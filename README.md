# Task Manager Client

Frontend application for Taskly - a modern task management system built with React, Vite, and an elegant design system.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios
- **Styling**: Inline styles with custom design system
- **Fonts**: DM Sans & Cormorant Garamond (Google Fonts)

## Features

### Authentication
- **Login & Signup** pages with elegant, minimal design
- JWT token-based authentication
- Protected routes that redirect to login if not authenticated
- Token stored in localStorage
- Auto-attach token to all API requests via Axios interceptor

### Task Management
- **Create Tasks** with validation
  - Title, description, priority, and due date (all required)
  - Frontend validation with error messages
  - Priority levels: Low, Medium, High
- **View Tasks** with beautiful card-based layout
- **Edit Tasks** inline (only for task creators)
- **Delete Tasks** (only for task creators)
- **Toggle Status** between Pending and Completed
- Visual priority badges with color coding
- Strike-through styling for completed tasks

### Archive Feature
- **Active/Archived Tabs** for organizing tasks
- Archive and unarchive tasks (creator only)
- Archive button with folder icon (📁/📂)
- Separate views maintain pagination

### Collaboration
- **Invite Users** to tasks via email
- Display collaborators as removable chips
- "Invited" badge for tasks shared with you
- Show task creator information on invited tasks
- Remove collaborators (creator only)
- Access control enforced on UI level

### Filtering & Search
- **Search** tasks by title
- **Filter** by status (Pending/Completed)
- **Filter** by priority (Low/Medium/High)
- Apply filters button to trigger search
- Filters only available on Active tasks tab

### Pagination
- Server-side pagination (5 tasks per page)
- Page navigation buttons
- Visual indicator for current page
- Works on both active and archived views

## Project Structure

```
src/
├── main.jsx                 # App entry point
├── App.jsx                  # Router configuration
├── index.css                # Global styles & Tailwind imports
├── api/
│   └── axios.js             # Axios instance with auth interceptor
├── components/
│   ├── Navbar.jsx           # Navigation component (placeholder)
│   ├── ProtectedRoute.jsx   # Auth guard for protected routes
│   ├── TaskCard.jsx         # Task display with inline edit
│   └── TaskForm.jsx         # Task creation form with validation
└── pages/
    ├── Login.jsx            # Login page
    ├── Signup.jsx           # Registration page
    └── Dashboard.jsx        # Main dashboard with tabs & filters
```

## Design System

The application uses a warm, editorial design aesthetic:

### Typography
- **Headings**: Cormorant Garamond (serif)
- **Body**: DM Sans (sans-serif)
- **Weights**: 300 (light), 400 (regular), 500 (medium), 600 (semibold)

### Colors
```css
Background: #f7f5f2 (warm beige)
Card Background: #fff
Primary Text: #1a1a1a (near black)
Secondary Text: #9e9389, #7a7068, #b5aea7 (warm grays)
Borders: #e8e4df, #ddd

Priority Colors:
- High: #7f1d1d (dark red) / #fef2f2 (light red bg)
- Medium: #78350f (dark amber) / #fffbeb (light amber bg)
- Low: #14532d (dark green) / #f0fdf4 (light green bg)

Status Colors:
- Completed: Green tones
- Pending: Amber tones
- Invited: Indigo (#4338ca / #eef2ff)

Error: #c0392b / #fef2f2 (background)
```

### Component Patterns
- Rounded corners: 3-6px
- Subtle borders: 1px solid
- Minimal shadows (primarily borders)
- Hover states with opacity/color transitions
- Uppercase labels with letter-spacing
- Consistent padding/spacing rhythm

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Running backend server (see task-manager-server README)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment (optional)**
   
   Create a `.env` file in the root:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
   
   If not set, defaults to `http://localhost:5000/api`

3. **Start development server**
   ```bash
   npm run dev
   ```
   
   The app will open at `http://localhost:5173`

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## Project Routes

| Route        | Component  | Protected | Description              |
|-------------|------------|-----------|--------------------------|
| `/`         | Login      | No        | Login page               |
| `/signup`   | Signup     | No        | Registration page        |
| `/dashboard`| Dashboard  | Yes       | Main task dashboard      |

## Component Usage

### TaskCard

Displays a single task with all actions:

```jsx
<TaskCard 
  task={taskObject}
  onDelete={handleDelete}
  onUpdate={handleUpdate}
  isCreator={currentUserId === task.user._id}
/>
```

**Props:**
- `task`: Task object from API
- `onDelete`: Callback when task is deleted
- `onUpdate`: Callback when task is updated
- `isCreator`: Boolean indicating if current user created the task

### TaskForm

Form for creating new tasks:

```jsx
<TaskForm onTaskCreated={handleTaskCreated} />
```

**Props:**
- `onTaskCreated`: Callback when task is successfully created

### ProtectedRoute

Wraps routes that require authentication:

```jsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## State Management

The app uses React's built-in state management:

- **Local state** (useState) for component-level data
- **localStorage** for JWT token persistence
- **Props** for parent-child communication
- **Callbacks** for child-parent updates

### Dashboard State

```javascript
const [tasks, setTasks] = useState([])           // Current tasks
const [page, setPage] = useState(1)              // Current page
const [totalPages, setTotalPages] = useState(1)  // Total pages
const [status, setStatus] = useState("")         // Status filter
const [priority, setPriority] = useState("")     // Priority filter
const [search, setSearch] = useState("")         // Search query
const [tab, setTab] = useState("active")         // active/archived
const [currentUserId, setCurrentUserId] = useState(null)
```

## API Integration

### Axios Configuration

Automatic token attachment via interceptor:

```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### API Calls

```javascript
// Create task
await api.post("/tasks", taskData)

// Get tasks (with filters)
await api.get(`/tasks?page=${page}&status=${status}`)

// Update task
await api.put(`/tasks/${id}`, updates)

// Delete task
await api.delete(`/tasks/${id}`)

// Archive task
await api.patch(`/tasks/${id}/archive`, { archive: true })

// Invite user
await api.post(`/tasks/${id}/invite`, { email })
```

## Key Features Implementation

### Access Control (Frontend)

```javascript
// Decode user ID from JWT
const token = localStorage.getItem("token");
const payload = JSON.parse(atob(token.split(".")[1]));
const currentUserId = payload.id;

// Check if creator
const isCreator = currentUserId === task.user._id;

// Conditionally render creator-only actions
{isCreator && <button onClick={handleDelete}>Delete</button>}
```

### Inline Task Editing

TaskCard has two modes:
1. **View mode**: Shows task details with action buttons
2. **Edit mode**: Shows inline form with Save/Cancel buttons

Toggle via `isEditing` state, only available to task creators.

### Tab Navigation

Dashboard switches between active and archived tasks:
- Changes API endpoint (`/tasks` vs `/tasks/archived`)
- Hides filters on archived tab
- Hides task creation form on archived tab
- Maintains separate pagination state

## Error Handling

- Form validation errors displayed inline
- API errors shown in styled error boxes
- Loading states prevent duplicate submissions
- Disabled buttons during async operations
- Console logging for debugging (can be removed in production)

## Browser Support

- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features used throughout
- No polyfills included

## Performance Optimizations

- Vite's fast HMR during development
- Code splitting via React Router
- Optimized production builds with Vite
- Minimal bundle size (no heavy UI libraries)

## Future Enhancements

Potential improvements:
- [ ] Real-time updates with WebSockets
- [ ] Drag-and-drop task reordering
- [ ] Task categories/tags
- [ ] File attachments
- [ ] Task comments/activity log
- [ ] Dark mode
- [ ] Mobile responsive improvements
- [ ] Offline support with service workers
- [ ] Batch operations (multi-select)

## Development Notes

### Styling Approach

The app uses inline styles instead of CSS modules or styled-components to:
- Keep components self-contained
- Avoid CSS naming conflicts
- Enable dynamic styling based on state
- Maintain consistency through shared style objects

### Font Loading

Google Fonts are loaded via `@import` in inline `<style>` tags to ensure fonts are available before render.

## License

ISC
