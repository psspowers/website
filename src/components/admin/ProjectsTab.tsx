import React, { useState, useEffect, useRef } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { FieldLabel, InfoTooltip } from './InfoTooltip';

interface ProjectRow {
  id: string;
  name: string;
  capacity: string;
  type: string;
  status: string;
  cod: string;
  role: string;
  location: string;
  image_url: string | null;
  gallery_urls: string[];
  coordinates_lat: number;
  coordinates_lng: number;
  description: string | null;
  client: string | null;
  is_featured: boolean;
  featured_order: number;
  is_website_only: boolean;
  created_at: string;
}

interface FormData {
  name: string;
  capacity: string;
  type: string;
  status: string;
  cod_month: string;
  cod_year: string;
  role: string;
  location: string;
  image_url: string;
  gallery_urls: string[];
  coordinates_lat: string;
  coordinates_lng: string;
  description: string;
  client: string;
  is_featured: boolean;
  is_website_only: boolean;
}

const MONTHS = [
  { v: '01', l: 'January' }, { v: '02', l: 'February' }, { v: '03', l: 'March' },
  { v: '04', l: 'April' },   { v: '05', l: 'May' },      { v: '06', l: 'June' },
  { v: '07', l: 'July' },    { v: '08', l: 'August' },   { v: '09', l: 'September' },
  { v: '10', l: 'October' }, { v: '11', l: 'November' }, { v: '12', l: 'December' },
];
const YEARS = Array.from({ length: 21 }, (_, i) => String(2015 + i));
const TYPES = ['Solar Rooftop', 'Ground Mount', 'Floating Solar', 'Solar Pump', 'Re.Powering', 'Wind', 'Energy Storage'];
const STATUSES = ['In Progress', 'Completed', 'Planning'];
const MAX_FEATURED = 9;
const MAX_GALLERY = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

const EMPTY: FormData = {
  name: '', capacity: '', type: '', status: '', cod_month: '', cod_year: '',
  role: '', location: '', image_url: '', gallery_urls: [],
  coordinates_lat: '', coordinates_lng: '', description: '', client: '',
  is_featured: false, is_website_only: false,
};

function parseCod(cod: string): { month: string; year: string } {
  const iso = cod.match(/^(\d{4})-(\d{2})$/);
  if (iso) return { year: iso[1], month: iso[2] };
  const yearM = cod.match(/\b(20\d{2})\b/);
  const lower = cod.toLowerCase();
  const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const mi = monthNames.findIndex(mn => lower.includes(mn));
  const qMap: Record<string, string> = { '1': '03', '2': '06', '3': '09', '4': '12' };
  const qM = lower.match(/q([1-4])/);
  return {
    year: yearM ? yearM[1] : '',
    month: mi >= 0 ? String(mi + 1).padStart(2, '0') : (qM ? qMap[qM[1]] : '01'),
  };
}

export default function ProjectsTab({ supabase }: { supabase: SupabaseClient }) {
  const [items, setItems] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [mainUploading, setMainUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [error, setError] = useState('');
  const [featuredError, setFeaturedError] = useState('');
  const mainFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('id,name,capacity,type,status,cod,role,location,image_url,gallery_urls,coordinates_lat,coordinates_lng,description,client,is_featured,featured_order,is_website_only,created_at')
      .order('created_at', { ascending: false });
    setItems((data as ProjectRow[]) ?? []);
    setLoading(false);
  }

  function openNew() {
    setForm(EMPTY);
    setEditingId(null);
    setError('');
    setShowForm(true);
    if (mainFileRef.current) mainFileRef.current.value = '';
    if (galleryFileRef.current) galleryFileRef.current.value = '';
  }

  function openEdit(item: ProjectRow) {
    const { month, year } = parseCod(item.cod ?? '');
    setForm({
      name: item.name, capacity: item.capacity, type: item.type, status: item.status,
      cod_month: month, cod_year: year, role: item.role, location: item.location,
      image_url: item.image_url ?? '', gallery_urls: item.gallery_urls ?? [],
      coordinates_lat: String(item.coordinates_lat), coordinates_lng: String(item.coordinates_lng),
      description: item.description ?? '', client: item.client ?? '',
      is_featured: item.is_featured, is_website_only: item.is_website_only,
    });
    setEditingId(item.id);
    setError('');
    setShowForm(true);
    if (mainFileRef.current) mainFileRef.current.value = '';
    if (galleryFileRef.current) galleryFileRef.current.value = '';
  }

  function set<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleClose() {
    if (mainFileRef.current) mainFileRef.current.value = '';
    if (galleryFileRef.current) galleryFileRef.current.value = '';
    setShowForm(false);
  }

  async function uploadToStorage(file: File, prefix: string): Promise<string | null> {
    if (file.size > MAX_FILE_BYTES) { setError('Image must be 5 MB or smaller.'); return null; }
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const safeName = (form.name || 'project').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
    const path = `${prefix}-${safeName}-${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from('project-images').upload(path, file, { upsert: true });
    if (uploadErr) { setError(`Upload failed: ${uploadErr.message}`); return null; }
    const { data } = supabase.storage.from('project-images').getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleMainImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setMainUploading(true);
    const url = await uploadToStorage(file, 'main');
    if (url) set('image_url', url);
    setMainUploading(false);
    if (mainFileRef.current) mainFileRef.current.value = '';
  }

  async function handleGalleryImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || form.gallery_urls.length >= MAX_GALLERY) return;
    setError('');
    setGalleryUploading(true);
    const url = await uploadToStorage(file, 'gallery');
    if (url) set('gallery_urls', [...form.gallery_urls, url]);
    setGalleryUploading(false);
    if (galleryFileRef.current) galleryFileRef.current.value = '';
  }

  function removeGalleryImage(i: number) {
    set('gallery_urls', form.gallery_urls.filter((_, idx) => idx !== i));
  }

  async function toggleFeatured(item: ProjectRow) {
    setFeaturedError('');
    if (!item.is_featured) {
      const featuredCount = items.filter(i => i.is_featured).length;
      if (featuredCount >= MAX_FEATURED) {
        setFeaturedError(`Maximum ${MAX_FEATURED} featured projects allowed. Unstar another project first.`);
        return;
      }
      const maxOrder = Math.max(0, ...items.filter(i => i.is_featured).map(i => i.featured_order));
      await supabase.from('projects').update({ is_featured: true, featured_order: maxOrder + 1 }).eq('id', item.id);
    } else {
      await supabase.from('projects').update({ is_featured: false, featured_order: 99 }).eq('id', item.id);
    }
    load();
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const cod = form.cod_year && form.cod_month ? `${form.cod_year}-${form.cod_month}` : (form.cod_year || '');
    const payload = {
      name: form.name, capacity: form.capacity, type: form.type, status: form.status,
      cod, role: form.role, location: form.location,
      image_url: form.image_url || null, gallery_urls: form.gallery_urls,
      description: form.description || null, client: form.client || null,
      coordinates_lat: parseFloat(form.coordinates_lat) || 0,
      coordinates_lng: parseFloat(form.coordinates_lng) || 0,
      is_featured: form.is_featured, is_website_only: form.is_website_only,
    };
    const { error: err } = editingId
      ? await supabase.from('projects').update(payload).eq('id', editingId)
      : await supabase.from('projects').insert({ ...payload, featured_order: 99, scope: [], features: [], challenges: [], solutions: [], results: [] });
    setSaving(false);
    if (err) { setError(err.message); return; }
    handleClose();
    load();
  }

  async function del(id: string) {
    if (!confirm('Delete this project?')) return;
    await supabase.from('projects').delete().eq('id', id);
    load();
  }

  const sortedItems = [...items].sort((a, b) => {
    if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
    if (a.is_featured && b.is_featured) return a.featured_order - b.featured_order;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const featuredCount = items.filter(i => i.is_featured).length;
  const hiddenCount = items.filter(i => i.is_website_only).length;
  const totalMWp = items.reduce((sum, i) => {
    if (!i.capacity || i.capacity.toLowerCase().includes('well')) return sum;
    const n = parseFloat(i.capacity.replace(/[^\d.]/g, ''));
    return sum + (isNaN(n) ? 0 : n);
  }, 0);
  const inp = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]';
  const sel = `${inp} bg-white`;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-900">Projects</h2>
        <button onClick={openNew} className="bg-[#1550b6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1243a0] transition-colors">+ New Project</button>
      </div>
      <p className="text-xs text-gray-500 mb-5">
        Featured on homepage: <span className="font-semibold text-gray-700">{featuredCount}/{MAX_FEATURED}</span>
        <span className="mx-2 text-gray-300">·</span>
        Hidden from public page: <span className="font-semibold text-gray-700">{hiddenCount}</span>
      </p>
      <div className="flex flex-wrap gap-4 mb-5">
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm">
          <p className="text-xs text-gray-500 mb-0.5">Total Projects Secured</p>
          <p className="text-2xl font-bold text-gray-900">{items.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm">
          <p className="text-xs text-gray-500 mb-0.5">Total Capacity</p>
          <p className="text-2xl font-bold text-gray-900">{totalMWp % 1 === 0 ? totalMWp.toFixed(0) : totalMWp.toFixed(2)} <span className="text-sm font-medium text-gray-500">MWp</span></p>
        </div>
      </div>

      {featuredError && (
        <div className="bg-orange-50 border border-orange-200 text-orange-700 text-sm rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
          <span>{featuredError}</span>
          <button onClick={() => setFeaturedError('')} className="text-orange-400 hover:text-orange-600 ml-4 font-bold">×</button>
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">{editingId ? 'Edit Project' : 'New Project'}</h3>
          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Name */}
            <div>
              <FieldLabel label="Project Name*" tip="Official project name as used in contracts and client communications." />
              <input required value={form.name} onChange={e => set('name', e.target.value)} className={inp} />
            </div>

            {/* Capacity */}
            <div>
              <FieldLabel label="Capacity*" tip="Installed peak power including unit (e.g. 1.50 MWp). Enter the full string — it is displayed as-is." />
              <input required value={form.capacity} onChange={e => set('capacity', e.target.value)} placeholder="1.50 MWp" className={inp} />
            </div>

            {/* Type */}
            <div>
              <FieldLabel label="Type*" tip="Energy type shown on the projects page filter. Choose the option that best matches the primary technology." />
              <select required value={form.type} onChange={e => set('type', e.target.value)} className={sel}>
                <option value="">Select type</option>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Status */}
            <div>
              <FieldLabel label="Status*" tip="In Progress = currently being built. Completed = live and generating. Planning = not yet started." />
              <select required value={form.status} onChange={e => set('status', e.target.value)} className={sel}>
                <option value="">Select status</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* COD Month + Year picker */}
            <div>
              <FieldLabel label="COD*" tip="Commercial Operation Date — the month and year the plant first started generating power." />
              <div className="flex gap-2">
                <select value={form.cod_month} onChange={e => set('cod_month', e.target.value)}
                  className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6] bg-white">
                  <option value="">Month</option>
                  {MONTHS.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
                </select>
                <select value={form.cod_year} onChange={e => set('cod_year', e.target.value)}
                  className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6] bg-white">
                  <option value="">Year</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* Role */}
            <div>
              <FieldLabel label="Role*" tip="PSS.O's role on this project (e.g. Developer, EPC and O&M). Use the format from proposals." />
              <input required value={form.role} onChange={e => set('role', e.target.value)} placeholder="Developer, EPC and O&M" className={inp} />
            </div>

            {/* Location */}
            <div>
              <FieldLabel label="Location*" tip="City and country shown on the project map and card (e.g. Chonburi, Thailand)." />
              <input required value={form.location} onChange={e => set('location', e.target.value)} placeholder="Bangkok, Thailand" className={inp} />
            </div>

            {/* Client */}
            <div>
              <FieldLabel label="Client" tip="Client or asset owner name as it should appear publicly. Leave blank if confidential." />
              <input value={form.client} onChange={e => set('client', e.target.value)} className={inp} />
            </div>

            {/* Coordinates */}
            <div>
              <FieldLabel label="Latitude*" tip="Decimal latitude for the map pin (e.g. 13.7563). Right-click in Google Maps and copy the coordinates." />
              <input required type="number" step="any" value={form.coordinates_lat} onChange={e => set('coordinates_lat', e.target.value)} placeholder="13.7563" className={inp} />
            </div>
            <div>
              <FieldLabel label="Longitude*" tip="Decimal longitude for the map pin (e.g. 100.5018). Right-click in Google Maps and copy the coordinates." />
              <input required type="number" step="any" value={form.coordinates_lng} onChange={e => set('coordinates_lng', e.target.value)} placeholder="100.5018" className={inp} />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <FieldLabel label="Description" tip="2–3 sentences about the project — scope, key highlights, and outcome. Shown on the public projects page." />
              <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6] resize-y" />
            </div>

            {/* Main Image */}
            <div className="md:col-span-2">
              <FieldLabel label="Main Image" tip="Primary project photo shown on the card. Ideal ratio 16:9, minimum 1200×675 px. JPG or WebP preferred." />
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-2">
                  <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer transition-colors ${mainUploading ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' : 'border-[#1550b6] text-[#1550b6] hover:bg-blue-50'}`}>
                    {mainUploading ? (
                      <><span className="w-4 h-4 border-2 border-[#1550b6] border-t-transparent rounded-full animate-spin inline-block" />Uploading...</>
                    ) : (
                      <><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" /></svg>{form.image_url ? 'Replace image' : 'Upload image'}</>
                    )}
                    <input ref={mainFileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="sr-only" disabled={mainUploading} onChange={handleMainImageChange} />
                  </label>
                  <p className="text-xs text-gray-400">JPG, PNG or WebP · max 5 MB · or paste a URL below:</p>
                  <input value={form.image_url} onChange={e => set('image_url', e.target.value)}
                    placeholder="https:// or /project-images/..." className={inp} />
                </div>
                {form.image_url && !mainUploading && (
                  <img src={form.image_url} alt="preview" className="w-28 h-20 rounded-xl object-cover border border-gray-200 shrink-0"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                )}
              </div>
            </div>

            {/* Gallery */}
            <div className="md:col-span-2">
              <FieldLabel label={`Gallery Photos (up to ${MAX_GALLERY})`} tip="Additional photos shown in the project detail view. Upload in order — first image appears first. Max 5 images." />
              <div className="flex flex-wrap gap-3 items-center">
                {form.gallery_urls.map((url, i) => (
                  <div key={i} className="relative shrink-0">
                    <img src={url} alt={`gallery ${i + 1}`} className="w-24 h-16 rounded-lg object-cover border border-gray-200"
                      onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
                    <button type="button" onClick={() => removeGalleryImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 leading-none shadow">
                      ×
                    </button>
                  </div>
                ))}
                {form.gallery_urls.length < MAX_GALLERY && (
                  <label className={`w-24 h-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 shrink-0 transition-colors ${galleryUploading ? 'border-gray-200 opacity-50 cursor-not-allowed' : 'border-gray-300 hover:border-[#1550b6] hover:bg-blue-50 cursor-pointer'}`}>
                    {galleryUploading ? (
                      <span className="w-5 h-5 border-2 border-[#1550b6] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-xs text-gray-400">Add</span>
                      </>
                    )}
                    <input ref={galleryFileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="sr-only" disabled={galleryUploading || form.gallery_urls.length >= MAX_GALLERY}
                      onChange={handleGalleryImageChange} />
                  </label>
                )}
                {form.gallery_urls.length > 0 && (
                  <span className="text-xs text-gray-400">{form.gallery_urls.length}/{MAX_GALLERY}</span>
                )}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)}
                  className="w-4 h-4 accent-emerald-500" />
                Featured on homepage
                <InfoTooltip tip="Promotes this project into the Featured Projects section on the homepage. Maximum 9 featured projects." label="Featured on homepage" />
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                <input type="checkbox" checked={form.is_website_only} onChange={e => set('is_website_only', e.target.checked)}
                  className="w-4 h-4 accent-amber-500" />
                Totals only (hidden from public)
                <InfoTooltip tip="Hides the project card from the public projects page, but includes its capacity in aggregated statistics." label="Totals only" />
              </label>
            </div>

            {error && <p className="md:col-span-2 text-red-600 text-sm">{error}</p>}
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={saving || mainUploading || galleryUploading}
                className="bg-[#1550b6] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#1243a0] disabled:opacity-60 transition-colors">
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={handleClose}
                className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-[#1550b6] border-t-transparent rounded-full animate-spin" /></div>
      ) : sortedItems.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No projects yet.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-3 w-10" title="Featured on homepage">
                  <svg className="w-4 h-4 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Capacity</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden xl:table-cell">Visibility</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedItems.map(item => {
                const canStar = item.is_featured || featuredCount < MAX_FEATURED;
                return (
                  <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${item.is_website_only ? 'opacity-55' : ''}`}>
                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => toggleFeatured(item)}
                        title={item.is_featured ? 'Remove from homepage' : canStar ? 'Feature on homepage' : `Max ${MAX_FEATURED} featured`}
                        className={`p-1 rounded transition-colors ${item.is_featured ? 'text-emerald-500 hover:text-emerald-400' : canStar ? 'text-gray-300 hover:text-gray-500' : 'text-gray-200 cursor-not-allowed'}`}
                        disabled={!canStar && !item.is_featured}
                      >
                        <svg className="w-4 h-4" fill={item.is_featured ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        {item.is_featured && <span className="block text-[10px] leading-none text-emerald-500 font-mono">#{item.featured_order}</span>}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px] truncate">{item.name}</td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{item.capacity}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{item.type}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                      }`}>{item.status}</span>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      {item.is_website_only ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Totals Only</span>
                      ) : (
                        <span className="text-gray-400 text-xs">Public</span>
                      )}
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
