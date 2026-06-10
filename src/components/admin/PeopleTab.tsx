import React, { useState, useEffect, useRef } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string | null;
  linkedin_url: string | null;
  display_order: number;
  is_visible: boolean;
}

type FormData = Omit<TeamMember, 'id'> & { image_url: string; linkedin_url: string };

const EMPTY: FormData = {
  name: '',
  role: '',
  bio: '',
  image_url: '',
  linkedin_url: '',
  display_order: 1,
  is_visible: true,
};

export default function PeopleTab({ supabase }: { supabase: SupabaseClient }) {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_BYTES = 2 * 1024 * 1024;

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true });
    setItems((data as TeamMember[]) ?? []);
    setLoading(false);
  }

  function openNew() {
    const nextOrder = items.length > 0 ? Math.max(...items.map(i => i.display_order)) + 1 : 1;
    setForm({ ...EMPTY, display_order: nextOrder });
    setEditingId(null);
    setError('');
    setShowForm(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function openEdit(item: TeamMember) {
    setForm({ ...item, image_url: item.image_url ?? '', linkedin_url: item.linkedin_url ?? '' });
    setEditingId(item.id);
    setError('');
    setShowForm(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function set<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_BYTES) {
      setError('Photo must be 2 MB or smaller.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setError('');
    setUploading(true);

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const slug = (form.name || 'photo').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const path = `${slug}-${Date.now()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from('team-photos')
      .upload(path, file, { upsert: true });

    if (uploadErr) {
      setError(`Upload failed: ${uploadErr.message}`);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('team-photos')
      .getPublicUrl(path);

    set('image_url', urlData.publicUrl);
    setUploading(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...form, image_url: form.image_url || null, linkedin_url: form.linkedin_url || null };
    const { error: err } = editingId
      ? await supabase.from('team_members').update(payload).eq('id', editingId)
      : await supabase.from('team_members').insert(payload);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setShowForm(false);
    load();
  }

  async function del(id: string) {
    if (!confirm('Delete this team member?')) return;
    await supabase.from('team_members').delete().eq('id', id);
    load();
  }

  async function toggleVisible(item: TeamMember) {
    await supabase
      .from('team_members')
      .update({ is_visible: !item.is_visible })
      .eq('id', item.id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">People</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {items.filter(i => i.is_visible).length} of {items.length} visible on the About page
          </p>
        </div>
        <button
          onClick={openNew}
          className="bg-[#1550b6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1243a0] transition-colors"
        >
          + New Person
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-start gap-6">
            <form onSubmit={save} className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <h3 className="md:col-span-2 font-semibold text-gray-900 -mb-1">
                {editingId ? 'Edit Person' : 'New Person'}
              </h3>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name*</label>
                <input
                  required
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="Sam Yamdagni"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Role / Title*</label>
                <input
                  required
                  value={form.role}
                  onChange={e => set('role', e.target.value)}
                  placeholder="CEO & JMD"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Bio*</label>
                <textarea
                  required
                  rows={2}
                  value={form.bio}
                  onChange={e => set('bio', e.target.value)}
                  placeholder="Short bio shown on the About page"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6] resize-y"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Photo</label>
                <div className="flex items-center gap-3">
                  <label
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer transition-colors ${
                      uploading
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'border-[#1550b6] text-[#1550b6] hover:bg-blue-50'
                    }`}
                  >
                    {uploading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-[#1550b6] border-t-transparent rounded-full animate-spin inline-block" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
                        </svg>
                        {form.image_url ? 'Replace photo' : 'Upload photo'}
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="sr-only"
                      disabled={uploading}
                      onChange={handleFileChange}
                    />
                  </label>
                  {form.image_url && !uploading && (
                    <span className="text-xs text-green-600 font-medium">Photo uploaded</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG or WebP, max 2 MB.</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={form.linkedin_url}
                  onChange={e => set('linkedin_url', e.target.value)}
                  placeholder="https://www.linkedin.com/in/username"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Display Order</label>
                <input
                  type="number"
                  min={1}
                  value={form.display_order}
                  onChange={e => set('display_order', Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
                />
                <p className="text-xs text-gray-400 mt-1">Lower numbers appear first.</p>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="person-visible"
                  checked={form.is_visible}
                  onChange={e => set('is_visible', e.target.checked)}
                  className="w-4 h-4 accent-[#1550b6]"
                />
                <label htmlFor="person-visible" className="text-sm text-gray-700 cursor-pointer">
                  Visible on About page
                </label>
              </div>

              {error && <p className="md:col-span-2 text-red-600 text-sm">{error}</p>}

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="bg-[#1550b6] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#1243a0] disabled:opacity-60 transition-colors"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>

            {form.image_url && (
              <div className="shrink-0 w-24 text-center">
                <p className="text-xs text-gray-500 mb-2">Preview</p>
                <img
                  src={form.image_url}
                  alt="preview"
                  className="w-24 h-24 rounded-xl object-cover border border-gray-200"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#1550b6] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No people yet. Add one above.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-10">#</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs font-mono">{item.display_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-100"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold flex-shrink-0">
                          {item.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{item.role}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <button
                      onClick={() => toggleVisible(item)}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${
                        item.is_visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                      }`}
                      title="Click to toggle visibility on About page"
                    >
                      {item.is_visible ? 'Visible' : 'Hidden'}
                    </button>
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
