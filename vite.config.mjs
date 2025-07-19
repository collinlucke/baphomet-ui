import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig(async ({ mode }) => {
  // Smart base path detection
  // Use root path for custom domain, subdirectory for GitHub Pages
  let base = '/';
  
  // In production builds, check if we're building for GitHub Pages subdirectory
  if (mode === 'production' && !process.env.CUSTOM_DOMAIN) {
    base = '/baphomet-ui/';
  }
  
  console.log('Vite base path:', base);
  
  return {
    base,
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin']
        }
      })
    ],
    test: {
      globals: true,
      setupFiles: 'vitest-setup.ts',
      include: [
        'src/tests/*.browser.{test,spec}.{js,ts,jsx,tsx}',
        'src/**/tests/*.browser.{test,spec}.{js,ts,jsx,tsx}'
      ],
      exclude: [
        'src/tests/*.api.{test,spec}.{js,ts,jsx,tsx}',
        'src/**/tests/*.api.{test,spec}.{js,ts,jsx,tsx}'
      ],
      environment: 'jsdom'
    }
  };
});
