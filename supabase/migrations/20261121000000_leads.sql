-- Solicitudes que llegan desde perceptiastudio.com: llamadas agendadas (/proceso) y cotizaciones (/contacto).
-- El sitio solo puede INSERTAR (rol anon). Leerlas y actualizarlas se hace desde el panel de Supabase
-- o con la service key, nunca desde el navegador.

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  kind          text not null check (kind in ('call', 'quote')),
  status        text not null default 'new' check (status in ('new', 'contacted', 'scheduled', 'won', 'lost', 'spam')),

  name          text not null check (char_length(name) between 1 and 120),
  contact       text not null check (char_length(contact) between 5 and 160),  -- correo o teléfono
  message       text not null check (char_length(message) between 10 and 4000),

  -- Llamadas: horario preferido (UTC). Se confirma manualmente con el cliente.
  preferred_at  timestamptz,
  -- Cotizaciones
  company       text check (char_length(company) <= 160),
  services      text[] check (coalesce(array_length(services, 1), 0) <= 10),
  budget        text check (char_length(budget) <= 60),

  lang          text not null default 'es' check (lang in ('es', 'en')),
  page          text check (char_length(page) <= 200),
  notes         text  -- notas internas del equipo
);

comment on table public.leads is 'Solicitudes del sitio web (llamadas y cotizaciones). Insert público, lectura solo para el equipo.';

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

alter table public.leads enable row level security;

-- El sitio (anon) solo puede crear solicitudes nuevas, sin tocar campos internos.
drop policy if exists "leads: insert desde el sitio" on public.leads;
create policy "leads: insert desde el sitio"
  on public.leads for insert
  to anon
  with check (status = 'new' and notes is null);

-- Sin políticas de select/update/delete para anon: el navegador no puede leer ni cambiar nada.
revoke select, update, delete on public.leads from anon;
grant insert on public.leads to anon;
