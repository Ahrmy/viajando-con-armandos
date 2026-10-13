import Icon from "../atoms/Icon";
import Eyebrow from "../atoms/Eyebrow";
import DestinationCard from "../molecules/DestinationCard";
import AddDestinationCard from "../molecules/AddDestinationCard";
import type { Destination } from "../../types/dashboard";

interface DestinationsSectionProps {
  destinations: Destination[];
  onAdd: () => void;
  onFavorite: (destination: Destination) => void;
  onViewItinerary: () => void;
}

export default function DestinationsSection({
  destinations,
  onAdd,
  onFavorite,
  onViewItinerary,
}: DestinationsSectionProps) {
  return (
    <section className="section-block destinations-section" id="destinos">
      <div className="section-heading">
        <div>
          <Eyebrow>EL PLAN VA TOMANDO FORMA</Eyebrow>
          <h2>
            Nuestros destinos{" "}
            <span className="heading-count">{destinations.length}</span>
          </h2>
        </div>
        <button className="text-button" onClick={onViewItinerary}>
          Ver itinerario <Icon name="arrow" size={16} />
        </button>
      </div>
      <div className="destination-grid">
        {destinations.map((destination, index) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            index={index}
            onFavorite={onFavorite}
          />
        ))}
        <AddDestinationCard onClick={onAdd} />
      </div>
    </section>
  );
}
