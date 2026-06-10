/* empty css                                */
import { c as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, a as addAttribute } from '../assets/astro/server.DYFYygLL.js';
import 'kleur/colors';
import 'html-escaper';
import { a as $$Icon, $ as $$Layout } from '../assets/Layout.SuKh4FP8.js';
import { s as supabase } from '../assets/supabase.DTyfQ36f.js';
export { renderers } from '../renderers.mjs';

function rowToOffice(row) {
  return {
    country: row.country,
    name: row.name,
    address: row.address,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    // Match original [lng, lat] tuple order expected by ContactMap
    coordinates: [Number(row.coordinates_lng), Number(row.coordinates_lat)],
    showInList: row.show_in_list
  };
}
async function fetchOffices() {
  const { data, error } = await supabase.from("offices").select("*").order("created_at", { ascending: true });
  if (error) throw new Error(`Failed to fetch offices: ${error.message}`);
  return data.map(rowToOffice);
}

const prerender = false;
const $$Contact = createComponent(async ($$result, $$props, $$slots) => {
  const offices = await fetchOffices();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Contact Pss.Orange - Get in Touch", "description": "Contact Pss.Orange for renewable energy solutions. Reach our offices in Thailand, India, and Singapore. Let's discuss your sustainable energy needs.", "image": "/pss-logo-black.png", "type": "website" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="pt-20"> <!-- Hero --> <section class="dark-gradient-header"> <div class="max-w-screen-2xl mx-auto px-6 lg:px-8"> <div class="max-w-3xl text-white" data-aos="fade-up"> <p class="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4">Reach Out</p> <h1 class="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6">
Get in Touch
</h1> <p class="text-xl text-slate-300 leading-relaxed">
Ready to start your renewable energy journey? Contact us today to discuss how we can help
            you achieve your sustainability goals.
</p> </div> </div> </section> <!-- Contact Form Section --> <section class="py-20"> <div class="max-w-screen-2xl mx-auto px-6 lg:px-8"> <div class="grid lg:grid-cols-3 gap-12"> <!-- Office Locations --> <div class="lg:col-span-1" data-aos="fade-up"> <h2 class="text-white font-bold text-2xl mb-8">Our Offices</h2> <div class="space-y-6"> ${offices.filter((office) => office.showInList).map((office) => renderTemplate`<div class="glass rounded-2xl p-6"> <div class="flex justify-between items-center mb-3"> <h3 class="text-emerald-400 font-bold">${office.country}</h3> <h4 class="text-slate-400 text-sm">${office.name}</h4> </div> <div class="space-y-2 text-slate-400 text-sm"> <p>${office.address}</p> ${office.phone && renderTemplate`<p>${office.phone}</p>`} ${office.email && renderTemplate`<a${addAttribute(`mailto:${office.email}`, "href")} class="text-emerald-400 hover:text-emerald-300 transition-colors" style="min-height: auto;"> ${office.email} </a>`} </div> </div>`)} </div> </div> <!-- Contact Form --> <div class="lg:col-span-2 glass rounded-2xl p-8" data-aos="fade-up"> <h2 class="text-white font-bold text-2xl mb-6">Send Us a Message</h2> <form class="space-y-5"> <div class="grid md:grid-cols-2 gap-5"> <div> <label class="block text-sm font-medium text-slate-400 mb-1.5" for="firstName">First Name*</label> <input type="text" id="firstName" name="firstName" required class="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm"> </div> <div> <label class="block text-sm font-medium text-slate-400 mb-1.5" for="lastName">Last Name*</label> <input type="text" id="lastName" name="lastName" required class="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm"> </div> </div> <div class="grid md:grid-cols-2 gap-5"> <div> <label class="block text-sm font-medium text-slate-400 mb-1.5" for="role">Role*</label> <select id="role" name="role" required class="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm" style="min-height: auto;"> <option value="" class="bg-slate-800">Select your role</option> <option value="candidate" class="bg-slate-800">Candidate</option> <option value="commercial" class="bg-slate-800">Commercial</option> <option value="electricity-provider" class="bg-slate-800">Electricity provider</option> <option value="electricity-utility" class="bg-slate-800">Electricity utility company</option> <option value="farmer" class="bg-slate-800">Farmer</option> <option value="financial-institution" class="bg-slate-800">Financial institution</option> <option value="industrial-company" class="bg-slate-800">Industrial company</option> <option value="influencer" class="bg-slate-800">Influencer/consultant</option> <option value="pv-plant-owner" class="bg-slate-800">Photovoltaic power plant owner</option> <option value="private-investor" class="bg-slate-800">Private investor</option> <option value="project-developer" class="bg-slate-800">Project developer</option> <option value="state-organisation" class="bg-slate-800">State organisation</option> <option value="other" class="bg-slate-800">Other</option> </select> </div> <div> <label class="block text-sm font-medium text-slate-400 mb-1.5" for="country">Country*</label> <input type="text" id="country" name="country" required class="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm"> </div> </div> <div> <label class="block text-sm font-medium text-slate-400 mb-1.5" for="email">Email Address*</label> <input type="email" id="email" name="email" required class="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm"> </div> <div> <label class="block text-sm font-medium text-slate-400 mb-1.5" for="phone">Phone Number</label> <input type="tel" id="phone" name="phone" class="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm"> </div> <div> <label class="block text-sm font-medium text-slate-400 mb-1.5" for="company">Company Name</label> <input type="text" id="company" name="company" class="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm"> </div> <div> <label class="block text-sm font-medium text-slate-400 mb-1.5" for="message">Message*</label> <textarea id="message" name="message" rows="4" required class="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none text-sm"></textarea> </div> <button type="submit" class="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 px-6 rounded-xl font-semibold transition-colors text-sm" style="min-height: auto;">
Send Message
</button> <p id="form-status" class="text-sm mt-2"></p> </form> </div> </div> </div> </section> <!-- Map Section --> <section class="py-20 bg-slate-900"> <div class="max-w-screen-2xl mx-auto px-6 lg:px-8"> <div class="text-center mb-12" data-aos="fade-up"> <p class="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">Locations</p> <h2 class="font-display text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">Our Global Presence</h2> <p class="text-slate-400">Explore our office locations across Asia</p> </div> <div class="max-w-5xl mx-auto"> <div class="glass rounded-2xl p-6" data-aos="fade-up"> <div data-map> ${renderComponent($$result2, "MapComponent", null, { "client:only": "react", "offices": offices, "client:component-hydration": "only", "client:component-path": "/tmp/cc-agent/41679351/project/src/components/ContactMap", "client:component-export": "default" })} </div> </div> </div> </div> </section> <!-- Social --> <section class="py-20"> <div class="max-w-screen-2xl mx-auto px-6 lg:px-8 text-center"> <h2 class="text-white font-bold text-2xl mb-6" data-aos="fade-up">Connect With Us</h2> <div class="flex justify-center" data-aos="fade-up" data-aos-delay="100"> <a href="https://www.linkedin.com/company/pssorange/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-x-3 text-slate-400 hover:text-emerald-400 transition-colors" style="min-height: auto;"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "linkedin", "size": 28, "class": "w-7 h-7" })} <span class="text-lg font-medium">Follow us on LinkedIn</span> </a> </div> </div> </section> </main> ` })} `;
}, "/tmp/cc-agent/41679351/project/src/pages/contact.astro", undefined);

const $$file = "/tmp/cc-agent/41679351/project/src/pages/contact.astro";
const $$url = "/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
