import { useMemo, useState, type FormEvent } from 'react';
import type { Dict } from '../i18n';

import { saveLead } from '../lib/leads';

/**
 * Agendador de llamadas. El horario se ofrece en hora de Colombia (UTC−5, sin horario de verano)
 * y, si el visitante está en otra zona, se muestra también su hora local.
 * La solicitud se guarda en Supabase (tabla `leads`, kind = 'call') y el equipo confirma el espacio.
 */
type Props = {
  t: Dict['booking'];
  lang: 'es' | 'en';
  whatsappNumber: string;
};

const BOGOTA_OFFSET = 5; // horas a sumar para pasar de hora Colombia a UTC
const HOURS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
const DAYS = 10;

const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const field =
  'w-full rounded-2xl border border-salvia/20 bg-noche/60 px-5 py-4 text-[16px] text-niebla placeholder:text-salvia/60 outline-none transition focus:border-aqua focus:shadow-[0_0_0_4px_rgba(20,224,165,.15)]';
const errCls = 'text-[13px] text-[#ff8a80]';

/** Próximos días hábiles en Colombia, empezando mañana. Cada día es { y, m, d } del calendario de Bogotá. */
function nextWorkdays(n: number) {
  const now = new Date(Date.now() - BOGOTA_OFFSET * 3600_000); // "ahora" leído como fecha de Bogotá en UTC
  const out: { y: number; m: number; d: number }[] = [];
  for (let k = 1; out.length < n && k < 30; k++) {
    const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + k));
    const wd = day.getUTCDay();
    if (wd !== 0 && wd !== 6) out.push({ y: day.getUTCFullYear(), m: day.getUTCMonth(), d: day.getUTCDate() });
  }
  return out;
}

const toUtc = (day: { y: number; m: number; d: number }, hhmm: string) => {
  const [h, mi] = hhmm.split(':').map(Number);
  return new Date(Date.UTC(day.y, day.m, day.d, h + BOGOTA_OFFSET, mi));
};

export default function BookingForm({ t, lang, whatsappNumber }: Props) {
  const days = useMemo(() => nextWorkdays(DAYS), []);
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'failed'>('idle');
  const [sent, setSent] = useState<null | { name: string; when: string; wa: string }>(null);

  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const sameAsBogota = useMemo(() => {
    const probe = new Date();
    const f = (tz: string) => new Intl.DateTimeFormat('en', { hour: 'numeric', timeZone: tz, hourCycle: 'h23' }).format(probe);
    return f(localTz) === f('America/Bogota');
  }, [localTz]);

  const dayFmt = new Intl.DateTimeFormat(lang, { weekday: 'short', timeZone: 'UTC' });
  const dateFmt = new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'short', timeZone: 'UTC' });
  const longFmt = new Intl.DateTimeFormat(lang, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
  const localFmt = new Intl.DateTimeFormat(lang, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

  const whenLabel = (hhmm: string) => {
    const dd = days[day];
    return `${longFmt.format(new Date(Date.UTC(dd.y, dd.m, dd.d)))} · ${hhmm}`;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') || '').trim();
    const contact = String(data.get('contact') || '').trim();
    const about = String(data.get('about') || '').trim();
    const errs: Record<string, string> = {};
    if (!hour) errs.slot = t.errors.slot;
    if (!name) errs.name = t.errors.name;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const isPhone = (contact.match(/\d/g) || []).length >= 7 && /^[+\d\s().-]+$/.test(contact);
    if (!isEmail && !isPhone) errs.contact = t.errors.contact;
    if (about.length < 10) errs.about = t.errors.about;
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const when = whenLabel(hour);
    const wa = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fill(t.wa, { name, when }))}`;
    // Campo trampa: si un bot lo llena, se finge el envío sin guardar nada.
    if (String(data.get('website') || '')) return setSent({ name, when, wa });

    setStatus('sending');
    try {
      await saveLead({ kind: 'call', name, contact, message: about, preferred_at: toUtc(days[day], hour).toISOString(), lang });
      setStatus('idle');
      setSent({ name, when, wa });
    } catch (err) {
      console.error(err);
      setStatus('failed');
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-[520px] flex-col items-start justify-center gap-6 rounded-[26px] border border-aqua/30 bg-card p-8 md:p-12" role="status">
        <div className="flex size-14 items-center justify-center rounded-full bg-aqua/15 text-2xl text-aqua">✓</div>
        <h3 className="text-[clamp(32px,3.4vw,44px)] font-semibold leading-none tracking-[-0.04em]">{fill(t.sent.title, { name: sent.name })}</h3>
        <p className="max-w-[480px] text-[17px] leading-[1.6] text-salvia">{fill(t.sent.body, { when: sent.when })}</p>
        <a className="btn btn-ghost" href={sent.wa} target="_blank" rel="noopener">
          {t.sent.whatsapp}
        </a>
        <button type="button" className="cursor-pointer font-mono text-[13px] tracking-[0.06em] text-salvia hover:text-niebla" onClick={() => {
            setSent(null);
            setHour('');
          }}>
          ← {t.sent.again}
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative flex flex-col gap-8 rounded-[26px] border border-salvia/14 bg-card p-6 md:p-10">
      <fieldset className="flex min-w-0 flex-col gap-3">
        <legend className="mono-tag mb-3">{t.day}</legend>
        <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
          {days.map((dd, i) => {
            const date = new Date(Date.UTC(dd.y, dd.m, dd.d));
            const on = i === day;
            return (
              <button
                key={i}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setDay(i);
                  setHour('');
                }}
                className={`flex min-w-[78px] flex-none snap-start cursor-pointer flex-col items-center gap-1 rounded-2xl border px-3 py-3 transition ${
                  on ? 'border-aqua bg-aqua/12 text-niebla shadow-[0_0_24px_-8px_rgba(20,224,165,.8)]' : 'border-salvia/20 text-bruma hover:border-salvia/50'
                }`}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-salvia">{dayFmt.format(date).replace('.', '')}</span>
                <span className="text-[17px] font-semibold tracking-[-0.02em]">{dateFmt.format(date).replace('.', '')}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="flex min-w-0 flex-col gap-3">
        <legend className="mb-3 flex w-full flex-wrap items-baseline justify-between gap-2">
          <span className="mono-tag">{t.time}</span>
          <span className="font-mono text-[11px] tracking-[0.06em] text-salvia">{t.tzNote}</span>
        </legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {HOURS.map((h) => {
            const on = h === hour;
            const local = sameAsBogota ? '' : localFmt.format(toUtc(days[day], h));
            return (
              <button
                key={h}
                type="button"
                aria-pressed={on}
                onClick={() => setHour(h)}
                className={`flex cursor-pointer flex-col items-center gap-0.5 rounded-xl border px-2 py-2.5 font-mono transition ${
                  on ? 'border-aqua bg-aqua text-noche' : 'border-salvia/20 text-niebla hover:border-aqua/60'
                }`}
              >
                <span className="text-[15px] font-medium">{h}</span>
                {local && <span className={`text-[10px] ${on ? 'text-noche/70' : 'text-salvia'}`}>{fill(t.yourTime, { time: local })}</span>}
              </button>
            );
          })}
        </div>
        {errors.slot && <span className={errCls}>{errors.slot}</span>}
      </fieldset>

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
        <textarea name="about" rows={4} className={`${field} resize-y`} placeholder={t.aboutPh} aria-invalid={!!errors.about} />
        {errors.about && <span className={errCls}>{errors.about}</span>}
      </label>

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
        <span className="text-[14px] text-salvia">{hour ? whenLabel(hour) : t.tzNote}</span>
        <button type="submit" disabled={status === 'sending'} className="btn btn-primary cursor-pointer disabled:opacity-70">
          {status === 'sending' ? t.sending : `${t.submit} →`}
        </button>
      </div>
    </form>
  );
}
