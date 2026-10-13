import MetaItem from "../molecules/MetaItem";
import WeatherChip from "../molecules/WeatherChip";

interface TripMetaBarProps {
  dates: string;
  travelers: string;
  destinationsCount: number;
}

export default function TripMetaBar({
  dates,
  travelers,
  destinationsCount,
}: TripMetaBarProps) {
  return (
    <section className="trip-meta" aria-label="Detalles del viaje">
      <MetaItem icon="calendar" label="FECHAS" value={dates} />
      <span className="meta-divider" />
      <MetaItem
        icon="users"
        label="VIAJEROS"
        value={travelers}
        iconClassName="meta-green"
      />
      <span className="meta-divider" />
      <MetaItem
        icon="pin"
        label="DESTINOS"
        value={`${destinationsCount} lugares`}
        iconClassName="meta-peach"
      />
      <WeatherChip icon="☀️" place="Lisboa" text="24° soleado" />
    </section>
  );
}
