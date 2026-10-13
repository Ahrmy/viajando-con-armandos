import Icon from "../atoms/Icon";
import Button from "../atoms/Button";
import Eyebrow from "../atoms/Eyebrow";

interface EmptyTripsStateProps {
  onCreateTrip: () => void;
}

export default function EmptyTripsState({ onCreateTrip }: EmptyTripsStateProps) {
  return (
    <section className="welcome-row">
      <div>
        <Eyebrow>EMPEZAMOS DE CERO</Eyebrow>
        <h1>
          Crea tu primer viaje <span className="wave">✳</span>
        </h1>
        <p className="welcome-subtitle">
          Cuando crees un viaje, aquí verás el resumen de la aventura: destinos,
          tareas y presupuesto.
        </p>
      </div>
      <Button variant="primary" onClick={onCreateTrip}>
        <Icon name="plane" size={18} /> Crear primer viaje
      </Button>
    </section>
  );
}
