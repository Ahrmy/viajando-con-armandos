interface WeatherChipProps {
  icon: string;
  place: string;
  text: string;
}

export default function WeatherChip({ icon, place, text }: WeatherChipProps) {
  return (
    <div className="weather-chip">
      <span>{icon}</span>
      <span>
        <strong>{place}</strong>
        <small>{text}</small>
      </span>
    </div>
  );
}
