import { useEffect, useState, type FormEvent } from 'react';

type Props = { whatsappNumber: string };

const TYPES = [
  { id: 'websites', label: 'Website / landing' },
  { id: 'mvps', label: 'MVP' },
  { id: 'a-la-medida', label: 'Software a la medida' },
  { id: 'automatizaciones', label: 'Automatización' },
  { id: 'otro', label: 'Otro' },
];
const BUDGETS = ['< $2M COP', '$2M – $8M', '$8M – $20M', '+ $20M', 'Aún no sé'];

const field =
  'w-full rounded-2xl border border-salvia/20 bg-noche/60 px-5 py-4 text-[16px] text-niebla placeholder:text-salvia/60 outline-none transition focus:border-aqua focus:shadow-[0_0_0_4px_rgba(20,224,165,.15)]';
const chip =
  'cursor-pointer rounded-full border px-4 py-2.5 text-[14px] font-medium leading-none transition select-none';

export default function ContactForm({ whatsappNumber }: Props) {
  const [types, setTypes] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    const s = new URLSearchParams(location.search).get('servicio');
    if (s && TYPES.some((t) => t.id === s)) setTypes([s]);
  }, []);

  const toggle = (id: string) => setTypes((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const errs: Record<string, string> = {};
    if (!name) errs.name = 'Cuéntanos tu nombre.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Revisa el correo.';
    if (!types.length) errs.types = 'Elige al menos un tipo de proyecto.';
    if (message.length < 10) errs.message = 'Danos un poco más de contexto.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const labels = TYPES.filter((t) => types.includes(t.id)).map((t) => t.label).join(', ');
    setSummary(
      `Hola Perceptia, soy ${name}${data.get('company') ? ` de ${data.get('company')}` : ''}. Quiero cotizar: ${labels}.` +
        (budget ? ` Presupuesto: ${budget}.` : '') +
        ` ${message}`,
    );
    // TODO: conectar a un backend (webhook, Formspree, etc.). Por ahora solo UI.
    setStatus('sending');
    setTimeout(() => setStatus('sent'), 900);
  };

  if (status === 'sent') {
    return (
      <div className="flex min-h-[520px] flex-col items-start justify-center gap-6 rounded-[26px] border border-aqua/30 bg-card p-8 md:p-12">
        <div className="flex size-14 items-center justify-center rounded-full bg-aqua/15 text-2xl text-aqua">✓</div>
        <h2 className="text-[40px] font-semibold leading-none tracking-[-0.04em]">
          ¡Gracias! Ya lo <em className="accent">percibimos</em>.
        </h2>
        <p className="max-w-[460px] text-[17px] leading-[1.6] text-salvia">
          Te responderemos en menos de 24 horas hábiles con los siguientes pasos. Si prefieres hablar ya, escríbenos por WhatsApp.
        </p>
        <a
          className="btn btn-primary"
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(summary)}`}
          target="_blank"
          rel="noopener"
        >
          Continuar por WhatsApp →
        </a>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-7 rounded-[26px] border border-salvia/14 bg-card p-6 md:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="mono-tag">Nombre *</span>
          <input name="name" autoComplete="name" className={field} placeholder="Tu nombre" aria-invalid={!!errors.name} />
          {errors.name && <span className="text-[13px] text-[#ff8a80]">{errors.name}</span>}
        </label>
        <label className="flex flex-col gap-2">
          <span className="mono-tag">Correo *</span>
          <input name="email" type="email" autoComplete="email" className={field} placeholder="tu@empresa.com" aria-invalid={!!errors.email} />
          {errors.email && <span className="text-[13px] text-[#ff8a80]">{errors.email}</span>}
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="mono-tag">Empresa</span>
        <input name="company" autoComplete="organization" className={field} placeholder="Opcional" />
      </label>

      <fieldset className="flex flex-col gap-3">
        <legend className="mono-tag mb-3">¿Qué necesitas? *</legend>
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
        {errors.types && <span className="text-[13px] text-[#ff8a80]">{errors.types}</span>}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mono-tag mb-3">Presupuesto estimado</legend>
        <div className="flex flex-wrap gap-2">
          {BUDGETS.map((b) => (
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
        <span className="mono-tag">Cuéntanos del proyecto *</span>
        <textarea name="message" rows={5} className={`${field} resize-y`} placeholder="Objetivo, fechas, referencias…" aria-invalid={!!errors.message} />
        {errors.message && <span className="text-[13px] text-[#ff8a80]">{errors.message}</span>}
      </label>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-[13px] text-salvia">Respondemos en menos de 24 h hábiles.</span>
        <button type="submit" disabled={status === 'sending'} className="btn btn-primary cursor-pointer disabled:opacity-70">
          {status === 'sending' ? 'Enviando…' : 'Enviar solicitud →'}
        </button>
      </div>
    </form>
  );
}
