import React, { useState, useEffect, useRef } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { FieldLabel } from './InfoTooltip';

interface Milestone {
  id: string;
  year: string;
  event: string;
  logo_url: string | null;
  display_order: number;
}

type MilestoneForm = Omit<Milestone, 'id'> & { logo_url: string };

const EMPTY_MILESTONE: MilestoneForm = { year: '', event: '', logo_url: '', display_order: 1 };

const MAX_FILE_BYTES = 2 * 1024 * 1024;

export default function MilestonesSection({ supabase }: { supabase: SupabaseClient }) {
  const [items, setItems] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MilestoneForm>(EMPTY_MILESTONE);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('milestones')
      .select('*')
      .order('display_order', { ascending: true });
    setItems((data as Milestone[]) ?? []);
    setLoading(false);
  }

  function openNew() {
    const next = items.length > 0 ? Math.max(...items.map(i => i.display_order)) + 1 : 1;
    setForm({ ...EMPTY_MILESTONE, display_order: next });
    setEditingId(null);
    setError('');
    setShowForm(true);
    if (fileRef.current) fileRef.current.value = '';
  }

  function openEdit(item: Milestone) {
    setForm({ year: item.year, event: item.event, logo_url: item.logo_url ?? '', display_order: item.display_order });
    setEditingId(item.id);
    setError('');
    setShowForm(true);
    if (fileRef.current) fileRef.current.value = '';
  }

  function set<K extends keyof MilestoneForm>(field: K, value: MilestoneForm[K]) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleClose() {
    if (fileRef.current) fileRef.current.value = '';
    setShowForm(false);
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setError('Logo must be 2 MB or smaller.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    setError('');
    setUploading(true);
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png';
    const slug = (form.event || 'logo').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
    const path = `${slug}-${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from('milestone-logos')
      .upload(path, file, { upsert: true });
    if (uploadErr) {
      setError(`Upload failed: ${uploadErr.message}`);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('milestone-logos').getPublicUrl(path);
    set('logo_url', data.publicUrl);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...form, logo_url: form.logo_url || null };
    const { error: err } = editingId
      ? await supabase.from('milestones').update(payload).eq('id', editingId)
      : await supabase.from('milestones').insert(payload);
    setSaving(false);
    if (err) { setError(err.message); return; }
    handleClose();
    load();
  }

  async function del(id: string) {
    if (!confirm('Delete this milestone?')) return;
    await supabase.from('milestones').delete().eq('id', id);
    load();
  }

  const inp = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Milestones</h3>
          <p className="text-xs text-gray-500 mt-0.5">Timeline shown on the About page. Logo is optional — used for partner logos.</p>
        </div>
        <button
          onClick={openNew}
          className="bg-[#1550b6] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[#1243a0] transition-colors"
        >
          + Add Milestone
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel label="Year*" tip="The year this milestone occurred (e.g. 2021). Used as the timeline marker on the About page." />
            <input required value={form.year} onChange={e => set('year', e.target.value)}
              placeholder="2025" className={inp} />
          </div>
          <div>
            <FieldLabel label="Display Order" tip="Controls left-to-right order on the timeline. Lower numbers appear first. Use gaps (10, 20, 30) to allow easy reordering." />
            <input type="number" min={1} value={form.display_order}
              onChange={e => set('display_order', Number(e.target.value))} className={inp} />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel label="Event description*" tip="1–2 sentences describing the achievement clearly and factually (e.g. 'Completed first 10 MW solar rooftop project in Thailand')." />
            <input required value={form.event} onChange={e => set('event', e.target.value)}
              placeholder="Signed agreement to partner with I Squared Capital" className={inp} />
          </div>

          {/* Logo upload */}
          <div className="sm:col-span-2">
            <FieldLabel label="Partner Logo (optional)" tip="Optional logo of a key partner involved in this milestone. PNG or SVG with transparent background preferred. Max 2 MB." />
            <div className="flex items-center gap-3 flex-wrap">
              <label className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border cursor-pointer transition-colors ${uploading ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' : 'border-[#1550b6] text-[#1550b6] hover:bg-blue-50'}`}>
                {uploading ? (
                  <><span className="w-3.5 h-3.5 border-2 border-[#1550b6] border-t-transparent rounded-full animate-spin inline-block" />Uploading...</>
                ) : (
                  <><svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" /></svg>{form.logo_url ? 'Replace logo' : 'Upload logo'}</>
                )}
                <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                  className="sr-only" disabled={uploading} onChange={handleLogoUpload} />
              </label>
              {form.logo_url && !uploading && (
                <img src={form.logo_url} alt="logo preview" className="h-8 w-auto object-contain border border-gray-200 rounded px-2 bg-white"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">JPG, PNG, WebP or SVG · max 2 MB · or paste a URL:</p>
            <input value={form.logo_url} onChange={e => set('logo_url', e.target.value)}
              placeholder="/i-squared-capital-logo.png or https://..." className={`${inp} mt-1.5`} />
          </div>

          {error && <p className="sm:col-span-2 text-red-600 text-sm">{error}</p>}

          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" disabled={saving || uploading}
              className="bg-[#1550b6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1243a0] disabled:opacity-60 transition-colors">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={handleClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="w-5 h-5 border-2 border-[#1550b6] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600 w-10">#</th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600 w-16">Year</th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600">Event</th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600 hidden md:table-cell">Logo</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-6 text-gray-400">No milestones yet.</td></tr>
              ) : items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs font-mono">{item.display_order}</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">{item.year}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs">{item.event}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {item.logo_url ? (
                      <img src={item.logo_url} alt="logo" className="h-6 w-auto object-contain"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(item)} className="text-[#1550b6] hover:underline text-xs mr-3 font-medium">Edit</button>
                    <button onClick={() => del(item.id)} className="text-red-500 hover:underline text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
