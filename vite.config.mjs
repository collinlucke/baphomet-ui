import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import del from 'rollup-plugin-delete';

const localAthame = resolve('..', 'athameui');
const useLocalAthame = existsSync(resolve(localAthame, 'package.json'));

export default defineConfig({
  resolve: useLocalAthame
    ? {
        alias: [
          {
            find: 'athameui/tokens.css',
            replacement: resolve(localAthame, 'styles/tokens.css')
          },
          {
            find: 'athameui/theme.css',
            replacement: resolve(localAthame, 'styles/theme.css')
          },
          {
            find: 'athameui',
            replacement: resolve(localAthame, 'main.ts')
          }
        ]
      }
    : undefined,
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    }),
    {
      name: 'clean-dist',
      buildStart() {
        del(['dist']);
      }
    }
  ],
  server: {
    port: 5173,
    host: '0.0.0.0',
    fs: {
      allow: ['..']
    }
  },
  test: {
    globals: true,
    setupFiles: 'vitest-setup.ts',
    environment: 'jsdom',
    include: [
      'src/tests/*.{test,spec}.{js,ts,jsx,tsx}',
      'src/**/tests/*.{test,spec}.{js,ts,jsx,tsx}',
      'src/tests/*.browser.{test,spec}.{js,ts,jsx,tsx}',
      'src/**/tests/*.browser.{test,spec}.{js,ts,jsx,tsx}',
      'src/tests/*.unit.{test,spec}.{js,ts,jsx,tsx}',
      'src/**/tests/*.unit.{test,spec}.{js,ts,jsx,tsx}'
    ],
    exclude: [
      'src/tests/*.api.{test,spec}.{js,ts,jsx,tsx}',
      'src/**/tests/*.api.{test,spec}.{js,ts,jsx,tsx}'
    ]
  },
  optimizeDeps: {
    exclude: useLocalAthame ? ['athameui'] : [],
    include: [
      'react',
      'react-dom',
      '@emotion/react/jsx-dev-runtime',
      '@emotion/react/jsx-runtime'
    ]
  },
  build: {
    modulePreload: {
      polyfill: true
    }
  },
  define: {
    __DEV_MODE__: process.env.NODE_ENV === 'development'
  },
  esbuild: {
    jsxImportSource: '@emotion/react'
  }
});
