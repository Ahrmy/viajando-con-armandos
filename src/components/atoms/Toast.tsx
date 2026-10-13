import Icon from "./Icon";

export default function Toast({ message }: { message: string }) {
  return (
    <div className="toast" role="status">
      <span className="toast-check">
        <Icon name="check" size={14} />
      </span>
      {message}
    </div>
  );
}
