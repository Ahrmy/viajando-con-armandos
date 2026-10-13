-- =============================================================
-- Viajando con Armandos — FIX: recursión en policies de family_members
--
-- Síntomas detectados en esta base de datos:
--   · GET /rest/v1/family_members → HTTP 500 (54001 max_stack_depth):
--     una policy ANTIGUA consulta la propia tabla (recursión infinita)
--   · ERROR 42883: function public.is_family_admin(uuid) does not exist:
--     la DB tiene una versión vieja de las funciones helper
--
-- Este script es autónomo e idempotente:
--   1. Crea/reemplaza las funciones is_family_member e is_family_admin
--   2. Borra TODAS las policies de family_members (incluidas las
--      antiguas con otros nombres)
--   3. Las recrea sin recursión, delegando en las funciones
--
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- Después: ejecuta supabase/rls.sql (alinea el resto de tablas)
-- y re-ejecuta supabase/trip_destinations.sql (recrea sus policies).
-- =============================================================

-- 1. Funciones helper (security definer → la policy no recursa)
create or replace function public.is_family_member(p_family_id uuid)
returns boolean
language sql stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.family_members
    where family_id = p_family_id and profile_id = auth.uid()
  );
$$;

create or replace function public.is_family_admin(p_family_id uuid)
returns boolean
language sql stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.family_members
    where family_id = p_family_id
      and profile_id = auth.uid()
      and role in ('owner', 'admin')
  );
$$;

-- 2. Eliminar todas las policies existentes en family_members
--    (pg_policies las lista con su nombre real, sea cual sea)
do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'family_members'
  loop
    execute format('drop policy if exists %I on public.family_members', pol.policyname);
  end loop;
end
$$;

-- 3. Recrear las 4 policies sin recursión
create policy "family_members_select" on public.family_members
  for select using (public.is_family_member(family_id));

create policy "family_members_insert" on public.family_members
  for insert with check (
    auth.uid() = profile_id or public.is_family_admin(family_id)
  );

create policy "family_members_update" on public.family_members
  for update using (public.is_family_admin(family_id));

create policy "family_members_delete" on public.family_members
  for delete using (
    public.is_family_admin(family_id) or auth.uid() = profile_id
  );
