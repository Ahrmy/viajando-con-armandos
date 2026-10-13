import Avatar from "../atoms/Avatar";

interface ProfileRowProps {
  name: string;
  subtitle: string;
  initial: string;
  onSignOut: () => void;
}

export default function ProfileRow({
  name,
  subtitle,
  initial,
  onSignOut,
}: ProfileRowProps) {
  return (
    <div className="profile-row">
      <Avatar label={initial} color="coral" className="profile-avatar" />
      <span>
        <strong>{name}</strong>
        <small>{subtitle}</small>
      </span>
      <button
        className="profile-more profile-logout"
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
        onClick={onSignOut}
      >
        ⏻
      </button>
    </div>
  );
}
