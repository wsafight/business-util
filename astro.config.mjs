// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightImageZoom from 'starlight-image-zoom'
import sidebar from './sidebar.json' with { type: "json" };

// https://astro.build/config
export default defineConfig({
  site: "https://wsafight.github.io",
  base: "business-util",
  redirects: {
    "/": "/business-util/business/currency",
  },
  integrations: [
    starlight({
      title: "实用工具集",
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/wsafight/business-util' },
      ],
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      sidebar,
      plugins: [
        starlightImageZoom()
      ],
      customCss: [
        './src/styles/custom.css',
      ],
    }),
  ],
  compressHTML: true,
});
