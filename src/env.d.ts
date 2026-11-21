interface ImportMetaEnv {
  /** URL del proyecto de Supabase (Project Settings → API). */
  readonly PUBLIC_SUPABASE_URL?: string;
  /** Clave pública anon/publishable. Nunca la service_role. */
  readonly PUBLIC_SUPABASE_ANON_KEY?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
