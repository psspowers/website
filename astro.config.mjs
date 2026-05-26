import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  integrations: [
    tailwind(),
    react({
      include: ['**/react/*', '**/React/*', '**/*.tsx'],
    })
  ],
  build: {
    inlineStylesheets: 'never',
    assets: 'assets',
    minify: true,
    splitting: true,
    compressHTML: true,
    experimental: {
      optimizeHoistedScript: true
    }
  },
  vite: {
    build: {
      cssMinify: true,
      cssCodeSplit: true,
      manifest: true,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1000,
      modulePreload: {
        polyfill: false
      },
      rollupOptions: {
        input: {
          main: './src/pages/index.astro',
          manifest: './public/manifest.json'
        },
        output: {
          assetFileNames: 'assets/[name].[hash][extname]',
          chunkFileNames: 'assets/[name].[hash].js',
          entryFileNames: 'assets/[name].[hash].js',
          manualChunks: {
            'leaflet': ['leaflet', 'leaflet.markercluster'],
            'react': ['react', 'react-dom'],
            'aos': ['aos'],
            'vendor': ['lodash'],
            'components': [
              './src/components/AnimatedStats.astro',
              './src/components/Card.astro',
              './src/components/Footer.astro',
              './src/components/Navigation.astro'
            ]
          }
        }
      }
    }
  }
});