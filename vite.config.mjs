import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import del from 'rollup-plugin-delete';

export default defineConfig(async ({ mode }) => {
  return {
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin']
        }
      })
    ]
  };
});
