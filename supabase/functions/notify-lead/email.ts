/**
 * Arma el correo de aviso de una solicitud nueva. No depende de Deno, así que se puede probar
 * con bun o node importando `buildEmail`.
 */

/** Fila de `public.leads` tal como la manda el trigger (ver migración notify_lead). */
export type LeadRecord = {
  id: string;
  created_at: string;
  kind: 'call' | 'quote';
  name: string;
  contact: string;
  message: string;
  preferred_at?: string | null;
  company?: string | null;
  services?: string[] | null;
  budget?: string | null;
  lang: 'es' | 'en';
  page?: string | null;
};

export type Email = { subject: string; html: string; text: string; replyTo?: string };

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Fecha legible en hora de Colombia: «26/11/2026, 10:42 a.m.». */
const when = (iso: string) =>
  new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Bogota' }).format(new Date(iso));

/** Enlace para escribirle al cliente: correo o WhatsApp según lo que dejó. */
function contactHref(contact: string): string | undefined {
  if (isEmail(contact)) return `mailto:${contact}`;
  const digits = contact.replace(/\D/g, '');
  return digits.length >= 7 ? `https://wa.me/${digits}` : undefined;
}

export function buildEmail(lead: LeadRecord, opts: { dashboardUrl?: string } = {}): Email {
  const kind = lead.kind === 'quote' ? 'Cotización' : 'Solicitud de llamada';
  const subject = `${kind}: ${lead.name}${lead.company ? ` (${lead.company})` : ''}`;

  const rows: [string, string, string?][] = [
    ['Nombre', lead.name],
    ['Contacto', lead.contact, contactHref(lead.contact)],
  ];
  if (lead.company) rows.push(['Empresa', lead.company]);
  if (lead.services?.length) rows.push(['Necesita', lead.services.join(', ')]);
  if (lead.budget) rows.push(['Presupuesto', lead.budget]);
  if (lead.preferred_at) rows.push(['Horario preferido', when(lead.preferred_at)]);
  rows.push(['Recibida', when(lead.created_at)]);
  rows.push(['Idioma', lead.lang === 'en' ? 'Inglés' : 'Español']);
  if (lead.page) rows.push(['Página', lead.page]);

  const text = [
    `${kind} nueva desde perceptiastudio.com`,
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    'Mensaje:',
    lead.message,
    '',
    ...(opts.dashboardUrl ? [`Ver en Supabase: ${opts.dashboardUrl}`] : []),
    `ID: ${lead.id}`,
  ].join('\n');

  const cell = 'padding:8px 0;border-bottom:1px solid #e3ebe8;vertical-align:top;';
  const htmlRows = rows
    .map(([k, v, href]) => {
      const value = href ? `<a href="${esc(href)}" style="color:#0b7a5c;">${esc(v)}</a>` : esc(v);
      return `<tr><td style="${cell}width:150px;color:#56645f;">${esc(k)}</td><td style="${cell}color:#03130f;">${value}</td></tr>`;
    })
    .join('');

  const html = `<!doctype html>
<html lang="es"><body style="margin:0;padding:24px;background:#f3f7f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;line-height:1.5;">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:28px;">
  <p style="margin:0 0 4px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#0b7a5c;">${esc(kind)} nueva</p>
  <h1 style="margin:0 0 20px;font-size:22px;color:#03130f;">${esc(lead.name)}</h1>
  <table role="presentation" style="width:100%;border-collapse:collapse;">${htmlRows}</table>
  <p style="margin:24px 0 6px;color:#56645f;">Mensaje</p>
  <div style="white-space:pre-wrap;color:#03130f;background:#f3f7f5;border-radius:12px;padding:14px 16px;">${esc(lead.message)}</div>
  ${opts.dashboardUrl ? `<p style="margin:24px 0 0;"><a href="${esc(opts.dashboardUrl)}" style="color:#0b7a5c;">Ver solicitudes en Supabase →</a></p>` : ''}
  <p style="margin:16px 0 0;font-size:12px;color:#8a9893;">ID ${esc(lead.id)}</p>
</div>
</body></html>`;

  return { subject, html, text, replyTo: isEmail(lead.contact) ? lead.contact : undefined };
}
