import type { AvatarColor } from "../../types/dashboard";

interface AvatarProps {
  label: string;
  color: AvatarColor;
  className?: string;
}

export default function Avatar({ label, color, className = "" }: AvatarProps) {
  const classes = `avatar avatar-${color}${className ? ` ${className}` : ""}`;
  return <span className={classes}>{label}</span>;
}
