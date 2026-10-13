import Icon from "../atoms/Icon";
import type { Destination } from "../../types/dashboard";

interface DestinationCardProps {
  destination: Destination;
  index: number;
  onFavorite: (destination: Destination) => void;
}

export default function DestinationCard({
  destination,
  index,
  onFavorite,
}: DestinationCardProps) {
  return (
    <article className="destination-card">
      <div className="destination-photo">
        <img src={destination.image} alt={`Paisaje de ${destination.name}`} />
        <span className="destination-number">0{index + 1}</span>
        <button
          className="destination-favorite"
          aria-label={`Guardar ${destination.name}`}
          onClick={() => onFavorite(destination)}
        >
          ♡
        </button>
      </div>
      <div className="destination-info">
        <div>
          <h3>
            {destination.name} <span>{destination.emoji}</span>
          </h3>
          <p>{destination.country}</p>
        </div>
        <span className="stay-pill">
          <Icon name="clock" size={13} /> {destination.days}
        </span>
      </div>
    </article>
  );
}
