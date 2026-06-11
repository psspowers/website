import React, { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

interface PartnerStat {
  id: string;
  key: string;
  value: string;
  label: string;
  sort_order: number;
}

export default function PartnerStatsSection({ supabase }: { supabase: SupabaseClient }) {
  const [items, setItems] = useState<PartnerStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { value: string; label: string }>>({});

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('partner_stats')
      .select('*')
      .order('sort_order', { ascending: true });
    const rows = (data as PartnerStat[]) ?? [];
    setItems(rows);
    const initial: Record<string, { value: string; label: string }> = {};
    rows.forEach(r => { initial[r.id] = { value: r.value, label: r.label }; });
    setDrafts(initial);
    setLoading(false);
  }

  function setDraft(id: string, field: 'value' | 'label', val: string) {
    setDrafts(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }));
  }

  async function save(item: PartnerStat) {
    const draft = drafts[item.id];
    if (!draft) return;
    setSaving(item.id);
    setError(null);
    const { error: err } = await supabase
      .from('partner_stats')
      .update({ value: draft.value, label: draft.label })
      .eq('id', item.id);
    setSaving(null);
    if (err) {
      setError(err.message);
    } else {
      setSaved(item.id);
      setTimeout(() => setSaved(null), 2000);
      setItems(prev => prev.map(r => r.id === item.id ? { ...r, value: draft.value, label: draft.label } : r));
    }
  }

  function isDirty(item: PartnerStat) {
    const d = drafts[item.id];
    return d && (d.value !== item.value || d.label !== item.label);
  }

  return (
    <div className="mb-10">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">I Squared Capital Partner Stats</h3>
        <p className="text-xs text-gray-500 mt-0.5">Displayed in the hover card on the About page partner badge.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="w-5 h-5 border-2 border-[#1550b6] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => {
            const draft = drafts[item.id] ?? { value: item.value, label: item.label };
            const dirty = isDirty(item);
            return (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
                  <input
                    value={draft.value}
                    onChange={e => setDraft(item.id, 'value', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#1550b6]"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                  <input
                    value={draft.label}
                    onChange={e => setDraft(item.id, 'label', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#1550b6]"
                  />
                </div>
                <button
                  onClick={() => save(item)}
                  disabled={!dirty || saving === item.id}
                  className={`w-full py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    saved === item.id
                      ? 'bg-emerald-500 text-white'
                      : dirty
                      ? 'bg-[#1550b6] hover:bg-[#1243a0] text-white'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {saving === item.id ? 'Saving...' : saved === item.id ? 'Saved!' : 'Save'}
                </button>
              </div>
            );
          })}
        </div>
      )}
      {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
    </div>
  );
}
