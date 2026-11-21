/**
 * Guarda solicitudes del sitio en la tabla `leads` de Supabase (ver supabase/migrations).
 * Usa la API REST directamente (sin supabase-js) con la clave pública: la tabla solo permite
 * INSERT al rol anon, así que desde el navegador no se puede leer nada.
 */
const URL = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

/** Versión de los términos y la política de datos vigentes (fecha de data/legal.ts). */
export const LEGAL_VERSION = '2026-11-21';

export type Lead = {
  kind: 'call' | 'quote';
  name: string;
  contact: string;
  message: string;
  preferred_at?: string;
  company?: string;
  services?: string[];
  budget?: string;
  lang: string;
  page?: string;
  /** Momento en que la persona marcó la casilla de autorización (Ley 1581). */
  consent_at?: string;
};

export const leadsConfigured = Boolean(URL && KEY);

export async function saveLead(lead: Lead): Promise<void> {
  if (!URL || !KEY) throw new Error('Supabase no está configurado (PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY).');
  const body: Record<string, unknown> = { ...lead, page: lead.page ?? location.pathname };
  if (lead.consent_at) body.consent_version = LEGAL_VERSION;
  const post = (payload: Record<string, unknown>) =>
    fetch(`${URL.replace(/\/$/, '')}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        apikey: KEY,
        // Las claves anon antiguas (JWT) también van como Bearer; las nuevas `sb_publishable_` solo en apikey.
        ...(KEY.startsWith('sb_') ? {} : { Authorization: `Bearer ${KEY}` }),
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    });
  let res = await post(body);
  // Mientras no se corra la migración de autorización, la tabla no tiene esas columnas:
  // se reintenta sin ellas para no perder la solicitud.
  if (res.status === 400 && /consent_(at|version)/.test(await res.clone().text())) {
    const { consent_at: _a, consent_version: _v, ...rest } = body;
    res = await post(rest);
  }
  if (!res.ok) throw new Error(`No se pudo guardar la solicitud (${res.status}): ${await res.text()}`);
}
