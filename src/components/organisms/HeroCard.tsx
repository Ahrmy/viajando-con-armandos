import Icon from "../atoms/Icon";
import type { TripSummary } from "../../types/dashboard";

interface HeroCardProps {
  trip: TripSummary;
  onMenu: () => void;
  onExplore: () => void;
}

export default function HeroCard({ trip, onMenu, onExplore }: HeroCardProps) {
  return (
    <section className="hero-card">
      <img src={trip.image} alt={trip.title} />
      <div className="hero-overlay" />
      <div className="hero-top">
        <span className="hero-badge">
          <span className="live-dot" /> EL VIAJE SE ACERCA
        </span>
        <button className="hero-menu" aria-label="Más opciones" onClick={onMenu}>
          ···
        </button>
      </div>
      <div className="hero-copy">
        <span className="hero-location">
          <Icon name="pin" size={15} /> {trip.destination.toUpperCase()}
        </span>
        <h2>{trip.destination}, allá vamos</h2>
        <p>Sol, sobremesas largas y recuerdos para siempre.</p>
      </div>
      <button className="hero-link" onClick={onExplore}>
        Explorar itinerario <Icon name="arrow" size={17} />
      </button>
    </section>
  );
}
