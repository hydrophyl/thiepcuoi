import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/thiepcuoi/' : '/',
  plugins: [
    tailwindcss(),
    svelte(),
    {
      // Dev only: /parent and /en need trailing slash, else Vite serves root index.html
      name: 'dev-trailing-slash',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const [path, query = ''] = (req.url ?? '').split('?')
          if (
            path === '/parent' ||
            path === '/en' ||
            path === '/hn' ||
            path === '/sg' ||
            path === '/parent/hn' ||
            path === '/parent/sg'
          ) {
            res.statusCode = 302
            res.setHeader('Location', path + '/' + (query && '?' + query))
            return res.end()
          }
          next()
        })
      },
    },
  ],

  // Treat .m4a as a static asset so imports get content-hashed URLs (proper cache busting)
  assetsInclude: ['**/*.m4a'],

  build: {
    rollupOptions: {
      input: {
        // Vietnamese page (default)
        main: resolve(__dirname, 'index.html'),
        // English page at /en/
        en: resolve(__dirname, 'en/index.html'),
        // Parent-invite page at /parent/
        parent: resolve(__dirname, 'parent/index.html'),
        // Single-city invites: /hn/ and /sg/
        hn: resolve(__dirname, 'hn/index.html'),
        sg: resolve(__dirname, 'sg/index.html'),
        // Single-city parent invites: /parent/hn/ and /parent/sg/
        parentHn: resolve(__dirname, 'parent/hn/index.html'),
        parentSg: resolve(__dirname, 'parent/sg/index.html'),
      },
      output: {
        // Split the Svelte runtime into its own chunk — browsers cache it across deployments
        // because it only changes when the framework version changes, not app code.
        manualChunks(id) {
          if (id.includes('node_modules/svelte')) {
            return 'vendor-svelte';
          }
        },
      },
    },
  },
}))
