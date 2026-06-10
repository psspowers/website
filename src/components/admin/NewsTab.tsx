import React, { useState, useEffect, useRef } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

type NewsStatus = 'draft' | 'published' | 'complete';

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
  status: NewsStatus;
}

type FormData = Omit<NewsPost, 'id' | 'tags'> & { tags: string };

const EMPTY: FormData = {
  title: '', slug: '', summary: '', source: '', source_url: '',
  image_url: '', image_alt: '', image_aspect_ratio: '16:9',
  image_width: 1200, image_height: 675, tags: '', date: '',
  is_published: false, status: 'draft',
};

const STATUS_CONFIG: Record<NewsStatus, { label: string; bg: string; text: string }> = {
  published: { label: 'Published', bg: 'bg-green-100', text: 'text-green-700' },
  draft:     { label: 'Draft',     bg: 'bg-yellow-100', text: 'text-yellow-700' },
  complete:  { label: 'Complete',  bg: 'bg-blue-100',  text: 'text-blue-600' },
};

const TOOLTIPS: Partial<Record<keyof FormData, string>> = {
  title:     'Clear, concise, and SEO-friendly title (max 70 characters recommended)',
  slug:      'URL-friendly version of the title (auto-generated from title)',
  summary:   'Short 1-2 sentence teaser for the news card (max 160 characters)',
  image_alt: 'Descriptive text for accessibility and SEO',
  tags:      'Comma-separated keywords (e.g. Solar, Partnership, Milestone)',
};

function toSlug(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function FieldLabel({ label, field, required }: { label: string; field: keyof FormData; required?: boolean }) {
  const [open, setOpen] = useState(false);
  const tip = TOOLTIPS[field];
  return (
    <label className="flex items-center gap-1 text-xs font-medium text-gray-600 mb-1">
      {label}
      {required && <span className="sr-only">(required)</span>}
      {tip && (
        <span className="relative inline-flex">
          <button
            type="button"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 text-[10px] font-bold flex items-center justify-center leading-none focus:outline-none"
            aria-label={`Help for ${label}`}
          >
            i
          </button>
          {open && (
            <span className="absolute left-5 top-0 z-50 w-60 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg pointer-events-none">
              {tip}
            </span>
          )}
        </span>
      )}
    </label>
  );
}

export default function NewsTab({ supabase }: { supabase: SupabaseClient }) {
  const [items, setItems] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_BYTES = 5 * 1024 * 1024;

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('news_posts').select('*').order('date', { ascending: false });
    setItems((data as NewsPost[]) ?? []);
    setLoading(false);
  }

  function openNew() {
    setForm(EMPTY);
    setEditingId(null);
    setError('');
    setShowForm(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function openEdit(item: NewsPost) {
    const status: NewsStatus = item.status ?? (item.is_published ? 'published' : 'draft');
    setForm({
      ...item,
      image_url: item.image_url ?? '',
      image_alt: item.image_alt ?? '',
      tags: item.tags.join(', '),
      status,
    });
    setEditingId(item.id);
    setError('');
    setShowForm(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
    const payload = {
      ...form,
      image_url: form.image_url || null,
      image_alt: form.image_alt || null,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      is_published: form.status === 'published',
    };
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

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setError('Image must be 5 MB or smaller.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setError('');
    setUploading(true);
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const slugBase = (form.slug || 'news').replace(/[^a-z0-9-]/g, '-');
    const path = `${slugBase}-${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from('news-images').upload(path, file, { upsert: true });
    if (uploadErr) {
      setError(`Upload failed: ${uploadErr.message}`);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('news-images').getPublicUrl(path);
    setForm(prev => ({ ...prev, image_url: urlData.publicUrl }));
    setUploading(false);
  }

  const statusCfg = STATUS_CONFIG[form.status] ?? STATUS_CONFIG.draft;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">News Posts</h2>
        <button onClick={openNew} className="bg-[#1550b6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1243a0] transition-colors">+ New Post</button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">{editingId ? 'Edit Post' : 'New Post'}</h3>
          <div className="flex items-start gap-6">
            <form onSubmit={save} className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <FieldLabel label="Title" field="title" required />
                <input required value={form.title} onChange={e => set('title', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]" />
              </div>
              <div>
                <FieldLabel label="Slug" field="slug" required />
                <input required value={form.slug} onChange={e => set('slug', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6] font-mono" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Date (YYYY-MM-DD)</label>
                <input required type="date" value={form.date} onChange={e => set('date', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]" />
              </div>
              <div className="md:col-span-2">
                <FieldLabel label="Summary" field="summary" required />
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
              <div className="md:col-span-2">
                <FieldLabel label="Image" field="image_url" />
                <div className="flex items-center gap-3 mb-2">
                  <label className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer transition-colors ${uploading ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' : 'border-[#1550b6] text-[#1550b6] hover:bg-blue-50'}`}>
                    {uploading ? (
                      <><span className="w-4 h-4 border-2 border-[#1550b6] border-t-transparent rounded-full animate-spin inline-block" />Uploading...</>
                    ) : (
                      <><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" /></svg>{form.image_url ? 'Replace image' : 'Upload image'}</>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="sr-only" disabled={uploading} onChange={handleFileChange} />
                  </label>
                  {form.image_url && !uploading && <span className="text-xs text-green-600 font-medium">Image set</span>}
                </div>
                <p className="text-xs text-gray-400 mb-2">JPG, PNG or WebP, max 5 MB. Or paste a URL:</p>
                <input value={form.image_url ?? ''} onChange={e => set('image_url', e.target.value)} placeholder="https://..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]" />
              </div>
              <div>
                <FieldLabel label="Image Alt Text" field="image_alt" />
                <input value={form.image_alt ?? ''} onChange={e => set('image_alt', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]" />
              </div>
              <div>
                <FieldLabel label="Tags (comma-separated)" field="tags" />
                <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="e.g. Solar, Partnership"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <div className="flex items-center gap-2">
                  <select value={form.status} onChange={e => set('status', e.target.value as NewsStatus)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6] bg-white">
                    <option value="draft">Draft — not yet published</option>
                    <option value="published">Published — live on website</option>
                    <option value="complete">Complete — archived after publishing</option>
                  </select>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${statusCfg.bg} ${statusCfg.text}`}>{statusCfg.label}</span>
                </div>
              </div>
              {error && <p className="md:col-span-2 text-red-600 text-sm">{error}</p>}
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={saving || uploading}
                  className="bg-[#1550b6] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#1243a0] disabled:opacity-60 transition-colors">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
            {form.image_url && (
              <div className="shrink-0 w-32 text-center hidden sm:block">
                <p className="text-xs text-gray-500 mb-2">Preview</p>
                <img src={form.image_url} alt="preview" className="w-32 h-20 rounded-xl object-cover border border-gray-200"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
          </div>
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
              {items.map(item => {
                const s: NewsStatus = item.status ?? (item.is_published ? 'published' : 'draft');
                const cfg = STATUS_CONFIG[s];
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{item.title}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{item.date}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => openEdit(item)} className="text-[#1550b6] hover:underline text-xs mr-3 font-medium">Edit</button>
                      <button onClick={() => del(item.id)} className="text-red-500 hover:underline text-xs font-medium">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
