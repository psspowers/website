import { s as supabase } from '../../assets/supabase.DTyfQ36f.js';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async () => {
  const headers = { "Content-Type": "application/json" };
  const fail = () => new Response(JSON.stringify({ ok: false }), { headers });
  try {
    const { data, error } = await Promise.race([
      supabase.from("projects").select("capacity, location"),
      new Promise(
        (resolve) => setTimeout(() => resolve({ data: null, error: new Error("timeout") }), 5e3)
      )
    ]);
    if (error || !data || data.length === 0) return fail();
    const totalCapacityMW = Math.round(
      data.reduce((sum, p) => {
        if (p.capacity.includes("Well")) return sum;
        const n = parseFloat(p.capacity.replace(/[^\d.]/g, ""));
        return sum + (isNaN(n) ? 0 : n);
      }, 0)
    );
    return new Response(
      JSON.stringify({
        ok: true,
        activeProjects: data.length,
        totalCapacityMW,
        totalLocations: new Set(data.map((p) => p.location)).size
      }),
      { headers }
    );
  } catch {
    return fail();
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
