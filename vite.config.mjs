import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig(async ({ mode }) => {
  // Use subdirectory base only for GitHub Pages without custom domain
  // If CNAME exists (custom domain), use root path
  const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
  const hasCustomDomain = process.env.GITHUB_PAGES_CUSTOM_DOMAIN === 'true';
  const base = isGitHubPages && !hasCustomDomain ? '/baphomet-ui/' : '/';
  
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
