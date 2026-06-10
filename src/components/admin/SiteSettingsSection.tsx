import React, { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

const SETTING_KEYS = [
  { key: 'hero_badge_text', label: 'Hero Badge Text', multiline: false, placeholder: 'Now active across 6 countries in Asia' },
  { key: 'hero_paragraph', label: 'Hero Paragraph', multiline: true, placeholder: 'Pss.Orange delivers...' },
  { key: 'hero_team_count', label: 'Team Count (e.g. 50+)', multiline: false, placeholder: '50+' },
];

export default function SiteSettingsSection({ supabase }: { supabase: SupabaseClient }) {
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
