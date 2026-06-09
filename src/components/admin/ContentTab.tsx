import React, { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

interface ContentItem {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

const KEY_LABELS: Record<string, string> = {
  'about.history.intro': 'History — Intro paragraph',
  'about.history.sam': 'History — Sam Yamdagni bio',
  'about.history.nikesh': 'History — Nikesh Sinha bio',
  'about.history.closing': 'History — Closing paragraph',
  'about.mission': 'Mission statement',
  'about.values.innovation': 'Values — Innovation',
  'about.values.sustainability': 'Values — Sustainability',
  'about.values.excellence': 'Values — Excellence',
};

const GROUPS = [
  { label: 'Company History', keys: ['about.history.intro', 'about.history.sam', 'about.history.nikesh', 'about.history.closing'] },
  { label: 'Mission', keys: ['about.mission'] },
  { label: 'Company Values', keys: ['about.values.innovation', 'about.values.sustainability', 'about.values.excellence'] },
];

export default function ContentTab({ supabase }: { supabase: SupabaseClient }) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('site_content').select('*').order('key', { ascending: true });
    setItems((data as ContentItem[]) ?? []);
    setLoading(false);
  }

  function startEdit(item: ContentItem) {
    setEditingKey(item.key);
    setEditValue(item.value);
  }

  function cancelEdit() { setEditingKey(null); setEditValue(''); }

  async function saveEdit(item: ContentItem) {
    setSaving(true);
    await supabase.from('site_content').update({ value: editValue, updated_at: new Date().toISOString() }).eq('id', item.id);
    setSaving(false);
    setEditingKey(null);
    setSavedKey(item.key);
    setTimeout(() => setSavedKey(null), 2000);
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, value: editValue } : i));
  }

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1550b6]/40 focus:border-[#1550b6]';

  function itemByKey(key: string) { return items.find(i => i.key === key); }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Site Content</h2>
        <p className="text-sm text-gray-500 mt-0.5">Edit text blocks used on the About page.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#1550b6] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {GROUPS.map(group => (
            <div key={group.label}>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 border-b border-gray-200 pb-2">
                {group.label}
              </h3>
              <div className="space-y-4">
                {group.keys.map(key => {
                  const item = itemByKey(key);
                  if (!item) return null;
                  const isEditing = editingKey === key;
                  return (
                    <div key={key} className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-600">{KEY_LABELS[key] ?? key}</p>
                        {savedKey === key && <span className="text-xs text-emerald-600 font-medium">Saved</span>}
                      </div>
                      {isEditing ? (
                        <>
                          <textarea
                            className={inputCls}
                            rows={5}
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            autoFocus
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => saveEdit(item)}
                              disabled={saving}
                              className="px-4 py-1.5 bg-[#1550b6] text-white text-xs font-medium rounded-lg hover:bg-[#1244a0] transition-colors disabled:opacity-60"
                            >
                              {saving ? 'Saving…' : 'Save'}
                            </button>
                            <button onClick={cancelEdit} className="px-4 py-1.5 text-xs text-gray-600 hover:text-gray-900">
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-sm text-gray-700 leading-relaxed flex-1">{item.value}</p>
                          <button
                            onClick={() => startEdit(item)}
                            className="text-xs text-[#1550b6] hover:underline font-medium shrink-0"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
