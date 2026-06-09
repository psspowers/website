import React, { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

interface PartnerInquiry {
  id: string;
  partnership_type: string;
  name: string;
  email: string;
  company: string | null;
  country: string | null;
  message: string | null;
  project_type: string | null;
  geography: string | null;
  investment_size: string | null;
  collaboration_goals: string | null;
  target_returns: string | null;
  investment_thesis: string | null;
  capabilities: string | null;
  regions_of_interest: string | null;
  relevant_experience: string | null;
  products_services: string | null;
  scale_of_supply: string | null;
  submitted_at: string;
}

const TYPE_COLORS: Record<string, string> = {
  strategic: 'bg-blue-100 text-blue-800',
  investment: 'bg-purple-100 text-purple-800',
  epc: 'bg-orange-100 text-orange-800',
  technology: 'bg-teal-100 text-teal-800',
  careers: 'bg-pink-100 text-pink-800',
  other: 'bg-gray-100 text-gray-700',
};

const ALL_TYPES = ['All', 'strategic', 'investment', 'epc', 'technology', 'careers', 'other'];

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function Badge({ type }: { type: string }) {
  const cls = TYPE_COLORS[type.toLowerCase()] ?? TYPE_COLORS.other;
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${cls}`}>
      {type}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-gray-800 text-sm whitespace-pre-wrap">{value}</p>
    </div>
  );
}

export default function PartnersTab({ supabase }: { supabase: SupabaseClient }) {
  const [items, setItems] = useState<PartnerInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('partner_inquiries')
      .select('*')
      .order('submitted_at', { ascending: false });
    setItems((data as PartnerInquiry[]) ?? []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this inquiry? This cannot be undone.')) return;
    await supabase.from('partner_inquiries').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
    if (expanded === id) setExpanded(null);
  }

  const visible = filter === 'All'
    ? items
    : items.filter(i => i.partnership_type.toLowerCase() === filter.toLowerCase());

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Partner Inquiries
          {items.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">
              {items.length} submission{items.length !== 1 ? 's' : ''}
            </span>
          )}
        </h2>
        <button onClick={load} className="text-sm text-[#1550b6] hover:underline font-medium">Refresh</button>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {ALL_TYPES.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors capitalize ${
              filter === t ? 'bg-[#1550b6] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#1550b6] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🤝</div>
          <p className="font-medium">No partner inquiries yet</p>
          <p className="text-sm mt-1">Submissions from the Partner With Us page will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Company</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map(item => (
                <React.Fragment key={item.id}>
                  <tr
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{item.email}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{item.company ?? '—'}</td>
                    <td className="px-4 py-3"><Badge type={item.partnership_type} /></td>
                    <td className="px-4 py-3 text-gray-400 hidden lg:table-cell text-xs whitespace-nowrap">{fmt(item.submitted_at)}</td>
                    <td className="px-4 py-3 text-right text-gray-400 text-xs">{expanded === item.id ? '▲' : '▼'}</td>
                  </tr>
                  {expanded === item.id && (
                    <tr className="bg-blue-50">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                          <DetailRow label="Email" value={item.email} />
                          <DetailRow label="Company" value={item.company} />
                          <DetailRow label="Country" value={item.country} />
                          <DetailRow label="Partnership Type" value={item.partnership_type} />
                          <DetailRow label="Submitted" value={fmt(item.submitted_at)} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                          <DetailRow label="Project Type" value={item.project_type} />
                          <DetailRow label="Geography" value={item.geography} />
                          <DetailRow label="Investment Size" value={item.investment_size} />
                          <DetailRow label="Investment Thesis" value={item.investment_thesis} />
                          <DetailRow label="Target Returns" value={item.target_returns} />
                          <DetailRow label="Collaboration Goals" value={item.collaboration_goals} />
                          <DetailRow label="Capabilities" value={item.capabilities} />
                          <DetailRow label="Regions of Interest" value={item.regions_of_interest} />
                          <DetailRow label="Relevant Experience" value={item.relevant_experience} />
                          <DetailRow label="Products / Services" value={item.products_services} />
                          <DetailRow label="Scale of Supply" value={item.scale_of_supply} />
                        </div>
                        {item.message && (
                          <>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Message</p>
                            <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed mb-3">{item.message}</p>
                          </>
                        )}
                        <div className="flex items-center gap-4">
                          <a href={`mailto:${item.email}`} className="text-sm text-[#1550b6] font-medium hover:underline">
                            Reply via email &rarr;
                          </a>
                          <button
                            onClick={e => { e.stopPropagation(); handleDelete(item.id); }}
                            className="text-sm text-red-500 hover:text-red-700 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
