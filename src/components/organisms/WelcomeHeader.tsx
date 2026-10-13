import Icon from "../atoms/Icon";
import Button from "../atoms/Button";
import Eyebrow from "../atoms/Eyebrow";

interface WelcomeHeaderProps {
  onAddDestination: () => void;
}

export default function WelcomeHeader({ onAddDestination }: WelcomeHeaderProps) {
  return (
    <section className="welcome-row">
      <div>
        <Eyebrow>NUESTRO PRÓXIMO CAPÍTULO</Eyebrow>
        <h1>
          ¡Nos vamos de viaje! <span className="wave">✳</span>
        </h1>
        <p className="welcome-subtitle">
          Un viaje en familia se disfruta desde que empieza a soñarse.
        </p>
      </div>
      <Button variant="primary" onClick={onAddDestination}>
        <Icon name="plus" size={18} /> Añadir destino
      </Button>
    </section>
  );
}
