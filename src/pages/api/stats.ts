export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  const headers = { 'Content-Type': 'application/json' };
  const fail = () => new Response(JSON.stringify({ ok: false }), { headers });

  try {
    const { data, error } = await Promise.race([
      supabase.from('projects').select('capacity, location'),
      new Promise<{ data: null; error: Error }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: new Error('timeout') }), 5000)
      ),
    ]);

    if (error || !data || data.length === 0) return fail();

    const totalCapacityMW = Math.round(
      (data as { capacity: string; location: string }[]).reduce((sum, p) => {
        if (p.capacity.includes('Well')) return sum;
        const n = parseFloat(p.capacity.replace(/[^\d.]/g, ''));
        return sum + (isNaN(n) ? 0 : n);
      }, 0)
    );

    return new Response(
      JSON.stringify({
        ok: true,
        activeProjects: data.length,
        totalCapacityMW,
        totalLocations: new Set((data as { location: string }[]).map(p => p.location)).size,
      }),
      { headers }
    );
  } catch {
    return fail();
  }
};
