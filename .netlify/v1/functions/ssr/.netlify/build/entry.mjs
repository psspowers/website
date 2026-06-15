import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './assets/_@astrojs-ssr-adapter.CvSoi7hX.js';
import { manifest } from './manifest_BViTEiLQ.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/admin.astro.mjs');
const _page3 = () => import('./pages/api/stats.astro.mjs');
const _page4 = () => import('./pages/contact.astro.mjs');
const _page5 = () => import('./pages/example.astro.mjs');
const _page6 = () => import('./pages/group.astro.mjs');
const _page7 = () => import('./pages/legal.astro.mjs');
const _page8 = () => import('./pages/news.astro.mjs');
const _page9 = () => import('./pages/partner-with-us.astro.mjs');
const _page10 = () => import('./pages/people.astro.mjs');
const _page11 = () => import('./pages/privacy.astro.mjs');
const _page12 = () => import('./pages/projects.astro.mjs');
const _page13 = () => import('./pages/services.astro.mjs');
const _page14 = () => import('./pages/solar-savings.astro.mjs');
const _page15 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/admin/index.astro", _page2],
    ["src/pages/api/stats.ts", _page3],
    ["src/pages/contact.astro", _page4],
    ["src/pages/example.astro", _page5],
    ["src/pages/group.astro", _page6],
    ["src/pages/legal.astro", _page7],
    ["src/pages/news.astro", _page8],
    ["src/pages/partner-with-us.astro", _page9],
    ["src/pages/people.astro", _page10],
    ["src/pages/privacy.astro", _page11],
    ["src/pages/projects.astro", _page12],
    ["src/pages/services.astro", _page13],
    ["src/pages/solar-savings.astro", _page14],
    ["src/pages/index.astro", _page15]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "7d9f50b3-e79a-49c3-a881-5191e11a47a4"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
