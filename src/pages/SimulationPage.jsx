import { useEffect, useState, useRef } from "react";
import { getLogs, getLiveData } from "../services/api";

const PHASE_LABELS = {
  0: "E–W Green",
  1: "E–W Yellow",
  2: "N–S Green",
  3: "N–S Yellow",
};

function SimBadge({ phase }) {
  const colors = {
    0: "var(--accent-green)",
    1: "var(--accent-amber)",
    2: "var(--accent-green)",
    3: "var(--accent-amber)",
  };
  const color = colors[phase] ?? "var(--accent-cyan)";
  return (
    <span style={{
      background: `${color}18`,
      border: `1px solid ${color}55`,
      borderRadius: "100px",
      padding: "2px 9px",
      fontSize: "0.68rem",
      color,
      fontWeight: 600,
      fontFamily: "var(--font-mono)",
      letterSpacing: "0.05em",
    }}>
      {PHASE_LABELS[phase] ?? `Phase ${phase}`}
    </span>
  );
}

function SimulationPage() {
  const [logs, setLogs]         = useState([]);
  const [live, setLive]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const logEndRef   = useRef(null);
  const intervalRef = useRef(null);

  const fetchAll = async () => {
    try {
      const [logData, liveData] = await Promise.all([
        getLogs(),
        getLiveData(),
      ]);

      // Only update if valid data
      if (Array.isArray(logData)) setLogs(logData);
      if (liveData && !liveData.status) setLive(liveData);

    } catch (err) {
      console.error("Simulation fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    intervalRef.current = setInterval(fetchAll, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Auto scroll
  useEffect(() => {
    if (autoScroll && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <span className="loading-text">Connecting to simulation...</span>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Simulation</h1>
          <p>Live SUMO + TraCI feed · traci6_QL.py · Node2 intersection</p>
        </div>
        {live && (
          <div className="live-badge" style={{ alignSelf: "center" }}>
            <span className="live-dot" />
            Step #{live.step}
          </div>
        )}
      </div>

      {/* Live Stat Cards */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card" style={{ "--card-accent": "var(--accent-cyan)" }}>
          <div className="stat-card-header">
            <span className="stat-card-label">Current Step</span>
            <span className="stat-card-icon">🔢</span>
          </div>
          <div className="stat-card-value cyan mono">{live?.step ?? "—"}</div>
          <div className="stat-card-sub">Simulation tick</div>
        </div>

        <div className="stat-card" style={{ "--card-accent": "var(--accent-green)" }}>
          <div className="stat-card-header">
            <span className="stat-card-label">Signal Phase</span>
            <span className="stat-card-icon">🚦</span>
          </div>
          <div className="stat-card-value green mono">{live?.phase ?? "—"}</div>
          <div className="stat-card-sub">{live ? (PHASE_LABELS[live.phase] ?? "Unknown") : "Waiting..."}</div>
        </div>

        <div className="stat-card" style={{ "--card-accent": "var(--accent-amber)" }}>
          <div className="stat-card-header">
            <span className="stat-card-label">Step Reward</span>
            <span className="stat-card-icon">🎯</span>
          </div>
          <div className="stat-card-value amber mono">{live?.reward ?? "—"}</div>
          <div className="stat-card-sub">Current RL reward</div>
        </div>

        <div className="stat-card" style={{ "--card-accent": "var(--accent-cyan)" }}>
          <div className="stat-card-header">
            <span className="stat-card-label">Total Queue</span>
            <span className="stat-card-icon">🚗</span>
          </div>
          <div className="stat-card-value cyan mono">
            {live
              ? live.EB0 + live.EB1 + live.EB2 + live.SB0 + live.SB1 + live.SB2
              : "—"}
          </div>
          <div className="stat-card-sub">All 6 detectors</div>
        </div>
      </div>

      {/* Info Box */}
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "16px 20px",
        marginBottom: 20,
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
      }}>
        <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>📁</span>
        <div>
          <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
            traci6_QL.py — Q-Learning Simulation
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            Simulation runs as a separate Python process using SUMO + TraCI.
            Each step: state → action → reward → Q-table update → database insert.
            Yahan live data database se aa raha hai har 1 second mein.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {[
              ["TOTAL_STEPS", "10,000"],
              ["ALPHA (α)", "0.1"],
              ["GAMMA (γ)", "0.9"],
              ["EPSILON (ε)", "0.1"],
              ["MIN_GREEN", "100 steps"],
            ].map(([k, v]) => (
              <span key={k} style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "3px 10px",
                fontSize: "0.68rem",
                fontFamily: "var(--font-mono)",
                color: "var(--text-secondary)",
              }}>
                <span style={{ color: "var(--accent-cyan)" }}>{k}</span>: {v}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Live Log */}
      <div className="detector-panel" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "0.9rem" }}>📋</span>
            <div>
              <div className="detector-panel-title">Live Step Log</div>
              <div className="detector-panel-subtitle">
                Last {logs.length} steps · updates every 1s
              </div>
            </div>
          </div>
          <button
            onClick={() => setAutoScroll(v => !v)}
            style={{
              background: autoScroll ? "var(--accent-cyan-dim)" : "var(--bg-card)",
              border: `1px solid ${autoScroll ? "var(--border-accent)" : "var(--border)"}`,
              borderRadius: "var(--radius-sm)",
              color: autoScroll ? "var(--accent-cyan)" : "var(--text-muted)",
              fontSize: "0.72rem",
              fontFamily: "var(--font-mono)",
              padding: "5px 12px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {autoScroll ? "⬇ Auto-scroll ON" : "⬇ Auto-scroll OFF"}
          </button>
        </div>

        {/* Column Headers */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr 120px 100px 110px",
          padding: "8px 20px",
          borderBottom: "1px solid var(--border)",
          gap: 8,
        }}>
          {["STEP", "SIGNAL PHASE", "TOTAL QUEUE", "REWARD", "STATUS"].map(h => (
            <span key={h} style={{
              fontSize: "0.62rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontFamily: "var(--font-mono)",
            }}>{h}</span>
          ))}
        </div>

        {/* Log Rows */}
        <div style={{ maxHeight: 400, overflowY: "auto", padding: "4px 0" }}>
          {logs.length === 0 ? (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.82rem" }}>
              No simulation data yet — start traci6_QL.py first
            </div>
          ) : (
            logs.map((row, i) => {
              const isLatest = i === logs.length - 1;
              return (
                <div
                  key={`${row.step}-${i}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr 120px 100px 110px",
                    padding: "8px 20px",
                    gap: 8,
                    alignItems: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.02)",
                    background: isLatest ? "var(--accent-cyan-dim)" : "transparent",
                  }}
                  onMouseEnter={e => { if (!isLatest) e.currentTarget.style.background = "var(--bg-card-hover)"; }}
                  onMouseLeave={e => { if (!isLatest) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.78rem",
                    color: isLatest ? "var(--accent-cyan)" : "var(--text-secondary)",
                    fontWeight: isLatest ? 600 : 400,
                  }}>
                    #{row.step}
                  </span>
                  <SimBadge phase={row.phase} />
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.78rem",
                    color: row.total_queue > 10 ? "var(--accent-red)" : "var(--text-secondary)",
                  }}>
                    {row.total_queue} vehicles
                  </span>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.78rem",
                    color: row.reward >= -5 ? "var(--accent-green)" : "var(--accent-amber)",
                  }}>
                    {row.reward}
                  </span>
                  <span style={{
                    fontSize: "0.68rem",
                    color: isLatest ? "var(--accent-cyan)" : "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                    fontWeight: isLatest ? 600 : 400,
                  }}>
                    {isLatest ? "● CURRENT" : "✓ done"}
                  </span>
                </div>
              );
            })
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
}

export default SimulationPage;