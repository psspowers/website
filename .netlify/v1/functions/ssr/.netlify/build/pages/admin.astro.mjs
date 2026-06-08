/* empty css                                */
import { c as createComponent, r as renderTemplate, e as renderHead, d as renderComponent } from '../assets/astro/server.YX3pkTnX.js';
import 'kleur/colors';
import 'html-escaper';
/* empty css                                */
/* empty css                                */
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en" data-astro-cid-u2h3djql> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" href="/pss-logo-black.png"><title>Admin — PSS Powers</title><meta name="robots" content="noindex, nofollow"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">${renderHead()}</head> <body data-astro-cid-u2h3djql> ${renderComponent($$result, "AdminDashboard", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-u2h3djql": true, "client:component-path": "/tmp/cc-agent/41679351/project/src/components/admin/AdminDashboard", "client:component-export": "default" })} </body></html>`;
}, "/tmp/cc-agent/41679351/project/src/pages/admin/index.astro", undefined);

const $$file = "/tmp/cc-agent/41679351/project/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
