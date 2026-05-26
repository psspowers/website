/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_SITE_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Global type declarations
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}