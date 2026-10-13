import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  small?: boolean;
  children: ReactNode;
}

export default function IconButton({
  small = false,
  className = "",
  children,
  ...rest
}: IconButtonProps) {
  const classes = `icon-button${small ? " small-icon-button" : ""}${className ? ` ${className}` : ""}`;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
