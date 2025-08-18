/// <reference types="vite/client" />

type ImportMetaEnv = {
  readonly GRAPHQL_BAPHOMET_SERVER_RENDER_URL: string;
};

type ImportMeta = {
  readonly env: ImportMetaEnv;
};
