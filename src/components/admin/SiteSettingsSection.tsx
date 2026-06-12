import React, { useState, useEffect, useRef } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

const SETTING_KEYS = [
  { key: 'hero_badge_text', label: 'Hero Badge Text', multiline: false, placeholder: 'Now active across 6 countries in Asia' },
  { key: 'hero_paragraph', label: 'Hero Paragraph', multiline: true, placeholder: 'Pss.Orange delivers...' },
];

const MAX_LOGO_BYTES = 2 * 1024 * 1024;

export default function SiteSettingsSection({ supabase }: { supabase: SupabaseClient }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [logoUrl, setLogoUrl] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const logoFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('site_settings').select('key,value');
    const map: Record<string, string> = {};
    (data ?? []).forEach((row: { key: string; value: string }) => {
      if (row.key === 'partner_logo_url') {
        setLogoUrl(row.value);
      } else {
        map[row.key] = row.value;
      }
    });
    setValues(map);
    setLoading(false);
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_LOGO_BYTES) {
      setError('Logo must be 2 MB or smaller.');
      if (logoFileRef.current) logoFileRef.current.value = '';
      return;
    }
    setError('');
    setLogoUploading(true);
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png';
    const path = `partner-logo-${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from('site-assets')
      .upload(path, file, { upsert: true });
    if (uploadErr) {
      setError(`Upload failed: ${uploadErr.message}`);
      setLogoUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('site-assets').getPublicUrl(path);
    setLogoUrl(urlData.publicUrl);
    setLogoUploading(false);
    if (logoFileRef.current) logoFileRef.current.value = '';
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError('');
    const rows = [
      ...SETTING_KEYS.map(({ key }) => ({ key, value: values[key] ?? '' })),
      { key: 'partner_logo_url', value: logoUrl },
    ];
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
          <p className="text-xs text-gray-500 mt-0.5">Controls the hero badge and paragraph on the homepage. Team count is managed via the Stats section below.</p>
        </div>
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

          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-medium text-gray-600 mb-2">Financial Partner Logo</label>
            <p className="text-xs text-gray-400 mb-3">Displayed on the About and People pages. PNG with transparent background preferred. Max 2 MB.</p>
            <div className="flex items-center gap-3 flex-wrap">
              <label className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border cursor-pointer transition-colors ${logoUploading ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' : 'border-[#1550b6] text-[#1550b6] hover:bg-blue-50'}`}>
                {logoUploading ? (
                  <><span className="w-3.5 h-3.5 border-2 border-[#1550b6] border-t-transparent rounded-full animate-spin inline-block" />Uploading...</>
                ) : (
                  <><svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" /></svg>{logoUrl ? 'Replace logo' : 'Upload logo'}</>
                )}
                <input
                  ref={logoFileRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                  className="sr-only"
                  disabled={logoUploading}
                  onChange={handleLogoUpload}
                />
              </label>
              {logoUrl && !logoUploading && (
                <img
                  src={logoUrl}
                  alt="partner logo preview"
                  className="h-8 w-auto object-contain border border-gray-200 rounded px-2 bg-white"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving || logoUploading}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${saved ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-[#1550b6] hover:bg-[#1243a0] text-white'}`}>
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
            </button>
            {saved && <span className="text-sm text-emerald-600 font-medium">Settings saved successfully.</span>}
          </div>
        </form>
      )}
    </div>
  );
}
