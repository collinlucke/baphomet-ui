import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig(async ({ mode }) => {
  // Since GitHub Pages redirects to custom domain, always use root path
  const base = '/';
  
  console.log('Vite base path:', base, 'Mode:', mode);
  
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
