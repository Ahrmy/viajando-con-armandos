import Avatar from "../atoms/Avatar";
import type { FamilyMember } from "../../types/dashboard";

interface AvatarStackProps {
  members: FamilyMember[];
  className?: string;
  ariaLabel?: string;
}

export default function AvatarStack({
  members,
  className = "avatar-stack",
  ariaLabel,
}: AvatarStackProps) {
  return (
    <div className={className} aria-label={ariaLabel}>
      {members.map((member, index) => (
        <Avatar
          key={`${member.label}-${index}`}
          label={member.label}
          color={member.color}
        />
      ))}
    </div>
  );
}
