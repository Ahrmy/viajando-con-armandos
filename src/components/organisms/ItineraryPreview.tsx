import Icon from "../atoms/Icon";
import Eyebrow from "../atoms/Eyebrow";

interface ItineraryPreviewProps {
  onViewAll: () => void;
}

export default function ItineraryPreview({ onViewAll }: ItineraryPreviewProps) {
  return (
    <section className="section-block itinerary-preview" id="itinerario">
      <div className="section-heading">
        <div>
          <Eyebrow>UN PASO A LA VEZ</Eyebrow>
          <h2>Lo que viene</h2>
        </div>
        <button className="text-button" onClick={onViewAll}>
          Ver todo <Icon name="arrow" size={16} />
        </button>
      </div>
      <div className="next-event">
        <div className="event-date">
          <strong>05</strong>
          <span>AGO</span>
        </div>
        <div className="event-line">
          <span />
        </div>
        <div className="event-details">
          <span className="event-type">
            <Icon name="plane" size={14} /> DÍA DE VIAJE
          </span>
          <h3>¡Despegamos rumbo a Lisboa!</h3>
          <p>Martes, 5 de agosto · Aeropuerto de A Coruña</p>
        </div>
        <span className="event-weather">☀️ 24°</span>
      </div>
    </section>
  );
}
