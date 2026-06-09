import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import NewsTab from './NewsTab';
import ProjectsTab from './ProjectsTab';
import OfficesTab from './OfficesTab';
import LeadsTab from './LeadsTab';
import PopupTab from './PopupTab';
import { newsItems as staticNews } from '../../data/news';
import { projects as staticProjects } from '../../data/projects/projects';
import { offices as staticOffices } from '../../data/offices';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://vxnxixwawtdhkjdsivak.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bnhpeHdhd3RkaGtqZHNpdmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3ODE3NDEsImV4cCI6MjA5NjM1Nzc0MX0.t-UTAXhvHCeRTvTchhBS-MhbQw7wJ9Spx9O9jlSAVWQ'
);

type Tab = 'news' | 'projects' | 'offices' | 'leads' | 'popup';

interface TableCounts { news: number; projects: number; offices: number; }

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminDashboard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('news');
  const [counts, setCounts] = useState<TableCounts | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');
  const resolvedRef = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!resolvedRef.current) {
        resolvedRef.current = true;
        setAuthLoading(false);
      }
    }, 5000);

    supabase.auth.getSession().then(({ data }) => {
      if (!resolvedRef.current) {
        resolvedRef.current = true;
        if (data.session?.user) setUser({ email: data.session.user.email ?? '' });
        setAuthLoading(false);
      }
    }).catch(() => {
      if (!resolvedRef.current) {
        resolvedRef.current = true;
        setAuthLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { email: session.user.email ?? '' } : null);
    });

    return () => {
      clearTimeout(timeout);
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => { if (user) loadCounts(); }, [user]);

  async function loadCounts() {
    const [{ count: nc }, { count: pc }, { count: oc }] = await Promise.all([
      supabase.from('news_posts').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('offices').select('*', { count: 'exact', head: true }),
    ]);
    setCounts({ news: nc ?? 0, projects: pc ?? 0, offices: oc ?? 0 });
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError(error.message);
  }

  async function handleSyncAll() {
    if (!counts) return;
    setSyncing(true);
    setSyncMsg('');
    const seeded: string[] = [];

    if (counts.news === 0) {
      const rows = staticNews.map(n => ({
        title: n.title, slug: toSlug(n.title), summary: n.summary,
        source: n.source, source_url: n.sourceUrl,
        image_url: n.image?.url ?? null, image_alt: n.image?.alt ?? null,
        image_aspect_ratio: n.image?.aspectRatio ?? '16:9',
        image_width: n.image?.width ?? 1200, image_height: n.image?.height ?? 675,
        tags: n.tags, date: n.date, is_published: true,
      }));
      const { error } = await supabase.from('news_posts').insert(rows);
      if (!error) seeded.push('news');
    }

    if (counts.projects === 0) {
      const rows = staticProjects.map(p => ({
        name: p.name, capacity: p.capacity, type: p.type, status: p.status,
        cod: p.cod, role: p.role, location: p.location, image_url: p.image,
        coordinates_lat: p.coordinates.lat, coordinates_lng: p.coordinates.lng,
        scope: [], features: [], challenges: [], solutions: [], results: [],
      }));
      const { error } = await supabase.from('projects').insert(rows);
      if (!error) seeded.push('projects');
    }

    if (counts.offices === 0) {
      const rows = staticOffices.map(o => ({
        country: o.country, name: o.name, address: o.address,
        phone: o.phone ?? null, email: o.email ?? null,
        coordinates_lat: o.coordinates[1], coordinates_lng: o.coordinates[0],
        show_in_list: o.showInList ?? true,
      }));
      const { error } = await supabase.from('offices').insert(rows);
      if (!error) seeded.push('offices');
    }

    await loadCounts();
    setSyncing(false);
    setSyncMsg(seeded.length > 0
      ? `Seeded: ${seeded.join(', ')}`
      : 'All tables already have data — nothing to sync.'
    );
    setTimeout(() => setSyncMsg(''), 5000);
  }

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px', height: '40px',
            border: '3px solid #e2e8f0',
            borderTopColor: '#1550b6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0, fontFamily: 'Inter, sans-serif' }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', padding: '16px' }}>
        <div style={{ width: '100%', maxWidth: '400px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '40px 36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img src="/pss-logo-black.png" alt="PSS Powers" style={{ height: '40px', margin: '0 auto 16px', display: 'block', objectFit: 'contain' }} />
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px', fontFamily: 'Inter, sans-serif' }}>Admin Portal</h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Sign in to manage site content</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', minHeight: 'unset' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Password</label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', minHeight: 'unset' }}
              />
            </div>
            {loginError && <p style={{ color: '#dc2626', fontSize: '13px', margin: 0 }}>{loginError}</p>}
            <button
              type="submit"
              style={{ background: '#1550b6', color: '#fff', padding: '11px', borderRadius: '8px', fontWeight: 600, fontSize: '15px', border: 'none', cursor: 'pointer', marginTop: '4px', minHeight: 'unset', minWidth: 'unset' }}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'news', label: 'News' },
    { id: 'projects', label: 'Projects' },
    { id: 'offices', label: 'Offices' },
    { id: 'leads', label: 'Leads Inbox' },
    { id: 'popup', label: 'Popup' },
  ];

  const needsSync = counts && (counts.news === 0 || counts.projects === 0 || counts.offices === 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#1550b6] text-white px-6 py-3 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <img src="/pss-logo-white.png" alt="PSS Powers" className="h-7 object-contain" />
          <span className="font-semibold text-lg hidden sm:inline">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-blue-200 hidden sm:inline">{user.email}</span>
          <a href="/" target="_blank" className="text-sm text-blue-200 hover:text-white transition-colors hidden md:inline">View Site</a>
          <button onClick={() => supabase.auth.signOut()}
            className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
            Sign Out
          </button>
        </div>
      </header>

      {/* Sync bar */}
      {needsSync && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex flex-wrap items-center gap-3 justify-between">
          <p className="text-sm text-amber-800">
            <strong>Initial setup required.</strong> Some tables are empty.
            {counts && <span className="ml-2 text-amber-600">News: {counts.news} | Projects: {counts.projects} | Offices: {counts.offices}</span>}
          </p>
          <button onClick={handleSyncAll} disabled={syncing}
            className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white text-sm px-4 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-60">
            {syncing ? 'Syncing...' : 'Sync Static Data'}
          </button>
        </div>
      )}
      {syncMsg && (
        <div className="bg-green-50 border-b border-green-200 px-6 py-2 text-sm text-green-800">{syncMsg}</div>
      )}

      {/* Tab nav */}
      <nav className="bg-white border-b border-gray-200 px-6">
        <div className="flex">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === t.id
                  ? 'border-[#1550b6] text-[#1550b6]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'news' && <NewsTab supabase={supabase} />}
        {activeTab === 'projects' && <ProjectsTab supabase={supabase} />}
        {activeTab === 'offices' && <OfficesTab supabase={supabase} />}
        {activeTab === 'leads' && <LeadsTab supabase={supabase} />}
        {activeTab === 'popup' && <PopupTab supabase={supabase} />}
      </main>
    </div>
  );
}
