import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  // Determine if we're using local PhantomArtist
  const useLocalPhantomArtist = env.VITE_USE_LOCAL_PHANTOMARTIST === 'true';

  return {
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin']
        }
      })
    ],
    optimizeDeps: {
      // Exclude linked packages from optimization to ensure real-time updates
      exclude: ['@collinlucke/phantomartist'],
      force: true // Force re-optimization
    },
    define: {
      // Make environment variables available in the app
      __USE_LOCAL_PHANTOMARTIST__: JSON.stringify(useLocalPhantomArtist),
      __DEV_MODE__: JSON.stringify(mode === 'development')
    },
    server: {
      watch: {
        // Watch PhantomArtist dist files for changes
        ignored: ['!../phantomartist/dist/**']
      },
      fs: {
        // Allow serving files from one level up
        allow: ['..']
      },
      host: '0.0.0.0',
      port: 5173 // Default Vite port
    },
    test: {
      globals: true,
      setupFiles: 'vitest-setup.ts',
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
      ],
      environment: 'jsdom'
    }
  };
});
