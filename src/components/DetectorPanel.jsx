const MAX_VEHICLES = 20; // Adjust based on your road capacity

function DetectorRow({ label, value, type }) {
  const pct = Math.min((value / MAX_VEHICLES) * 100, 100);

  return (
    <div className="detector-row">
      <span className="detector-label">{label}</span>
      <div className="detector-bar-wrap">
        <div
          className={`detector-bar-fill ${type}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`detector-value ${type}`}>{value}</span>
    </div>
  );
}

function DetectorPanel({ title, subtitle, icon, type, lanes }) {
  const total = lanes.reduce((sum, l) => sum + l.value, 0);

  return (
    <div className="detector-panel">
      <div className="detector-panel-header">
        <div className={`detector-panel-icon ${type}`}>{icon}</div>
        <div>
          <div className="detector-panel-title">{title}</div>
          <div className="detector-panel-subtitle">
            {subtitle} · Total: {total} vehicles
          </div>
        </div>
      </div>

      <div className="detector-rows">
        {lanes.map((lane) => (
          <DetectorRow
            key={lane.label}
            label={lane.label}
            value={lane.value}
            type={type}
          />
        ))}
      </div>
    </div>
  );
}

export default DetectorPanel;