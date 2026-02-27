import { useState } from "react";
import api from "../api/axios";

const priorityConfig = {
  High:   { color: "#7f1d1d", background: "#fef2f2", border: "#fecaca" },
  Medium: { color: "#78350f", background: "#fffbeb", border: "#fde68a" },
  Low:    { color: "#14532d", background: "#f0fdf4", border: "#bbf7d0" },
};

function TaskCard({ task, onDelete, onUpdate, isCreator }) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : "",
  });
  const [editError, setEditError] = useState("");

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

  const handleArchive = async () => {
    try {
      const res = await api.patch(`/tasks/${task._id}/archive`, {
        archive: !task.isArchived,
      });
      onUpdate(res.data.task);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    try {
      setInviting(true);
      setInviteError("");
      const res = await api.post(`/tasks/${task._id}/invite`, { email: inviteEmail });
      onUpdate(res.data.task);
      setInviteEmail("");
      setShowInvite(false);
    } catch (err) {
      setInviteError(err.response?.data?.message || "Failed to invite user");
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      const res = await api.delete(`/tasks/${task._id}/invite/${userId}`);
      onUpdate(res.data.task);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async () => {
    try {
      setEditError("");
      const res = await api.put(`/tasks/${task._id}`, editForm);
      onUpdate(res.data.task);
      setIsEditing(false);
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update task");
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : "",
    });
    setEditError("");
  };

  const p = priorityConfig[task.priority] || priorityConfig.Low;
  const isCompleted = task.status === "Completed";

  return (
    <div style={styles.card}>
      <style>{`
        .delete-btn:hover { color: #c0392b !important; }
        .status-btn:hover { opacity: 0.75; }
        .archive-btn:hover { opacity: 0.75; }
        .invite-toggle:hover { opacity: 0.75; }
        .edit-btn:hover { opacity: 0.75; }
        .save-btn:hover { background: #333 !important; }
        .cancel-btn:hover { background: #f0ece8 !important; }
      `}</style>

      {isEditing ? (
        <div style={styles.editForm}>
          <h3 style={styles.editHeading}>Edit Task</h3>
          {editError && <p style={styles.editError}>{editError}</p>}
          
          <div style={styles.editRow}>
            <div style={{ flex: 2 }}>
              <label style={styles.editLabel}>Title</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                style={styles.editInput}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.editLabel}>Priority</label>
              <select
                value={editForm.priority}
                onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                style={styles.editInput}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <div>
            <label style={styles.editLabel}>Description</label>
            <input
              type="text"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              style={styles.editInput}
            />
          </div>

          <div>
            <label style={styles.editLabel}>Due Date</label>
            <input
              type="date"
              value={editForm.dueDate}
              onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
              style={styles.editInput}
            />
          </div>

          <div style={styles.editActions}>
            <button className="save-btn" onClick={handleEdit} style={styles.saveBtn}>Save Changes</button>
            <button className="cancel-btn" onClick={cancelEdit} style={styles.cancelEditBtn}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div style={styles.cardTop}>
            <div style={styles.cardMain}>
              <h3 style={{ ...styles.title, textDecoration: isCompleted ? "line-through" : "none", color: isCompleted ? "#9e9389" : "#1a1a1a" }}>
                {task.title}
              </h3>
              {task.description && (
                <p style={styles.description}>{task.description}</p>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              {isCreator && (
                <button className="edit-btn" onClick={() => setIsEditing(true)} style={styles.editBtn} title="Edit task">
                  ✎
                </button>
              )}
              {isCreator && (
                <button className="archive-btn" onClick={handleArchive} style={styles.archiveBtn} title={task.isArchived ? "Unarchive" : "Archive"}>
                  {task.isArchived ? "📂" : "📁"}
                </button>
              )}
              {isCreator && (
                <button className="delete-btn" onClick={handleDelete} style={styles.deleteBtn}>
                  ✕
                </button>
              )}
            </div>
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

          {!isCreator && (
            <span style={{ ...styles.badge, color: "#4338ca", background: "#eef2ff", border: "1px solid #c7d2fe" }}>
              Invited
            </span>
          )}
        </div>

        {task.dueDate && (
          <span style={styles.dueDate}>
            Due {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        )}
      </div>

      {/* Invited Users Section */}
      {isCreator && task.invitedUsers && task.invitedUsers.length > 0 && (
        <div style={styles.invitedSection}>
          <p style={styles.invitedLabel}>Collaborators:</p>
          <div style={styles.invitedList}>
            {task.invitedUsers.map((u) => (
              <span key={u._id} style={styles.invitedChip}>
                {u.name || u.email}
                <button
                  onClick={() => handleRemoveUser(u._id)}
                  style={styles.removeChipBtn}
                  title="Remove user"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Creator info for invited users */}
      {!isCreator && task.user && (
        <div style={styles.invitedSection}>
          <p style={styles.invitedLabel}>Created by: {task.user.name || task.user.email}</p>
        </div>
      )}

      {/* Invite Button */}
      {isCreator && (
        <div style={styles.inviteSection}>
          {!showInvite ? (
            <button className="invite-toggle" onClick={() => setShowInvite(true)} style={styles.inviteToggleBtn}>
              + Invite User
            </button>
          ) : (
            <div style={styles.inviteRow}>
              <input
                type="email"
                placeholder="Enter user email..."
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                style={styles.inviteInput}
              />
              <button onClick={handleInvite} disabled={inviting} style={styles.inviteSendBtn}>
                {inviting ? "..." : "Invite"}
              </button>
              <button onClick={() => { setShowInvite(false); setInviteError(""); }} style={styles.inviteCancelBtn}>
                Cancel
              </button>
            </div>
          )}
          {inviteError && <p style={styles.inviteError}>{inviteError}</p>}
        </div>
      )}
        </>
      )}
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
  archiveBtn: {
    background: "none",
    border: "none",
    fontSize: 14,
    cursor: "pointer",
    padding: "2px 4px",
    transition: "opacity 0.2s",
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
  invitedSection: {
    marginTop: 12,
    paddingTop: 10,
    borderTop: "1px solid #f0ece8",
  },
  invitedLabel: {
    fontSize: 10,
    fontWeight: 500,
    color: "#7a7068",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  invitedList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },
  invitedChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 11,
    fontWeight: 400,
    padding: "3px 10px",
    borderRadius: 20,
    background: "#eef2ff",
    color: "#4338ca",
    border: "1px solid #c7d2fe",
    fontFamily: "'DM Sans', sans-serif",
  },
  removeChipBtn: {
    background: "none",
    border: "none",
    color: "#4338ca",
    fontSize: 14,
    cursor: "pointer",
    padding: 0,
    lineHeight: 1,
    fontWeight: 700,
  },
  inviteSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: "1px solid #f0ece8",
  },
  inviteToggleBtn: {
    background: "none",
    border: "1px dashed #c8c0b8",
    color: "#7a7068",
    fontSize: 11,
    fontWeight: 500,
    padding: "5px 14px",
    borderRadius: 3,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.04em",
    transition: "opacity 0.2s",
  },
  inviteRow: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  inviteInput: {
    flex: 1,
    border: "1px solid #ddd",
    borderRadius: 3,
    padding: "7px 10px",
    fontSize: 12,
    color: "#1a1a1a",
    background: "#fafafa",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 300,
  },
  inviteSendBtn: {
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: 3,
    padding: "7px 14px",
    fontSize: 11,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  inviteCancelBtn: {
    background: "none",
    border: "1px solid #ddd",
    color: "#7a7068",
    borderRadius: 3,
    padding: "7px 12px",
    fontSize: 11,
    fontWeight: 400,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  inviteError: {
    fontSize: 11,
    color: "#c0392b",
    marginTop: 6,
    fontWeight: 400,
  },
  editBtn: {
    background: "none",
    border: "none",
    color: "#7a7068",
    fontSize: 14,
    cursor: "pointer",
    padding: "2px 4px",
    transition: "opacity 0.2s",
    flexShrink: 0,
  },
  editForm: {
    padding: "4px 0",
  },
  editHeading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 18,
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: 14,
  },
  editError: {
    fontSize: 11,
    color: "#c0392b",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    padding: "6px 10px",
    borderRadius: 3,
    marginBottom: 12,
  },
  editRow: {
    display: "flex",
    gap: 10,
    marginBottom: 12,
  },
  editLabel: {
    display: "block",
    fontSize: 10,
    fontWeight: 500,
    color: "#7a7068",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  editInput: {
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: 3,
    padding: "8px 10px",
    fontSize: 12,
    color: "#1a1a1a",
    background: "#fafafa",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 300,
  },
  editActions: {
    display: "flex",
    gap: 8,
    marginTop: 14,
  },
  saveBtn: {
    flex: 1,
    padding: "9px",
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: 3,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "background 0.2s",
  },
  cancelEditBtn: {
    flex: 1,
    padding: "9px",
    background: "#fff",
    color: "#7a7068",
    border: "1px solid #ddd",
    borderRadius: 3,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "background 0.2s",
  },
};

export default TaskCard;