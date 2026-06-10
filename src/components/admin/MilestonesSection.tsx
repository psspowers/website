import React, { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

interface Milestone {
  id: string;
  year: string;
  event: string;
  logo_url: string | null;
  display_order: number;
}

type MilestoneForm = Omit<Milestone, 'id'> & { logo_url: string };

const EMPTY_MILESTONE: MilestoneForm = { year: '', event: '', logo_url: '', display_order: 1 };

export default function MilestonesSection({ supabase }: { supabase: SupabaseClient }) {
  const [items, setItems] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MilestoneForm>(EMPTY_MILESTONE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
  }

  function openEdit(item: Milestone) {
    setForm({ year: item.year, event: item.event, logo_url: item.logo_url ?? '', display_order: item.display_order });
    setEditingId(item.id);
    setError('');
    setShowForm(true);
  }

  function set<K extends keyof MilestoneForm>(field: K, value: MilestoneForm[K]) {
    setForm(prev => ({ ...prev, [field]: value }));
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
    setShowForm(false);
    load();
  }

  async function del(id: string) {
    if (!confirm('Delete this milestone?')) return;
    await supabase.from('milestones').delete().eq('id', id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Milestones</h3>
          <p className="text-xs text-gray-500 mt-0.5">Timeline shown on the About page. Logo URL is optional — used for partner logos.</p>
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
            <label className="block text-xs font-medium text-gray-600 mb-1">Year*</label>
            <input
              required
              value={form.year}
              onChange={e => set('year', e.target.value)}
              placeholder="2025"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Display Order</label>
            <input
              type="number" min={1}
              value={form.display_order}
              onChange={e => set('display_order', Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Event description*</label>
            <input
              required
              value={form.event}
              onChange={e => set('event', e.target.value)}
              placeholder="Signed agreement to partner with I Squared Capital"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Logo URL (optional)</label>
            <input
              value={form.logo_url}
              onChange={e => set('logo_url', e.target.value)}
              placeholder="/i-squared-capital-logo.png"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
            />
            <p className="text-xs text-gray-400 mt-1">If set, a small logo image is shown inline next to this milestone.</p>
          </div>
          {error && <p className="sm:col-span-2 text-red-600 text-sm">{error}</p>}
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" disabled={saving}
              className="bg-[#1550b6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1243a0] disabled:opacity-60 transition-colors">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
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
                      <img src={item.logo_url} alt="logo" className="h-6 w-auto object-contain" />
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
