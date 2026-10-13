import Icon from "../atoms/Icon";
import type { TaskItem } from "../../types/dashboard";

interface TaskRowProps {
  task: TaskItem;
  onToggle: (id: string) => void;
}

export default function TaskRow({ task, onToggle }: TaskRowProps) {
  return (
    <label className={task.done ? "task-row task-done" : "task-row"}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
      />
      <span className="custom-checkbox">
        <Icon name="check" size={13} />
      </span>
      <span className="task-copy">
        <strong>{task.label}</strong>
        <small>{task.who}</small>
      </span>
      <span className="task-menu">···</span>
    </label>
  );
}
