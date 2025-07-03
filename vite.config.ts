import type { ViteConfig } from "nuxt/schema";
import svgLoader from "vite-svg-loader";

const viteConfig: ViteConfig = {
  plugins: [svgLoader()],
};

export default viteConfig;
