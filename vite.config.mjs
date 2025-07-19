import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig(async ({ mode }) => {
  // Use subdirectory base for GitHub Pages until custom domain DNS is set up
  // Once DNS points to GitHub Pages, this will automatically use root path
  const base = '/baphomet-ui/';
  
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
