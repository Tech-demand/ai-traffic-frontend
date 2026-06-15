import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const navItems = [
    { icon: "⬛", label: "Dashboard",  path: "/" },
    { icon: "📈", label: "Analytics",  path: "/analytics" },
    { icon: "🧠", label: "Q-Table",    path: "/qtable" },
    { icon: "🔁", label: "Simulation", path: "/simulation" },
    { icon: "📖", label: "Learn",      path: "/learn" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <div className="logo-icon">🚦</div>
          <div className="logo-text">
            <span className="logo-name">AI-Traffic</span>
            <span className="logo-tagline">RL Controller</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Navigation</span>
        {navItems.map((item) => (
          <div
            key={item.label}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-item-icon">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-footer-text">
          <strong>Model:</strong> Q-Learning<br />
          <strong>α</strong> 0.1 · <strong>γ</strong> 0.9 · <strong>ε</strong> 0.1
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;