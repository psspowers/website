import React, { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

interface NewsPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  source: string;
  source_url: string;
  image_url: string | null;
  image_alt: string | null;
  image_aspect_ratio: string;
  image_width: number;
  image_height: number;
  tags: string[];
  date: string;
  is_published: boolean;
}

type FormData = Omit<NewsPost, 'id' | 'tags'> & { tags: string };

const EMPTY: FormData = {
  title: '', slug: '', summary: '', source: '', source_url: '',
  image_url: '', image_alt: '', image_aspect_ratio: '16:9',
  image_width: 1200, image_height: 675, tags: '', date: '', is_published: true,
};

function toSlug(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function NewsTab({ supabase }: { supabase: SupabaseClient }) {
  const [items, setItems] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('news_posts').select('*').order('date', { ascending: false });
    setItems((data as NewsPost[]) ?? []);
    setLoading(false);
  }

  function openNew() { setForm(EMPTY); setEditingId(null); setError(''); setShowForm(true); }

  function openEdit(item: NewsPost) {
    setForm({ ...item, image_url: item.image_url ?? '', image_alt: item.image_alt ?? '', tags: item.tags.join(', ') });
    setEditingId(item.id);
    setError('');
    setShowForm(true);
  }

  function set(field: keyof FormData, value: string | boolean | number) {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !editingId) next.slug = toSlug(value as string);
      return next;
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...form, image_url: form.image_url || null, image_alt: form.image_alt || null, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    const { error: err } = editingId
      ? await supabase.from('news_posts').update(payload).eq('id', editingId)
      : await supabase.from('news_posts').insert(payload);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setShowForm(false);
    load();
  }

  async function del(id: string) {
    if (!confirm('Delete this post?')) return;
    await supabase.from('news_posts').delete().eq('id', id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">News Posts</h2>
        <button onClick={openNew} className="bg-[#1550b6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1243a0] transition-colors">+ New Post</button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">{editingId ? 'Edit Post' : 'New Post'}</h3>
          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Title*</label>
              <input required value={form.title} onChange={e => set('title', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Slug*</label>
              <input required value={form.slug} onChange={e => set('slug', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6] font-mono" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date* (YYYY-MM-DD)</label>
              <input required type="date" value={form.date} onChange={e => set('date', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Summary*</label>
              <textarea required rows={4} value={form.summary} onChange={e => set('summary', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6] resize-y" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Source</label>
              <input value={form.source} onChange={e => set('source', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Source URL</label>
              <input type="url" value={form.source_url} onChange={e => set('source_url', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
              <input value={form.image_url ?? ''} onChange={e => set('image_url', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Image Alt Text</label>
              <input value={form.image_alt ?? ''} onChange={e => set('image_alt', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tags (comma-separated)</label>
              <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="e.g. Solar, Partnership"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]" />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <input type="checkbox" id="published" checked={form.is_published} onChange={e => set('is_published', e.target.checked)} className="w-4 h-4 accent-[#1550b6]" />
              <label htmlFor="published" className="text-sm text-gray-700 cursor-pointer">Published</label>
            </div>
            {error && <p className="md:col-span-2 text-red-600 text-sm">{error}</p>}
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={saving}
                className="bg-[#1550b6] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#1243a0] disabled:opacity-60 transition-colors">
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-[#1550b6] border-t-transparent rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No posts yet. Use "Sync Static Data" or create one above.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{item.title}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{item.date}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {item.is_published ? 'Published' : 'Draft'}
                    </span>
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
