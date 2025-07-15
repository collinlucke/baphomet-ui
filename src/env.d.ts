/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GRAPHQL_BAPHOMET_SERVER_RENDER_URL: string;
  readonly GRAPHQL_BAPHOMET_SERVER_RENDER_URL: string;
  readonly GIT_REGISTRY_TOKEN: string;
  readonly MODE: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
