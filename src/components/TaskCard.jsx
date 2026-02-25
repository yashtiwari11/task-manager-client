import api from "../api/axios";

const priorityConfig = {
  High:   { color: "#7f1d1d", background: "#fef2f2", border: "#fecaca" },
  Medium: { color: "#78350f", background: "#fffbeb", border: "#fde68a" },
  Low:    { color: "#14532d", background: "#f0fdf4", border: "#bbf7d0" },
};

function TaskCard({ task, onDelete, onUpdate }) {
  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${task._id}`);
      onDelete(task._id);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleStatus = async () => {
    try {
      const updatedStatus = task.status === "Pending" ? "Completed" : "Pending";
      const res = await api.put(`/tasks/${task._id}`, { status: updatedStatus });
      onUpdate(res.data.task);
    } catch (err) {
      console.log(err);
    }
  };

  const p = priorityConfig[task.priority] || priorityConfig.Low;
  const isCompleted = task.status === "Completed";

  return (
    <div style={styles.card}>
      <style>{`
        .delete-btn:hover { color: #c0392b !important; }
        .status-btn:hover { opacity: 0.75; }
      `}</style>

      <div style={styles.cardTop}>
        <div style={styles.cardMain}>
          <h3 style={{ ...styles.title, textDecoration: isCompleted ? "line-through" : "none", color: isCompleted ? "#9e9389" : "#1a1a1a" }}>
            {task.title}
          </h3>
          {task.description && (
            <p style={styles.description}>{task.description}</p>
          )}
        </div>

        <button className="delete-btn" onClick={handleDelete} style={styles.deleteBtn}>
          ✕
        </button>
      </div>

      <div style={styles.cardBottom}>
        <div style={styles.badges}>
          <span style={{ ...styles.badge, color: p.color, background: p.background, border: `1px solid ${p.border}` }}>
            {task.priority}
          </span>

          <button className="status-btn" onClick={toggleStatus} style={{
            ...styles.statusBtn,
            background: isCompleted ? "#f0fdf4" : "#fffbeb",
            color: isCompleted ? "#14532d" : "#78350f",
            border: `1px solid ${isCompleted ? "#bbf7d0" : "#fde68a"}`,
          }}>
            {isCompleted ? "✓ Completed" : "⏳ Pending"}
          </button>
        </div>

        {task.dueDate && (
          <span style={styles.dueDate}>
            Due {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    border: "1px solid #e8e4df",
    borderRadius: 6,
    padding: "18px 20px",
    marginBottom: 10,
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
    gap: 12,
  },
  cardMain: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 500,
    color: "#1a1a1a",
    marginBottom: 4,
    fontFamily: "'DM Sans', sans-serif",
    transition: "color 0.2s",
  },
  description: {
    fontSize: 13,
    color: "#9e9389",
    fontWeight: 300,
    lineHeight: 1.5,
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "#c8c0b8",
    fontSize: 13,
    cursor: "pointer",
    padding: "2px 4px",
    fontFamily: "'DM Sans', sans-serif",
    transition: "color 0.2s",
    flexShrink: 0,
  },
  cardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badges: {
    display: "flex",
    gap: 8,
  },
  badge: {
    fontSize: 11,
    fontWeight: 500,
    padding: "3px 10px",
    borderRadius: 20,
    letterSpacing: "0.04em",
    fontFamily: "'DM Sans', sans-serif",
  },
  statusBtn: {
    fontSize: 11,
    fontWeight: 500,
    padding: "3px 10px",
    borderRadius: 20,
    letterSpacing: "0.04em",
    cursor: "pointer",
    border: "none",
    fontFamily: "'DM Sans', sans-serif",
    transition: "opacity 0.2s",
  },
  dueDate: {
    fontSize: 11,
    color: "#b5aea7",
    fontWeight: 300,
    letterSpacing: "0.02em",
  },
};

export default TaskCard;