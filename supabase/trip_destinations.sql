-- =============================================================
-- Viajando con Armandos — Tabla trip_destinations + RLS
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- Es idempotente: puedes ejecutarlo más de una vez sin errores.
-- Requiere: haber ejecutado antes supabase/rls.sql
-- (usa las funciones public.is_trip_member y public.is_trip_editor)
-- =============================================================

-- Paradas/destinos de un viaje (Lisboa, Oporto, Sintra…)
create table if not exists public.trip_destinations (
  id          uuid primary key default gen_random_uuid(),
  trip_id     uuid not null references public.trips (id) on delete cascade,
  name        text not null,
  country     text,
  nights      integer check (nights is null or nights > 0),
  image_url   text,
  emoji       text not null default '📍',
  position    integer not null default 0,
  created_by  uuid not null references public.profiles (id),
  created_at  timestamptz not null default now()
);

create index if not exists trip_destinations_trip_id_idx
  on public.trip_destinations (trip_id);

comment on table public.trip_destinations is
  'Paradas del itinerario de un viaje, ordenadas por position.';

-- -------------------------------------------------------------
-- RLS — mismo patrón que el resto del contenido del viaje:
-- miembros leen y crean; el autor o un editor modifican/borran
-- -------------------------------------------------------------
alter table public.trip_destinations enable row level security;

drop policy if exists "trip_destinations_select" on public.trip_destinations;
create policy "trip_destinations_select" on public.trip_destinations
  for select using (public.is_trip_member(trip_id));

drop policy if exists "trip_destinations_insert" on public.trip_destinations;
create policy "trip_destinations_insert" on public.trip_destinations
  for insert with check (
    auth.uid() = created_by and public.is_trip_member(trip_id)
  );

drop policy if exists "trip_destinations_update" on public.trip_destinations;
create policy "trip_destinations_update" on public.trip_destinations
  for update using (
    auth.uid() = created_by or public.is_trip_editor(trip_id)
  );

drop policy if exists "trip_destinations_delete" on public.trip_destinations;
create policy "trip_destinations_delete" on public.trip_destinations
  for delete using (
    auth.uid() = created_by or public.is_trip_editor(trip_id)
  );
