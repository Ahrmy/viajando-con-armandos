import { useState, type FormEvent } from "react";
import Icon, { type IconName } from "../atoms/Icon";
import Button from "../atoms/Button";
import Modal from "../molecules/Modal";
import type { ModalKind, NewTripInput } from "../../types/dashboard";

const modalCopy: Record<
  Exclude<ModalKind, null>,
  { icon: IconName; eyebrow: string; title: string; description: string }
> = {
  destination: {
    icon: "pin",
    eyebrow: "EL MAPA ESTÁ ESPERANDO",
    title: "Añade una parada",
    description: "Ese sitio del que todos habláis merece un hueco en el viaje.",
  },
  invite: {
    icon: "users",
    eyebrow: "CUANTOS MÁS, MEJOR",
    title: "Invita a la familia",
    description: "Comparte la organización del viaje con quien tú quieras.",
  },
  trip: {
    icon: "plane",
    eyebrow: "NUEVA AVENTURA EN CAMINO",
    title: "Crea un nuevo viaje",
    description: "Ponedle nombre y un destino soñado; las fechas las ajustáis luego.",
  },
};

interface DashboardModalsProps {
  modal: ModalKind;
  onClose: () => void;
  onAddDestination: (name: string) => void;
  onInvite: (email: string) => void;
  onCreateTrip: (input: NewTripInput) => void;
}

export default function DashboardModals({
  modal,
  onClose,
  onAddDestination,
  onInvite,
  onCreateTrip,
}: DashboardModalsProps) {
  if (!modal) return null;
  const copy = modalCopy[modal];

  return (
    <Modal
      icon={copy.icon}
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      onClose={onClose}
    >
      {modal === "destination" && (
        <DestinationForm
          onSubmit={(name) => {
            onAddDestination(name);
            onClose();
          }}
        />
      )}
      {modal === "invite" && (
        <InviteForm
          onSubmit={(email) => {
            onInvite(email);
            onClose();
          }}
        />
      )}
      {modal === "trip" && (
        <TripForm
          onSubmit={(input) => {
            onCreateTrip(input);
            onClose();
          }}
        />
      )}
    </Modal>
  );
}

function DestinationForm({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="destination-name">¿A dónde os gustaría ir?</label>
      <input
        autoFocus
        id="destination-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Ej. Sintra, Portugal"
        required
      />
      <Button variant="primary" className="modal-submit" type="submit">
        Añadir destino <Icon name="arrow" size={16} />
      </Button>
    </form>
  );
}

function InviteForm({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="invite-email">Correo electrónico</label>
      <input
        autoFocus
        id="invite-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="familia@ejemplo.com"
        required
      />
      <Button variant="primary" className="modal-submit" type="submit">
        Enviar invitación <Icon name="send" size={16} />
      </Button>
    </form>
  );
}

function TripForm({ onSubmit }: { onSubmit: (input: NewTripInput) => void }) {
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit({
      name: trimmed,
      destination: destination.trim(),
      startDate,
      endDate,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="trip-name">Nombre del viaje</label>
      <input
        autoFocus
        id="trip-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Ej. Escapada a Roma"
        required
      />
      <label htmlFor="trip-destination">Destino principal</label>
      <input
        id="trip-destination"
        value={destination}
        onChange={(event) => setDestination(event.target.value)}
        placeholder="Ej. Italia"
      />
      <div className="modal-dates">
        <span>
          <label htmlFor="trip-start">Desde</label>
          <input
            id="trip-start"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </span>
        <span>
          <label htmlFor="trip-end">Hasta</label>
          <input
            id="trip-end"
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </span>
      </div>
      <Button variant="primary" className="modal-submit" type="submit">
        Crear viaje <Icon name="plane" size={16} />
      </Button>
    </form>
  );
}
