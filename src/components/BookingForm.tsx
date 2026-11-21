import { useState, type FormEvent } from 'react';
import type { Dict } from '../i18n';

import { saveLead } from '../lib/leads';
import Consent, { type ConsentProps } from './Consent';

/**
 * Solicitud de llamada: el cliente deja su correo o WhatsApp y una descripción corta.
 * Se guarda en Supabase (tabla `leads`, kind = 'call') y el equipo lo contacta para coordinar.
 */
type Props = {
  t: Dict['booking'];
  lang: 'es' | 'en';
  whatsappNumber: string;
  /** Casilla de autorización: textos y enlaces a las páginas legales. */
  consent: ConsentProps;
};

const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const field =
  'w-full rounded-2xl border border-salvia/20 bg-noche/60 px-5 py-4 text-[16px] text-niebla placeholder:text-salvia/60 outline-none transition focus:border-aqua focus:shadow-[0_0_0_4px_rgba(20,224,165,.15)]';
const errCls = 'text-[13px] text-[#ff8a80]';

export default function BookingForm({ t, lang, whatsappNumber, consent }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'failed'>('idle');
  const [sent, setSent] = useState<null | { name: string; wa: string }>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') || '').trim();
    const contact = String(data.get('contact') || '').trim();
    const about = String(data.get('about') || '').trim();
    const errs: Record<string, string> = {};
    if (!name) errs.name = t.errors.name;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const isPhone = (contact.match(/\d/g) || []).length >= 7 && /^[+\d\s().-]+$/.test(contact);
    if (!isEmail && !isPhone) errs.contact = t.errors.contact;
    if (about.length < 10) errs.about = t.errors.about;
    if (!data.get('consent')) errs.consent = consent.t.error;
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const wa = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fill(t.wa, { name }))}`;
    // Campo trampa: si un bot lo llena, se finge el envío sin guardar nada.
    if (String(data.get('website') || '')) return setSent({ name, wa });

    setStatus('sending');
    try {
      await saveLead({ kind: 'call', name, contact, message: about, lang, consent_at: new Date().toISOString() });
      setStatus('idle');
      setSent({ name, wa });
    } catch (err) {
      console.error(err);
      setStatus('failed');
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-[420px] flex-col items-start justify-center gap-6 rounded-[26px] border border-aqua/30 bg-card p-8 md:p-12" role="status">
        <div className="flex size-14 items-center justify-center rounded-full bg-aqua/15 text-2xl text-aqua">✓</div>
        <h3 className="text-[clamp(32px,3.4vw,44px)] font-semibold leading-none tracking-[-0.04em]">{fill(t.sent.title, { name: sent.name })}</h3>
        <p className="max-w-[480px] text-[17px] leading-[1.6] text-salvia">{t.sent.body}</p>
        <a className="btn btn-ghost" href={sent.wa} target="_blank" rel="noopener">
          {t.sent.whatsapp}
        </a>
        <button type="button" className="cursor-pointer font-mono text-[13px] tracking-[0.06em] text-salvia hover:text-niebla" onClick={() => setSent(null)}>
          ← {t.sent.again}
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative flex flex-col gap-6 rounded-[26px] border border-salvia/14 bg-card p-6 md:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="mono-tag">{t.name}</span>
          <input name="name" autoComplete="name" className={field} placeholder={t.namePh} aria-invalid={!!errors.name} />
          {errors.name && <span className={errCls}>{errors.name}</span>}
        </label>
        <label className="flex flex-col gap-2">
          <span className="mono-tag">{t.contact}</span>
          <input name="contact" autoComplete="email" className={field} placeholder={t.contactPh} aria-invalid={!!errors.contact} />
          {errors.contact && <span className={errCls}>{errors.contact}</span>}
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="mono-tag">{t.about}</span>
        <textarea name="about" rows={5} className={`${field} resize-y`} placeholder={t.aboutPh} aria-invalid={!!errors.about} />
        {errors.about && <span className={errCls}>{errors.about}</span>}
      </label>

      <Consent {...consent} error={errors.consent} />

      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      {status === 'failed' && (
        <p role="alert" className="rounded-2xl border border-[#ff8a80]/40 bg-[#ff8a80]/8 px-5 py-4 text-[14px] text-[#ffb4ab]">
          {t.failed}{' '}
          <a className="underline underline-offset-4" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener">
            WhatsApp ↗
          </a>
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-[14px] text-salvia">{t.note}</span>
        <button type="submit" disabled={status === 'sending'} className="btn btn-primary cursor-pointer disabled:opacity-70">
          {status === 'sending' ? t.sending : `${t.submit} →`}
        </button>
      </div>
    </form>
  );
}
