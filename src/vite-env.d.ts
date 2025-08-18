/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string;
  readonly VITE_USE_LOCAL_PHANTOMARTIST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __USE_LOCAL_PHANTOMARTIST__: boolean;
declare const __DEV_MODE__: boolean;
