import Icon from "../atoms/Icon";
import ProgressBar from "../atoms/ProgressBar";

interface CountdownCardProps {
  days: number | null;
  progress: number;
}

export default function CountdownCard({ days, progress }: CountdownCardProps) {
  return (
    <section className="side-card countdown-card">
      <div className="card-topline">
        <span className="card-icon countdown-icon">
          <Icon name="calendar" size={18} />
        </span>
        <span className="card-label">CUENTA ATRÁS</span>
        <span className="card-dots">···</span>
      </div>
      <div className="countdown-number">
        {days ?? "—"} <span>días</span>
      </div>
      <p className="countdown-copy">¡Y empieza la aventura!</p>
      <ProgressBar className="countdown-progress" />
      <div className="countdown-foot">
        <span>Preparativos</span>
        <strong>{progress}% listos</strong>
      </div>
    </section>
  );
}
