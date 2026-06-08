import React, { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  role: string | null;
  country: string | null;
  message: string;
  submitted_at: string;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function LeadsTab({ supabase }: { supabase: SupabaseClient }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('contact_submissions').select('*').order('submitted_at', { ascending: false });
    setLeads((data as Lead[]) ?? []);
    setLoading(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Leads Inbox
          {leads.length > 0 && <span className="ml-2 text-sm font-normal text-gray-400">{leads.length} submission{leads.length !== 1 ? 's' : ''}</span>}
        </h2>
        <button onClick={load} className="text-sm text-[#1550b6] hover:underline font-medium">Refresh</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-[#1550b6] border-t-transparent rounded-full animate-spin" /></div>
      ) : leads.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📬</div>
          <p className="font-medium">No submissions yet</p>
          <p className="text-sm mt-1">Submissions from the contact form will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Company</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Country</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map(lead => (
                <React.Fragment key={lead.id}>
                  <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}>
                    <td className="px-4 py-3 font-medium text-gray-900">{lead.first_name} {lead.last_name}</td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{lead.email}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{lead.company ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{lead.country ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-400 hidden lg:table-cell text-xs whitespace-nowrap">{fmt(lead.submitted_at)}</td>
                    <td className="px-4 py-3 text-right text-gray-400 text-xs">{expanded === lead.id ? '▲' : '▼'}</td>
                  </tr>
                  {expanded === lead.id && (
                    <tr className="bg-blue-50">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-sm">
                          <div><p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Email</p><p className="text-gray-800">{lead.email}</p></div>
                          {lead.phone && <div><p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Phone</p><p className="text-gray-800">{lead.phone}</p></div>}
                          {lead.company && <div><p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Company</p><p className="text-gray-800">{lead.company}</p></div>}
                          {lead.role && <div><p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Role</p><p className="text-gray-800">{lead.role}</p></div>}
                          {lead.country && <div><p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Country</p><p className="text-gray-800">{lead.country}</p></div>}
                          <div><p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Submitted</p><p className="text-gray-800">{fmt(lead.submitted_at)}</p></div>
                        </div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Message</p>
                        <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">{lead.message}</p>
                        <a href={`mailto:${lead.email}`} className="inline-block mt-3 text-sm text-[#1550b6] font-medium hover:underline">
                          Reply via email &rarr;
                        </a>
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
