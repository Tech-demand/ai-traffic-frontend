function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <span className="footer-logo">🚦</span>
          <div>
            <div className="footer-project-name">AI Traffic Management System</div>
            <div className="footer-subtitle">Q-Learning · SUMO · TraCI · Flask · React</div>
          </div>
        </div>

        <div className="footer-center">
          <div className="footer-copy">
            © {year} <span className="footer-name">Rahul Sharma</span>
          </div>
          <div className="footer-rights">All Rights Reserved</div>
        </div>

        <div className="footer-right">
          <div className="footer-badge">
            <span className="footer-badge-dot" />
            Reinforcement Learning
          </div>
          <div className="footer-badge">
            <span className="footer-badge-dot footer-badge-dot--amber" />
            Real-Time Simulation
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;