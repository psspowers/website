import React, { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

interface Service {
  id: string;
  title: string;
  description: string;
  icon_path: string;
  features: string[];
  stat_value: number;
  stat_label: string;
  stat_format: string;
  success_client: string;
  success_result: string;
  display_order: number;
}

type ServiceForm = Omit<Service, 'id'>;

const EMPTY: ServiceForm = {
  title: '', description: '', icon_path: '', features: [],
  stat_value: 0, stat_label: '', stat_format: '',
  success_client: '', success_result: '', display_order: 1,
};

export default function ServicesTab({ supabase }: { supabase: SupabaseClient }) {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(EMPTY);
  const [featuresText, setFeaturesText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('services').select('*').order('display_order', { ascending: true });
    setItems((data as Service[]) ?? []);
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

  function openEdit(item: Service) {
    setForm({
      title: item.title, description: item.description, icon_path: item.icon_path,
      features: item.features, stat_value: item.stat_value, stat_label: item.stat_label,
      stat_format: item.stat_format, success_client: item.success_client,
      success_result: item.success_result, display_order: item.display_order,
    });
    setFeaturesText((item.features ?? []).join('\n'));
    setEditingId(item.id);
    setError('');
    setShowForm(true);
  }

  function closeForm() { setShowForm(false); setEditingId(null); setError(''); }

  function f(k: keyof ServiceForm, v: string | number) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    setSaving(true);
    const payload = { ...form, features: featuresText.split('\n').map(s => s.trim()).filter(Boolean) };
    const { error: err } = editingId
      ? await supabase.from('services').update(payload).eq('id', editingId)
      : await supabase.from('services').insert(payload);
    setSaving(false);
    if (err) { setError(err.message); return; }
    closeForm();
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this service?')) return;
    await supabase.from('services').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  }

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1550b6]/40 focus:border-[#1550b6]';
  const labelCls = 'block text-xs font-medium text-gray-600 mb-1';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Services</h2>
        <button onClick={openNew} className="bg-[#1550b6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1244a0] transition-colors">
          + Add Service
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
                  <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed mb-2 line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap gap-1">
                  {item.features.map((feat, i) => (
                    <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{feat}</span>
                  ))}
                </div>
                <p className="text-xs text-emerald-600 font-medium mt-2">
                  {item.stat_value} {item.stat_format} — {item.stat_label}
                </p>
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
              <h3 className="font-bold text-gray-900">{editingId ? 'Edit Service' : 'New Service'}</h3>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelCls}>Title *</label>
                  <input className={inputCls} value={form.title} onChange={e => f('title', e.target.value)} required />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Description</label>
                  <textarea className={inputCls} rows={3} value={form.description} onChange={e => f('description', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Features (one per line)</label>
                  <textarea className={inputCls} rows={4} value={featuresText} onChange={e => setFeaturesText(e.target.value)} placeholder="Feature 1&#10;Feature 2" />
                </div>
                <div>
                  <label className={labelCls}>Stat Value</label>
                  <input type="number" step="0.1" className={inputCls} value={form.stat_value} onChange={e => f('stat_value', parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <label className={labelCls}>Stat Format</label>
                  <select className={inputCls} value={form.stat_format} onChange={e => f('stat_format', e.target.value)}>
                    <option value="">None</option>
                    <option value="MW">MW</option>
                    <option value="%">%</option>
                    <option value="+">+</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Stat Label</label>
                  <input className={inputCls} value={form.stat_label} onChange={e => f('stat_label', e.target.value)} placeholder="e.g. Total Capacity Installed (MW)" />
                </div>
                <div>
                  <label className={labelCls}>Success Story — Client</label>
                  <input className={inputCls} value={form.success_client} onChange={e => f('success_client', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Display Order</label>
                  <input type="number" className={inputCls} value={form.display_order} onChange={e => f('display_order', parseInt(e.target.value) || 1)} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Success Story — Result</label>
                  <input className={inputCls} value={form.success_result} onChange={e => f('success_result', e.target.value)} />
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
