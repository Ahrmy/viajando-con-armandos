export type IconName =
  | "grid"
  | "map"
  | "wallet"
  | "sparkles"
  | "settings"
  | "plus"
  | "arrow"
  | "pin"
  | "calendar"
  | "users"
  | "check"
  | "clock"
  | "plane"
  | "close"
  | "link"
  | "send";

const iconPaths: Record<IconName, string> = {
  grid: "M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z",
  map: "M3 6 8 3l8 3 5-3v15l-5 3-8-3-5 3z M8 3v15 M16 6v15",
  wallet:
    "M4 6.5h15a2 2 0 0 1 2 2V19H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h13 M2 7h17 M15 13h6",
  sparkles:
    "m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z",
  settings:
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 2.9-.2-.1a1.7 1.7 0 0 0-1.9.3l-.1.1h-3.4l-.1-.2a1.7 1.7 0 0 0-1.6-1l-.2.1-2.9-1.7.1-.2a1.7 1.7 0 0 0-.3-1.9l-.1-.1v-3.4l.2-.1a1.7 1.7 0 0 0 1-1.6l-.1-.2 1.7-2.9.2.1a1.7 1.7 0 0 0 1.9-.3l.1-.1h3.4l.1.2a1.7 1.7 0 0 0 1.6 1l.2-.1 2.9 1.7-.1.2a1.7 1.7 0 0 0 .3 1.9l.1.1v3.4z",
  plus: "M12 5v14 M5 12h14",
  arrow: "M5 12h14 M13 6l6 6-6 6",
  pin: "M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z M12 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  calendar: "M4 5h16v16H4z M8 3v4 M16 3v4 M4 10h16",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M20 21v-2a4 4 0 0 0-3-3.9 M16 3.1a4 4 0 0 1 0 7.8",
  check: "m5 12 4 4L19 6",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2",
  plane: "m22 2-7 20-4-9-9-4z M22 2 11 13",
  close: "M18 6 6 18 M6 6l12 12",
  link: "M10 13a5 5 0 0 0 7.1 0l3-3A5 5 0 0 0 13 2.9l-1.7 1.7 M14 11a5 5 0 0 0-7.1 0l-3 3A5 5 0 0 0 11 21.1l1.7-1.7",
  send: "m22 2-7 20-4-9-9-4z M22 2 11 13",
};

interface IconProps {
  name: IconName;
  size?: number;
}

export default function Icon({ name, size = 19 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}
