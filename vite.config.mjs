import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  // Determine if we're using local PhantomArtist
  const useLocalPhantomArtist = env.VITE_USE_LOCAL_PHANTOMARTIST === 'true';

  const config = {
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin']
        },
        // Enable fast refresh for better HMR
        fastRefresh: true
      })
    ],
    optimizeDeps: {
      // Exclude linked packages from optimization to ensure real-time updates
      exclude: ['@collinlucke/phantomartist'],
      // Don't force re-optimization as it can cause full page reloads
      force: false
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
      port: 5173, // Default Vite port
      hmr: {
        // Enable HMR overlay for better debugging
        overlay: true
      }
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

  // If using local PhantomArtist, add alias to source files for better HMR
  if (useLocalPhantomArtist) {
    config.resolve = {
      alias: {
        '@collinlucke/phantomartist': path.resolve(
          __dirname,
          '../phantomartist/lib'
        )
      }
    };

    // Watch PhantomArtist source files directly
    config.server.watch.ignored = ['!../phantomartist/lib/**'];
  }

  return config;
});
