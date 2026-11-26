-- Aviso por correo de cada solicitud nueva: después de cada INSERT en public.leads se llama a la
-- Edge Function `notify-lead` (supabase/functions/notify-lead), que envía el correo con Resend.
--
-- La URL de la función y el secreto compartido se leen de Supabase Vault (no quedan en el repo).
-- Crearlos una vez desde el SQL Editor:
--   select vault.create_secret('https://<ref>.supabase.co/functions/v1/notify-lead', 'notify_lead_url');
--   select vault.create_secret('<secreto largo y aleatorio>', 'notify_lead_secret');
-- Mientras no existan, el trigger no hace nada.
--
-- La llamada es asíncrona (pg_net): no demora el insert, y un error de red o de Resend nunca hace
-- que se pierda la solicitud.

create extension if not exists pg_net;

create or replace function public.notify_new_lead()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  fn_url text;
  fn_secret text;
begin
  select decrypted_secret into fn_url from vault.decrypted_secrets where name = 'notify_lead_url';
  select decrypted_secret into fn_secret from vault.decrypted_secrets where name = 'notify_lead_secret';
  if fn_url is null or fn_secret is null then
    return new;
  end if;

  perform net.http_post(
    url := fn_url,
    body := jsonb_build_object('record', to_jsonb(new)),
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-webhook-secret', fn_secret),
    timeout_milliseconds := 10000
  );
  return new;
exception when others then
  -- Nunca bloquear el insert por el aviso.
  raise warning 'notify_new_lead: %', sqlerrm;
  return new;
end;
$$;

comment on function public.notify_new_lead() is 'Llama a la Edge Function notify-lead (correo con Resend) por cada solicitud nueva.';

-- Solo la usa el trigger; nadie la puede llamar directamente.
revoke all on function public.notify_new_lead() from public, anon, authenticated;

drop trigger if exists leads_notify on public.leads;
create trigger leads_notify
  after insert on public.leads
  for each row execute function public.notify_new_lead();
