/**
 * Guarda solicitudes del sitio en la tabla `leads` de Supabase (ver supabase/migrations).
 * Usa la API REST directamente (sin supabase-js) con la clave pública: la tabla solo permite
 * INSERT al rol anon, así que desde el navegador no se puede leer nada.
 */
const URL = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

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
};

export const leadsConfigured = Boolean(URL && KEY);

export async function saveLead(lead: Lead): Promise<void> {
  if (!URL || !KEY) throw new Error('Supabase no está configurado (PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY).');
  const res = await fetch(`${URL.replace(/\/$/, '')}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: KEY,
      // Las claves anon antiguas (JWT) también van como Bearer; las nuevas `sb_publishable_` solo en apikey.
      ...(KEY.startsWith('sb_') ? {} : { Authorization: `Bearer ${KEY}` }),
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ ...lead, page: lead.page ?? location.pathname }),
  });
  if (!res.ok) throw new Error(`No se pudo guardar la solicitud (${res.status}): ${await res.text()}`);
}
