import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint2';
import preact from '@preact/preset-vite';
import stylelintPlugin from 'vite-plugin-stylelint';

import * as configs from '@brybrant/configs';

export default defineConfig({
  base: '/zodiac/',
  css: {
    postcss: configs.postCSSConfig,
  },
  plugins: [
    stylelintPlugin({
      lintInWorker: true,
      config: configs.stylelintConfig,
    }),
    preact(),
    eslintPlugin({
      lintInWorker: true,
    }),
  ],
  server: {
    host: '127.0.0.1',
    port: 3000,
    strictPort: true,
  },
})
