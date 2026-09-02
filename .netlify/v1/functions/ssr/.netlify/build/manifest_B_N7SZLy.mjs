import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import 'es-module-lexer';
import 'html-escaper';
import 'clsx';
import { N as NOOP_MIDDLEWARE_HEADER, h as decodeKey } from './assets/astro/server.DYFYygLL.js';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || undefined,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : undefined,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///tmp/cc-agent/41679351/project/","adapterName":"@astrojs/netlify","routes":[{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"admin/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/admin","isIndex":true,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/index.astro","pathname":"/admin","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"commitment-day-2026/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/commitment-day-2026","isIndex":false,"type":"page","pattern":"^\\/commitment-day-2026\\/?$","segments":[[{"content":"commitment-day-2026","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/commitment-day-2026.astro","pathname":"/commitment-day-2026","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"contact/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"group/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/group","isIndex":false,"type":"page","pattern":"^\\/group\\/?$","segments":[[{"content":"group","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/group.astro","pathname":"/group","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"legal/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/legal","isIndex":false,"type":"page","pattern":"^\\/legal\\/?$","segments":[[{"content":"legal","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/legal.astro","pathname":"/legal","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"news/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/news","isIndex":false,"type":"page","pattern":"^\\/news\\/?$","segments":[[{"content":"news","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/news.astro","pathname":"/news","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"partner-with-us/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/partner-with-us","isIndex":false,"type":"page","pattern":"^\\/partner-with-us\\/?$","segments":[[{"content":"partner-with-us","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/partner-with-us.astro","pathname":"/partner-with-us","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"people/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/people","isIndex":false,"type":"page","pattern":"^\\/people\\/?$","segments":[[{"content":"people","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/people.astro","pathname":"/people","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"privacy/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/privacy","isIndex":false,"type":"page","pattern":"^\\/privacy\\/?$","segments":[[{"content":"privacy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/privacy.astro","pathname":"/privacy","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"projects/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/projects","isIndex":false,"type":"page","pattern":"^\\/projects\\/?$","segments":[[{"content":"projects","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/projects.astro","pathname":"/projects","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"services/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/services","isIndex":false,"type":"page","pattern":"^\\/services\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services.astro","pathname":"/services","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"solar-savings/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/solar-savings","isIndex":false,"type":"page","pattern":"^\\/solar-savings\\/?$","segments":[[{"content":"solar-savings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/solar-savings.astro","pathname":"/solar-savings","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/stats","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/stats\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"stats","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/stats.ts","pathname":"/api/stats","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/tmp/cc-agent/41679351/project/src/pages/admin/index.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/commitment-day-2026.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/group.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/legal.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/news.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/partner-with-us.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/people.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/privacy.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/projects.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/services.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/solar-savings.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/admin/index@_@astro":"pages/admin.astro.mjs","\u0000@astro-page:src/pages/api/stats@_@ts":"pages/api/stats.astro.mjs","\u0000@astro-page:src/pages/commitment-day-2026@_@astro":"pages/commitment-day-2026.astro.mjs","\u0000@astro-page:src/pages/contact@_@astro":"pages/contact.astro.mjs","\u0000@astro-page:src/pages/group@_@astro":"pages/group.astro.mjs","\u0000@astro-page:src/pages/legal@_@astro":"pages/legal.astro.mjs","\u0000@astro-page:src/pages/news@_@astro":"pages/news.astro.mjs","\u0000@astro-page:src/pages/partner-with-us@_@astro":"pages/partner-with-us.astro.mjs","\u0000@astro-page:src/pages/people@_@astro":"pages/people.astro.mjs","\u0000@astro-page:src/pages/privacy@_@astro":"pages/privacy.astro.mjs","\u0000@astro-page:src/pages/projects@_@astro":"pages/projects.astro.mjs","\u0000@astro-page:src/pages/services@_@astro":"pages/services.astro.mjs","\u0000@astro-page:src/pages/solar-savings@_@astro":"pages/solar-savings.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_B_N7SZLy.mjs","/astro/hoisted.js?q=7":"assets/hoisted.BbIaYSKJ.js","/tmp/cc-agent/41679351/project/src/components/ContactMap":"assets/ContactMap.CkR5ll2A.js","/tmp/cc-agent/41679351/project/src/components/MapComponent":"assets/MapComponent.CvsOOR1S.js","/astro/hoisted.js?q=0":"assets/hoisted.Dsi2LU84.js","/astro/hoisted.js?q=1":"assets/hoisted.BP3FadHs.js","/astro/hoisted.js?q=2":"assets/hoisted.I-w-N8SX.js","/astro/hoisted.js?q=3":"assets/hoisted.diX0D3X7.js","/astro/hoisted.js?q=6":"assets/hoisted.DDGUlEZJ.js","/tmp/cc-agent/41679351/project/src/components/admin/NewsTab.tsx":"assets/NewsTab.BUK61kUe.js","/tmp/cc-agent/41679351/project/src/components/admin/ProjectsTab.tsx":"assets/ProjectsTab.lXRmNqnj.js","/tmp/cc-agent/41679351/project/src/components/admin/OfficesTab.tsx":"assets/OfficesTab.BiXQ52oG.js","/tmp/cc-agent/41679351/project/src/components/admin/LeadsTab.tsx":"assets/LeadsTab.RdEDStFM.js","/tmp/cc-agent/41679351/project/src/components/admin/PopupTab.tsx":"assets/PopupTab.BDj11zYE.js","/tmp/cc-agent/41679351/project/src/components/admin/PeopleTab.tsx":"assets/PeopleTab.ElICln-d.js","/tmp/cc-agent/41679351/project/src/components/admin/PartnerInquiriesTab.tsx":"assets/PartnerInquiriesTab.BxpIYf6N.js","/tmp/cc-agent/41679351/project/node_modules/leaflet/dist/leaflet.css":"assets/leaflet.DV_UAf4f.js","/tmp/cc-agent/41679351/project/node_modules/leaflet.markercluster/dist/MarkerCluster.css":"assets/MarkerCluster.x3aDoahD.js","/tmp/cc-agent/41679351/project/node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css":"assets/MarkerCluster.Default.d-8S5mZF.js","/tmp/cc-agent/41679351/project/src/components/admin/AdminDashboard":"assets/AdminDashboard.BeZsP4U7.js","/tmp/cc-agent/41679351/project/src/components/admin/AboutTab.tsx":"assets/AboutTab.eEwQDJfB.js","@astrojs/react/client.js":"assets/client.gam2TTLE.js","/astro/hoisted.js?q=4":"assets/hoisted.D7jKlj9G.js","/astro/hoisted.js?q=5":"assets/hoisted.Cwa_wr4m.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/assets/about.BVzv844y.css","/assets/about.BzjICjbE.css","/assets/about.KjLNWhrV.css","/assets/index.WcDji4Tw.css","/assets/index.DVftA1Vb.css","/assets/projects.t1e0B4Ri.css","/Final_Hero_shot_website.jpg","/Logo_Only.png","/Logo_Only_2.png","/PSS.RES.Banner.jpg","/PSS.RES.Logo.jpg","/PizzaMania.Banner.jpg","/Pss.O_Logo_Cropped.png","/Pss.O_New_Logo_Transparent.png","/Screenshot_2026-08-27_at_5.53.43_PM.png","/Screenshot_2026-08-27_at_6.04.57_PM.png","/Tato.Banner.jpg","/YCUBE.IRR.Banner.jpg","/favicon.svg","/i-squared-capital-logo.png","/pss-logo-black.png","/pss-logo-white.png","/Commitment Day/5.1.1_-_Panel__Leader_+_Government_.png","/Commitment Day/5.2.1_-_Panel__Quick_Win_Technology_.png","/Commitment Day/5.3.1_-_Panel__Engg_+_EPC_+_Consult_.png","/Commitment Day/5.4.1_-_Panel__Strategic_Initiative_.png","/Commitment Day/5.5.1_-_7_Mins_Tech_Update_.png","/Commitment Day/CD 26 Big_Cheers.jpg","/Commitment Day/CD 26 Bob Announce Predictability Survey.jpg","/Commitment Day/CD 26 Cheer from Stage.jpg","/Commitment Day/CD 26 Keynote_-_PEA.jpg","/Commitment Day/CD 26 Opening Dry Ice.jpg","/Commitment Day/CD 26 Opening on Stage.jpg","/Commitment Day/CD 26 Panel_Bob.jpg","/Commitment Day/CD 26 Panel_Martin.jpg","/Commitment Day/CD 26 Raise_a_toast.jpg","/Commitment Day/CD_26_-_Keynote_Arthit.jpg","/Commitment Day/CD_26_-_Keynote_Vibikke.jpg","/Commitment Day/CD_26_-_Panel_Pai.jpg","/Commitment Day/CD_26_-_Stage_Wai.jpg","/Commitment Day/Panel_ Leader_Government.jpg","/News_Images/2024-01_2024-01-15_operations-india.jpg","/News_Images/2024-02_2024-02-20_maxion-wheels-completion.jpg","/News_Images/2024-09_2024-09-05_naraesuan-sign.jpg","/News_Images/2025-02_2025-02-15_isq-partnership-announcement.jpg","/News_Images/A&E_Signing_-_December_2025.jpeg","/News_Images/A&E_Signing_-_November_2025.jpeg","/News_Images/Commitment_Day_2025.jpeg","/News_Images/Energy_Box_-_July_2025.jpeg","/News_Images/Energy_Box_Malaysia_-_Oct_2025.jpeg","/News_Images/Energy_Trilema_-_April_2026.jpeg","/News_Images/HSBC_-_Data_Center_-_October_2025.jpeg","/News_Images/KKU_Signing_-_March_2026.jpeg","/News_Images/Screenshot_2026-08-14_at_3.08.37_PM.png","/News_Images/Screenshot_2026-08-14_at_3.09.17_PM.png","/News_Images/Screenshot_2026-08-14_at_3.09.28_PM.png","/News_Images/Screenshot_2026-08-14_at_3.11.17_PM.png","/News_Images/TRPF_-_May_2026.jpeg","/News_Images/Vardhaman_Signing_-_November_2025.jpeg","/News_Images/Vardhaman_Steel_COD_-_April_2026.png","/Team/Ashish.jpg","/Team/Chudapak.jpg","/Team/Kapil.jpg","/Team/Nakkarin.jpg","/Team/Nanaphan_1.jpg","/Team/Nikesh.jpg","/Team/Pimlapat.jpg","/Team/Sam.jpg","/Team/Suraphol.jpg","/Team/Walailak_COD_.jpeg","/assets/AboutTab.eEwQDJfB.js","/assets/AdminDashboard.BeZsP4U7.js","/assets/ContactMap.CkR5ll2A.js","/assets/InfoTooltip.D-zcmXns.js","/assets/LeadsTab.RdEDStFM.js","/assets/MapComponent.CvsOOR1S.js","/assets/MarkerCluster.4Oo7lyRB.css","/assets/MarkerCluster.BhFbdele.css","/assets/NewsTab.BUK61kUe.js","/assets/OfficesTab.BiXQ52oG.js","/assets/PartnerInquiriesTab.BxpIYf6N.js","/assets/PeopleTab.ElICln-d.js","/assets/PopupTab.BDj11zYE.js","/assets/ProjectsTab.lXRmNqnj.js","/assets/_commonjsHelpers.Cpj98o6Y.js","/assets/client.gam2TTLE.js","/assets/hoisted.BP3FadHs.js","/assets/hoisted.BbIaYSKJ.js","/assets/hoisted.Cwa_wr4m.js","/assets/hoisted.D7jKlj9G.js","/assets/hoisted.DDGUlEZJ.js","/assets/hoisted.Dsi2LU84.js","/assets/hoisted.DvB2Xm2x.css","/assets/hoisted.I-w-N8SX.js","/assets/hoisted.diX0D3X7.js","/assets/index.DLVm3Rra.js","/assets/index.h85i37dG.js","/assets/jsx-runtime.C9xZqr8S.js","/assets/leaflet-src.Ca-aQOu_.js","/assets/leaflet.Dgihpmma.css","/assets/leaflet.markercluster-src.C6nYp5jn.js","/project-images/acts-studio.webp","/project-images/att-u-park.webp","/project-images/c2c.webp","/project-images/ck-corp.webp","/project-images/copper-cord.webp","/project-images/dynoflex.webp","/project-images/foamtec.webp","/project-images/hv-fila.webp","/project-images/irpc.webp","/project-images/kce-1.webp","/project-images/kce-2.webp","/project-images/krabi.webp","/project-images/lpf.webp","/project-images/maha-sarakham.webp","/project-images/maxion.webp","/project-images/mega-life.webp","/project-images/nanapan.webp","/project-images/prime-road.webp","/project-images/renaissance.webp","/project-images/sb-solar.webp","/project-images/seacon.webp","/project-images/sfc-scc.webp","/project-images/sfc.webp","/project-images/soltech.webp","/project-images/srisaket.webp","/project-images/ss.webp","/project-images/tf-tech-2.webp","/project-images/tf-tech-3.webp","/project-images/tf-tech-4.webp","/project-images/tf-tech.webp","/project-images/thai-churos.webp","/project-images/thai-food.webp","/project-images/thai-ruam-jai.webp","/project-images/vardhaman-steel.webp","/icons/services/energy-storage.png","/icons/services/energy-storage.svg","/icons/services/solar-energy.png","/icons/services/solar-energy.svg","/icons/services/wind-power.png","/icons/services/wind-power.svg","/icons/projects/png/CO2 reduction.png","/icons/projects/png/active-projects.png","/icons/projects/png/project-types.png","/icons/projects/png/total-capacity.png","/icons/projects/png/total-sites.png","/about/index.html","/admin/index.html","/commitment-day-2026/index.html","/contact/index.html","/group/index.html","/legal/index.html","/news/index.html","/partner-with-us/index.html","/people/index.html","/privacy/index.html","/projects/index.html","/services/index.html","/solar-savings/index.html","/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"N2zTswcWYOq0NXBkHatPJzqhpGt/uOb4M02zmETsct0=","experimentalEnvGetSecretEnabled":false});

export { manifest };
