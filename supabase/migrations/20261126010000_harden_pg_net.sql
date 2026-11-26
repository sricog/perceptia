-- pg_net (la extensión con la que el trigger leads_notify llama a la Edge Function) se reinstala en
-- el esquema `extensions`, como recomienda el linter de Supabase (lint 0014_extension_in_public).
-- No se puede mover con ALTER EXTENSION, así que se borra y se vuelve a crear; solo se pierden la
-- cola y el registro temporal de llamadas. Sus funciones siguen en el esquema `net`, así que
-- notify_new_lead() no cambia.
--
-- Sobre permisos: Supabase (rol supabase_admin) da USAGE en `net` y EXECUTE en sus funciones a
-- PUBLIC, anon y authenticated. El rol postgres no puede revocarlos, y notify_new_lead() depende
-- de ese EXECUTE. Lo que impide que un visitante use pg_net es que `net` (igual que `vault`) no está
-- expuesto en la API: Settings → API → Exposed schemas debe seguir siendo solo public y
-- graphql_public.

drop extension if exists pg_net;
create extension pg_net with schema extensions;
