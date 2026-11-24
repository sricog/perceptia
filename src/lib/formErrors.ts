/**
 * Errores de formulario accesibles: cada mensaje lleva un id y su campo lo enlaza con
 * `aria-describedby`; al enviar con errores el foco va al primer campo inválido (en el orden
 * del formulario), así el lector de pantalla anuncia el campo y su mensaje.
 */
export const errId = (field: string) => `${field}-err`;

/** Atributos para un campo según su error. */
export const errProps = (field: string, error?: string) => ({
  'aria-invalid': !!error,
  'aria-describedby': error ? errId(field) : undefined,
});

/** Espera a que React pinte los errores y enfoca el primero. Los grupos sin control propio usan `data-invalid`. */
export function focusFirstError(form: HTMLFormElement) {
  requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid]')?.focus());
}
