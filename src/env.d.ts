/// <reference types="vite/client" />

type ImportMetaEnv = {
  readonly GRAPHQL_BAPHOMET_SERVER_RENDER_URL: string;
  // more env variables...
};

type ImportMeta = {
  readonly env: ImportMetaEnv;
};
