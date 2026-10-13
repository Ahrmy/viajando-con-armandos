import type { MouseEvent, ReactNode } from "react";
import Icon, { type IconName } from "../atoms/Icon";
import Eyebrow from "../atoms/Eyebrow";

interface ModalProps {
  icon: IconName;
  eyebrow: string;
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({
  icon,
  eyebrow,
  title,
  description,
  onClose,
  children,
}: ModalProps) {
  const handleBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onMouseDown={handleBackdrop}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal-close" aria-label="Cerrar" onClick={onClose}>
          <Icon name="close" />
        </button>
        <span className="modal-icon">
          <Icon name={icon} size={22} />
        </span>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id="modal-title">{title}</h2>
        <p className="modal-description">{description}</p>
        {children}
      </section>
    </div>
  );
}
