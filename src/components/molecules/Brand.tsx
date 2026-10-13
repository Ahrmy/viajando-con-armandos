import Icon from "../atoms/Icon";

export default function Brand() {
  return (
    <a href="#inicio" className="brand" aria-label="Viajando con Armandos, inicio">
      <span className="brand-mark">
        <Icon name="plane" size={20} />
      </span>
      <span>
        viajando<span className="brand-light">con</span>
        <br />
        <strong>Armandos</strong>
      </span>
    </a>
  );
}
