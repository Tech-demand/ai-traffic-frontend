function StatCard({ label, value, icon, colorClass, sub, accentColor }) {
  return (
    <div
      className="stat-card"
      style={{ "--card-accent": accentColor }}
    >
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-icon">{icon}</span>
      </div>
      <div className={`stat-card-value ${colorClass}`}>{value}</div>
      {sub && <div className="stat-card-sub">{sub}</div>}
    </div>
  );
}

export default StatCard;