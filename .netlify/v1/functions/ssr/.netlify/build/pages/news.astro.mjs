/* empty css                                */
import { c as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, a as addAttribute, u as unescapeHTML } from '../assets/astro/server.YX3pkTnX.js';
import 'kleur/colors';
import { $ as $$OptimizedImage, a as $$Layout } from '../assets/Layout.pCO0nZ_a.js';
import { s as supabase } from '../assets/supabase.DTyfQ36f.js';
import { $ as $$LinkText } from '../assets/LinkText.YXEtl2rL.js';
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
  const { data, error } = await supabase.from("news_posts").select("*").eq("is_published", true).order("date", { ascending: false });
  if (error) throw new Error(`Failed to fetch news: ${error.message}`);
  return data.map(rowToNewsItem);
}

const prerender = false;
const $$News = createComponent(async ($$result, $$props, $$slots) => {
  const newsItems = await fetchNewsItems();
  const allTags = [...new Set(newsItems.flatMap((item) => item.tags))].sort();
  const sortedNews = [...newsItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  sortedNews.filter((item) => item.image?.url);
  const newsWithoutImages = sortedNews.filter((item) => !item.image?.url);
  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Latest News & Updates - PSS Powers", "description": "Stay informed about PSS Powers' latest projects, partnerships, and achievements in renewable energy. Read about our impact on sustainable energy in Asia.", "image": "/News_Images/2025-02_2025-02-15_isq-partnership-announcement.jpg", "type": "article" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="pt-20"> <!-- Hero Section --> <section class="gradient-header"> <div class="container mx-auto px-6"> <div class="max-w-3xl text-white" data-aos="fade-up"> <h1 class="text-4xl md:text-5xl font-bold mb-6">
Latest News & Updates
</h1> <p class="text-xl opacity-90">
Stay informed about our latest projects, partnerships, and achievements in renewable energy.
</p> </div> </div> </section> <!-- News Content --> <section class="py-16"> <div class="container mx-auto px-6"> <div class="grid lg:grid-cols-4 gap-8"> <div class="lg:col-span-3"> <!-- Articles with Images --> <div class="grid md:grid-cols-2 gap-8 mb-12"> ${newsItems.map((item, index) => renderTemplate`<div${addAttribute(`news-${item.date}-${index}`, "key")} class="bg-white rounded-lg shadow-lg overflow-hidden" data-aos="fade-up"${addAttribute(index * 100, "data-aos-delay")}> <div class="relative"> ${renderComponent($$result2, "OptimizedImage", $$OptimizedImage, { "src": item.image.url, "alt": item.image.alt, "aspectRatio": item.image.aspectRatio, "priority": index < 2 })} </div> <div class="p-6"> <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2"> <time${addAttribute(item.date, "datetime")} class="text-sm text-gray-500"> ${formatDate(item.date)} </time> <a${addAttribute(item.sourceUrl, "href")} target="_blank" rel="noopener noreferrer" class="text-sm text-primary hover:text-primary/80 transition-colors whitespace-nowrap">
View on ${item.source} </a> </div> <h2 class="text-xl font-bold mb-4 line-clamp-2">${renderComponent($$result2, "LinkText", $$LinkText, { "text": item.title })} ${unescapeHTML(false)}</h2> <p class="text-gray-600 mb-6 whitespace-pre-line">${renderComponent($$result2, "LinkText", $$LinkText, { "text": item.summary })} ${unescapeHTML(false)}</p> <div class="flex flex-wrap gap-2"> ${item.tags.map((tag, index2) => renderTemplate`<span${addAttribute(`tag-${index2}`, "key")} class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"> ${tag} </span>`)} </div> </div> </div>`)} </div> <!-- Articles without Images --> ${newsWithoutImages.length > 0 && renderTemplate`<div class="space-y-8"> <h2 class="text-2xl font-bold mb-6">More News</h2> ${newsWithoutImages.map((item, index) => renderTemplate`<div class="bg-white rounded-lg shadow-lg p-6" data-aos="fade-up"${addAttribute(index * 100, "data-aos-delay")}> <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2"> <time${addAttribute(item.date, "datetime")} class="text-sm text-gray-500"> ${formatDate(item.date)} </time> <a${addAttribute(item.sourceUrl, "href")} target="_blank" rel="noopener noreferrer" class="text-sm text-primary hover:text-primary/80 transition-colors whitespace-nowrap">
View on ${item.source} </a> </div> <h2 class="text-xl font-bold mb-4">${renderComponent($$result2, "LinkText", $$LinkText, { "text": item.title })} ${unescapeHTML(false)}</h2> <p class="text-gray-600 mb-6">${renderComponent($$result2, "LinkText", $$LinkText, { "text": item.summary })} ${unescapeHTML(false)}</p> <div class="flex flex-wrap gap-2"> ${item.tags.map((tag) => renderTemplate`<span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"> ${tag} </span>`)} </div> </div>`)} </div>`} </div> <!-- Sidebar --> <div class="lg:col-span-1"> <div class="bg-white rounded-lg shadow-lg p-6 sticky top-24"> <h2 class="text-xl font-bold mb-4">Categories</h2> <div class="space-y-2"> ${allTags.map((tag) => renderTemplate`<button class="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-primary transition-colors"${addAttribute(tag, "data-tag")}> ${tag} </button>`)} </div> <div class="mt-8"> <h2 class="text-xl font-bold mb-4">Follow Us</h2> <a href="https://www.linkedin.com/company/psspowers" target="_blank" rel="noopener noreferrer" class="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"> <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"> <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path> </svg> <span>Follow us on LinkedIn</span> </a> </div> </div> </div> </div> </div> </section> </main> ` })} `;
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
