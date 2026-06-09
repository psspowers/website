/* empty css                                */
import { c as createComponent, r as renderTemplate, m as maybeRenderHead, a as addAttribute, d as renderComponent, b as createAstro } from '../assets/astro/server.CUvW1WRH.js';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../assets/Layout.ChGWclkI.js';
import { $ as $$AnimatedStats } from '../assets/AnimatedStats.Dx2j_tS9.js';
import { $ as $$OptimizedImage } from '../assets/OptimizedImage.Ds2Ig7dW.js';
/* empty css                                   */
import { s as supabase } from '../assets/supabase.DTyfQ36f.js';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$ProjectCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ProjectCard;
  const { project, index } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article class="project-card group glass rounded-2xl flex flex-col h-full overflow-hidden hover:bg-slate-800/40 transition-colors"${addAttribute(project.type, "data-type")}${addAttribute(project.status, "data-status")}${addAttribute(project.location, "data-location")}${addAttribute(project.capacity.toUpperCase(), "data-capacity")} data-aos="fade-up"${addAttribute(index * 50, "data-aos-delay")} data-astro-cid-mspuyifq> <!-- Image Container --> <div class="relative aspect-video overflow-hidden rounded-t-2xl bg-slate-800" data-astro-cid-mspuyifq> ${renderComponent($$result, "OptimizedImage", $$OptimizedImage, { "src": project.image, "fallback": "/pss-logo-black.png", "alt": project.name, "aspectRatio": "16:9", "priority": index < 4, "class": "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105", "data-astro-cid-mspuyifq": true })} <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-between p-4" data-astro-cid-mspuyifq> <div class="flex gap-2" data-astro-cid-mspuyifq> <span${addAttribute(`px-2.5 py-0.5 text-xs font-medium rounded-full border ${project.status === "Completed" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-blue-500/20 text-blue-300 border-blue-500/30"}`, "class")} data-astro-cid-mspuyifq> ${project.status} </span> <span class="px-2.5 py-0.5 bg-slate-800/80 text-slate-300 text-xs font-medium rounded-full border border-slate-700/50" data-astro-cid-mspuyifq> ${project.type} </span> </div> <h2 class="text-lg font-bold text-white line-clamp-2" data-astro-cid-mspuyifq> ${project.name} </h2> </div> </div> <!-- Content Container --> <div class="p-4 flex flex-col flex-grow" data-astro-cid-mspuyifq> <div class="grid grid-cols-2 gap-2 w-full" data-astro-cid-mspuyifq> <div class="flex items-baseline justify-between bg-slate-800/60 px-3 py-2 rounded-lg" data-astro-cid-mspuyifq> <span class="text-xs text-slate-500 font-medium" data-astro-cid-mspuyifq>Capacity</span> <span class="text-sm font-semibold text-emerald-400 ml-2" data-astro-cid-mspuyifq>${project.capacity}</span> </div> <div class="flex items-baseline justify-between bg-slate-800/60 px-3 py-2 rounded-lg" data-astro-cid-mspuyifq> <span class="text-xs text-slate-500 font-medium" data-astro-cid-mspuyifq>COD</span> <span class="text-sm font-semibold text-white ml-2" data-astro-cid-mspuyifq>${project.cod}</span> </div> <div class="flex items-baseline justify-between bg-slate-800/60 px-3 py-2 rounded-lg" data-astro-cid-mspuyifq> <span class="text-xs text-slate-500 font-medium" data-astro-cid-mspuyifq>Role</span> <span class="text-sm font-semibold text-white ml-2" data-astro-cid-mspuyifq>${project.role}</span> </div> <div class="flex items-baseline justify-between bg-slate-800/60 px-3 py-2 rounded-lg" data-astro-cid-mspuyifq> <span class="text-xs text-slate-500 font-medium" data-astro-cid-mspuyifq>Location</span> <span class="text-sm font-semibold text-white ml-2" data-astro-cid-mspuyifq>${project.location}</span> </div> </div> </div> </article> `;
}, "/tmp/cc-agent/41679351/project/src/components/ProjectCard.astro", undefined);

function rowToProject(row) {
  return {
    name: row.name,
    capacity: row.capacity,
    type: row.type,
    status: row.status,
    cod: row.cod,
    role: row.role,
    location: row.location,
    image: row.image_url ?? "",
    coordinates: {
      lat: Number(row.coordinates_lat),
      lng: Number(row.coordinates_lng)
    },
    description: row.description ?? undefined,
    client: row.client ?? undefined,
    scope: row.scope.length > 0 ? row.scope : undefined,
    features: row.features.length > 0 ? row.features : undefined,
    challenges: row.challenges.length > 0 ? row.challenges : undefined,
    solutions: row.solutions.length > 0 ? row.solutions : undefined,
    results: row.results.length > 0 ? row.results : undefined,
    sustainability: row.co2_reduction || row.trees_equivalent || row.energy_savings ? {
      co2Reduction: row.co2_reduction ?? undefined,
      treesEquivalent: row.trees_equivalent ?? undefined,
      energySavings: row.energy_savings ?? undefined
    } : undefined
  };
}
async function fetchProjects() {
  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: true });
  if (error) throw new Error(`Failed to fetch projects: ${error.message}`);
  return data.map(rowToProject);
}

const regions = {
  "Central Thailand": {
    name: "Central Thailand",
    locations: [
      "Bangkok, Thailand",
      "Samut Prakan, Thailand",
      "Pathum Thani, Thailand",
      "Saraburi, Thailand",
      "Samut Sakhon, Thailand",
      "Ayutthaya, Thailand",
      "Chachoengsao, Thailand",
      "Prachinburi, Thailand",
      "Kanchanaburi, Thailand",
      "Suphan Buri, Thailand"
    ],
    description: "Major industrial and commercial hub with high energy demand"
  },
  "Southern Thailand": {
    name: "Southern Thailand",
    locations: [
      "Phuket, Thailand",
      "Krabi, Thailand"
    ],
    description: "Tourism-focused region with growing renewable energy adoption"
  },
  "Eastern Thailand": {
    name: "Eastern Thailand",
    locations: [
      "Chonburi, Thailand",
      "Rayong, Thailand"
    ],
    description: "Industrial heartland and part of the Eastern Economic Corridor"
  },
  "Northeastern Thailand": {
    name: "Northeastern Thailand",
    locations: [
      "Udon Thani, Thailand",
      "Nong Khai, Thailand",
      "Si Sa Ket, Thailand",
      "Maha Sarakham, Thailand"
    ],
    description: "Agricultural region with significant solar potential"
  },
  "India": {
    name: "India",
    locations: [
      "Punjab, India"
    ],
    description: "Expanding market with strong renewable energy growth"
  }
};

function validateProject(project) {
  try {
    if (!project.name || typeof project.name !== "string") {
      console.error("Invalid project name:", project);
      return false;
    }
    if (!project.capacity || typeof project.capacity !== "string") {
      console.error("Invalid capacity:", project);
      return false;
    }
    if (!project.type || typeof project.type !== "string") {
      console.error("Invalid type:", project);
      return false;
    }
    if (!project.status || typeof project.status !== "string") {
      console.error("Invalid status:", project);
      return false;
    }
    if (!project.location || typeof project.location !== "string") {
      console.error("Invalid location:", project);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Project validation error:", error);
    return false;
  }
}
function validateCapacityValue(capacity) {
  try {
    if (capacity.includes("Well")) {
      return 0;
    }
    const numericValue = parseFloat(capacity.replace(/[^\d.]/g, ""));
    return isNaN(numericValue) ? 0 : numericValue;
  } catch (error) {
    console.error("Capacity validation error:", error);
    return 0;
  }
}

const prerender = false;
const $$Projects = createComponent(async ($$result, $$props, $$slots) => {
  const allProjects = await fetchProjects();
  const validatedProjects = allProjects.filter(validateProject);
  const projectTypes = [...new Set(validatedProjects.map((p) => p.type))];
  const projectStatuses = [...new Set(validatedProjects.map((p) => p.status))];
  const projectMetrics = {
    activeProjects: validatedProjects.length,
    totalCapacity: validatedProjects.reduce((sum, p) => sum + validateCapacityValue(p.capacity), 0).toFixed(2),
    totalSites: new Set(validatedProjects.map((p) => p.location)).size,
    projectTypes: projectTypes.length
  };
  const sortedProjects = [...validatedProjects].sort((a, b) => {
    const yearMatchA = a.cod.match(/\d{4}/);
    const yearMatchB = b.cod.match(/\d{4}/);
    if (!yearMatchA || !yearMatchB) return 0;
    const yearA = parseInt(yearMatchA[0]);
    const yearB = parseInt(yearMatchB[0]);
    if (yearA !== yearB) return yearB - yearA;
    const quarterMatchA = a.cod.match(/Q(\d)/);
    const quarterMatchB = b.cod.match(/Q(\d)/);
    if (!quarterMatchA || !quarterMatchB) return 0;
    return parseInt(quarterMatchB[1]) - parseInt(quarterMatchA[1]);
  });
  const statIcons = {
    activeProjects: "/icons/projects/png/active-projects.png",
    totalCapacity: "/icons/projects/png/total-capacity.png",
    totalSites: "/icons/projects/png/total-sites.png",
    projectTypes: "/icons/projects/png/project-types.png"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Projects Portfolio - PSS Powers", "description": "Explore PSS Powers' portfolio of renewable energy projects across Asia. Featuring solar, wind, and energy storage solutions.", "image": "/project-images/maxion.webp", "type": "website", "data-astro-cid-aid3sr62": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="pt-20" data-astro-cid-aid3sr62> <!-- Hero --> <section class="dark-gradient-header" data-astro-cid-aid3sr62> <div class="max-w-screen-2xl mx-auto px-6 lg:px-8" data-astro-cid-aid3sr62> <div class="max-w-4xl text-white" data-aos="fade-up" data-astro-cid-aid3sr62> <p class="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4" data-astro-cid-aid3sr62>Our Work</p> <h1 class="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6" data-astro-cid-aid3sr62>
Global Project Portfolio
</h1> <p class="text-xl text-slate-300 leading-relaxed" data-astro-cid-aid3sr62>
Explore our worldwide renewable energy projects and achievements.
</p> </div> </div> </section> <!-- Stats --> <section class="py-12 bg-slate-900" data-astro-cid-aid3sr62> <div class="max-w-screen-2xl mx-auto px-6 lg:px-8" data-astro-cid-aid3sr62> <div class="grid grid-cols-2 md:grid-cols-4 gap-6" data-astro-cid-aid3sr62> ${renderComponent($$result2, "AnimatedStats", $$AnimatedStats, { "value": projectMetrics.activeProjects, "label": "Active Projects", "format": "+", "icon": statIcons.activeProjects, "data-stat": "activeProjects", "data-astro-cid-aid3sr62": true })} ${renderComponent($$result2, "AnimatedStats", $$AnimatedStats, { "value": parseFloat(projectMetrics.totalCapacity), "label": "Total Capacity", "format": "MW", "icon": statIcons.totalCapacity, "data-stat": "totalCapacity", "data-astro-cid-aid3sr62": true })} ${renderComponent($$result2, "AnimatedStats", $$AnimatedStats, { "value": projectMetrics.totalSites, "label": "Total Sites", "format": "+", "icon": statIcons.totalSites, "data-stat": "totalSites", "data-astro-cid-aid3sr62": true })} ${renderComponent($$result2, "AnimatedStats", $$AnimatedStats, { "value": projectMetrics.projectTypes, "label": "Project Types", "format": "+", "icon": statIcons.projectTypes, "data-stat": "projectTypes", "data-astro-cid-aid3sr62": true })} </div> </div> </section> <!-- Filters and Projects --> <section class="py-12" data-astro-cid-aid3sr62> <div class="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8" data-astro-cid-aid3sr62> <!-- View Toggle --> <div class="flex justify-end mb-8" data-astro-cid-aid3sr62> <div class="inline-flex rounded-xl glass p-1 gap-1" data-astro-cid-aid3sr62> <button id="grid-view" class="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500 text-slate-950" aria-label="Grid View" style="min-height: auto; min-width: auto;" data-astro-cid-aid3sr62> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-aid3sr62> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" data-astro-cid-aid3sr62></path> </svg> </button> <button id="map-view" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors" aria-label="Map View" style="min-height: auto; min-width: auto;" data-astro-cid-aid3sr62> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-aid3sr62> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" data-astro-cid-aid3sr62></path> </svg> </button> </div> </div> <!-- Filters --> <div class="flex flex-wrap gap-3 mb-8" data-astro-cid-aid3sr62> <select id="type-filter" class="px-4 py-2 rounded-xl glass border-0 text-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-transparent min-w-[150px]" style="min-height: auto;" data-astro-cid-aid3sr62> <option value="" class="bg-slate-800" data-astro-cid-aid3sr62>All Types</option> ${projectTypes.map((type, index) => renderTemplate`<option${addAttribute(`type-${index}`, "key")}${addAttribute(type, "value")} class="bg-slate-800" data-astro-cid-aid3sr62>${type}</option>`)} </select> <select id="status-filter" class="px-4 py-2 rounded-xl glass border-0 text-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-transparent min-w-[150px]" style="min-height: auto;" data-astro-cid-aid3sr62> <option value="" class="bg-slate-800" data-astro-cid-aid3sr62>All Statuses</option> ${projectStatuses.map((status, index) => renderTemplate`<option${addAttribute(`status-${index}`, "key")}${addAttribute(status, "value")} class="bg-slate-800" data-astro-cid-aid3sr62>${status}</option>`)} </select> <select id="region-filter" class="px-4 py-2 rounded-xl glass border-0 text-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-transparent min-w-[200px]" style="min-height: auto;" data-astro-cid-aid3sr62> <option value="" class="bg-slate-800" data-astro-cid-aid3sr62>All Regions</option> ${Object.entries(regions).map(([key, region], index) => renderTemplate`<option${addAttribute(`region-${key}-${index}`, "key")}${addAttribute(key, "value")} class="bg-slate-800" data-astro-cid-aid3sr62>${region.name}</option>`)} </select> </div> <!-- Views Container --> <div id="views-container" class="w-full" data-astro-cid-aid3sr62> <div id="grid-view-container" class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto" data-astro-cid-aid3sr62> ${sortedProjects.map((project, index) => renderTemplate`${renderComponent($$result2, "ProjectCard", $$ProjectCard, { "project": project, "index": index, "data-astro-cid-aid3sr62": true })}`)} </div> <div id="map-view-container" class="hidden" data-astro-cid-aid3sr62> <div data-map data-astro-cid-aid3sr62> ${renderComponent($$result2, "MapComponent", null, { "client:only": "react", "projects": validatedProjects.filter((p) => p.coordinates?.lat && p.coordinates?.lng), "client:component-hydration": "only", "data-astro-cid-aid3sr62": true, "client:component-path": "/tmp/cc-agent/41679351/project/src/components/MapComponent", "client:component-export": "default" })} </div> </div> </div> </div> </section> </main> ` })}  `;
}, "/tmp/cc-agent/41679351/project/src/pages/projects.astro", undefined);

const $$file = "/tmp/cc-agent/41679351/project/src/pages/projects.astro";
const $$url = "/projects";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Projects,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
