import Icon from "../atoms/Icon";
import AvatarStack from "./AvatarStack";
import type { FamilyMember } from "../../types/dashboard";

interface FamilyCardProps {
  members: FamilyMember[];
  onInvite: () => void;
}

export default function FamilyCard({ members, onInvite }: FamilyCardProps) {
  return (
    <div className="family-card">
      <AvatarStack members={members} className="family-avatars" />
      <strong>La familia</strong>
      <span>{members.length} personas organizando</span>
      <button onClick={onInvite}>
        Invitar a alguien <Icon name="plus" size={15} />
      </button>
    </div>
  );
}
