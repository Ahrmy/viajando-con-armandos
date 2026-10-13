import type { AvatarColor, Destination } from "../types/dashboard";

export const defaultTripImage =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=90";

export const newDestinationImage =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85";

/** Paleta rotatoria para los avatares de miembros de la familia */
export const avatarColors: AvatarColor[] = [
  "coral",
  "blue",
  "yellow",
  "green",
  "lilac",
];

// TODO: los destinos siguen en local hasta crear la tabla `trip_destinations`
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
