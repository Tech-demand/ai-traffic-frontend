const PHASE_LABELS = {
  0: "East–West Green",
  1: "East–West Yellow",
  2: "North–South Green",
  3: "North–South Yellow",
};

function PhaseIndicator({ phase }) {
  const label = PHASE_LABELS[phase] ?? `Phase ${phase}`;

  return (
    <div className="phase-card">
      <div className="phase-ring-outer">
        <div className="phase-ring-inner">
          <span className="phase-number">{phase}</span>
          <span className="phase-label-small">phase</span>
        </div>
      </div>
      <span className="phase-info-label">{label}</span>
    </div>
  );
}

export default PhaseIndicator;