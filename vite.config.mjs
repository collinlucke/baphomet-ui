import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import del from "rollup-plugin-delete";

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    {
      name: "clean-dist",
      buildStart() {
        del(["dist"]);
      },
    },
  ],
  server: {
    port: 5173,
    host: "0.0.0.0",
    watch: {},
  },
  test: {
    globals: true,
    setupFiles: "vitest-setup.ts",
    environment: "jsdom",
    include: [
      "src/tests/*.{test,spec}.{js,ts,jsx,tsx}",
      "src/**/tests/*.{test,spec}.{js,ts,jsx,tsx}",
      "src/tests/*.browser.{test,spec}.{js,ts,jsx,tsx}",
      "src/**/tests/*.browser.{test,spec}.{js,ts,jsx,tsx}",
      "src/tests/*.unit.{test,spec}.{js,ts,jsx,tsx}",
      "src/**/tests/*.unit.{test,spec}.{js,ts,jsx,tsx}",
    ],
    exclude: [
      "src/tests/*.api.{test,spec}.{js,ts,jsx,tsx}",
      "src/**/tests/*.api.{test,spec}.{js,ts,jsx,tsx}",
    ],
  },
  build: {
    modulePreload: {
      polyfill: true,
    },
  },
  define: {
    __USE_LOCAL_PHANTOMARTIST__: false,
    __DEV_MODE__: process.env.NODE_ENV === "development",
  },
  esbuild: {
    jsxImportSource: "@emotion/react",
  },
});
