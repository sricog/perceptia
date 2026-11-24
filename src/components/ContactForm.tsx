import { useEffect, useState, type FormEvent } from 'react';
import type { Dict } from '../i18n';
import { saveLead } from '../lib/leads';
import { errId, errProps, focusFirstError } from '../lib/formErrors';
import Consent, { type ConsentProps } from './Consent';

type Props = {
  whatsappNumber: string;
  /** Textos del formulario en el idioma de la página. */
  t: Dict['form'];
  /** Un chip por tipo de proyecto; `id` coincide con el slug del servicio (?servicio= / ?service=). */
  types: { id: string; label: string }[];
  lang: 'es' | 'en';
  /** Casilla de autorización: textos y enlaces a las páginas legales. */
  consent: ConsentProps;
};

const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

const field =
  'w-full rounded-2xl border border-salvia/20 bg-noche/60 px-5 py-4 text-[1rem] text-niebla placeholder:text-salvia/60 outline-none transition focus:border-aqua focus:shadow-[0_0_0_0.25rem_rgba(20,224,165,.15)]';
const chip =
  'cursor-pointer rounded-full border px-4 py-2.5 text-[0.875rem] font-medium leading-none transition select-none';

export default function ContactForm({ whatsappNumber, t, types: TYPES, lang, consent }: Props) {
  const [types, setTypes] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    const s = new URLSearchParams(location.search).get(t.serviceParam);
    if (s && TYPES.some((t) => t.id === s)) setTypes([s]);
  }, []);

  const toggle = (id: string) => setTypes((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const errs: Record<string, string> = {};
    if (!name) errs.name = t.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = t.errors.email;
    if (!types.length) errs.types = t.errors.types;
    if (message.length < 10) errs.message = t.errors.message;
    if (!data.get('consent')) errs.consent = consent.t.error;
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(e.currentTarget);

    const labels = TYPES.filter((t) => types.includes(t.id)).map((t) => t.label).join(', ');
    const company = String(data.get('company') || '').trim();
    setSummary(
      fill(t.wa.hello, { name }) +
        (company ? fill(t.wa.company, { company }) : '') +
        fill(t.wa.want, { labels }) +
        (budget ? fill(t.wa.budget, { budget }) : '') +
        ` ${message}`,
    );
    // Campo trampa: si un bot lo llena, se finge el envío sin guardar nada.
    if (String(data.get('website') || '')) return setStatus('sent');

    setStatus('sending');
    try {
      await saveLead({
        kind: 'quote',
        name,
        contact: email,
        message,
        company: company || undefined,
        services: TYPES.filter((t) => types.includes(t.id)).map((t) => t.label),
        budget: budget || undefined,
        lang,
        consent_at: new Date().toISOString(),
      });
      setStatus('sent');
    } catch (err) {
      console.error(err);
      setStatus('failed');
    }
  };

  if (status === 'sent') {
    return (
      <div className="flex min-h-[32.5rem] flex-col items-start justify-center gap-6 rounded-[1.625rem] border border-aqua/30 bg-card p-8 md:p-12" role="status">
        <div className="flex size-14 items-center justify-center rounded-full bg-aqua/15 text-2xl text-aqua">✓</div>
        <h2 className="text-[2.5rem] font-semibold leading-none tracking-[-0.04em]">
          {t.sent.title[0]}<em className="accent">{t.sent.title[1]}</em>{t.sent.title[2]}
        </h2>
        <p className="max-w-[28.75rem] text-[1.0625rem] leading-[1.6] text-salvia">
          {t.sent.body}
        </p>
        <a
          className="btn btn-primary"
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(summary)}`}
          target="_blank"
          rel="noopener"
        >
          {t.sent.cta}
        </a>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative flex flex-col gap-7 rounded-[1.625rem] border border-salvia/14 bg-card p-6 md:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="mono-tag">{t.name}</span>
          <input name="name" autoComplete="name" className={field} placeholder={t.namePh} {...errProps('name', errors.name)} />
          {errors.name && <span id={errId('name')} className="text-[0.8125rem] text-[#ff8a80]">{errors.name}</span>}
        </label>
        <label className="flex flex-col gap-2">
          <span className="mono-tag">{t.email}</span>
          <input name="email" type="email" autoComplete="email" className={field} placeholder={t.emailPh} {...errProps('email', errors.email)} />
          {errors.email && <span id={errId('email')} className="text-[0.8125rem] text-[#ff8a80]">{errors.email}</span>}
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="mono-tag">{t.company}</span>
        <input name="company" autoComplete="organization" className={field} placeholder={t.companyPh} />
      </label>

      <fieldset
        className="flex flex-col gap-3 outline-none"
        tabIndex={-1}
        data-invalid={errors.types ? '' : undefined}
        aria-describedby={errors.types ? errId('types') : undefined}
      >
        <legend className="mono-tag mb-3">{t.need}</legend>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => {
            const on = types.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(t.id)}
                className={`${chip} ${on ? 'border-aqua bg-aqua text-noche' : 'border-salvia/25 text-bruma hover:border-salvia/60'}`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        {errors.types && <span id={errId('types')} className="text-[0.8125rem] text-[#ff8a80]">{errors.types}</span>}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mono-tag mb-3">{t.budget}</legend>
        <div className="flex flex-wrap gap-2">
          {t.budgets.map((b) => (
            <button
              key={b}
              type="button"
              aria-pressed={budget === b}
              onClick={() => setBudget(budget === b ? '' : b)}
              className={`${chip} ${budget === b ? 'border-niebla bg-niebla text-noche' : 'border-salvia/25 text-bruma hover:border-salvia/60'}`}
            >
              {b}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-2">
        <span className="mono-tag">{t.message}</span>
        <textarea name="message" rows={5} className={`${field} resize-y`} placeholder={t.messagePh} {...errProps('message', errors.message)} />
        {errors.message && <span id={errId('message')} className="text-[0.8125rem] text-[#ff8a80]">{errors.message}</span>}
      </label>

      <Consent {...consent} error={errors.consent} />

      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[624.9375rem] h-0 w-0 opacity-0" />

      {status === 'failed' && (
        <p role="alert" className="rounded-2xl border border-[#ff8a80]/40 bg-[#ff8a80]/8 px-5 py-4 text-[0.875rem] text-[#ffb4ab]">
          {t.failed}{' '}
          <a className="underline underline-offset-4" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(summary)}`} target="_blank" rel="noopener">
            WhatsApp ↗
          </a>
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-[0.8125rem] text-salvia">{t.note}</span>
        <button type="submit" disabled={status === 'sending'} className="btn btn-primary cursor-pointer disabled:opacity-70">
          {status === 'sending' ? t.sending : t.submit}
        </button>
      </div>
    </form>
  );
}
