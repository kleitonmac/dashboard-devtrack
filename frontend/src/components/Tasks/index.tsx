import { useContext, useState } from "react";
import { DevContext } from "../../context/DevContext";
import "./tasks.css";

export default function Tasks() {
  const { tasks, addTask, completeTask, deleteTask } = useContext(DevContext);
  const [newTask, setNewTask] = useState("");
  const [xpValue, setXpValue] = useState(10);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      addTask({
        title: newTask,
        xpReward: parseInt(xpValue),
        createdAt: new Date().toLocaleDateString("pt-BR"),
      });
      setNewTask("");
      setXpValue(10);
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h2>📚 Minhas Aulas</h2>
        <div className="tasks-stats">
          <span className="stat-badge completed">
            {completedCount} / {totalTasks} completas
          </span>
        </div>
      </div>

      {totalTasks > 0 && (
        <div className="completion-bar-container">
          <div className="completion-bar">
            <div
              className="completion-fill"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <p className="completion-text">{Math.round(completionRate)}% completo</p>
        </div>
      )}

      <form onSubmit={handleAddTask} className="add-task-form">
        <div className="form-group">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Adicionar nova aula..."
            className="task-input"
          />
          <div className="xp-selector">
            <label htmlFor="xp-value">XP: </label>
            <select
              id="xp-value"
              value={xpValue}
              onChange={(e) => setXpValue(e.target.value)}
              className="xp-select"
            >
              <option value={5}>5 XP</option>
              <option value={10}>10 XP</option>
              <option value={15}>15 XP</option>
              <option value={20}>20 XP</option>
              <option value={25}>25 XP</option>
              <option value={30}>30 XP</option>
            </select>
          </div>
          <button type="submit" className="btn-add-task primary">
            ➕ Adicionar
          </button>
        </div>
      </form>

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>📖 Nenhuma aula adicionada ainda</p>
            <p className="empty-hint">Adicione aulas para começar a ganhar XP!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`task-item ${task.completed ? "completed" : ""}`}
            >
              <div className="task-content">
                <div className="task-checkbox">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => completeTask(task.id, task.xpReward)}
                    className="checkbox-input"
                    id={`task-${task.id}`}
                  />
                  <label htmlFor={`task-${task.id}`} className="checkbox-label"></label>
                </div>
                <div className="task-info">
                  <h4 className="task-title">{task.title}</h4>
                  <p className="task-date">Adicionada em {task.createdAt}</p>
                </div>
              </div>

              <div className="task-actions">
                <span className="xp-badge">+{task.xpReward} XP</span>
                {task.completed && <span className="completed-badge">✅ Concluído</span>}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="btn-delete"
                  title="Remover aula"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
