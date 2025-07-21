/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly GRAPHQL_BAPHOMET_SERVER_RENDER_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
