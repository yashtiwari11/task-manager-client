import { useState } from "react";
import api from "../api/axios";

function TaskForm({ onTaskCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.dueDate) errs.dueDate = "Due date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setErrors({});
      const res = await api.post("/tasks", form);
      onTaskCreated(res.data.task);
      setForm({ title: "", description: "", priority: "Low", dueDate: "" });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create task";
      setErrors({ server: msg });
    }
  };

  return (
    <div style={styles.wrap}>
      <style>{`
        .form-input::placeholder { color: #b5aea7; }
        .add-btn:hover { background: #333 !important; }
      `}</style>

      <p style={styles.eyebrow}>New Task</p>
      <h2 style={styles.heading}>Create Task</h2>

      {errors.server && <p style={styles.errorText}>{errors.server}</p>}

      <div style={styles.row}>
        <div style={{ flex: 2 }}>
          <label style={styles.label}>Title *</label>
          <input
            className="form-input"
            type="text"
            placeholder="Task title"
            style={{ ...styles.input, borderColor: errors.title ? "#fecaca" : "#ddd" }}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          {errors.title && <p style={styles.fieldError}>{errors.title}</p>}
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Priority</label>
          <select
            style={styles.input}
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>

      <div>
        <label style={styles.label}>Description *</label>
        <input
          className="form-input"
          type="text"
          placeholder="Short description"
          style={{ ...styles.input, borderColor: errors.description ? "#fecaca" : "#ddd" }}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        {errors.description && <p style={styles.fieldError}>{errors.description}</p>}
      </div>

      <div style={styles.row}>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Due Date *</label>
          <input
            className="form-input"
            type="date"
            style={{ ...styles.input, borderColor: errors.dueDate ? "#fecaca" : "#ddd" }}
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
          {errors.dueDate && <p style={styles.fieldError}>{errors.dueDate}</p>}
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end" }}>
          <button className="add-btn" onClick={handleSubmit} style={styles.btn}>
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    background: "#fff",
    border: "1px solid #e8e4df",
    borderRadius: 6,
    padding: "24px 24px 20px",
    marginBottom: 24,
    fontFamily: "'DM Sans', sans-serif",
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#9e9389",
    marginBottom: 2,
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 22,
    fontWeight: 600,
    color: "#1a1a1a",
    letterSpacing: "-0.01em",
    marginBottom: 20,
  },
  row: {
    display: "flex",
    gap: 12,
    marginBottom: 14,
  },
  label: {
    display: "block",
    fontSize: 10,
    fontWeight: 500,
    color: "#7a7068",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: 3,
    padding: "9px 12px",
    fontSize: 13,
    color: "#1a1a1a",
    background: "#fafafa",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 300,
  },
  btn: {
    width: "100%",
    padding: "10px",
    background: "#1a1a1a",
    border: "none",
    borderRadius: 3,
    color: "#fff",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.04em",
    transition: "background 0.2s",
  },
  errorText: {
    fontSize: 12,
    color: "#c0392b",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    padding: "8px 12px",
    borderRadius: 3,
    marginBottom: 14,
  },
  fieldError: {
    fontSize: 11,
    color: "#c0392b",
    marginTop: 4,
  },
};

export default TaskForm;