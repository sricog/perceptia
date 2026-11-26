/**
 * Edge Function `notify-lead`: avisa por correo (Resend) cada solicitud nueva de `public.leads`.
 *
 * La llama el trigger `leads_notify` (migración 20261126000000_notify_lead.sql) después de cada
 * INSERT, con la fila en `record` y el secreto compartido en `x-webhook-secret`. Se despliega
 * sin verificación de JWT (`--no-verify-jwt`) porque la protege ese secreto.
 *
 * Secretos (`supabase secrets set ...`):
 *   RESEND_API_KEY       clave de Resend (re_...)
 *   NOTIFY_LEAD_SECRET   el mismo valor guardado en Vault como `notify_lead_secret`
 *   LEADS_FROM           opcional; por defecto «Perceptia <formulario@perceptiastudio.com>»
 *   LEADS_TO             opcional; uno o varios correos separados por coma
 */
import { buildEmail, type LeadRecord } from './email.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SECRET = Deno.env.get('NOTIFY_LEAD_SECRET');
const FROM = Deno.env.get('LEADS_FROM') || 'Perceptia <formulario@perceptiastudio.com>';
const TO = (Deno.env.get('LEADS_TO') || 'perceptiastudio@gmail.com').split(',').map((s) => s.trim()).filter(Boolean);

// SUPABASE_URL lo pone Supabase: https://<ref>.supabase.co → enlace al editor de tablas del proyecto.
const ref = Deno.env.get('SUPABASE_URL')?.match(/^https:\/\/([^.]+)\.supabase\.co/)?.[1];
const dashboardUrl = ref ? `https://supabase.com/dashboard/project/${ref}/editor` : undefined;

/** Comparación en tiempo constante para no filtrar el secreto por tiempos de respuesta. */
function safeEqual(a: string, b: string): boolean {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  if (x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'method not allowed' });
  if (!RESEND_API_KEY || !SECRET) return json(500, { error: 'faltan RESEND_API_KEY o NOTIFY_LEAD_SECRET' });
  if (!safeEqual(req.headers.get('x-webhook-secret') ?? '', SECRET)) return json(401, { error: 'unauthorized' });

  let lead: LeadRecord | undefined;
  try {
    lead = (await req.json())?.record;
  } catch {
    // cuerpo inválido: se responde abajo
  }
  if (!lead?.id || !lead.name || !lead.contact || !lead.message) return json(400, { error: 'record inválido' });

  const email = buildEmail(lead, { dashboardUrl });
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      // Si la llamada se repite para la misma solicitud, Resend no manda el correo dos veces.
      'Idempotency-Key': `lead-${lead.id}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: TO,
      subject: email.subject,
      html: email.html,
      text: email.text,
      ...(email.replyTo ? { reply_to: email.replyTo } : {}),
      tags: [{ name: 'kind', value: lead.kind }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error(`Resend respondió ${res.status} para el lead ${lead.id}: ${detail}`);
    return json(502, { error: 'resend', status: res.status });
  }
  const { id } = await res.json();
  console.log(`Aviso enviado para el lead ${lead.id} (Resend ${id})`);
  return json(200, { ok: true, id });
});
