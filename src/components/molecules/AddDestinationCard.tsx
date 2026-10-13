import Icon from "../atoms/Icon";

export default function AddDestinationCard({ onClick }: { onClick: () => void }) {
  return (
    <button className="add-destination-card" onClick={onClick}>
      <span className="add-round">
        <Icon name="plus" size={20} />
      </span>
      <strong>
        ¿Y si añadimos
        <br />
        otro lugar?
      </strong>
      <small>Las mejores ideas empiezan aquí</small>
    </button>
  );
}
