import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'hybrid',
  adapter: netlify(),
  integrations: [
    tailwind(),
    react({
      include: ['**/react/*', '**/React/*', '**/*.tsx'],
    }),
  ],
  build: {
    inlineStylesheets: 'never',
    assets: 'assets',
  },
  vite: {
    build: {
      cssMinify: true,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash][extname]',
          chunkFileNames: 'assets/[name].[hash].js',
          entryFileNames: 'assets/[name].[hash].js',
          manualChunks: {
            leaflet: ['leaflet', 'leaflet.markercluster'],
            react: ['react', 'react-dom'],
            aos: ['aos'],
            vendor: ['lodash'],
          },
        },
      },
    },
  },
});