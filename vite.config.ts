import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { viteSingleFile } from 'vite-plugin-singlefile'
import vuetify from "vite-plugin-vuetify"

const filesNeedToExclude = [
  './src/pages/googlemap/NewTravel.vue',
  './src/pages/openstreetmap/NewTravel.vue',
  './src/pages/baidumap/NewTravel2.vue',
  './src/pages/baidumap/NewTravel3.vue',
  './src/pages/baidumap/NewTravel4.vue',
  './src/pages/baidumap/NewTravel5.vue',
  './src/stores/userStore.ts'
]

const filesPathToExclude = filesNeedToExclude.map((src) => {
  return fileURLToPath(new URL(src, import.meta.url));
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    vueJsx(),
    vueDevTools(),
    viteSingleFile({
      removeViteModuleLoader: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    // cssCodeSplit: false,
    // assetsInlineLimit: 100000000,
    // chunkSizeWarningLimit: 100000,
    rollupOptions: {
      external: [
        ...filesPathToExclude
      ],
      output: {
        inlineDynamicImports: true,
      },
    },
  }
})
