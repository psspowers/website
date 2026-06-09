import React, { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

interface GroupCompany {
  id: string;
  name: string;
  url: string;
  description: string;
  features: string[];
  banner_image_url: string;
  logo_url: string | null;
  display_order: number;
}

type CompanyForm = Omit<GroupCompany, 'id'>;

const EMPTY: CompanyForm = {
  name: '', url: '', description: '', features: [],
  banner_image_url: '', logo_url: '', display_order: 1,
};

export default function GroupTab({ supabase }: { supabase: SupabaseClient }) {
  const [items, setItems] = useState<GroupCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CompanyForm>(EMPTY);
  const [featuresText, setFeaturesText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('group_companies').select('*').order('display_order', { ascending: true });
    setItems((data as GroupCompany[]) ?? []);
    setLoading(false);
  }

  function openNew() {
    const next = items.length > 0 ? Math.max(...items.map(i => i.display_order)) + 1 : 1;
    setForm({ ...EMPTY, display_order: next });
    setFeaturesText('');
    setEditingId(null);
    setError('');
    setShowForm(true);
  }

  function openEdit(item: GroupCompany) {
    setForm({
      name: item.name, url: item.url, description: item.description,
      features: item.features, banner_image_url: item.banner_image_url,
      logo_url: item.logo_url ?? '', display_order: item.display_order,
    });
    setFeaturesText((item.features ?? []).join('\n'));
    setEditingId(item.id);
    setError('');
    setShowForm(true);
  }

  function closeForm() { setShowForm(false); setEditingId(null); setError(''); }

  function f(k: keyof CompanyForm, v: string | number | null) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required'); return; }
    setSaving(true);
    const payload = {
      ...form,
      features: featuresText.split('\n').map(s => s.trim()).filter(Boolean),
      logo_url: (form.logo_url as string)?.trim() || null,
    };
    const { error: err } = editingId
      ? await supabase.from('group_companies').update(payload).eq('id', editingId)
      : await supabase.from('group_companies').insert(payload);
    setSaving(false);
    if (err) { setError(err.message); return; }
    closeForm();
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this company entry?')) return;
    await supabase.from('group_companies').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  }

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1550b6]/40 focus:border-[#1550b6]';
  const labelCls = 'block text-xs font-medium text-gray-600 mb-1';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Group Companies</h2>
        <button onClick={openNew} className="bg-[#1550b6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1244a0] transition-colors">
          + Add Company
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#1550b6] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-400 font-mono">#{item.display_order}</span>
                  <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                  <span className="text-emerald-500 text-xs">{item.url}</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed mb-2 line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap gap-1">
                  {item.features.map((feat, i) => (
                    <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{feat}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(item)} className="text-xs text-[#1550b6] hover:underline font-medium">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-xs text-red-500 hover:underline font-medium">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{editingId ? 'Edit Company' : 'New Company'}</h3>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Company Name *</label>
                  <input className={inputCls} value={form.name} onChange={e => f('name', e.target.value)} required />
                </div>
                <div>
                  <label className={labelCls}>Website URL</label>
                  <input className={inputCls} value={form.url} onChange={e => f('url', e.target.value)} placeholder="www.example.com" />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Description</label>
                  <textarea className={inputCls} rows={4} value={form.description} onChange={e => f('description', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Key Features (one per line)</label>
                  <textarea className={inputCls} rows={4} value={featuresText} onChange={e => setFeaturesText(e.target.value)} placeholder="Feature 1&#10;Feature 2" />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Banner Image URL</label>
                  <input className={inputCls} value={form.banner_image_url} onChange={e => f('banner_image_url', e.target.value)} placeholder="/image.jpg or https://..." />
                </div>
                <div>
                  <label className={labelCls}>Logo URL (optional)</label>
                  <input className={inputCls} value={form.logo_url ?? ''} onChange={e => f('logo_url', e.target.value)} placeholder="/logo.png" />
                </div>
                <div>
                  <label className={labelCls}>Display Order</label>
                  <input type="number" className={inputCls} value={form.display_order} onChange={e => f('display_order', parseInt(e.target.value) || 1)} />
                </div>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeForm} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-[#1550b6] text-white text-sm font-medium rounded-lg hover:bg-[#1244a0] transition-colors disabled:opacity-60">
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
