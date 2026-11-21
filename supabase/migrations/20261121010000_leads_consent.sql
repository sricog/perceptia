-- Prueba de la autorización de tratamiento de datos (Ley 1581 de 2012, art. 9 y Decreto 1074 de 2015):
-- cada solicitud guarda cuándo la persona marcó la casilla y qué versión de la política aceptó.

alter table public.leads
  add column if not exists consent_at      timestamptz,
  add column if not exists consent_version text check (char_length(consent_version) <= 20);

comment on column public.leads.consent_at is 'Momento en que la persona aceptó los términos y autorizó el tratamiento de datos.';
comment on column public.leads.consent_version is 'Versión (fecha) de los términos y la política aceptados. Ver LEGAL_VERSION en src/lib/leads.ts.';

-- Desde ahora el sitio solo puede crear solicitudes con autorización.
drop policy if exists "leads: insert desde el sitio" on public.leads;
create policy "leads: insert desde el sitio"
  on public.leads for insert
  to anon
  with check (status = 'new' and notes is null and consent_at is not null and consent_version is not null);
