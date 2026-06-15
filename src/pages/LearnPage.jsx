function Section({ title, icon, children }) {
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: "28px 32px",
      marginBottom: 20,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontSize: "1.4rem" }}>{icon}</span>
        <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Term({ word, children }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "180px 1fr",
      gap: 16,
      padding: "12px 0",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      alignItems: "start",
    }}>
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.78rem",
        fontWeight: 600,
        color: "var(--accent-cyan)",
        paddingTop: 2,
      }}>{word}</span>
      <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>{children}</span>
    </div>
  );
}

function Highlight({ color = "cyan", children }) {
  const colors = {
    cyan:  { bg: "var(--accent-cyan-dim)",  border: "var(--border-accent)",            text: "var(--accent-cyan)" },
    amber: { bg: "var(--accent-amber-dim)", border: "rgba(245,158,11,0.3)",            text: "var(--accent-amber)" },
    green: { bg: "var(--accent-green-dim)", border: "rgba(16,185,129,0.3)",            text: "var(--accent-green)" },
    red:   { bg: "var(--accent-red-dim)",   border: "rgba(239,68,68,0.3)",             text: "var(--accent-red)" },
  };
  const c = colors[color];
  return (
    <span style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: "4px",
      padding: "1px 7px",
      fontSize: "0.78rem",
      color: c.text,
      fontFamily: "var(--font-mono)",
      fontWeight: 600,
    }}>{children}</span>
  );
}

function FormulaBox({ formula, label }) {
  return (
    <div style={{
      background: "var(--bg-primary)",
      border: "1px solid var(--border-accent)",
      borderRadius: "var(--radius-md)",
      padding: "16px 20px",
      margin: "14px 0",
      textAlign: "center",
    }}>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.95rem",
        color: "var(--accent-cyan)",
        fontWeight: 600,
        letterSpacing: "0.04em",
        marginBottom: label ? 8 : 0,
      }}>{formula}</div>
      {label && (
        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{label}</div>
      )}
    </div>
  );
}

function StepFlow({ steps }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap", margin: "16px 0" }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-accent)",
            borderRadius: "var(--radius-sm)",
            padding: "8px 14px",
            fontSize: "0.78rem",
            color: "var(--accent-cyan)",
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}>{s}</div>
          {i < steps.length - 1 && (
            <span style={{ color: "var(--text-muted)", padding: "0 6px", fontSize: "0.9rem" }}>→</span>
          )}
        </div>
      ))}
    </div>
  );
}

function PhaseVisual() {
  const phases = [
    { id: 0, label: "Phase 0", desc: "East–West GREEN", color: "var(--accent-green)", sub: "EB lanes ko green signal" },
    { id: 1, label: "Phase 1", desc: "East–West YELLOW", color: "var(--accent-amber)", sub: "Transition / warning" },
    { id: 2, label: "Phase 2", desc: "North–South GREEN", color: "var(--accent-green)", sub: "SB lanes ko green signal" },
    { id: 3, label: "Phase 3", desc: "North–South YELLOW", color: "var(--accent-amber)", sub: "Transition / warning" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, margin: "16px 0" }}>
      {phases.map(p => (
        <div key={p.id} style={{
          background: "var(--bg-primary)",
          border: `1px solid ${p.color}44`,
          borderRadius: "var(--radius-sm)",
          padding: "12px",
          textAlign: "center",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: p.color, margin: "0 auto 8px",
            boxShadow: `0 0 12px ${p.color}66`,
          }} />
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{p.label}</div>
          <div style={{ fontSize: "0.65rem", color: p.color, fontWeight: 600, marginBottom: 3 }}>{p.desc}</div>
          <div style={{ fontSize: "0.62rem", color: "var(--text-muted)" }}>{p.sub}</div>
        </div>
      ))}
    </div>
  );
}

function LearnPage() {
  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Learn & Guide</h1>
          <p>Is system mein kya ho raha hai — har cheez ka explanation</p>
        </div>
      </div>

      {/* 1. System Overview */}
      <Section title="System Overview — Ye Project Kya Hai?" icon="🗺️">
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 16 }}>
          Ye ek <strong style={{ color: "var(--text-primary)" }}>AI-powered traffic signal controller</strong> hai jo
          ek real intersection (Node2) pe vehicles ki queue dekh kar automatically signal change karta hai.
          Normal traffic lights fixed timer pe chalte hain — ye system <strong style={{ color: "var(--accent-cyan)" }}>Q-Learning</strong> (ek
          Reinforcement Learning algorithm) use karke <em>khud seekhta hai</em> ki kab signal switch karna chahiye.
        </p>

        <StepFlow steps={["SUMO Simulation", "TraCI (Python)", "Q-Learning Agent", "SQL Database", "Flask API", "React Dashboard"]} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16 }}>
          {[
            { icon: "🚦", title: "SUMO", desc: "Traffic simulator — virtual roads aur vehicles banata hai" },
            { icon: "🧠", title: "Q-Learning", desc: "AI agent jo har step pe best action choose karna seekhta hai" },
            { icon: "📊", title: "Dashboard", desc: "Real-time data visualization — kya ho raha hai live dekho" },
          ].map(c => (
            <div key={c.title} style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "14px",
            }}>
              <div style={{ fontSize: "1.3rem", marginBottom: 6 }}>{c.icon}</div>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* 2. Detectors */}
      <Section title="Detectors — EB aur SB kya hain?" icon="📡">
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 16 }}>
          Node2 intersection pe <strong style={{ color: "var(--text-primary)" }}>6 virtual loop detectors</strong> lage hain jo
          count karte hain ki har lane mein kitni gaadiyaan ruki hain (queue).
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "var(--bg-primary)", border: "1px solid var(--border-accent)", borderRadius: "var(--radius-sm)", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span>➡️</span>
              <span style={{ fontWeight: 700, color: "var(--accent-cyan)", fontSize: "0.88rem" }}>East Bound (EB)</span>
            </div>
            <Term word="EB0">Lane 0 — Node1 se Node2 ki taraf aane wali pehli lane ki queue</Term>
            <Term word="EB1">Lane 1 — beech wali lane ki queue</Term>
            <Term word="EB2">Lane 2 — teesri lane ki queue</Term>
          </div>
          <div style={{ background: "var(--bg-primary)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "var(--radius-sm)", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span>⬇️</span>
              <span style={{ fontWeight: 700, color: "var(--accent-amber)", fontSize: "0.88rem" }}>South Bound (SB)</span>
            </div>
            <Term word="SB0">Lane 0 — Node2 se Node7 ki taraf aane wali pehli lane ki queue</Term>
            <Term word="SB1">Lane 1 — beech wali lane ki queue</Term>
            <Term word="SB2">Lane 2 — teesri lane ki queue</Term>
          </div>
        </div>

        <div style={{ marginTop: 14, padding: "12px 16px", background: "var(--accent-cyan-dim)", border: "1px solid var(--border-accent)", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
          💡 <strong style={{ color: "var(--accent-cyan)" }}>Value ka matlab:</strong> Agar EB0 = 3 hai toh East Bound ki lane 0 mein 3 gaadiyaan signal ka wait kar rahi hain.
          Value 0 matlab sab clear hai.
        </div>
      </Section>

      {/* 3. Phase */}
      <Section title="Signal Phase — Traffic Light ka State" icon="🚦">
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 4 }}>
          Node2 pe traffic light 4 phases mein rotate hoti hai. Har phase ka matlab:
        </p>
        <PhaseVisual />
        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          AI agent decide karta hai ki <Highlight color="green">Phase rakhein (Action 0)</Highlight> ya <Highlight color="amber">Next phase pe switch karein (Action 1)</Highlight>.
          Minimum green time <Highlight>100 steps</Highlight> fix hai — isse pehle switch nahi ho sakta.
        </div>
      </Section>

      {/* 4. Q-Learning */}
      <Section title="Q-Learning — AI Kaise Seekhta Hai?" icon="🧠">
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 12 }}>
          Q-Learning ek <strong style={{ color: "var(--text-primary)" }}>Reinforcement Learning</strong> algorithm hai.
          Jaise insaan galtiyon se seekhta hai, waise ye agent har step pe reward/penalty dekh ke apni policy improve karta hai.
        </p>

        <StepFlow steps={["State observe karo", "Action choose karo", "Reward lo", "Q-Table update karo", "Repeat"]} />

        <div style={{ marginTop: 16 }}>
          <Term word="State">Current situation — (EB0, EB1, EB2, SB0, SB1, SB2, Phase) ka combination. Jaise (2, 0, 1, 3, 0, 0, 0) ek state hai.</Term>
          <Term word="Action">Agent ke paas 2 options — 0 = current phase raho, 1 = next phase pe switch karo</Term>
          <Term word="Reward">Har step pe milne wala score. Formula: <strong style={{ color: "var(--accent-amber)", fontFamily: "var(--font-mono)" }}>Reward = -(total queue)</strong>. Zyada queue = zyada negative reward = bura.</Term>
          <Term word="Q-Value">Ek number jo batata hai — is state mein ye action kitna achha hai. Jitna zyada Q-value, utna better action.</Term>
          <Term word="Episode">Ek poora simulation run — 10,000 steps tak chalti hai training.</Term>
        </div>

        <FormulaBox
          formula="Q(s,a) ← Q(s,a) + α × [r + γ × max Q(s',a') − Q(s,a)]"
          label="Bellman Equation — Q-Table update ka formula"
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 8 }}>
          {[
            { sym: "α (Alpha) = 0.1", desc: "Learning rate — kitni tezi se naya seekhe. 0.1 matlab 10% naya, 90% purana" },
            { sym: "γ (Gamma) = 0.9", desc: "Discount factor — future rewards ki value. 0.9 matlab future bhi important hai" },
            { sym: "ε (Epsilon) = 0.1", desc: "Exploration rate — 10% baar random action lo, 90% baar best action lo" },
          ].map(p => (
            <div key={p.sym} style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "12px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-cyan)", marginBottom: 6 }}>{p.sym}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. Q-Table */}
      <Section title="Q-Table — Agent ki Memory" icon="📋">
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 12 }}>
          Q-Table ek <strong style={{ color: "var(--text-primary)" }}>dictionary</strong> hai jisme har visited state ke liye
          dono actions ke Q-values store hote hain. Ye agent ki "memory" hai.
        </p>

        <div style={{ background: "var(--bg-primary)", borderRadius: "var(--radius-sm)", padding: "16px", fontFamily: "var(--font-mono)", fontSize: "0.75rem", overflowX: "auto", border: "1px solid var(--border)" }}>
          <div style={{ color: "var(--text-muted)", marginBottom: 8 }}># Example Q-Table entries:</div>
          <div style={{ display: "grid", gridTemplateColumns: "auto auto auto auto", gap: "6px 24px" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>STATE</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>Q(Keep)</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>Q(Switch)</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>BEST ACTION</span>

            <span style={{ color: "var(--accent-cyan)" }}>(0,0,0,0,0,0,0)</span>
            <span style={{ color: "var(--text-secondary)" }}>-0.0023</span>
            <span style={{ color: "var(--text-secondary)" }}>-0.0091</span>
            <span style={{ color: "var(--accent-green)" }}>Keep Phase ✓</span>

            <span style={{ color: "var(--accent-cyan)" }}>(2,1,0,3,0,0,0)</span>
            <span style={{ color: "var(--text-secondary)" }}>-2.4100</span>
            <span style={{ color: "var(--text-secondary)" }}>-1.2300</span>
            <span style={{ color: "var(--accent-green)" }}>Switch Phase ✓</span>

            <span style={{ color: "var(--accent-cyan)" }}>(0,0,0,2,1,0,2)</span>
            <span style={{ color: "var(--text-secondary)" }}>-0.9800</span>
            <span style={{ color: "var(--text-secondary)" }}>-1.5600</span>
            <span style={{ color: "var(--accent-green)" }}>Keep Phase ✓</span>
          </div>
        </div>

        <div style={{ marginTop: 14, fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Jab queue zyada hoti hai (jaise SB mein 3 gaadiyaan), agent seekh jaata hai ki
          <Highlight color="amber">Switch Phase</Highlight> karna better hai. Jab sab clear hain,
          <Highlight color="green">Keep Phase</Highlight> better hota hai.
          Q-Table page pe aap ye saari entries real-time dekh sakte hain.
        </div>
      </Section>

      {/* 6. Reward */}
      <Section title="Reward — AI ko Score Kaise Milta Hai?" icon="🎯">
        <FormulaBox
          formula="Reward = −(EB0 + EB1 + EB2 + SB0 + SB1 + SB2)"
          label="Total queue length ka negative = step reward"
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {[
            { ex: "Sab lanes clear", calc: "−(0+0+0+0+0+0)", result: "0", color: "green", meaning: "Perfect! Koi queue nahi" },
            { ex: "Thodi queue", calc: "−(1+0+1+1+0+0)", result: "−3", color: "amber", meaning: "Theek hai, improve karo" },
            { ex: "Zyada queue", calc: "−(3+2+1+4+1+2)", result: "−13", color: "red", meaning: "Bura! Zyada congestion" },
          ].map(r => (
            <div key={r.ex} style={{
              background: "var(--bg-primary)",
              border: `1px solid ${r.color === "green" ? "rgba(16,185,129,0.3)" : r.color === "amber" ? "rgba(245,158,11,0.3)" : "rgba(239,68,68,0.3)"}`,
              borderRadius: "var(--radius-sm)",
              padding: "14px",
            }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 6 }}>{r.ex}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-secondary)", marginBottom: 6 }}>{r.calc}</div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "1.2rem", fontWeight: 700,
                color: r.color === "green" ? "var(--accent-green)" : r.color === "amber" ? "var(--accent-amber)" : "var(--accent-red)",
                marginBottom: 4,
              }}>{r.result}</div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{r.meaning}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 14 }}>
          Agent ka goal hai <strong style={{ color: "var(--accent-green)" }}>cumulative reward maximize</strong> karna —
          matlab total queue minimize karna across all steps. Jitna reward 0 ke kareeb, utna better performance.
        </p>
      </Section>

      {/* 7. Dashboard Pages */}
      <Section title="Dashboard Pages — Kahan Kya Dekhen?" icon="🖥️">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            {
              page: "Dashboard", icon: "⬛", color: "var(--accent-cyan)",
              desc: "Live snapshot — abhi is second kya ho raha hai",
              items: ["Total vehicles in all lanes", "EB aur SB individual lane queues with progress bars", "Current signal phase with pulsing ring", "Current step reward"],
            },
            {
              page: "Analytics", icon: "📈", color: "var(--accent-amber)",
              desc: "Historical trends aur AI prediction",
              items: ["Reward over time chart — agent improve ho raha hai ya nahi", "Queue length chart — EB vs SB vs Total", "Congestion Forecast — agle 10 steps ka predicted queue (Linear Regression)", "Model R² accuracy score"],
            },
            {
              page: "Q-Table", icon: "🧠", color: "var(--accent-green)",
              desc: "AI ki memory — agent ne kya seekha",
              items: ["Har visited state ke Q-values", "Best action badge — Keep Phase ya Switch Phase", "Search/filter by state", "Har 50 steps pe automatically update hota hai"],
            },
            {
              page: "Simulation", icon: "🔁", color: "var(--accent-amber)",
              desc: "Step-by-step live log",
              items: ["Har step ka signal phase, total queue, reward", "CURRENT step highlighted in cyan", "traci6_QL.py ke hyperparameters info", "Auto-scroll toggle"],
            },
            {
              page: "Learn", icon: "📖", color: "var(--accent-cyan)",
              desc: "Ye page — system ka poora explanation",
              items: ["Detectors ka matlab", "Q-Learning kaise kaam karta hai", "Reward formula", "Har page ka guide"],
            },
          ].map(p => (
            <div key={p.page} style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "16px 20px",
              display: "grid",
              gridTemplateColumns: "160px 1fr",
              gap: 16,
              alignItems: "start",
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span>{p.icon}</span>
                  <span style={{ fontWeight: 700, color: p.color, fontSize: "0.88rem" }}>{p.page}</span>
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{p.desc}</div>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
                {p.items.map(item => (
                  <li key={item} style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: p.color, flexShrink: 0, marginTop: 2 }}>›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* 8. Prediction */}
      <Section title="Congestion Forecast — Future Prediction Kaise Hoti Hai?" icon="🔮">
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 12 }}>
          Analytics page pe jo <strong style={{ color: "var(--text-primary)" }}>Forecast</strong> dikha raha hai wo
          <strong style={{ color: "var(--accent-cyan)" }}> Linear Regression</strong> model se aata hai — ye ek supervised ML algorithm hai.
        </p>
        <StepFlow steps={["DB se last 500 steps lo", "Window of 5 steps → next value", "Model train karo", "Last 5 values se 10 predict karo", "Chart mein dikhao"]} />
        <div style={{ marginTop: 14 }}>
          <Term word="R² Score">Model ki accuracy — 100% matlab perfect prediction. 80%+ achha maana jaata hai.</Term>
          <Term word="Actual (Cyan)">Last 10 steps ki real queue values jo database se aayi</Term>
          <Term word="Predicted (Amber)">Agle 10 steps ka model ka guess — real data aane se pehle</Term>
          <Term word="Color coding">Green = low congestion (0–4), Amber = medium (4–8), Red = high congestion (8+)</Term>
        </div>
      </Section>

    </div>
  );
}

export default LearnPage;