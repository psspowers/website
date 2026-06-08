import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './assets/_@astrojs-ssr-adapter.CvSoi7hX.js';
import { manifest } from './manifest_U9Z7tiwu.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/admin.astro.mjs');
const _page3 = () => import('./pages/api/stats.astro.mjs');
const _page4 = () => import('./pages/contact.astro.mjs');
const _page5 = () => import('./pages/example.astro.mjs');
const _page6 = () => import('./pages/group.astro.mjs');
const _page7 = () => import('./pages/news.astro.mjs');
const _page8 = () => import('./pages/projects.astro.mjs');
const _page9 = () => import('./pages/services.astro.mjs');
const _page10 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/admin/index.astro", _page2],
    ["src/pages/api/stats.ts", _page3],
    ["src/pages/contact.astro", _page4],
    ["src/pages/example.astro", _page5],
    ["src/pages/group.astro", _page6],
    ["src/pages/news.astro", _page7],
    ["src/pages/projects.astro", _page8],
    ["src/pages/services.astro", _page9],
    ["src/pages/index.astro", _page10]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "cb0c116d-da91-46c9-8a00-44f7ad74ad65"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
