import Icon, { type IconName } from "../atoms/Icon";

interface NavItemProps {
  icon: IconName;
  label: string;
  active?: boolean;
  count?: number;
  onClick: () => void;
}

export default function NavItem({
  icon,
  label,
  active = false,
  count,
  onClick,
}: NavItemProps) {
  return (
    <button className={active ? "nav-item active" : "nav-item"} onClick={onClick}>
      <Icon name={icon} />
      <span>{label}</span>
      {count !== undefined && <span className="nav-count">{count}</span>}
    </button>
  );
}
