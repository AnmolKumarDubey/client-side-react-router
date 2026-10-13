import React from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  ChevronRight,
  Compass,
  Home,
  LayoutDashboard,
  Search,
  Settings,
  Users,
} from "lucide-react";
import "./styles.css";

const projects = [
  {
    id: "atlas",
    name: "Atlas Launch",
    owner: "Mira Patel",
    status: "Planning",
    accent: "#0f9f8f",
    summary: "Client onboarding, route map, and launch checklist.",
  },
  {
    id: "northstar",
    name: "Northstar CRM",
    owner: "Theo Martin",
    status: "In review",
    accent: "#5576d1",
    summary: "Account dashboards and customer activity timelines.",
  },
  {
    id: "pulse",
    name: "Pulse Analytics",
    owner: "Ana Gomez",
    status: "Live",
    accent: "#c36a2d",
    summary: "Metrics hub with weekly reporting and alerts.",
  },
];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function AppLayout() {
  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/projects", label: "Projects", icon: Compass },
    { to: "/calendar", label: "Calendar", icon: CalendarDays },
    { to: "/reports", label: "Reports", icon: BarChart3 },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/dashboard" className="brand" aria-label="Go to dashboard">
          <span className="brand-mark">R</span>
          <span>
            <strong>RouteDesk</strong>
            <small>Client workspace</small>
          </span>
        </Link>

        <nav className="nav-list" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
              >
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <main className="content">
        <TopBar />
        <Outlet />
      </main>
    </div>
  );
}

function TopBar() {
  const location = useLocation();
  const current = location.pathname.split("/").filter(Boolean).at(0) ?? "dashboard";

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Client-side route</p>
        <h1>{titleCase(current)}</h1>
      </div>
      <label className="search">
        <Search size={18} aria-hidden="true" />
        <input type="search" placeholder="Search workspace" />
      </label>
    </header>
  );
}

function Dashboard() {
  return (
    <section className="page-grid">
      <article className="overview-panel">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Routing keeps the shell stable while the page content changes.</h2>
          <p>
            The sidebar, top bar, and search remain mounted as navigation moves
            between pages. Each route renders its own view in the main workspace.
          </p>
        </div>
        <div className="route-map" aria-label="Routing flow illustration">
          <span>/dashboard</span>
          <ChevronRight size={18} />
          <span>/projects</span>
          <ChevronRight size={18} />
          <span>/projects/:projectId</span>
        </div>
      </article>

      <section className="metrics">
        <Metric label="Active routes" value="7" />
        <Metric label="Open projects" value="3" />
        <Metric label="Fallback route" value="404" />
      </section>

      <section className="wide-list">
        <div className="section-heading">
          <h2>Recent projects</h2>
          <Link to="/projects">View all</Link>
        </div>
        <ProjectRows compact />
      </section>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Projects() {
  return (
    <section className="stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Projects</p>
          <h2>Choose a project to open a dynamic route.</h2>
        </div>
      </div>
      <ProjectRows />
    </section>
  );
}

function ProjectRows({ compact = false }) {
  return (
    <div className={compact ? "project-list compact" : "project-list"}>
      {projects.map((project) => (
        <Link
          key={project.id}
          to={`/projects/${project.id}`}
          className="project-row"
          style={{ "--accent": project.accent }}
        >
          <span className="project-avatar">{project.name.charAt(0)}</span>
          <span className="project-copy">
            <strong>{project.name}</strong>
            <small>{project.summary}</small>
          </span>
          <span className="project-meta">
            {!compact && <small>{project.owner}</small>}
            <em>{project.status}</em>
          </span>
          <ChevronRight size={18} aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}

function ProjectDetail() {
  const { projectId } = useParams();
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return <NotFound />;
  }

  return (
    <section className="stack">
      <Link to="/projects" className="back-link">
        <ArrowLeft size={18} aria-hidden="true" />
        Back to projects
      </Link>
      <article className="detail-panel" style={{ "--accent": project.accent }}>
        <div className="project-avatar large">{project.name.charAt(0)}</div>
        <div>
          <p className="eyebrow">Dynamic route: /projects/{project.id}</p>
          <h2>{project.name}</h2>
          <p>{project.summary}</p>
        </div>
      </article>
      <div className="detail-grid">
        <InfoBlock label="Owner" value={project.owner} />
        <InfoBlock label="Status" value={project.status} />
        <InfoBlock label="Next action" value="Review route-specific data" />
      </div>
    </section>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div className="info-block">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Calendar() {
  return (
    <section className="stack">
      <p className="eyebrow">Calendar</p>
      <h2>Schedule route</h2>
      <div className="timeline">
        {["Discovery call", "Design review", "Release check"].map((item, index) => (
          <div className="timeline-item" key={item}>
            <span>{index + 1}</span>
            <strong>{item}</strong>
            <small>{index === 0 ? "Today" : `Day ${index + 2}`}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function Reports() {
  return (
    <section className="stack">
      <p className="eyebrow">Reports</p>
      <h2>Analytics route</h2>
      <div className="report-bars" aria-label="Report preview chart">
        {[72, 48, 88, 63, 54].map((height, index) => (
          <span key={index} style={{ height: `${height}%` }} />
        ))}
      </div>
    </section>
  );
}

function SettingsPage() {
  return (
    <section className="settings-grid">
      <InfoBlock label="Router" value="BrowserRouter" />
      <InfoBlock label="Navigation" value="NavLink active states" />
      <InfoBlock label="Dynamic params" value="useParams" />
      <InfoBlock label="Fallback" value="Wildcard route" />
    </section>
  );
}

function NotFound() {
  return (
    <section className="empty-state">
      <Home size={30} aria-hidden="true" />
      <h2>Route not found</h2>
      <p>This URL is handled by the wildcard client-side route.</p>
      <Link to="/dashboard">Return to dashboard</Link>
    </section>
  );
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
