import React, { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { FieldLabel } from './InfoTooltip';

interface Stat {
  id: string;
  value: number;
  label: string;
  format: string;
  display_order: number;
}

type StatForm = Omit<Stat, 'id'>;

const EMPTY_STAT: StatForm = { value: 0, label: '', format: '', display_order: 1 };

export default function StatsSection({ supabase }: { supabase: SupabaseClient }) {
  const [items, setItems] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<StatForm>(EMPTY_STAT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('about_stats')
      .select('*')
      .order('display_order', { ascending: true });
    setItems((data as Stat[]) ?? []);
    setLoading(false);
  }

  function openNew() {
    const next = items.length > 0 ? Math.max(...items.map(i => i.display_order)) + 1 : 1;
    setForm({ ...EMPTY_STAT, display_order: next });
    setEditingId(null);
    setError('');
    setShowForm(true);
  }

  function openEdit(item: Stat) {
    setForm({ value: item.value, label: item.label, format: item.format, display_order: item.display_order });
    setEditingId(item.id);
    setError('');
    setShowForm(true);
  }

  function set<K extends keyof StatForm>(field: K, value: StatForm[K]) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const { error: err } = editingId
      ? await supabase.from('about_stats').update(form).eq('id', editingId)
      : await supabase.from('about_stats').insert(form);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setShowForm(false);
    load();
  }

  async function del(id: string) {
    if (!confirm('Delete this stat?')) return;
    await supabase.from('about_stats').delete().eq('id', id);
    load();
  }

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Stats</h3>
          <p className="text-xs text-gray-500 mt-0.5">Displayed in the banner on the About page</p>
        </div>
        <button
          onClick={openNew}
          className="bg-[#1550b6] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[#1243a0] transition-colors"
        >
          + Add Stat
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <FieldLabel label="Value*" tip="The numeric value shown prominently (e.g. 150, 1200). Numbers only — suffix or unit is added via the Format field." />
            <input
              required type="number"
              value={form.value}
              onChange={e => set('value', Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
            />
          </div>
          <div>
            <FieldLabel label="Label*" tip="Descriptive text shown below the value on the About page (e.g. Projects Completed, MW Installed, Tons CO₂ Saved)." />
            <input
              required
              value={form.label}
              onChange={e => set('label', e.target.value)}
              placeholder="Total Project Pipeline"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
            />
          </div>
          <div>
            <FieldLabel label="Format" tip="Optional suffix appended to the value (e.g. MW, +, tons). Choose None if the value stands alone." />
            <select
              value={form.format}
              onChange={e => set('format', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6] bg-white"
            >
              <option value="">None</option>
              <option value="MW">MW</option>
              <option value="+">+</option>
              <option value="tons">tons</option>
            </select>
          </div>
          <div>
            <FieldLabel label="Order" tip="Controls left-to-right display order on the About page banner. Lower numbers appear first." />
            <input
              type="number" min={1}
              value={form.display_order}
              onChange={e => set('display_order', Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
            />
          </div>
          {error && <p className="sm:col-span-2 md:col-span-4 text-red-600 text-sm">{error}</p>}
          <div className="sm:col-span-2 md:col-span-4 flex gap-3">
            <button type="submit" disabled={saving}
              className="bg-[#1550b6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1243a0] disabled:opacity-60 transition-colors">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="w-5 h-5 border-2 border-[#1550b6] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600 w-10">#</th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600">Value</th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600">Label</th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600 hidden sm:table-cell">Format</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-6 text-gray-400">No stats yet.</td></tr>
              ) : items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs font-mono">{item.display_order}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{item.value.toLocaleString()}{item.format}</td>
                  <td className="px-4 py-3 text-gray-700">{item.label}</td>
                  <td className="px-4 py-3 text-gray-400 hidden sm:table-cell font-mono text-xs">{item.format || '—'}</td>
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
