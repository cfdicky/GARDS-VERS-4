import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webfontDownload from 'vite-plugin-webfont-dl'

// Preload main CSS so it starts downloading as early as possible
function preloadAssets() {
  return {
    name: 'preload-assets',
    enforce: 'post',
    apply: 'build',
    generateBundle(_, bundle) {
      const htmlName = Object.keys(bundle).find((n) => n.endsWith('.html'))
      if (!htmlName) return
      const cssName = Object.keys(bundle).find((n) => n.endsWith('.css'))
      if (!cssName) return
      let html = bundle[htmlName].source
      const href = './' + cssName
      if (!html.includes('as="style"')) {
        html = html.replace('</title>', `</title>\n    <link rel="preload" as="style" href="${href}">`)
      }
      bundle[htmlName].source = html
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    webfontDownload(
      [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap',
      ],
      {
        injectAsStyleTag: true,
        minifyCss: true,
        cache: true,
        subsetsAllowed: ['latin'],
      }
    ),
    preloadAssets(),
  ],
  build: {
    assetsInlineLimit: 10240,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('framer-motion')) return 'framer-motion'
          if (id.includes('embla-carousel')) return 'embla'
          if (id.includes('lucide-react')) return 'icons'
          if (id.includes('react') || id.includes('scheduler')) return 'react-vendor'
        },
      },
    },
  },
})
