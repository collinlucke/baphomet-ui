import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import del from 'rollup-plugin-delete';
import path from 'path';

export default defineConfig({
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
  resolve: {
    alias: process.env.NODE_ENV === 'development' ? {
      'phantomartist': path.resolve(__dirname, '../phantomartist/lib'),
      '@collinlucke/phantomartist': path.resolve(__dirname, '../phantomartist/lib')
    } : {}
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    watch: {
      ignored: ['!**/phantomartist/lib/**']
    },
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
    exclude: ['@collinlucke/phantomartist'],
    include: ['react', 'react-dom', '@emotion/react/jsx-dev-runtime', '@emotion/react/jsx-runtime']
  },
  build: {
    modulePreload: {
      polyfill: true
    }
  },
  define: {
    __USE_LOCAL_PHANTOMARTIST__: process.env.NODE_ENV === 'development',
    __DEV_MODE__: process.env.NODE_ENV === 'development'
  },
  esbuild: {
    jsxImportSource: '@emotion/react'
  }
});
