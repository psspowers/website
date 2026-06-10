/* empty css                                */
import { c as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, a as addAttribute } from '../assets/astro/server.DYFYygLL.js';
import 'kleur/colors';
import 'html-escaper';
import { a as $$Icon, $ as $$Layout } from '../assets/Layout.f2qSj1Df.js';
import { s as supabase } from '../assets/supabase.DTyfQ36f.js';
import { $ as $$LinkText } from '../assets/LinkText.N3JovsEf.js';
import { $ as $$OptimizedImage } from '../assets/OptimizedImage.BfeX-moT.js';
export { renderers } from '../renderers.mjs';

function rowToNewsItem(row) {
  return {
    title: row.title,
    date: row.date,
    summary: row.summary,
    source: row.source,
    sourceUrl: row.source_url,
    image: {
      url: row.image_url ?? "",
      alt: row.image_alt ?? "",
      aspectRatio: row.image_aspect_ratio,
      width: row.image_width,
      height: row.image_height
    },
    tags: row.tags
  };
}
async function fetchNewsItems() {
  try {
    const { data, error } = await supabase.from("news_posts").select("*").eq("is_published", true).order("date", { ascending: false });
    if (error) throw new Error(error.message);
    return data.map(rowToNewsItem);
  } catch (e) {
    console.error("fetchNewsItems:", e);
    return [];
  }
}

const prerender = false;
const $$News = createComponent(async ($$result, $$props, $$slots) => {
  const newsItems = await fetchNewsItems();
  const allTags = [...new Set(newsItems.flatMap((item) => item.tags))].sort();
  const sortedNews = [...newsItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const newsWithoutImages = sortedNews.filter((item) => !item.image?.url);
  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Latest News & Updates - Pss.Orange", "description": "Stay informed about Pss.Orange's latest projects, partnerships, and achievements in renewable energy.", "image": "/News_Images/2025-02_2025-02-15_isq-partnership-announcement.jpg", "type": "article" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="pt-20"> <!-- Hero --> <section class="dark-gradient-header"> <div class="max-w-screen-2xl mx-auto px-6 lg:px-8"> <div class="max-w-3xl text-white" data-aos="fade-up"> <p class="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4">Press & Media</p> <h1 class="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6">
Latest News & Updates
</h1> <p class="text-xl text-slate-300 leading-relaxed">
Stay informed about our latest projects, partnerships, and achievements in renewable energy.
</p> </div> </div> </section> <!-- News Content --> <section class="py-20"> <div class="max-w-screen-2xl mx-auto px-6 lg:px-8"> <div class="grid lg:grid-cols-4 gap-10"> <!-- Articles --> <div class="lg:col-span-3"> <div class="grid md:grid-cols-2 gap-6 mb-12"> ${newsItems.map((item, index) => renderTemplate`<div${addAttribute(`news-${item.date}-${index}`, "key")} class="glass rounded-2xl overflow-hidden" data-aos="fade-up"${addAttribute(index * 80, "data-aos-delay")}> <div class="relative bg-slate-800 overflow-hidden rounded-t-2xl"> ${renderComponent($$result2, "OptimizedImage", $$OptimizedImage, { "src": item.image.url, "alt": item.image.alt, "aspectRatio": item.image.aspectRatio, "priority": index < 2 })} </div> <div class="p-6"> <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2"> <time${addAttribute(item.date, "datetime")} class="text-sm text-slate-500"> ${formatDate(item.date)} </time> <a${addAttribute(item.sourceUrl, "href")} target="_blank" rel="noopener noreferrer" class="text-sm text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap" style="min-height: auto;">
View on ${item.source} </a> </div> <h2 class="text-lg font-bold text-white mb-3 line-clamp-2"> ${renderComponent($$result2, "LinkText", $$LinkText, { "text": item.title })} </h2> <p class="text-slate-400 text-sm mb-4 leading-relaxed whitespace-pre-line line-clamp-3"> ${renderComponent($$result2, "LinkText", $$LinkText, { "text": item.summary })} </p> <div class="flex flex-wrap gap-2"> ${item.tags.map((tag, index2) => renderTemplate`<span${addAttribute(`tag-${index2}`, "key")} class="px-2.5 py-0.5 bg-slate-800/60 text-slate-400 rounded-full text-xs border border-slate-700"> ${tag} </span>`)} </div> </div> </div>`)} </div> ${newsWithoutImages.length > 0 && renderTemplate`<div class="space-y-6"> <h2 class="text-white font-bold text-2xl mb-4">More News</h2> ${newsWithoutImages.map((item, index) => renderTemplate`<div class="glass rounded-2xl p-6" data-aos="fade-up"${addAttribute(index * 80, "data-aos-delay")}> <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2"> <time${addAttribute(item.date, "datetime")} class="text-sm text-slate-500">${formatDate(item.date)}</time> <a${addAttribute(item.sourceUrl, "href")} target="_blank" rel="noopener noreferrer" class="text-sm text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap" style="min-height: auto;">
View on ${item.source} </a> </div> <h2 class="text-white font-bold text-lg mb-3"> ${renderComponent($$result2, "LinkText", $$LinkText, { "text": item.title })} </h2> <p class="text-slate-400 text-sm leading-relaxed mb-4"> ${renderComponent($$result2, "LinkText", $$LinkText, { "text": item.summary })} </p> <div class="flex flex-wrap gap-2"> ${item.tags.map((tag) => renderTemplate`<span class="px-2.5 py-0.5 bg-slate-800/60 text-slate-400 rounded-full text-xs border border-slate-700">${tag}</span>`)} </div> </div>`)} </div>`} </div> <!-- Sidebar --> <div class="lg:col-span-1"> <div class="glass rounded-2xl p-6 sticky top-24"> <h2 class="text-white font-bold text-lg mb-4">Categories</h2> <div class="space-y-1"> ${allTags.map((tag) => renderTemplate`<button class="w-full text-left px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors text-sm"${addAttribute(tag, "data-tag")} style="min-height: auto; min-width: auto;"> ${tag} </button>`)} </div> <div class="mt-8 pt-6 border-t border-slate-700/50"> <h2 class="text-white font-bold text-lg mb-4">Follow Us</h2> <a href="https://www.linkedin.com/company/pssorange" target="_blank" rel="noopener noreferrer" class="flex items-center gap-x-2 text-slate-400 hover:text-emerald-400 transition-colors" style="min-height: auto;"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "linkedin", "size": 20, "class": "w-5 h-5" })} <span class="text-sm">Follow on LinkedIn</span> </a> </div> </div> </div> </div> </div> </section> </main> ` })} `;
}, "/tmp/cc-agent/41679351/project/src/pages/news.astro", undefined);

const $$file = "/tmp/cc-agent/41679351/project/src/pages/news.astro";
const $$url = "/news";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$News,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
