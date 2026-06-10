import React, { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

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
  coordinates_lat: number;
  coordinates_lng: number;
  description: string | null;
  client: string | null;
  is_featured: boolean;
  featured_order: number;
  is_website_only: boolean;
  created_at: string;
}

type FormData = Omit<ProjectRow, 'id' | 'coordinates_lat' | 'coordinates_lng' | 'is_featured' | 'featured_order' | 'is_website_only' | 'created_at'> & {
  coordinates_lat: string;
  coordinates_lng: string;
  is_featured: boolean;
  featured_order: string;
  is_website_only: boolean;
};

const EMPTY: FormData = {
  name: '', capacity: '', type: '', status: '', cod: '', role: '',
  location: '', image_url: '', coordinates_lat: '', coordinates_lng: '',
  description: '', client: '', is_featured: false, featured_order: '99', is_website_only: false,
};

const TYPES = ['Solar Rooftop', 'Ground Mount', 'Floating Solar', 'Solar Pump', 'Re.Powering', 'Wind', 'Energy Storage'];
const STATUSES = ['In Progress', 'Completed', 'Planning'];
const MAX_FEATURED = 8;

export default function ProjectsTab({ supabase }: { supabase: SupabaseClient }) {
  const [items, setItems] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [featuredError, setFeaturedError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('id,name,capacity,type,status,cod,role,location,image_url,coordinates_lat,coordinates_lng,description,client,is_featured,featured_order,is_website_only,created_at')
      .order('created_at', { ascending: false });
    setItems((data as ProjectRow[]) ?? []);
    setLoading(false);
  }

  function openNew() { setForm(EMPTY); setEditingId(null); setError(''); setShowForm(true); }

  function openEdit(item: ProjectRow) {
    setForm({
      ...item,
      image_url: item.image_url ?? '',
      description: item.description ?? '',
      client: item.client ?? '',
      coordinates_lat: String(item.coordinates_lat),
      coordinates_lng: String(item.coordinates_lng),
      featured_order: String(item.featured_order),
    });
    setEditingId(item.id);
    setError('');
    setShowForm(true);
  }

  function set(field: keyof FormData, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
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
    setSaving(true); setError('');
    const payload = {
      ...form,
      image_url: form.image_url || null,
      description: form.description || null,
      client: form.client || null,
      coordinates_lat: parseFloat(form.coordinates_lat) || 0,
      coordinates_lng: parseFloat(form.coordinates_lng) || 0,
      featured_order: parseInt(form.featured_order) || 99,
    };
    const { error: err } = editingId
      ? await supabase.from('projects').update(payload).eq('id', editingId)
      : await supabase.from('projects').insert({ ...payload, scope: [], features: [], challenges: [], solutions: [], results: [] });
    setSaving(false);
    if (err) { setError(err.message); return; }
    setShowForm(false);
    load();
  }

  async function del(id: string) {
    if (!confirm('Delete this project?')) return;
    await supabase.from('projects').delete().eq('id', id);
    load();
  }

  const field = (label: string, f: keyof FormData, extra?: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input value={(form[f] as string) ?? ''} onChange={e => set(f, e.target.value)} {...extra}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]" />
    </div>
  );

  const sortedItems = [...items].sort((a, b) => {
    if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
    if (a.is_featured && b.is_featured) return a.featured_order - b.featured_order;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const featuredCount = items.filter(i => i.is_featured).length;
  const hiddenCount = items.filter(i => i.is_website_only).length;

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
            {field('Project Name*', 'name', { required: true })}
            {field('Capacity* (e.g. 1.5 MWp)', 'capacity', { required: true, placeholder: '1.50 MWp' })}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type*</label>
              <select required value={form.type} onChange={e => set('type', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6] bg-white">
                <option value="">Select type</option>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status*</label>
              <select required value={form.status} onChange={e => set('status', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6] bg-white">
                <option value="">Select status</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {field('COD* (e.g. Q2 2025)', 'cod', { required: true, placeholder: 'Q2 2025' })}
            {field('Role*', 'role', { required: true, placeholder: 'Developer, EPC and O&M' })}
            {field('Location*', 'location', { required: true, placeholder: 'Bangkok, Thailand' })}
            {field('Image URL', 'image_url', { placeholder: '/project-images/example.webp' })}
            {field('Latitude*', 'coordinates_lat', { required: true, type: 'number', step: 'any', placeholder: '13.7563' })}
            {field('Longitude*', 'coordinates_lng', { required: true, type: 'number', step: 'any', placeholder: '100.5018' })}
            {field('Client', 'client')}
            {field('Description', 'description')}
            {field('Featured Order', 'featured_order', { type: 'number', min: '1', placeholder: '99' })}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)}
                  className="w-4 h-4 accent-emerald-500" />
                Featured on homepage
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                <input type="checkbox" checked={form.is_website_only} onChange={e => set('is_website_only', e.target.checked)}
                  className="w-4 h-4 accent-amber-500" />
                Totals only (hidden from public)
              </label>
            </div>
            {error && <p className="md:col-span-2 text-red-600 text-sm">{error}</p>}
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={saving}
                className="bg-[#1550b6] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#1243a0] disabled:opacity-60 transition-colors">
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
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
