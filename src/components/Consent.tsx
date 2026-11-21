import type { Dict } from '../i18n';

/**
 * Casilla de autorización (Ley 1581 de 2012): sin marcarla no se envía el formulario.
 * La fecha y la versión de la política aceptada se guardan con la solicitud (ver lib/leads.ts).
 */
export type ConsentProps = {
  t: Dict['consent'];
  terms: string;
  privacy: string;
};

export default function Consent({ t, terms, privacy, error }: ConsentProps & { error?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="group flex cursor-pointer items-start gap-3 text-[14px] leading-[1.5] text-salvia">
        <input
          type="checkbox"
          name="consent"
          value="1"
          aria-invalid={!!error}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className="mt-px flex size-5 flex-none items-center justify-center rounded-md border border-salvia/40 text-[13px] leading-none text-transparent transition group-hover:border-aqua/70 peer-checked:border-aqua peer-checked:bg-aqua peer-checked:text-noche peer-focus-visible:shadow-[0_0_0_4px_rgba(20,224,165,.25)]"
        >
          ✓
        </span>
        <span>
          {t.pre}
          <a href={terms} target="_blank" rel="noopener" className="text-niebla underline decoration-salvia/50 underline-offset-4 hover:text-aqua">
            {t.terms}
          </a>
          {t.mid}
          <a href={privacy} target="_blank" rel="noopener" className="text-niebla underline decoration-salvia/50 underline-offset-4 hover:text-aqua">
            {t.privacy}
          </a>
          {t.post}
        </span>
      </label>
      {error && <span className="text-[13px] text-[#ff8a80]">{error}</span>}
    </div>
  );
}
