import Icon from "../atoms/Icon";
import IconButton from "../atoms/IconButton";
import ProgressBar from "../atoms/ProgressBar";
import Eyebrow from "../atoms/Eyebrow";

interface BudgetCardProps {
  spent: number;
  total: number;
  onOpen: () => void;
}

const formatEuros = (amount: number) => `${amount.toLocaleString("es-ES")} €`;

export default function BudgetCard({ spent, total, onOpen }: BudgetCardProps) {
  const left = total - spent;

  return (
    <section className="side-card budget-card" id="presupuesto">
      <div className="card-section-heading">
        <div>
          <span className="card-icon budget-icon">
            <Icon name="wallet" size={18} />
          </span>
          <div>
            <Eyebrow>SIN SORPRESAS</Eyebrow>
            <h2>Presupuesto</h2>
          </div>
        </div>
        <IconButton small aria-label="Ver presupuesto" onClick={onOpen}>
          <Icon name="arrow" size={16} />
        </IconButton>
      </div>
      <div className="budget-amount">
        <strong>{formatEuros(spent)}</strong>
        <span>de {formatEuros(total)}</span>
      </div>
      <ProgressBar className="budget-progress" />
      <div className="budget-legend">
        <span>
          <i className="legend-spent" /> Gastado <strong>{formatEuros(spent)}</strong>
        </span>
        <span>
          <i className="legend-left" /> Disponible <strong>{formatEuros(left)}</strong>
        </span>
      </div>
    </section>
  );
}
