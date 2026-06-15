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

const manifest = deserializeManifest({"hrefRoot":"file:///tmp/cc-agent/41679351/project/","adapterName":"@astrojs/netlify","routes":[{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"admin/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/admin","isIndex":true,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/index.astro","pathname":"/admin","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"contact/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"example/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/example","isIndex":false,"type":"page","pattern":"^\\/example\\/?$","segments":[[{"content":"example","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/example.astro","pathname":"/example","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"group/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/group","isIndex":false,"type":"page","pattern":"^\\/group\\/?$","segments":[[{"content":"group","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/group.astro","pathname":"/group","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"legal/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/legal","isIndex":false,"type":"page","pattern":"^\\/legal\\/?$","segments":[[{"content":"legal","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/legal.astro","pathname":"/legal","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"news/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/news","isIndex":false,"type":"page","pattern":"^\\/news\\/?$","segments":[[{"content":"news","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/news.astro","pathname":"/news","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"partner-with-us/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/partner-with-us","isIndex":false,"type":"page","pattern":"^\\/partner-with-us\\/?$","segments":[[{"content":"partner-with-us","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/partner-with-us.astro","pathname":"/partner-with-us","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"people/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/people","isIndex":false,"type":"page","pattern":"^\\/people\\/?$","segments":[[{"content":"people","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/people.astro","pathname":"/people","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"privacy/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/privacy","isIndex":false,"type":"page","pattern":"^\\/privacy\\/?$","segments":[[{"content":"privacy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/privacy.astro","pathname":"/privacy","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"projects/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/projects","isIndex":false,"type":"page","pattern":"^\\/projects\\/?$","segments":[[{"content":"projects","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/projects.astro","pathname":"/projects","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"services/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/services","isIndex":false,"type":"page","pattern":"^\\/services\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services.astro","pathname":"/services","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"solar-savings/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/solar-savings","isIndex":false,"type":"page","pattern":"^\\/solar-savings\\/?$","segments":[[{"content":"solar-savings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/solar-savings.astro","pathname":"/solar-savings","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/stats","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/stats\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"stats","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/stats.ts","pathname":"/api/stats","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/tmp/cc-agent/41679351/project/src/pages/admin/index.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/example.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/group.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/legal.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/news.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/partner-with-us.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/people.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/privacy.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/projects.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/services.astro",{"propagation":"none","containsHead":true}],["/tmp/cc-agent/41679351/project/src/pages/solar-savings.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/admin/index@_@astro":"pages/admin.astro.mjs","\u0000@astro-page:src/pages/api/stats@_@ts":"pages/api/stats.astro.mjs","\u0000@astro-page:src/pages/contact@_@astro":"pages/contact.astro.mjs","\u0000@astro-page:src/pages/example@_@astro":"pages/example.astro.mjs","\u0000@astro-page:src/pages/group@_@astro":"pages/group.astro.mjs","\u0000@astro-page:src/pages/legal@_@astro":"pages/legal.astro.mjs","\u0000@astro-page:src/pages/news@_@astro":"pages/news.astro.mjs","\u0000@astro-page:src/pages/partner-with-us@_@astro":"pages/partner-with-us.astro.mjs","\u0000@astro-page:src/pages/people@_@astro":"pages/people.astro.mjs","\u0000@astro-page:src/pages/privacy@_@astro":"pages/privacy.astro.mjs","\u0000@astro-page:src/pages/projects@_@astro":"pages/projects.astro.mjs","\u0000@astro-page:src/pages/services@_@astro":"pages/services.astro.mjs","\u0000@astro-page:src/pages/solar-savings@_@astro":"pages/solar-savings.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_CgbQUd2T.mjs","/astro/hoisted.js?q=7":"assets/hoisted.BMFBsVX-.js","/tmp/cc-agent/41679351/project/src/components/ZoomableContent":"assets/ZoomableContent.BYg54LdC.js","/tmp/cc-agent/41679351/project/src/components/ContactMap":"assets/ContactMap.BeE5Iw4X.js","/tmp/cc-agent/41679351/project/src/components/MapComponent":"assets/MapComponent.DPq3XUpw.js","/astro/hoisted.js?q=0":"assets/hoisted.BFRyD7xX.js","/astro/hoisted.js?q=1":"assets/hoisted.CH4MupxZ.js","/astro/hoisted.js?q=2":"assets/hoisted.BWv7WwKV.js","/astro/hoisted.js?q=3":"assets/hoisted.l3a1QhtO.js","/astro/hoisted.js?q=6":"assets/hoisted.BD9VbTWR.js","/tmp/cc-agent/41679351/project/node_modules/leaflet/dist/leaflet.css":"assets/leaflet.DV_UAf4f.js","/tmp/cc-agent/41679351/project/src/components/admin/NewsTab.tsx":"assets/NewsTab.DpfqbGcF.js","/tmp/cc-agent/41679351/project/src/components/admin/ProjectsTab.tsx":"assets/ProjectsTab.Udok0yO0.js","/tmp/cc-agent/41679351/project/src/components/admin/OfficesTab.tsx":"assets/OfficesTab.Dp9MEHs2.js","/tmp/cc-agent/41679351/project/src/components/admin/LeadsTab.tsx":"assets/LeadsTab.xlgwwUMP.js","/tmp/cc-agent/41679351/project/src/components/admin/PopupTab.tsx":"assets/PopupTab.6DQyYeSu.js","/tmp/cc-agent/41679351/project/src/components/admin/PeopleTab.tsx":"assets/PeopleTab.CaKPgNpX.js","/tmp/cc-agent/41679351/project/src/components/admin/PartnerInquiriesTab.tsx":"assets/PartnerInquiriesTab.CcD5UPGv.js","/tmp/cc-agent/41679351/project/node_modules/leaflet.markercluster/dist/MarkerCluster.css":"assets/MarkerCluster.x3aDoahD.js","/tmp/cc-agent/41679351/project/node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css":"assets/MarkerCluster.Default.d-8S5mZF.js","/tmp/cc-agent/41679351/project/src/components/admin/AdminDashboard":"assets/AdminDashboard.1urMmbxJ.js","/tmp/cc-agent/41679351/project/src/components/admin/AboutTab.tsx":"assets/AboutTab.DNal_O3O.js","@astrojs/react/client.js":"assets/client.gam2TTLE.js","/astro/hoisted.js?q=4":"assets/hoisted.DTk3Udm2.js","/astro/hoisted.js?q=5":"assets/hoisted.CFf01wqT.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/assets/about.DaaHXIIh.css","/assets/about.CP07z1Xq.css","/assets/about.BVzv844y.css","/assets/index.WcDji4Tw.css","/assets/index.DeI3HoWF.css","/assets/projects.t1e0B4Ri.css","/Final_Hero_shot_website.jpg","/PSS.RES.Banner.jpg","/PSS.RES.Logo.jpg","/PizzaMania.Banner.jpg","/Pss.O_Logo_Cropped.png","/Pss.O_New_Logo_Transparent.png","/Tato.Banner.jpg","/YCUBE.IRR.Banner.jpg","/favicon.svg","/i-squared-capital-logo.png","/image.png","/pss-logo-black.png","/pss-logo-white.png","/News_Images/2024-01_2024-01-15_operations-india.jpg","/News_Images/2024-02_2024-02-20_maxion-wheels-completion.jpg","/News_Images/2024-09_2024-09-05_naraesuan-sign.jpg","/News_Images/2025-02_2025-02-15_isq-partnership-announcement.jpg","/News_Images/A&E_Signing_-_December_2025.jpeg","/News_Images/A&E_Signing_-_November_2025.jpeg","/News_Images/Commitment_Day_2025.jpeg","/News_Images/Energy_Box_-_July_2025.jpeg","/News_Images/Energy_Box_Malaysia_-_Oct_2025.jpeg","/News_Images/Energy_Trilema_-_April_2026.jpeg","/News_Images/HSBC_-_Data_Center_-_October_2025.jpeg","/News_Images/KKU_Signing_-_March_2026.jpeg","/News_Images/TRPF_-_May_2026.jpeg","/News_Images/Vardhaman_Signing_-_November_2025.jpeg","/News_Images/Vardhaman_Steel_COD_-_April_2026.png","/Team/Ashish.jpg","/Team/Chudapak.jpg","/Team/Kapil.jpg","/Team/Nakkarin.jpg","/Team/Nanaphan_1.jpg","/Team/Nikesh.jpg","/Team/Pimlapat.jpg","/Team/Sam.jpg","/Team/Suraphol.jpg","/Team/Walailak_COD_.jpeg","/assets/AboutTab.DNal_O3O.js","/assets/AdminDashboard.1urMmbxJ.js","/assets/ContactMap.BeE5Iw4X.js","/assets/InfoTooltip.CXMhKCUz.js","/assets/LeadsTab.xlgwwUMP.js","/assets/MapComponent.DPq3XUpw.js","/assets/MarkerCluster.4Oo7lyRB.css","/assets/MarkerCluster.BhFbdele.css","/assets/NewsTab.DpfqbGcF.js","/assets/OfficesTab.Dp9MEHs2.js","/assets/PartnerInquiriesTab.CcD5UPGv.js","/assets/PeopleTab.CaKPgNpX.js","/assets/PopupTab.6DQyYeSu.js","/assets/ProjectsTab.Udok0yO0.js","/assets/ZoomableContent.BYg54LdC.js","/assets/_commonjsHelpers.Cpj98o6Y.js","/assets/client.gam2TTLE.js","/assets/hoisted.BD9VbTWR.js","/assets/hoisted.BFRyD7xX.js","/assets/hoisted.BMFBsVX-.js","/assets/hoisted.BWv7WwKV.js","/assets/hoisted.CFf01wqT.js","/assets/hoisted.CH4MupxZ.js","/assets/hoisted.DTk3Udm2.js","/assets/hoisted.DvB2Xm2x.css","/assets/hoisted.l3a1QhtO.js","/assets/index.DLVm3Rra.js","/assets/index.h85i37dG.js","/assets/jsx-runtime.DryX8W7K.js","/assets/leaflet-src.Ca-aQOu_.js","/assets/leaflet.Dgihpmma.css","/assets/leaflet.markercluster-src.C6nYp5jn.js","/assets/preload-helper.CLcXU_4U.js","/project-images/acts-studio.webp","/project-images/att-u-park.webp","/project-images/c2c.webp","/project-images/ck-corp.webp","/project-images/copper-cord.webp","/project-images/dynoflex.webp","/project-images/foamtec.webp","/project-images/hv-fila.webp","/project-images/irpc.webp","/project-images/kce-1.webp","/project-images/kce-2.webp","/project-images/krabi.webp","/project-images/lpf.webp","/project-images/maha-sarakham.webp","/project-images/maxion.webp","/project-images/mega-life.webp","/project-images/nanapan.webp","/project-images/prime-road.webp","/project-images/renaissance.webp","/project-images/sb-solar.webp","/project-images/seacon.webp","/project-images/sfc-scc.webp","/project-images/sfc.webp","/project-images/soltech.webp","/project-images/srisaket.webp","/project-images/ss.webp","/project-images/tf-tech-2.webp","/project-images/tf-tech-3.webp","/project-images/tf-tech-4.webp","/project-images/tf-tech.webp","/project-images/thai-churos.webp","/project-images/thai-food.webp","/project-images/thai-ruam-jai.webp","/project-images/vardhaman-steel.webp","/icons/services/energy-storage.png","/icons/services/energy-storage.svg","/icons/services/solar-energy.png","/icons/services/solar-energy.svg","/icons/services/wind-power.png","/icons/services/wind-power.svg","/icons/projects/png/CO2 reduction.png","/icons/projects/png/active-projects.png","/icons/projects/png/project-types.png","/icons/projects/png/total-capacity.png","/icons/projects/png/total-sites.png","/about/index.html","/admin/index.html","/contact/index.html","/example/index.html","/group/index.html","/legal/index.html","/news/index.html","/partner-with-us/index.html","/people/index.html","/privacy/index.html","/projects/index.html","/services/index.html","/solar-savings/index.html","/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"A3N5H4+v12TJYDWh82FVIYeOF0Lgr0KMqIyPSg8Fi1g=","experimentalEnvGetSecretEnabled":false});

export { manifest };
