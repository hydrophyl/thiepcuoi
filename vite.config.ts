import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// /parent, /en, /hn, /sg and the city parent pages need a trailing slash,
// else the static server falls back to the root index.html (both cities).
const slashPaths = ['/parent', '/en', '/hn', '/sg', '/parent/hn', '/parent/sg']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function redirectToTrailingSlash(req: any, res: any, next: () => void) {
  const [path, query = ''] = (req.url ?? '').split('?')
  if (slashPaths.includes(path)) {
    res.statusCode = 302
    res.setHeader('Location', path + '/' + (query && '?' + query))
    return res.end()
  }
  next()
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/thiepcuoi/' : '/',
  plugins: [
    tailwindcss(),
    svelte(),
    {
      name: 'trailing-slash-redirect',
      configureServer(server) {
        server.middlewares.use(redirectToTrailingSlash)
      },
      // `vite preview` does not inherit configureServer, and without this it
      // silently serves the root page for /hn — same guest-visible mistake.
      configurePreviewServer(server) {
        server.middlewares.use(redirectToTrailingSlash)
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
