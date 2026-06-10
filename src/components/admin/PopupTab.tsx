import React, { useState, useEffect, useRef } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { FieldLabel, InfoTooltip } from './InfoTooltip';

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

const MAX_FILE_BYTES = 5 * 1024 * 1024;

export default function PopupTab({ supabase }: { supabase: SupabaseClient }) {
  const [items, setItems] = useState<PopupAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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
    if (fileRef.current) fileRef.current.value = '';
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
    if (fileRef.current) fileRef.current.value = '';
  }

  function set<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleClose() {
    if (fileRef.current) fileRef.current.value = '';
    setShowForm(false);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) { setError('Image must be 5 MB or smaller.'); return; }
    setError('');
    setUploading(true);
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const slug = (form.title || 'popup').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
    const path = `popup-${slug}-${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from('popup-images').upload(path, file, { upsert: true });
    if (uploadErr) { setError(`Upload failed: ${uploadErr.message}`); setUploading(false); return; }
    const { data } = supabase.storage.from('popup-images').getPublicUrl(path);
    set('image_url', data.publicUrl);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...form, image_url: form.image_url || null };
    const { error: err } = editingId
      ? await supabase.from('popup_announcements').update(payload).eq('id', editingId)
      : await supabase.from('popup_announcements').insert(payload);
    setSaving(false);
    if (err) { setError(err.message); return; }
    handleClose();
    load();
  }

  async function del(id: string) {
    if (!confirm('Delete this popup?')) return;
    await supabase.from('popup_announcements').delete().eq('id', id);
    load();
  }

  async function toggleActive(item: PopupAnnouncement) {
    await supabase.from('popup_announcements').update({ is_active: !item.is_active }).eq('id', item.id);
    load();
  }

  const liveCount = items.filter(i => {
    if (!i.is_active) return false;
    const now = Date.now();
    return now >= new Date(i.show_from).getTime() && now <= new Date(i.show_until).getTime();
  }).length;

  const inp = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]';

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
        <button onClick={openNew} className="bg-[#1550b6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1243a0] transition-colors">
          + New Popup
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900">{editingId ? 'Edit Popup' : 'New Popup'}</h3>
            <button type="button" onClick={() => setPreview(p => !p)}
              className={`text-sm font-medium transition-colors ${preview ? 'text-gray-500 hover:text-gray-700' : 'text-[#1550b6] hover:text-[#1243a0]'}`}>
              {preview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form */}
            <form onSubmit={save} className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="md:col-span-2">
                <FieldLabel label="Title*" tip="Short, attention-grabbing headline (max 60 characters). State the news or benefit clearly — avoid mystery titles." />
                <input required value={form.title} onChange={e => set('title', e.target.value)}
                  placeholder="e.g. PSS Partners with I Squared Capital" className={inp} />
              </div>

              <div className="md:col-span-2">
                <FieldLabel label="Body text*" tip="1–2 supporting sentences shown below the title. Keep it under 150 characters. Explain what the visitor gains by clicking." />
                <textarea required rows={3} value={form.body} onChange={e => set('body', e.target.value)}
                  placeholder="Short announcement text shown in the popup (150 chars max recommended)"
                  className={`${inp} resize-y`} />
              </div>

              {/* Image upload */}
              <div className="md:col-span-2">
                <FieldLabel label="Image (optional)" tip="Optional banner image shown at the top of the popup. Recommended 600×400 px or wider. JPG or WebP." />
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer transition-colors ${uploading ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' : 'border-[#1550b6] text-[#1550b6] hover:bg-blue-50'}`}>
                      {uploading ? (
                        <><span className="w-4 h-4 border-2 border-[#1550b6] border-t-transparent rounded-full animate-spin inline-block" />Uploading...</>
                      ) : (
                        <><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" /></svg>{form.image_url ? 'Replace image' : 'Upload image'}</>
                      )}
                      <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
                        className="sr-only" disabled={uploading} onChange={handleFileChange} />
                    </label>
                    <p className="text-xs text-gray-400">JPG, PNG or WebP · max 5 MB · or paste a URL:</p>
                    <input value={form.image_url ?? ''} onChange={e => set('image_url', e.target.value)}
                      placeholder="/News_Images/your-image.jpg or https://..." className={inp} />
                  </div>
                  {form.image_url && !uploading && (
                    <img src={form.image_url} alt="preview" className="w-28 h-20 rounded-xl object-cover border border-gray-200 shrink-0"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  )}
                </div>
              </div>

              <div>
                <FieldLabel label="CTA Button Label*" tip="Text on the call-to-action button (e.g. Learn More, Read Now, Contact Us). Keep it under 25 characters." />
                <input required value={form.cta_label} onChange={e => set('cta_label', e.target.value)}
                  placeholder="Learn More" className={inp} />
              </div>

              <div>
                <FieldLabel label="CTA Button URL*" tip="Where the button takes the visitor. Use a full URL (https://) for external links or a relative path (e.g. /news, /contact) for internal pages." />
                <input required value={form.cta_url} onChange={e => set('cta_url', e.target.value)}
                  placeholder="/news or https://..." className={inp} />
              </div>

              <div>
                <FieldLabel label="Show From*" tip="Date and time when the popup starts showing to visitors. Set to now for immediate display." />
                <input required type="datetime-local" value={toLocalDatetimeInput(form.show_from)}
                  onChange={e => set('show_from', toISO(e.target.value))} className={inp} />
              </div>

              <div>
                <FieldLabel label="Show Until*" tip="Date and time when the popup automatically stops showing. Visitors will not see it after this point." />
                <input required type="datetime-local" value={toLocalDatetimeInput(form.show_until)}
                  onChange={e => set('show_until', toISO(e.target.value))} className={inp} />
              </div>

              <div>
                <FieldLabel label="Delay before showing (seconds)" tip="How many seconds after page load before the popup appears. 0 = immediate. 3–5 seconds is recommended to avoid interrupting the visitor immediately." />
                <input type="number" min={0} max={60} value={form.delay_seconds}
                  onChange={e => set('delay_seconds', Number(e.target.value))} className={inp} />
              </div>

              <div className="flex items-center gap-2 pt-3">
                <input type="checkbox" id="popup-active" checked={form.is_active}
                  onChange={e => set('is_active', e.target.checked)} className="w-4 h-4 accent-[#1550b6]" />
                <label htmlFor="popup-active" className="text-sm text-gray-700 cursor-pointer">
                  Active (visitors will see this popup within the date window)
                </label>
                <InfoTooltip tip="Master on/off switch. The popup must be active AND within the Show From–Show Until window to appear to visitors." label="Active" />
              </div>

              {error && <p className="md:col-span-2 text-red-600 text-sm">{error}</p>}

              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={saving || uploading}
                  className="bg-[#1550b6] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#1243a0] disabled:opacity-60 transition-colors">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={handleClose}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
              </div>
            </form>

            {/* Preview panel */}
            {preview && (
              <div className="lg:w-[320px] shrink-0 flex flex-col gap-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Live Preview</p>
                <PopupPreview form={form} />
                <p className="text-xs text-gray-400 leading-relaxed bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                  This is a preview. Placement on the site is controlled by the{' '}
                  <code className="text-gray-600 font-mono bg-gray-100 px-1 rounded">PopupAnnouncement</code>{' '}
                  component in <code className="text-gray-600 font-mono bg-gray-100 px-1 rounded">Layout.astro</code>.
                </p>
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
                      <button onClick={() => toggleActive(item)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${badge.cls}`}
                        title="Click to toggle active">
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
    <div className="relative rounded-xl overflow-hidden bg-slate-800" style={{ minHeight: '280px' }}>
      {/* Simulated page backdrop */}
      <div className="absolute inset-0 bg-slate-950/70" />

      {/* Mock browser chrome */}
      <div className="absolute top-0 left-0 right-0 h-7 bg-slate-900 flex items-center px-2.5 gap-1.5 z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        <span className="ml-2 text-slate-500 text-[10px] font-mono truncate">pss-orange.com</span>
      </div>

      {/* Centered popup card */}
      <div className="absolute inset-0 flex items-center justify-center px-3 pt-7 pb-3">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[260px] overflow-hidden relative">
          {/* Close button */}
          <span className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm z-10">
            <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>

          {form.image_url ? (
            <div className="w-full h-[110px] bg-gray-100 overflow-hidden">
              <img src={form.image_url} alt="preview" className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          ) : (
            <div className="w-full h-[110px] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          <div className="p-4">
            <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2">
              {form.title || <span className="text-gray-300 italic font-normal">Title goes here</span>}
            </h3>
            <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-3">
              {form.body
                ? (form.body.length > 100 ? form.body.slice(0, 100) + '…' : form.body)
                : <span className="text-gray-300 italic">Body text goes here</span>}
            </p>
            <div className="flex gap-1.5">
              <span className="flex-1 text-center px-2 py-1.5 rounded-lg bg-[#1550b6] text-white font-semibold text-[11px] truncate">
                {form.cta_label || 'Learn More'}
              </span>
              <span className="flex-1 text-center px-2 py-1.5 rounded-lg bg-[#0077b5] text-white font-semibold text-[11px] truncate">
                Follow on LinkedIn
              </span>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              Appears after {form.delay_seconds}s &bull; once per session
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
