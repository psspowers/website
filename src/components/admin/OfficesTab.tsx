import React, { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

interface OfficeRow {
  id: string;
  country: string;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  coordinates_lat: number;
  coordinates_lng: number;
  show_in_list: boolean;
}

type FormData = Omit<OfficeRow, 'id' | 'coordinates_lat' | 'coordinates_lng'> & {
  coordinates_lat: string;
  coordinates_lng: string;
};

const EMPTY: FormData = {
  country: '', name: '', address: '', phone: '', email: '',
  coordinates_lat: '', coordinates_lng: '', show_in_list: true,
};

export default function OfficesTab({ supabase }: { supabase: SupabaseClient }) {
  const [items, setItems] = useState<OfficeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('offices').select('*').order('created_at', { ascending: true });
    setItems((data as OfficeRow[]) ?? []);
    setLoading(false);
  }

  function openNew() { setForm(EMPTY); setEditingId(null); setError(''); setShowForm(true); }

  function openEdit(item: OfficeRow) {
    setForm({ ...item, phone: item.phone ?? '', email: item.email ?? '',
      coordinates_lat: String(item.coordinates_lat), coordinates_lng: String(item.coordinates_lng) });
    setEditingId(item.id); setError(''); setShowForm(true);
  }

  function set(field: keyof FormData, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError('');
    const payload = { ...form, phone: form.phone || null, email: form.email || null,
      coordinates_lat: parseFloat(form.coordinates_lat) || 0, coordinates_lng: parseFloat(form.coordinates_lng) || 0 };
    const { error: err } = editingId
      ? await supabase.from('offices').update(payload).eq('id', editingId)
      : await supabase.from('offices').insert(payload);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setShowForm(false); load();
  }

  async function del(id: string) {
    if (!confirm('Delete this office?')) return;
    await supabase.from('offices').delete().eq('id', id);
    load();
  }

  const inp = (label: string, f: keyof FormData, extra?: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input value={(form[f] as string) ?? ''} onChange={e => set(f, e.target.value)} {...extra}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Offices</h2>
        <button onClick={openNew} className="bg-[#1550b6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1243a0] transition-colors">+ New Office</button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">{editingId ? 'Edit Office' : 'New Office'}</h3>
          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inp('Country*', 'country', { required: true, placeholder: 'Thailand' })}
            {inp('Office Name*', 'name', { required: true, placeholder: 'Bangkok HQ' })}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Address*</label>
              <textarea required rows={2} value={form.address} onChange={e => set('address', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6] resize-none" />
            </div>
            {inp('Phone', 'phone', { type: 'tel' })}
            {inp('Email', 'email', { type: 'email' })}
            {inp('Latitude*', 'coordinates_lat', { required: true, type: 'number', step: 'any', placeholder: '13.7375' })}
            {inp('Longitude*', 'coordinates_lng', { required: true, type: 'number', step: 'any', placeholder: '100.5617' })}
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="showInList" checked={form.show_in_list} onChange={e => set('show_in_list', e.target.checked)} className="w-4 h-4 accent-[#1550b6]" />
              <label htmlFor="showInList" className="text-sm text-gray-700 cursor-pointer">Show on Contact page</label>
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
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No offices yet. Use "Sync Static Data" or add one above.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Country</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Address</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Listed</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.country}</td>
                  <td className="px-4 py-3 text-gray-700">{item.name}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell max-w-xs truncate">{item.address}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.show_in_list ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {item.show_in_list ? 'Visible' : 'Hidden'}
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
