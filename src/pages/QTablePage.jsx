import { useEffect, useState } from "react";
import { getQTable } from "../services/api";

function QTablePage() {
  const [table, setTable]   = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getQTable();
        setTable(data);
      } catch (err) {
        console.error("QTable fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  const filtered = table.filter(row =>
    row.state.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <span className="loading-text">Loading Q-Table...</span>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Q-Table</h1>
          <p>All visited states and their learned Q-values · {table.length} states</p>
        </div>
      </div>

      {/* Summary */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card" style={{ "--card-accent": "var(--accent-cyan)" }}>
          <div className="stat-card-header">
            <span className="stat-card-label">Total States</span>
            <span className="stat-card-icon">🧠</span>
          </div>
          <div className="stat-card-value cyan mono">{table.length}</div>
          <div className="stat-card-sub">Unique visited states</div>
        </div>
        <div className="stat-card" style={{ "--card-accent": "var(--accent-green)" }}>
          <div className="stat-card-header">
            <span className="stat-card-label">Actions</span>
            <span className="stat-card-icon">⚡</span>
          </div>
          <div className="stat-card-value green mono">2</div>
          <div className="stat-card-sub">Keep Phase · Switch Phase</div>
        </div>
        <div className="stat-card" style={{ "--card-accent": "var(--accent-amber)" }}>
          <div className="stat-card-header">
            <span className="stat-card-label">Algorithm</span>
            <span className="stat-card-icon">📐</span>
          </div>
          <div className="stat-card-value" style={{ fontSize: "1.1rem", color: "var(--accent-amber)", fontFamily: "var(--font-mono)", marginBottom: 6 }}>Q-Learning</div>
          <div className="stat-card-sub">α=0.1 · γ=0.9 · ε=0.1</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Filter by state..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            padding: "9px 14px",
            width: "100%",
            maxWidth: 400,
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = "var(--accent-cyan)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
        />
      </div>

      {/* Table */}
      <div className="detector-panel" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "60vh" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "var(--font-mono)",
            fontSize: "0.78rem",
          }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["#", "State (EB0, EB1, EB2, SB0, SB1, SB2, Phase)", "Q(Keep Phase)", "Q(Switch Phase)", "Best Action"].map(h => (
                  <th key={h} style={{
                    padding: "12px 16px",
                    position: "sticky",
                    top: 0,
                    background: "var(--bg-card)",
                    zIndex: 1,
                    textAlign: "left",
                    color: "var(--text-muted)",
                    fontWeight: 600,
                    fontSize: "0.68rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted)" }}>
                    {table.length === 0
                      ? "Q-table is empty — run simulation first"
                      : "No states match filter"}
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => {
                  const best = row.action_0 >= row.action_1 ? "Keep Phase" : "Switch Phase";
                  const bestColor = best === "Keep Phase" ? "var(--accent-cyan)" : "var(--accent-amber)";
                  return (
                    <tr
                      key={row.state}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        transition: "background 0.15s",
                        cursor: "default",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card-hover)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "10px 16px", color: "var(--text-muted)" }}>{i + 1}</td>
                      <td style={{ padding: "10px 16px", color: "var(--accent-cyan)" }}>{row.state}</td>
                      <td style={{ padding: "10px 16px", color: "var(--text-secondary)" }}>{row.action_0}</td>
                      <td style={{ padding: "10px 16px", color: "var(--text-secondary)" }}>{row.action_1}</td>
                      <td style={{ padding: "10px 16px" }}>
                        <span style={{
                          background: best === "Keep Phase" ? "var(--accent-cyan-dim)" : "var(--accent-amber-dim)",
                          border: `1px solid ${bestColor}`,
                          borderRadius: "100px",
                          padding: "2px 10px",
                          fontSize: "0.68rem",
                          color: bestColor,
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                        }}>{best}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default QTablePage;