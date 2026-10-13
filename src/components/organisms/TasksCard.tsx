import Icon from "../atoms/Icon";
import IconButton from "../atoms/IconButton";
import ProgressBar from "../atoms/ProgressBar";
import Eyebrow from "../atoms/Eyebrow";
import TaskRow from "../molecules/TaskRow";
import type { TaskItem } from "../../types/dashboard";

interface TasksCardProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onAddTask: () => void;
  onViewAll: () => void;
}

export default function TasksCard({
  tasks,
  onToggleTask,
  onAddTask,
  onViewAll,
}: TasksCardProps) {
  const completed = tasks.filter((task) => task.done).length;
  const progress = tasks.length ? (completed / tasks.length) * 100 : 0;

  return (
    <section className="side-card tasks-card" id="ideas">
      <div className="card-section-heading">
        <div>
          <span className="card-icon task-icon">
            <Icon name="check" size={18} />
          </span>
          <div>
            <Eyebrow>PARA IR CALENTANDO</Eyebrow>
            <h2>Lista de tareas</h2>
          </div>
        </div>
        <IconButton small aria-label="Añadir tarea" onClick={onAddTask}>
          <Icon name="plus" size={17} />
        </IconButton>
      </div>
      <ProgressBar value={progress} className="task-progress" />
      <p className="task-progress-label">
        {completed} de {tasks.length} tareas completadas
      </p>
      <div className="task-list">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} onToggle={onToggleTask} />
        ))}
      </div>
      <button className="all-tasks-button" onClick={onViewAll}>
        Ver todas las tareas <Icon name="arrow" size={15} />
      </button>
    </section>
  );
}
