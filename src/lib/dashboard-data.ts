import { supabase } from "./supabaseClient";
import { avatarColors, defaultTripImage } from "../data/dashboard-mock";
import type { FamilyMember, TaskItem, TripSummary } from "../types/dashboard";
import type { Tables } from "../types/database";

type TripRow = Tables<"trips">;

export interface FamilyInfo {
  id: string;
  name: string;
}

// ------------------------------------------------------------------
// Mappers
// ------------------------------------------------------------------

const formatDate = (iso: string | null): string =>
  iso
    ? new Date(`${iso}T00:00:00`).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

export function mapTrip(row: TripRow): TripSummary {
  const destination = row.destination ?? "Por descubrir";
  const start = formatDate(row.start_date);
  const end = formatDate(row.end_date);
  const dates =
    start && end ? `${start} – ${end}` : start || end || "Fechas por definir";
  const year = row.start_date
    ? new Date(`${row.start_date}T00:00:00`).getFullYear()
    : new Date(row.created_at).getFullYear();
  return {
    id: row.id,
    title: row.title,
    label: `${destination} ${year}`,
    destination,
    dates,
    image: defaultTripImage,
    startDate: row.start_date,
    endDate: row.end_date,
  };
}

export function daysUntil(startDate: string | null): number | null {
  if (!startDate) return null;
  const diff = Math.ceil(
    (new Date(`${startDate}T00:00:00`).getTime() - Date.now()) / 86_400_000,
  );
  return Math.max(diff, 0);
}

const initialOf = (name: string | null | undefined): string =>
  name?.trim().charAt(0).toUpperCase() || "·";

// ------------------------------------------------------------------
// Familia
// ------------------------------------------------------------------

/** Familia del usuario (primera membership). Null si aún no tiene. */
export async function fetchMyFamily(
  userId: string,
): Promise<FamilyInfo | null> {
  const { data, error } = await supabase
    .from("family_members")
    .select("family_id, families!family_members_family_id_fkey(name)")
    .eq("profile_id", userId)
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return { id: data.family_id, name: data.families?.name ?? "Mi familia" };
}

/** Crea la familia del usuario y su membership como owner (onboarding). */
export async function createFamily(
  userId: string,
  name: string,
): Promise<FamilyInfo> {
  const { data: family, error: familyError } = await supabase
    .from("families")
    .insert({ name, owner_id: userId })
    .select("id, name")
    .single();
  if (familyError) throw new Error(familyError.message);

  const { error: memberError } = await supabase
    .from("family_members")
    .insert({ family_id: family.id, profile_id: userId, role: "owner" });
  if (memberError) throw new Error(memberError.message);

  return { id: family.id, name: family.name };
}

export async function fetchFamilyMembers(
  familyId: string,
): Promise<FamilyMember[]> {
  const { data, error } = await supabase
    .from("family_members")
    .select("profile_id, profiles!family_members_profile_id_fkey(full_name)")
    .eq("family_id", familyId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data.map((row, index) => ({
    label: initialOf(row.profiles?.full_name),
    color: avatarColors[index % avatarColors.length],
  }));
}

// ------------------------------------------------------------------
// Viajes
// ------------------------------------------------------------------

export async function fetchTrips(familyId: string): Promise<TripSummary[]> {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("family_id", familyId)
    .order("start_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data.map(mapTrip);
}

export interface InsertTripInput {
  familyId: string;
  createdBy: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
}

export async function insertTrip(input: InsertTripInput): Promise<TripSummary> {
  const { data, error } = await supabase
    .from("trips")
    .insert({
      family_id: input.familyId,
      created_by: input.createdBy,
      title: input.title,
      destination: input.destination || null,
      start_date: input.startDate || null,
      end_date: input.endDate || null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapTrip(data);
}

// ------------------------------------------------------------------
// Tareas del viaje
// ------------------------------------------------------------------

export async function fetchTasks(tripId: string): Promise<TaskItem[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select(
      "id, title, status, assignee:profiles!tasks_assigned_to_fkey(full_name)",
    )
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data.map((row) => ({
    id: row.id,
    label: row.title,
    who: row.assignee?.full_name ?? "Todos",
    done: row.status === "done",
  }));
}

export async function updateTaskStatus(
  taskId: string,
  done: boolean,
): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .update({ status: done ? "done" : "todo" })
    .eq("id", taskId);
  if (error) throw new Error(error.message);
}

// ------------------------------------------------------------------
// Presupuesto y viajeros
// ------------------------------------------------------------------

/** Total gastado en el viaje (suma de expenses.amount). */
export async function fetchExpensesTotal(tripId: string): Promise<number> {
  const { data, error } = await supabase
    .from("expenses")
    .select("amount")
    .eq("trip_id", tripId);
  if (error) throw new Error(error.message);
  return data.reduce((sum, row) => sum + Number(row.amount), 0);
}

/** Nº de miembros explícitos del viaje (trip_members). */
export async function fetchTravelersCount(tripId: string): Promise<number> {
  const { count, error } = await supabase
    .from("trip_members")
    .select("id", { count: "exact", head: true })
    .eq("trip_id", tripId);
  if (error) throw new Error(error.message);
  return count ?? 0;
}
