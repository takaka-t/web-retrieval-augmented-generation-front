/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** webapi用ベースURL */
  readonly VITE_BASE_URL_FOR_WEB_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
