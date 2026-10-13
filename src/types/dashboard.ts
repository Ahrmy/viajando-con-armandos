export type AvatarColor = "coral" | "blue" | "yellow" | "lilac" | "green";

export interface TripSummary {
  id: number;
  title: string;
  label: string;
  destination: string;
  dates: string;
  image: string;
}

export interface Destination {
  name: string;
  country: string;
  days: string;
  image: string;
  emoji: string;
}

export interface TaskItem {
  id: number;
  label: string;
  who: string;
  done: boolean;
}

export interface FamilyMember {
  label: string;
  color: AvatarColor;
}

export type ModalKind = "destination" | "invite" | "trip" | null;

export interface NewTripInput {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
}

export type DbStatus = "conectando" | "conectado" | "error";
