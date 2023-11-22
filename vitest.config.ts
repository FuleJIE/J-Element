/// <reference types="vitest" />

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  test: {
    globals: true,
    environment: 'jsdom' // JavaScript库，可以通过 JS 模拟对应的 DOM 对象
  }
})
