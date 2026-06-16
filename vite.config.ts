import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/thiepcuoi/' : '/',
  plugins: [tailwindcss(), svelte()],

  // Treat .m4a as a static asset so imports get content-hashed URLs (proper cache busting)
  assetsInclude: ['**/*.m4a'],

  build: {
    rollupOptions: {
      input: {
        // Vietnamese page (default)
        main: resolve(__dirname, 'index.html'),
        // English page at /en/
        en: resolve(__dirname, 'en/index.html'),
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
