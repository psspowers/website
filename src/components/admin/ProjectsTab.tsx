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
}

type FormData = Omit<ProjectRow, 'id' | 'coordinates_lat' | 'coordinates_lng'> & {
  coordinates_lat: string;
  coordinates_lng: string;
};

const EMPTY: FormData = {
  name: '', capacity: '', type: '', status: '', cod: '', role: '',
  location: '', image_url: '', coordinates_lat: '', coordinates_lng: '',
  description: '', client: '',
};

const TYPES = ['Solar Rooftop', 'Ground Mount', 'Floating Solar', 'Solar Pump', 'Re.Powering', 'Wind', 'Energy Storage'];
const STATUSES = ['In Progress', 'Completed', 'Planning'];

export default function ProjectsTab({ supabase }: { supabase: SupabaseClient }) {
  const [items, setItems] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('id,name,capacity,type,status,cod,role,location,image_url,coordinates_lat,coordinates_lng,description,client')
      .order('created_at', { ascending: false });
    setItems((data as ProjectRow[]) ?? []);
    setLoading(false);
  }

  function openNew() { setForm(EMPTY); setEditingId(null); setError(''); setShowForm(true); }

  function openEdit(item: ProjectRow) {
    setForm({ ...item, image_url: item.image_url ?? '', description: item.description ?? '', client: item.client ?? '',
      coordinates_lat: String(item.coordinates_lat), coordinates_lng: String(item.coordinates_lng) });
    setEditingId(item.id); setError(''); setShowForm(true);
  }

  function set(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError('');
    const payload = { ...form, image_url: form.image_url || null, description: form.description || null, client: form.client || null,
      coordinates_lat: parseFloat(form.coordinates_lat) || 0, coordinates_lng: parseFloat(form.coordinates_lng) || 0 };
    const { error: err } = editingId
      ? await supabase.from('projects').update(payload).eq('id', editingId)
      : await supabase.from('projects').insert({ ...payload, scope: [], features: [], challenges: [], solutions: [], results: [] });
    setSaving(false);
    if (err) { setError(err.message); return; }
    setShowForm(false); load();
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Projects</h2>
        <button onClick={openNew} className="bg-[#1550b6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1243a0] transition-colors">+ New Project</button>
      </div>

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
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No projects yet. Use "Sync Static Data" to import existing data.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Capacity</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden xl:table-cell">Location</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px] truncate">{item.name}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{item.capacity}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{item.type}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                    }`}>{item.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden xl:table-cell max-w-[160px] truncate">{item.location}</td>
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
