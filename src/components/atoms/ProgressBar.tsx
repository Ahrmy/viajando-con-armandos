interface ProgressBarProps {
  /** Porcentaje 0-100. Si se omite, el ancho lo controla el CSS. */
  value?: number;
  className?: string;
}

export default function ProgressBar({ value, className = "" }: ProgressBarProps) {
  return (
    <div className={className}>
      <span style={value === undefined ? undefined : { width: `${value}%` }} />
    </div>
  );
}
