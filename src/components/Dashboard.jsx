import { useEffect, useState } from "react";
import { getLiveData } from "../services/api";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import StatCard from "./StatCard";
import DetectorPanel from "./DetectorPanel";
import PhaseIndicator from "./PhaseIndicator";

function Dashboard() {
  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getLiveData();

        // API ne "No Data Found" diya ya status field hai — SUMO chala nahi abhi
        if (!result || result.status) {
          setError(true);
          setData(null);
          return;
        }

        setData(result);
        setError(false);
        setLastUpdated(new Date().toLocaleTimeString("en-IN"));
      } catch (err) {
        console.error("API Error:", err);
        setError(true);
      }
    };

    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

  // Flask chal raha hai lekin SUMO/data nahi aaya abhi
  if (error || !data) {
    return (
      <>
        <Navbar data={null} />
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - var(--topbar-height))",
          gap: 20,
          padding: 32,
          textAlign: "center",
        }}>
          {/* Animated waiting indicator */}
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            border: "2px solid var(--border)",
            borderTopColor: "var(--accent-cyan)",
            animation: "spin-slow 1s linear infinite",
          }} />

          <div>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "1rem",
              color: "var(--accent-cyan)",
              fontWeight: 600,
              marginBottom: 8,
            }}>
              Waiting for simulation data...
            </p>
            <p style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              lineHeight: 1.7,
              maxWidth: 420,
            }}>
              Flask backend chal raha hai ✅<br />
              Ab <strong style={{ color: "var(--text-secondary)" }}>traci6_QL.py</strong> start karo — jaise hi
              SUMO simulation data insert karega, dashboard automatically load ho jaega.
            </p>
          </div>

          {/* Checklist */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "18px 24px",
            textAlign: "left",
            minWidth: 320,
          }}>
            {[
              { label: "Flask Backend (app.py)", done: true },
              { label: "React Frontend (npm run dev)", done: true },
              { label: "SUMO Simulation (traci6_QL.py)", done: false },
            ].map(item => (
              <div key={item.label} style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 0",
                borderBottom: "1px solid var(--border)",
                fontSize: "0.82rem",
              }}>
                <span style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: item.done ? "var(--accent-green-dim)" : "var(--accent-amber-dim)",
                  border: `1px solid ${item.done ? "var(--accent-green)" : "var(--accent-amber)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.65rem",
                  flexShrink: 0,
                  color: item.done ? "var(--accent-green)" : "var(--accent-amber)",
                  fontWeight: 700,
                }}>
                  {item.done ? "✓" : "…"}
                </span>
                <span style={{ color: item.done ? "var(--text-primary)" : "var(--text-muted)" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  const totalEB = data.EB0 + data.EB1 + data.EB2;
  const totalSB = data.SB0 + data.SB1 + data.SB2;
  const totalVehicles = totalEB + totalSB;

  return (
    <>
      <Navbar data={data} />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-text">
            <h1>Traffic Overview</h1>
            <p>Real-time vehicle queue monitoring · Q-Learning agent active</p>
          </div>
          <div className="last-updated">
            Last updated<br />
            <span>{lastUpdated}</span>
          </div>
        </div>

        <div className="stat-grid">
          <StatCard label="Total Vehicles" value={totalVehicles} icon="🚗" colorClass="cyan"  sub="All detectors combined"   accentColor="var(--accent-cyan)" />
          <StatCard label="East Bound"     value={totalEB}       icon="➡️" colorClass="cyan"  sub="Lanes EB0 + EB1 + EB2"   accentColor="var(--accent-cyan)" />
          <StatCard label="South Bound"    value={totalSB}       icon="⬇️" colorClass="amber" sub="Lanes SB0 + SB1 + SB2"   accentColor="var(--accent-amber)" />
          <StatCard
            label="Reward"
            value={data.reward}
            icon="🎯"
            colorClass={data.reward >= 0 ? "green" : "amber"}
            sub="Current step reward"
            accentColor={data.reward >= 0 ? "var(--accent-green)" : "var(--accent-amber)"}
          />
        </div>

        <div className="detector-grid">
          <DetectorPanel
            title="East Bound" subtitle="Node1–2 · EB" icon="➡️" type="eb"
            lanes={[
              { label: "EB — 0", value: data.EB0 },
              { label: "EB — 1", value: data.EB1 },
              { label: "EB — 2", value: data.EB2 },
            ]}
          />
          <DetectorPanel
            title="South Bound" subtitle="Node2–7 · SB" icon="⬇️" type="sb"
            lanes={[
              { label: "SB — 0", value: data.SB0 },
              { label: "SB — 1", value: data.SB1 },
              { label: "SB — 2", value: data.SB2 },
            ]}
          />
        </div>

        <div className="phase-section">
          <PhaseIndicator phase={data.phase} />
          <div className="reward-panel">
            <div className="reward-panel-header">
              <span className="reward-panel-title">Step Reward</span>
              <span className="text-muted" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
                Step #{data.step}
              </span>
            </div>
            <div className="reward-value-large">{data.reward}</div>
            <p className="reward-desc">
              Reward = negative of total queue length.<br />
              Lower queues → higher (less negative) reward.<br />
              The Q-Learning agent updates its policy each step to maximise this signal.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;