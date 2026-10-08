-- =============================================================
-- Viajando con Armandos — Seguridad Row Level Security (RLS)
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- Es idempotente: puedes ejecutarlo más de una vez sin errores.
-- =============================================================

-- -------------------------------------------------------------
-- 1. Trigger: crear el perfil automáticamente al registrar usuario
-- -------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -------------------------------------------------------------
-- 2. Funciones auxiliares (security definer → evitan recursión)
-- -------------------------------------------------------------

-- ¿El usuario actual pertenece a esta familia?
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

-- ¿El usuario actual es owner o admin de esta familia?
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

-- ¿El usuario actual tiene acceso a este viaje?
-- (miembro de la familia dueña del viaje o miembro explícito del viaje)
create or replace function public.is_trip_member(p_trip_id uuid)
returns boolean
language sql stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.trips t
    where t.id = p_trip_id
      and (
        public.is_family_member(t.family_id)
        or exists (
          select 1 from public.trip_members tm
          where tm.trip_id = t.id and tm.profile_id = auth.uid()
        )
      )
  );
$$;

-- ¿El usuario actual puede editar este viaje?
-- (owner/editor del viaje u owner/admin de la familia)
create or replace function public.is_trip_editor(p_trip_id uuid)
returns boolean
language sql stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.trips t
    where t.id = p_trip_id
      and (
        public.is_family_admin(t.family_id)
        or exists (
          select 1 from public.trip_members tm
          where tm.trip_id = t.id
            and tm.profile_id = auth.uid()
            and tm.role in ('owner', 'editor')
        )
      )
  );
$$;

-- ¿El usuario actual comparte alguna familia con este perfil?
create or replace function public.shares_family_with(p_profile_id uuid)
returns boolean
language sql stable
security definer set search_path = public
as $$
  select exists (
    select 1
    from public.family_members a
    join public.family_members b using (family_id)
    where a.profile_id = auth.uid() and b.profile_id = p_profile_id
  );
$$;

-- -------------------------------------------------------------
-- 3. Activar RLS en todas las tablas
-- -------------------------------------------------------------
alter table public.profiles        enable row level security;
alter table public.families        enable row level security;
alter table public.family_members  enable row level security;
alter table public.trips           enable row level security;
alter table public.trip_members    enable row level security;
alter table public.trip_days       enable row level security;
alter table public.activities      enable row level security;
alter table public.tasks           enable row level security;
alter table public.expenses        enable row level security;
alter table public.expense_splits  enable row level security;
alter table public.packing_items   enable row level security;
alter table public.comments        enable row level security;
alter table public.notifications   enable row level security;

-- -------------------------------------------------------------
-- 4. PROFILES — ves tu perfil y el de tu familia; editas el tuyo
-- -------------------------------------------------------------
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (
    auth.uid() = id or public.shares_family_with(id)
  );

drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_insert" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles
  for update using (auth.uid() = id);

-- -------------------------------------------------------------
-- 5. FAMILIES — miembros leen; cualquiera crea la suya;
--    owner/admin edita; solo el owner borra
-- -------------------------------------------------------------
drop policy if exists "families_select" on public.families;
create policy "families_select" on public.families
  for select using (public.is_family_member(id));

drop policy if exists "families_insert" on public.families;
create policy "families_insert" on public.families
  for insert with check (auth.uid() = owner_id);

drop policy if exists "families_update" on public.families;
create policy "families_update" on public.families
  for update using (public.is_family_admin(id));

drop policy if exists "families_delete" on public.families;
create policy "families_delete" on public.families
  for delete using (auth.uid() = owner_id);

-- -------------------------------------------------------------
-- 6. FAMILY_MEMBERS — miembros leen; te añades a ti mismo
--    o te añade un owner/admin
-- -------------------------------------------------------------
drop policy if exists "family_members_select" on public.family_members;
create policy "family_members_select" on public.family_members
  for select using (public.is_family_member(family_id));

drop policy if exists "family_members_insert" on public.family_members;
create policy "family_members_insert" on public.family_members
  for insert with check (
    auth.uid() = profile_id or public.is_family_admin(family_id)
  );

drop policy if exists "family_members_update" on public.family_members;
create policy "family_members_update" on public.family_members
  for update using (public.is_family_admin(family_id));

drop policy if exists "family_members_delete" on public.family_members;
create policy "family_members_delete" on public.family_members
  for delete using (
    public.is_family_admin(family_id) or auth.uid() = profile_id
  );

-- -------------------------------------------------------------
-- 7. TRIPS — miembros de la familia/viaje leen; editores modifican
-- -------------------------------------------------------------
drop policy if exists "trips_select" on public.trips;
create policy "trips_select" on public.trips
  for select using (
    public.is_family_member(family_id)
    or exists (
      select 1 from public.trip_members tm
      where tm.trip_id = id and tm.profile_id = auth.uid()
    )
  );

drop policy if exists "trips_insert" on public.trips;
create policy "trips_insert" on public.trips
  for insert with check (
    auth.uid() = created_by and public.is_family_member(family_id)
  );

drop policy if exists "trips_update" on public.trips;
create policy "trips_update" on public.trips
  for update using (public.is_trip_editor(id));

drop policy if exists "trips_delete" on public.trips;
create policy "trips_delete" on public.trips
  for delete using (public.is_trip_editor(id));

-- -------------------------------------------------------------
-- 8. TRIP_MEMBERS
-- -------------------------------------------------------------
drop policy if exists "trip_members_select" on public.trip_members;
create policy "trip_members_select" on public.trip_members
  for select using (public.is_trip_member(trip_id));

drop policy if exists "trip_members_insert" on public.trip_members;
create policy "trip_members_insert" on public.trip_members
  for insert with check (
    auth.uid() = profile_id or public.is_trip_editor(trip_id)
  );

drop policy if exists "trip_members_update" on public.trip_members;
create policy "trip_members_update" on public.trip_members
  for update using (public.is_trip_editor(trip_id));

drop policy if exists "trip_members_delete" on public.trip_members;
create policy "trip_members_delete" on public.trip_members
  for delete using (
    public.is_trip_editor(trip_id) or auth.uid() = profile_id
  );

-- -------------------------------------------------------------
-- 9. Contenido del viaje: trip_days, activities, tasks,
--    expenses, expense_splits, packing_items, comments
--    → miembros leen y crean; editores (o el autor) modifican/borran
-- -------------------------------------------------------------

-- TRIP_DAYS
drop policy if exists "trip_days_select" on public.trip_days;
create policy "trip_days_select" on public.trip_days
  for select using (public.is_trip_member(trip_id));

drop policy if exists "trip_days_insert" on public.trip_days;
create policy "trip_days_insert" on public.trip_days
  for insert with check (public.is_trip_member(trip_id));

drop policy if exists "trip_days_update" on public.trip_days;
create policy "trip_days_update" on public.trip_days
  for update using (public.is_trip_editor(trip_id));

drop policy if exists "trip_days_delete" on public.trip_days;
create policy "trip_days_delete" on public.trip_days
  for delete using (public.is_trip_editor(trip_id));

-- ACTIVITIES
drop policy if exists "activities_select" on public.activities;
create policy "activities_select" on public.activities
  for select using (
    exists (
      select 1 from public.trip_days td
      where td.id = trip_day_id and public.is_trip_member(td.trip_id)
    )
  );

drop policy if exists "activities_insert" on public.activities;
create policy "activities_insert" on public.activities
  for insert with check (
    auth.uid() = created_by
    and exists (
      select 1 from public.trip_days td
      where td.id = trip_day_id and public.is_trip_member(td.trip_id)
    )
  );

drop policy if exists "activities_update" on public.activities;
create policy "activities_update" on public.activities
  for update using (
    auth.uid() = created_by
    or exists (
      select 1 from public.trip_days td
      where td.id = trip_day_id and public.is_trip_editor(td.trip_id)
    )
  );

drop policy if exists "activities_delete" on public.activities;
create policy "activities_delete" on public.activities
  for delete using (
    auth.uid() = created_by
    or exists (
      select 1 from public.trip_days td
      where td.id = trip_day_id and public.is_trip_editor(td.trip_id)
    )
  );

-- TASKS
drop policy if exists "tasks_select" on public.tasks;
create policy "tasks_select" on public.tasks
  for select using (public.is_trip_member(trip_id));

drop policy if exists "tasks_insert" on public.tasks;
create policy "tasks_insert" on public.tasks
  for insert with check (
    auth.uid() = created_by and public.is_trip_member(trip_id)
  );

drop policy if exists "tasks_update" on public.tasks;
create policy "tasks_update" on public.tasks
  for update using (
    auth.uid() = created_by
    or auth.uid() = assigned_to
    or public.is_trip_editor(trip_id)
  );

drop policy if exists "tasks_delete" on public.tasks;
create policy "tasks_delete" on public.tasks
  for delete using (
    auth.uid() = created_by or public.is_trip_editor(trip_id)
  );

-- EXPENSES
drop policy if exists "expenses_select" on public.expenses;
create policy "expenses_select" on public.expenses
  for select using (public.is_trip_member(trip_id));

drop policy if exists "expenses_insert" on public.expenses;
create policy "expenses_insert" on public.expenses
  for insert with check (
    auth.uid() = paid_by and public.is_trip_member(trip_id)
  );

drop policy if exists "expenses_update" on public.expenses;
create policy "expenses_update" on public.expenses
  for update using (
    auth.uid() = paid_by or public.is_trip_editor(trip_id)
  );

drop policy if exists "expenses_delete" on public.expenses;
create policy "expenses_delete" on public.expenses
  for delete using (
    auth.uid() = paid_by or public.is_trip_editor(trip_id)
  );

-- EXPENSE_SPLITS
drop policy if exists "expense_splits_select" on public.expense_splits;
create policy "expense_splits_select" on public.expense_splits
  for select using (
    exists (
      select 1 from public.expenses e
      where e.id = expense_id and public.is_trip_member(e.trip_id)
    )
  );

drop policy if exists "expense_splits_insert" on public.expense_splits;
create policy "expense_splits_insert" on public.expense_splits
  for insert with check (
    exists (
      select 1 from public.expenses e
      where e.id = expense_id
        and (auth.uid() = e.paid_by or public.is_trip_editor(e.trip_id))
    )
  );

drop policy if exists "expense_splits_update" on public.expense_splits;
create policy "expense_splits_update" on public.expense_splits
  for update using (
    exists (
      select 1 from public.expenses e
      where e.id = expense_id
        and (auth.uid() = e.paid_by or public.is_trip_editor(e.trip_id))
    )
  );

drop policy if exists "expense_splits_delete" on public.expense_splits;
create policy "expense_splits_delete" on public.expense_splits
  for delete using (
    exists (
      select 1 from public.expenses e
      where e.id = expense_id
        and (auth.uid() = e.paid_by or public.is_trip_editor(e.trip_id))
    )
  );

-- PACKING_ITEMS
drop policy if exists "packing_items_select" on public.packing_items;
create policy "packing_items_select" on public.packing_items
  for select using (public.is_trip_member(trip_id));

drop policy if exists "packing_items_insert" on public.packing_items;
create policy "packing_items_insert" on public.packing_items
  for insert with check (public.is_trip_member(trip_id));

drop policy if exists "packing_items_update" on public.packing_items;
create policy "packing_items_update" on public.packing_items
  for update using (
    auth.uid() = assigned_to or public.is_trip_member(trip_id)
  );

drop policy if exists "packing_items_delete" on public.packing_items;
create policy "packing_items_delete" on public.packing_items
  for delete using (public.is_trip_editor(trip_id));

-- COMMENTS
drop policy if exists "comments_select" on public.comments;
create policy "comments_select" on public.comments
  for select using (public.is_trip_member(trip_id));

drop policy if exists "comments_insert" on public.comments;
create policy "comments_insert" on public.comments
  for insert with check (
    auth.uid() = profile_id and public.is_trip_member(trip_id)
  );

drop policy if exists "comments_update" on public.comments;
create policy "comments_update" on public.comments
  for update using (auth.uid() = profile_id);

drop policy if exists "comments_delete" on public.comments;
create policy "comments_delete" on public.comments
  for delete using (
    auth.uid() = profile_id or public.is_trip_editor(trip_id)
  );

-- -------------------------------------------------------------
-- 10. NOTIFICATIONS — solo el dueño las lee y las marca como leídas
-- -------------------------------------------------------------
drop policy if exists "notifications_select" on public.notifications;
create policy "notifications_select" on public.notifications
  for select using (auth.uid() = profile_id);

drop policy if exists "notifications_insert" on public.notifications;
create policy "notifications_insert" on public.notifications
  for insert with check (auth.uid() = profile_id);

drop policy if exists "notifications_update" on public.notifications;
create policy "notifications_update" on public.notifications
  for update using (auth.uid() = profile_id);

drop policy if exists "notifications_delete" on public.notifications;
create policy "notifications_delete" on public.notifications
  for delete using (auth.uid() = profile_id);
