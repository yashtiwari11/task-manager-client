import { useEffect, useState } from "react";
import api from "../api/axios";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [tab, setTab] = useState("active"); // "active" or "archived"
  const [currentUserId, setCurrentUserId] = useState(null);

  // Decode user ID from JWT token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload.id);
      } catch (e) {
        console.log("Failed to decode token");
      }
    }
  }, []);

  const fetchTasks = async (currentPage = 1) => {
    try {
      setLoading(true);
      setError("");

      let url;
      if (tab === "archived") {
        url = `/tasks/archived?page=${currentPage}&limit=5`;
      } else {
        url = `/tasks?page=${currentPage}&limit=5&status=${status}&priority=${priority}&search=${search}`;
      }

      const res = await api.get(url);
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
      setPage(currentPage);
    } catch (err) {
      setError("Failed to load tasks");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(1);
  }, [tab]);

  const handleTaskCreated = (newTask) => {
    if (tab === "active") {
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const handleDelete = (id) => setTasks((prev) => prev.filter((t) => t._id !== id));

  const handleUpdate = (updatedTask) => {
    // If task was archived/unarchived, remove from current view
    if (tab === "active" && updatedTask.isArchived) {
      setTasks((prev) => prev.filter((t) => t._id !== updatedTask._id));
      return;
    }
    if (tab === "archived" && !updatedTask.isArchived) {
      setTasks((prev) => prev.filter((t) => t._id !== updatedTask._id));
      return;
    }
    setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
  };

  const getCreatorId = (task) => {
    if (task.user && typeof task.user === "object") return task.user._id;
    return task.user;
  };

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        input, select { outline: none; font-family: 'DM Sans', sans-serif; }
        input::placeholder { color: #b5aea7; }
        .logout-btn:hover { background: #111 !important; }
        .apply-btn:hover { background: #333 !important; }
        .page-btn:hover { background: #f0ece8 !important; }
        .tab-btn:hover { background: #f0ece8 !important; }
      `}</style>

      <div style={styles.inner}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <p style={styles.headerEyebrow}>Dashboard</p>
            <h1 style={styles.heading}>Your Tasks</h1>
          </div>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            style={styles.logoutBtn}
          >
            Logout
          </button>
        </div>

        {/* Tabs: Active / Archived */}
        <div style={styles.tabBar}>
          <button
            className="tab-btn"
            onClick={() => setTab("active")}
            style={{
              ...styles.tabBtn,
              background: tab === "active" ? "#1a1a1a" : "#fff",
              color: tab === "active" ? "#fff" : "#1a1a1a",
            }}
          >
            Active Tasks
          </button>
          <button
            className="tab-btn"
            onClick={() => setTab("archived")}
            style={{
              ...styles.tabBtn,
              background: tab === "archived" ? "#1a1a1a" : "#fff",
              color: tab === "archived" ? "#fff" : "#1a1a1a",
            }}
          >
            Archived Tasks
          </button>
        </div>

        {/* Search + Filter (only for active tab) */}
        {tab === "active" && (
          <div style={styles.filterBar}>
            <input
              type="text"
              placeholder="Search tasks..."
              style={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select style={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>

            <select style={styles.select} value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <button className="apply-btn" onClick={() => fetchTasks(1)} style={styles.applyBtn}>
              Apply
            </button>
          </div>
        )}

        {/* Create Task (only for active tab) */}
        {tab === "active" && <TaskForm onTaskCreated={handleTaskCreated} />}

        {/* States */}
        {loading && <p style={styles.stateText}>Loading tasks...</p>}
        {error && <p style={{ ...styles.stateText, color: "#c0392b" }}>{error}</p>}

        {/* Task List */}
        {!loading && tasks.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>✦</p>
            <p style={styles.emptyText}>
              {tab === "archived" ? "No archived tasks" : "No tasks found"}
            </p>
          </div>
        ) : (
          <div>
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                isCreator={currentUserId === getCreatorId(task)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className="page-btn"
                onClick={() => fetchTasks(i + 1)}
                style={{
                  ...styles.pageBtn,
                  background: page === i + 1 ? "#1a1a1a" : "#fff",
                  color: page === i + 1 ? "#fff" : "#1a1a1a",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#f7f5f2",
    fontFamily: "'DM Sans', sans-serif",
    padding: "40px 20px",
  },
  inner: {
    maxWidth: 720,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 24,
    paddingBottom: 24,
    borderBottom: "1px solid #e8e4df",
  },
  headerEyebrow: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#9e9389",
    marginBottom: 4,
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 34,
    fontWeight: 600,
    color: "#1a1a1a",
    letterSpacing: "-0.02em",
  },
  logoutBtn: {
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: 3,
    padding: "8px 18px",
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: "0.04em",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "background 0.2s",
  },
  tabBar: {
    display: "flex",
    gap: 8,
    marginBottom: 24,
  },
  tabBtn: {
    border: "1px solid #ddd",
    borderRadius: 3,
    padding: "8px 18px",
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: "0.04em",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "background 0.15s, color 0.15s",
  },
  filterBar: {
    display: "flex",
    gap: 10,
    marginBottom: 28,
    flexWrap: "wrap",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    minWidth: 180,
    border: "1px solid #ddd",
    borderRadius: 3,
    padding: "9px 14px",
    fontSize: 13,
    color: "#1a1a1a",
    background: "#fff",
    fontWeight: 300,
  },
  select: {
    border: "1px solid #ddd",
    borderRadius: 3,
    padding: "9px 12px",
    fontSize: 13,
    color: "#1a1a1a",
    background: "#fff",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 300,
  },
  applyBtn: {
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: 3,
    padding: "9px 20px",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "background 0.2s",
  },
  stateText: {
    fontSize: 13,
    color: "#9e9389",
    fontWeight: 300,
    marginBottom: 16,
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 0",
    borderTop: "1px solid #e8e4df",
  },
  emptyIcon: {
    fontSize: 20,
    color: "#c8c0b8",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#9e9389",
    fontWeight: 300,
  },
  pagination: {
    display: "flex",
    gap: 6,
    marginTop: 32,
    paddingTop: 24,
    borderTop: "1px solid #e8e4df",
  },
  pageBtn: {
    width: 34,
    height: 34,
    border: "1px solid #ddd",
    borderRadius: 3,
    fontSize: 13,
    fontWeight: 400,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "background 0.15s",
  },
};

export default Dashboard;