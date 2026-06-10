import React, { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Stat {
  id: string;
  value: number;
  label: string;
  format: string;
  display_order: number;
}

interface Milestone {
  id: string;
  year: string;
  event: string;
  logo_url: string | null;
  display_order: number;
}

type StatForm = Omit<Stat, 'id'>;
type MilestoneForm = Omit<Milestone, 'id'> & { logo_url: string };

const EMPTY_STAT: StatForm = { value: 0, label: '', format: '', display_order: 1 };
const EMPTY_MILESTONE: MilestoneForm = { year: '', event: '', logo_url: '', display_order: 1 };

// ─── Stat section ────────────────────────────────────────────────────────────

function StatsSection({ supabase }: { supabase: SupabaseClient }) {
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
            <label className="block text-xs font-medium text-gray-600 mb-1">Value*</label>
            <input
              required type="number"
              value={form.value}
              onChange={e => set('value', Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Label*</label>
            <input
              required
              value={form.label}
              onChange={e => set('label', e.target.value)}
              placeholder="Total Project Pipeline"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Format</label>
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
            <label className="block text-xs font-medium text-gray-600 mb-1">Order</label>
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

// ─── Milestones section ──────────────────────────────────────────────────────

function MilestonesSection({ supabase }: { supabase: SupabaseClient }) {
  const [items, setItems] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MilestoneForm>(EMPTY_MILESTONE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('milestones')
      .select('*')
      .order('display_order', { ascending: true });
    setItems((data as Milestone[]) ?? []);
    setLoading(false);
  }

  function openNew() {
    const next = items.length > 0 ? Math.max(...items.map(i => i.display_order)) + 1 : 1;
    setForm({ ...EMPTY_MILESTONE, display_order: next });
    setEditingId(null);
    setError('');
    setShowForm(true);
  }

  function openEdit(item: Milestone) {
    setForm({ year: item.year, event: item.event, logo_url: item.logo_url ?? '', display_order: item.display_order });
    setEditingId(item.id);
    setError('');
    setShowForm(true);
  }

  function set<K extends keyof MilestoneForm>(field: K, value: MilestoneForm[K]) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...form, logo_url: form.logo_url || null };
    const { error: err } = editingId
      ? await supabase.from('milestones').update(payload).eq('id', editingId)
      : await supabase.from('milestones').insert(payload);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setShowForm(false);
    load();
  }

  async function del(id: string) {
    if (!confirm('Delete this milestone?')) return;
    await supabase.from('milestones').delete().eq('id', id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Milestones</h3>
          <p className="text-xs text-gray-500 mt-0.5">Timeline shown on the About page. Logo URL is optional — used for partner logos.</p>
        </div>
        <button
          onClick={openNew}
          className="bg-[#1550b6] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[#1243a0] transition-colors"
        >
          + Add Milestone
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Year*</label>
            <input
              required
              value={form.year}
              onChange={e => set('year', e.target.value)}
              placeholder="2025"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Display Order</label>
            <input
              type="number" min={1}
              value={form.display_order}
              onChange={e => set('display_order', Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Event description*</label>
            <input
              required
              value={form.event}
              onChange={e => set('event', e.target.value)}
              placeholder="Signed agreement to partner with I Squared Capital"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Logo URL (optional)</label>
            <input
              value={form.logo_url}
              onChange={e => set('logo_url', e.target.value)}
              placeholder="/i-squared-capital-logo.png"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
            />
            <p className="text-xs text-gray-400 mt-1">If set, a small logo image is shown inline next to this milestone.</p>
          </div>
          {error && <p className="sm:col-span-2 text-red-600 text-sm">{error}</p>}
          <div className="sm:col-span-2 flex gap-3">
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
                <th className="text-left px-4 py-2.5 font-medium text-gray-600 w-16">Year</th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600">Event</th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600 hidden md:table-cell">Logo</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-6 text-gray-400">No milestones yet.</td></tr>
              ) : items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs font-mono">{item.display_order}</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">{item.year}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs">{item.event}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {item.logo_url ? (
                      <img src={item.logo_url} alt="logo" className="h-6 w-auto object-contain" />
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
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

// ─── Site Settings section ───────────────────────────────────────────────────

const SETTING_KEYS = [
  { key: 'hero_badge_text', label: 'Hero Badge Text', multiline: false, placeholder: 'Now active across 6 countries in Asia' },
  { key: 'hero_paragraph', label: 'Hero Paragraph', multiline: true, placeholder: 'Pss.Orange delivers...' },
  { key: 'hero_team_count', label: 'Team Count (e.g. 50+)', multiline: false, placeholder: '50+' },
];

function SiteSettingsSection({ supabase }: { supabase: SupabaseClient }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('site_settings').select('key,value');
    const map: Record<string, string> = {};
    (data ?? []).forEach((row: { key: string; value: string }) => { map[row.key] = row.value; });
    setValues(map);
    setLoading(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError('');
    const rows = SETTING_KEYS.map(({ key }) => ({ key, value: values[key] ?? '' }));
    const { error: err } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
    setSaving(false);
    if (err) { setError(err.message); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Hero & Homepage Text</h3>
          <p className="text-xs text-gray-500 mt-0.5">Controls the hero badge, paragraph, and team count on the homepage.</p>
        </div>
        {saved && <span className="text-sm text-emerald-600 font-medium">Saved!</span>}
      </div>
      {loading ? (
        <div className="flex justify-center py-6"><div className="w-5 h-5 border-2 border-[#1550b6] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <form onSubmit={save} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
          {SETTING_KEYS.map(({ key, label, multiline, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              {multiline ? (
                <textarea
                  value={values[key] ?? ''}
                  onChange={e => setValues(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6] resize-vertical"
                />
              ) : (
                <input
                  value={values[key] ?? ''}
                  onChange={e => setValues(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1550b6]"
                />
              )}
            </div>
          ))}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={saving}
            className="bg-[#1550b6] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#1243a0] disabled:opacity-60 transition-colors">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      )}
    </div>
  );
}

// ─── Root component ──────────────────────────────────────────────────────────

export default function AboutTab({ supabase }: { supabase: SupabaseClient }) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">About &amp; Homepage Content</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage homepage hero text, stats banner, and milestones timeline.</p>
      </div>
      <div className="border-b border-gray-200 mb-8" />
      <SiteSettingsSection supabase={supabase} />
      <div className="border-b border-gray-200 mb-8" />
      <StatsSection supabase={supabase} />
      <div className="border-b border-gray-200 mb-8" />
      <MilestonesSection supabase={supabase} />
    </div>
  );
}
