import React, { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

interface Inquiry {
  id: string;
  partnership_type: string;
  name: string;
  email: string;
  company: string | null;
  country: string | null;
  message: string | null;
  project_type: string | null;
  geography: string | null;
  collaboration_goals: string | null;
  investment_size: string | null;
  investment_thesis: string | null;
  target_returns: string | null;
  capabilities: string | null;
  regions_of_interest: string | null;
  relevant_experience: string | null;
  products_services: string | null;
  scale_of_supply: string | null;
  submitted_at: string;
}

const TYPE_LABELS: Record<string, string> = {
  strategic: 'Strategic',
  investment: 'Investment',
  epc: 'EPC',
  technology: 'Technology',
  careers: 'Careers',
  other: 'Other',
};

const TYPE_COLORS: Record<string, string> = {
  strategic: 'bg-blue-100 text-blue-700',
  investment: 'bg-emerald-100 text-emerald-700',
  epc: 'bg-orange-100 text-orange-700',
  technology: 'bg-purple-100 text-purple-700',
  careers: 'bg-pink-100 text-pink-700',
  other: 'bg-gray-100 text-gray-600',
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-gray-800 text-sm">{value}</p>
    </div>
  );
}

function ExpandedDetails({ inquiry }: { inquiry: Inquiry }) {
  const type = inquiry.partnership_type;
  return (
    <tr className="bg-blue-50">
      <td colSpan={6} className="px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          <Field label="Email" value={inquiry.email} />
          <Field label="Company" value={inquiry.company} />
          <Field label="Country" value={inquiry.country} />
          <Field label="Submitted" value={fmt(inquiry.submitted_at)} />

          {type === 'strategic' && <>
            <Field label="Project Type" value={inquiry.project_type} />
            <Field label="Geography" value={inquiry.geography} />
          </>}
          {type === 'investment' && <>
            <Field label="Investment Size" value={inquiry.investment_size} />
            <Field label="Investment Thesis" value={inquiry.investment_thesis} />
            <Field label="Target Returns" value={inquiry.target_returns} />
          </>}
          {type === 'epc' && <>
            <Field label="Core Capabilities" value={inquiry.capabilities} />
            <Field label="Regions" value={inquiry.regions_of_interest} />
          </>}
          {type === 'technology' && <>
            <Field label="Products / Services" value={inquiry.products_services} />
            <Field label="Scale of Supply" value={inquiry.scale_of_supply} />
          </>}
        </div>

        {type === 'strategic' && inquiry.collaboration_goals && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Collaboration Goals</p>
            <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">{inquiry.collaboration_goals}</p>
          </div>
        )}
        {type === 'epc' && inquiry.relevant_experience && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Relevant Experience</p>
            <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">{inquiry.relevant_experience}</p>
          </div>
        )}
        {(type === 'technology' || type === 'careers' || type === 'other') && inquiry.message && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Message</p>
            <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">{inquiry.message}</p>
          </div>
        )}

        <a href={`mailto:${inquiry.email}`} className="inline-block mt-1 text-sm text-[#1550b6] font-medium hover:underline">
          Reply via email &rarr;
        </a>
      </td>
    </tr>
  );
}

export default function PartnerInquiriesTab({ supabase }: { supabase: SupabaseClient }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('partner_inquiries')
      .select('*')
      .order('submitted_at', { ascending: false });
    setInquiries((data as Inquiry[]) ?? []);
    setLoading(false);
  }

  const filtered = filter === 'all' ? inquiries : inquiries.filter(i => i.partnership_type === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Partner Inquiries
          {inquiries.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">
              {inquiries.length} submission{inquiries.length !== 1 ? 's' : ''}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1550b6]/30"
            style={{ minHeight: 'unset' }}
          >
            <option value="all">All types</option>
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <button onClick={load} className="text-sm text-[#1550b6] hover:underline font-medium">Refresh</button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#1550b6] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
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
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Company</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(inq => (
                <React.Fragment key={inq.id}>
                  <tr
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{inq.name}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[inq.partnership_type] ?? 'bg-gray-100 text-gray-600'}`}>
                        {TYPE_LABELS[inq.partnership_type] ?? inq.partnership_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{inq.email}</td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{inq.company ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-400 hidden lg:table-cell text-xs whitespace-nowrap">{fmt(inq.submitted_at)}</td>
                    <td className="px-4 py-3 text-right text-gray-400 text-xs">{expanded === inq.id ? '▲' : '▼'}</td>
                  </tr>
                  {expanded === inq.id && <ExpandedDetails inquiry={inq} />}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
