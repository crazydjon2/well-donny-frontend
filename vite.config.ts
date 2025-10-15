import type { ViteConfig } from 'nuxt/schema'
import { visualizer } from 'rollup-plugin-visualizer'
import svgLoader from 'vite-svg-loader'

const viteConfig: ViteConfig = {
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined, // отключает автосплит
      },
    },
  },
  plugins: [svgLoader(), visualizer()],
}

export default viteConfig
