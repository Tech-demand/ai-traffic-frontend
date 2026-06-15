function Navbar({ data }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-hero">
          <div className="topbar-title-wrap">
            <span className="topbar-title-main">
              {"AI Traffic Management System".split("").map((ch, i) => (
                <span
                  key={i}
                  className="title-char"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </span>
            <span className="topbar-subtitle">
              Real-Time Q-Learning Controller · Node2
            </span>
          </div>
        </div>
      </div>

      <div className="topbar-right">
        {data && (
          <span className="topbar-step">
            Step <span>#{data.step}</span>
          </span>
        )}
        <div className="live-badge">
          <span className="live-dot" />
          Live
        </div>
      </div>
    </header>
  );
}

export default Navbar;