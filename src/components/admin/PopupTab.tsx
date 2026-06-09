import React, { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

interface PopupAnnouncement {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
  cta_label: string;
  cta_url: string;
  is_active: boolean;
  show_from: string;
  show_until: string;
  delay_seconds: number;
  created_at: string;
  updated_at: string;
}

type FormData = Omit<PopupAnnouncement, 'id' | 'created_at' | 'updated_at'>;

function toLocalDatetimeInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toISO(localInput: string): string {
  return new Date(localInput).toISOString();
}

function nowPlusISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const EMPTY: FormData = {
  title: '',
  body: '',
  image_url: '',
  cta_label: 'Learn More',
  cta_url: '/news',
  is_active: false,
  show_from: new Date().toISOString(),
  show_until: nowPlusISO(7),
  delay_seconds: 5,
};

function statusBadge(item: PopupAnnouncement): { label: string; cls: string } {
  if (!item.is_active) return { label: 'Inactive', cls: 'bg-gray-100 text-gray-500' };
  const now = Date.now();
  const from = new Date(item.show_from).getTime();
  const until = new Date(item.show_until).getTime();
  if (now < from) return { label: 'Scheduled', cls: 'bg-blue-100 text-blue-700' };
  if (now > until) return { label: 'Expired', cls: 'bg-red-100 text-red-600' };
  return { label: 'Live', cls: 'bg-green-100 text-green-700' };
}

export default function PopupTab({ supabase }: { supabase: SupabaseClient }) {
  const [items, setItems] = useState<PopupAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('popup_announcements')
      .select('*')
      .order('created_at', { ascending: false });
    setItems((data as PopupAnnouncement[]) ?? []);
    setLoading(false);
  }

  function openNew() {
    setForm(EMPTY);
    setEditingId(null);
    setError('');
    setPreview(false);
    setShowForm(true);
  }

  function openEdit(item: PopupAnnouncement) {
    setForm({
      title: item.title,
      body: item.body,
      image_url: item.image_url ?? '',
      cta_label: item.cta_label,
      cta_url: item.cta_url,
      is_active: item.is_active,
      show_from: item.show_from,
      show_until: item.show_until,
      delay_seconds: item.delay_seconds,
    });
    setEditingId(item.id);
    setError('');
    setPreview(false);
    setShowForm(true);
  }

  function set<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      image_url: form.image_url || null,
    };
    const { error: err } = editingId
      ? await supabase.from('popup_announcements').update(payload).eq('id', editingId)
      : await supabase.from('popup_announcements').insert(payload);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setShowForm(false);
    load();
  }

  async function del(id: string) {
    if (!confirm('Delete this popup?')) return;
    await supabase.from('popup_announcements').delete().eq('id', id);
    load();
  }

  async function toggleActive(item: PopupAnnouncement) {
    await supabase
      .from('popup_announcements')
      .update({ is_active: !item.is_active })
      .eq('id', item.id);
    load();
  }

  const liveCount = items.filter(i => {
    if (!i.is_active) return false;
    const now = Date.now();
    return now >= new Date(i.show_from).getTime() && now <= new Date(i.show_until).getTime();
  }).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Popup Announcements</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {liveCount > 0
              ? `${liveCount} popup currently live — visitors see the most recently created active popup within its date window`
              : 'No popup is currently live'}
          </p>
        </div>
        <button
          onClick={openNew}
          className="bg-[#1550b6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1243a0] transition-colors"
        >
          + New Popup
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{editingId ? 'Edit Popup' : 'New Popup'}</h3>
            <button
              type="button"
              onClick={() => setPreview(p => !p)}
              className="text-sm text-[#1550b6] hover:underline font-medium"
            >
              {preview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <form onSubmit={save} className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Title*</label>
                <input
                  required
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="e.g. PSS Partners with I Squared Capital"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Body text*</label>
                <textarea
                  required
                  rows={3}
                  value={form.body}
                  onChange={e => set('body', e.target.value)}
                  placeholder="Short announcement text shown in the popup (150 chars max recommended)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6] resize-y"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Image URL (optional)</label>
                <input
                  value={form.image_url ?? ''}
                  onChange={e => set('image_url', e.target.value)}
                  placeholder="/News_Images/your-image.jpg"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">CTA Button Label*</label>
                <input
                  required
                  value={form.cta_label}
                  onChange={e => set('cta_label', e.target.value)}
                  placeholder="Learn More"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">CTA Button URL*</label>
                <input
                  required
                  value={form.cta_url}
                  onChange={e => set('cta_url', e.target.value)}
                  placeholder="/news or https://..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Show From*</label>
                <input
                  required
                  type="datetime-local"
                  value={toLocalDatetimeInput(form.show_from)}
                  onChange={e => set('show_from', toISO(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Show Until*</label>
                <input
                  required
                  type="datetime-local"
                  value={toLocalDatetimeInput(form.show_until)}
                  onChange={e => set('show_until', toISO(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Delay before showing (seconds)</label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={form.delay_seconds}
                  onChange={e => set('delay_seconds', Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
                />
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="popup-active"
                  checked={form.is_active}
                  onChange={e => set('is_active', e.target.checked)}
                  className="w-4 h-4 accent-[#1550b6]"
                />
                <label htmlFor="popup-active" className="text-sm text-gray-700 cursor-pointer">
                  Active (visitors will see this popup within the date window)
                </label>
              </div>

              {error && <p className="md:col-span-2 text-red-600 text-sm">{error}</p>}

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
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

            {preview && (
              <div className="lg:w-80 shrink-0">
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Preview</p>
                <PopupPreview form={form} />
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
        <div className="text-center py-12 text-gray-400">No popups yet. Create one above.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Window</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => {
                const badge = statusBadge(item);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{item.title}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell text-xs">
                      {new Date(item.show_from).toLocaleDateString()} &rarr; {new Date(item.show_until).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <button
                        onClick={() => toggleActive(item)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${badge.cls}`}
                        title="Click to toggle active"
                      >
                        {badge.label}
                      </button>
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

function PopupPreview({ form }: { form: FormData }) {
  return (
    <div className="bg-white bg-opacity-95 rounded-xl shadow-2xl w-full max-w-[300px] overflow-hidden border border-gray-200">
      {form.image_url && (
        <div className="w-full h-[160px] bg-gray-100 overflow-hidden">
          <img
            src={form.image_url}
            alt="preview"
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-bold text-base text-gray-900 mb-2 leading-tight line-clamp-2">
          {form.title || <span className="text-gray-300 italic">Title goes here</span>}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {form.body
            ? (form.body.length > 120 ? form.body.slice(0, 120) + '...' : form.body)
            : <span className="text-gray-300 italic">Body text goes here</span>}
        </p>
        <div className="flex gap-2">
          <span className="flex-1 text-center px-3 py-2 rounded-lg bg-[#1550b6] text-white font-semibold text-xs">
            {form.cta_label || 'Learn More'}
          </span>
          <span className="flex-1 text-center px-3 py-2 rounded-lg bg-[#0077b5] text-white font-semibold text-xs">
            Follow on LinkedIn
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          Appears after {form.delay_seconds}s &bull; once per session
        </p>
      </div>
    </div>
  );
}
