/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_CACHE_TTL_MS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
