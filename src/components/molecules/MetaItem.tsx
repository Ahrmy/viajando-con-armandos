import Icon, { type IconName } from "../atoms/Icon";

interface MetaItemProps {
  icon: IconName;
  label: string;
  value: string;
  iconClassName?: string;
}

export default function MetaItem({
  icon,
  label,
  value,
  iconClassName = "",
}: MetaItemProps) {
  return (
    <div className="meta-item">
      <span className={`meta-icon${iconClassName ? ` ${iconClassName}` : ""}`}>
        <Icon name={icon} size={18} />
      </span>
      <span>
        <small>{label}</small>
        <strong>{value}</strong>
      </span>
    </div>
  );
}
