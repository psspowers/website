/* empty css                                */
import { c as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, a as addAttribute } from '../assets/astro/server.YX3pkTnX.js';
import 'kleur/colors';
import 'html-escaper';
import { a as $$Layout } from '../assets/Layout.Wz3htEI7.js';
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
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Contact PSS Powers - Get in Touch", "description": "Contact PSS Powers for renewable energy solutions. Reach our offices in Thailand, India, and Singapore. Let's discuss your sustainable energy needs.", "image": "/pss-logo-black.png", "type": "website" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="pt-20"> <!-- Hero Section --> <section class="gradient-header"> <div class="container mx-auto px-6"> <div class="max-w-3xl text-white" data-aos="fade-up"> <h1 class="text-4xl md:text-5xl font-bold mb-6">
Get in Touch
</h1> <p class="text-xl opacity-90">
Ready to start your renewable energy journey? Contact us today to discuss how we can help you achieve your sustainability goals.
</p> </div> </div> </section> <!-- Contact Form Section --> <section class="py-16 bg-gray-50"> <div class="container mx-auto px-6"> <div class="grid lg:grid-cols-3 gap-12"> <!-- Office Locations --> <div class="lg:col-span-1" data-aos="fade-up"> <h2 class="text-2xl font-bold mb-8">Our Offices</h2> <div class="space-y-8"> ${offices.filter((office) => office.showInList).map((office) => renderTemplate`<div class="bg-white p-6 rounded-lg shadow-lg"> <div class="flex justify-between items-center mb-4"> <h3 class="text-xl font-bold text-primary">${office.country}</h3> <h4 class="text-lg text-gray-800">${office.name}</h4> </div> <div class="space-y-6"> <p class="text-gray-600 mt-4">${office.address}</p> ${office.phone && renderTemplate`<p class="text-gray-600 mt-2">${office.phone}</p>`} ${office.email && renderTemplate`<p class="text-gray-600 mt-1"> <a${addAttribute(`mailto:${office.email}`, "href")} class="hover:text-primary transition-colors"> ${office.email} </a> </p>`} </div> </div>`)} </div> </div> <!-- Contact Form --> <div class="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg" data-aos="fade-up"> <h2 class="text-2xl font-bold mb-6">Send Us a Message</h2> <form class="space-y-6"> <div class="grid md:grid-cols-2 gap-6"> <div> <label class="block text-sm font-medium text-gray-700 mb-2" htmlFor="firstName">
First Name*
</label> <input type="text" id="firstName" name="firstName" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-2" htmlFor="lastName">
Last Name*
</label> <input type="text" id="lastName" name="lastName" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"> </div> </div> <div class="grid md:grid-cols-2 gap-6"> <div> <label class="block text-sm font-medium text-gray-700 mb-2" htmlFor="role">
Role*
</label> <select id="role" name="role" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"> <option value="">Select your role</option> <option value="candidate">Candidate</option> <option value="commercial">Commercial</option> <option value="electricity-provider">Electricity provider</option> <option value="electricity-utility">Electricity utility company</option> <option value="farmer">Farmer</option> <option value="financial-institution">Financial institution</option> <option value="industrial-company">Industrial company</option> <option value="influencer">Influencer/consultant</option> <option value="pv-plant-owner">Photovoltaic power plant owner</option> <option value="private-investor">Private investor</option> <option value="project-developer">Project developer</option> <option value="state-organisation">State organisation</option> <option value="other">Other</option> </select> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-2" htmlFor="country">
Country*
</label> <input type="text" id="country" name="country" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"> </div> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
Email Address*
</label> <input type="email" id="email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">
Phone Number
</label> <input type="tel" id="phone" name="phone" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-2" htmlFor="company">
Company Name
</label> <input type="text" id="company" name="company" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-2" htmlFor="message">
Message*
</label> <textarea id="message" name="message" rows="4" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"></textarea> </div> <button type="submit" class="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
Send Message
</button> <p id="form-status" class="text-sm mt-2"></p> </form> </div> </div> </div> </section> <!-- Interactive Map Section --> <section class="py-16 bg-white"> <div class="container mx-auto px-6"> <h2 class="text-2xl font-bold text-center mb-4" data-aos="fade-up">Our Global Presence</h2> <p class="text-center text-gray-600 mb-8" data-aos="fade-up">Explore our office locations across Asia</p> <div class="max-w-5xl mx-auto"> <div class="bg-white rounded-lg shadow-lg p-6 relative" data-aos="fade-up"> <div data-map> ${renderComponent($$result2, "MapComponent", null, { "client:only": "react", "offices": offices, "client:component-hydration": "only", "client:component-path": "/tmp/cc-agent/41679351/project/src/components/ContactMap", "client:component-export": "default" })} </div> </div> </div> </div> </section> <!-- Social Connection Section --> <section class="py-16 bg-gray-50"> <div class="container mx-auto px-6 text-center"> <h2 class="text-2xl font-bold mb-6" data-aos="fade-up">Connect With Us</h2> <div class="flex justify-center space-x-6" data-aos="fade-up" data-aos-delay="100"> <a href="https://www.linkedin.com/company/psspowers/" target="_blank" rel="noopener noreferrer" class="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"> <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"> <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path> </svg> <span class="text-lg">Follow us on LinkedIn</span> </a> </div> </div> </section> </main> ` })} `;
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
