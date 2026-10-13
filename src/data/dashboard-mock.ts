import type {
  Destination,
  FamilyMember,
  TaskItem,
  TripSummary,
} from "../types/dashboard";

export const defaultTripImage =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=90";

export const newDestinationImage =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85";

export const initialTrips: TripSummary[] = [
  {
    id: 1,
    title: "Verano en familia",
    label: "Verano 2027",
    destination: "Portugal",
    dates: "5 – 15 agosto, 2027",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1800&q=90",
  },
];

export const initialDestinations: Destination[] = [
  {
    name: "Lisboa",
    country: "Portugal",
    days: "4 noches",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=85",
    emoji: "🇵🇹",
  },
  {
    name: "Oporto",
    country: "Portugal",
    days: "3 noches",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=85",
    emoji: "🇵🇹",
  },
];

export const initialTasks: TaskItem[] = [
  { id: 1, label: "Mirar vuelos para toda la familia", who: "Mamá", done: true },
  { id: 2, label: "Elegir alojamiento en Lisboa", who: "Papá", done: false },
  { id: 3, label: "Revisar documentación", who: "Todos", done: false },
];

export const familyMembers: FamilyMember[] = [
  { label: "M", color: "coral" },
  { label: "P", color: "blue" },
  { label: "A", color: "yellow" },
  { label: "+", color: "lilac" },
];

export const tripMembers: FamilyMember[] = [
  { label: "M", color: "coral" },
  { label: "P", color: "blue" },
  { label: "A", color: "yellow" },
  { label: "L", color: "green" },
];
