import { useEffect, useState } from "react";
import { getHistory } from "../services/api";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from "recharts";

const API = "http://127.0.0.1:5000";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-accent)",
        borderRadius: "var(--radius-sm)",
        padding: "10px 14px",
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem"
      }}>
        <p style={{ color: "var(--text-muted)", marginBottom: 6 }}>Step {label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color, marginBottom: 2 }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function Analytics() {
  const [history, setHistory]       = useState([]);
  const [forecast, setForecast]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [forecastLoading, setForecastLoading] = useState(true);

  // Fetch history
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (err) {
        console.error("History error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, []);

  // Fetch forecast
  useEffect(() => {
    const loadForecast = async () => {
      try {
        const res = await axios.get(`${API}/api/predict`);
        if (res.data.status === "ok") setForecast(res.data);
      } catch (err) {
        console.error("Forecast error:", err);
      } finally {
        setForecastLoading(false);
      }
    };
    loadForecast();
    const t = setInterval(loadForecast, 5000);
    return () => clearInterval(t);
  }, []);

  const chartData = history.map(row => ({
    step:       row.step,
    reward:     row.reward,
    totalQueue: row.EB0 + row.EB1 + row.EB2 + row.SB0 + row.SB1 + row.SB2,
    eb:         row.EB0 + row.EB1 + row.EB2,
    sb:         row.SB0 + row.SB1 + row.SB2,
  }));

  // Build forecast chart — actual + predicted side by side
  const forecastChart = forecast
    ? [
        ...forecast.actual.map((v, i) => ({
          index: `A${i + 1}`,
          actual: v,
          predicted: null,
        })),
        ...forecast.predicted.map((v, i) => ({
          index: `P${i + 1}`,
          actual: null,
          predicted: v,
        })),
      ]
    : [];

  const avgReward = history.length
    ? (history.reduce((s, r) => s + r.reward, 0) / history.length).toFixed(2)
    : 0;
  const minReward = history.length
    ? Math.min(...history.map(r => r.reward))
    : 0;
  const maxQueue = history.length
    ? Math.max(...history.map(r => r.EB0 + r.EB1 + r.EB2 + r.SB0 + r.SB1 + r.SB2))
    : 0;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <span className="loading-text">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Analytics</h1>
          <p>Reward & queue trends · Congestion forecast</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stat-grid" style={{ marginBottom: 28 }}>
        <div className="stat-card" style={{ "--card-accent": "var(--accent-amber)" }}>
          <div className="stat-card-header">
            <span className="stat-card-label">Avg Reward</span>
            <span className="stat-card-icon">📊</span>
          </div>
          <div className="stat-card-value amber mono">{avgReward}</div>
          <div className="stat-card-sub">Last {history.length} steps</div>
        </div>
        <div className="stat-card" style={{ "--card-accent": "var(--accent-red)" }}>
          <div className="stat-card-header">
            <span className="stat-card-label">Min Reward</span>
            <span className="stat-card-icon">📉</span>
          </div>
          <div className="stat-card-value red mono">{minReward}</div>
          <div className="stat-card-sub">Worst step</div>
        </div>
        <div className="stat-card" style={{ "--card-accent": "var(--accent-cyan)" }}>
          <div className="stat-card-header">
            <span className="stat-card-label">Peak Queue</span>
            <span className="stat-card-icon">🚗</span>
          </div>
          <div className="stat-card-value cyan mono">{maxQueue}</div>
          <div className="stat-card-sub">All lanes combined</div>
        </div>
        <div className="stat-card" style={{ "--card-accent": "var(--accent-green)" }}>
          <div className="stat-card-header">
            <span className="stat-card-label">Model Accuracy</span>
            <span className="stat-card-icon">🎯</span>
          </div>
          <div className="stat-card-value green mono">
            {forecast ? `${forecast.score}%` : "—"}
          </div>
          <div className="stat-card-sub">Forecast R² score</div>
        </div>
      </div>

      {/* ========================
          FORECAST SECTION
      ======================== */}
      <div className="detector-panel" style={{ marginBottom: 20 }}>
        <div className="detector-panel-header">
          <div className="detector-panel-icon eb">🔮</div>
          <div style={{ flex: 1 }}>
            <div className="detector-panel-title">Congestion Forecast — Next 10 Steps</div>
            <div className="detector-panel-subtitle">
              Linear Regression model trained on historical queue data
            </div>
          </div>
          {forecast && (
            <span style={{
              background: "var(--accent-green-dim)",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: "100px",
              padding: "3px 12px",
              fontSize: "0.68rem",
              color: "var(--accent-green)",
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              alignSelf: "center",
            }}>
              R² {forecast.score}%
            </span>
          )}
        </div>

        {forecastLoading ? (
          <div style={{ padding: "32px", textAlign: "center" }}>
            <div className="loading-spinner" style={{ margin: "0 auto 12px" }} />
            <span className="loading-text">Training forecast model...</span>
          </div>
        ) : !forecast ? (
          <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.82rem" }}>
            Need at least 20 simulation steps to train forecast model
          </div>
        ) : (
          <>
            {/* Predicted values pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16, padding: "0 2px" }}>
              {forecast.predicted.map((v, i) => (
                <div key={i} style={{
                  background: v > 8 ? "var(--accent-red-dim)" : v > 4 ? "var(--accent-amber-dim)" : "var(--accent-green-dim)",
                  border: `1px solid ${v > 8 ? "rgba(239,68,68,0.3)" : v > 4 ? "rgba(245,158,11,0.3)" : "rgba(16,185,129,0.3)"}`,
                  borderRadius: "var(--radius-sm)",
                  padding: "6px 10px",
                  textAlign: "center",
                  minWidth: 52,
                }}>
                  <div style={{
                    fontSize: "0.62rem",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                    marginBottom: 2,
                  }}>+{i + 1}</div>
                  <div style={{
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    fontFamily: "var(--font-mono)",
                    color: v > 8 ? "var(--accent-red)" : v > 4 ? "var(--accent-amber)" : "var(--accent-green)",
                  }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Forecast Chart */}
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={forecastChart} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="index"
                  tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-mono)" }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-mono)" }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine x="P1" stroke="var(--border-accent)" strokeDasharray="4 2" label={{
                  value: "Forecast →",
                  fill: "var(--accent-cyan)",
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                }} />
                <Legend
                  wrapperStyle={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}
                />
                <Line
                  type="monotone" dataKey="actual" name="Actual Queue"
                  stroke="var(--accent-cyan)" strokeWidth={2}
                  dot={{ r: 3, fill: "var(--accent-cyan)" }}
                  connectNulls={false}
                />
                <Line
                  type="monotone" dataKey="predicted" name="Predicted Queue"
                  stroke="var(--accent-amber)" strokeWidth={2}
                  strokeDasharray="5 3"
                  dot={{ r: 3, fill: "var(--accent-amber)" }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </div>

      {/* Reward Chart */}
      <div className="detector-panel" style={{ marginBottom: 20 }}>
        <div className="detector-panel-header">
          <div className="detector-panel-icon eb">📈</div>
          <div>
            <div className="detector-panel-title">Reward Over Time</div>
            <div className="detector-panel-subtitle">Step reward · negative = queues present</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="step" tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="reward" name="Reward" stroke="var(--accent-amber)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Queue Chart */}
      <div className="detector-panel">
        <div className="detector-panel-header">
          <div className="detector-panel-icon sb">🚦</div>
          <div>
            <div className="detector-panel-title">Queue Length Over Time</div>
            <div className="detector-panel-subtitle">EB vs SB vs Total vehicles waiting</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="step" tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }} />
            <Line type="monotone" dataKey="eb" name="East Bound" stroke="var(--accent-cyan)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="sb" name="South Bound" stroke="var(--accent-amber)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="totalQueue" name="Total" stroke="var(--accent-green)" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;