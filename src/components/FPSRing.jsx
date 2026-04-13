import React from 'react';

export default function FPSRing({ fps = 0 }) {
  const radius = 42;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (fps / 100) * circ;

  const color = fps >= 80 ? '#00e676' : fps >= 50 ? '#6c63ff' : fps >= 30 ? '#ff9100' : '#ff6584';

  return (
    <div className="fps-ring-wrapper">
      <div className="fps-ring">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {/* Background ring */}
          <circle cx="50" cy="50" r={radius} fill="none"
            stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          {/* Progress ring */}
          <circle cx="50" cy="50" r={radius} fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease', filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="fps-value">
          <span className="fps-number" style={{ color }}>{fps}</span>
          <span className="fps-label">FPS</span>
        </div>
      </div>
      <span className="text-xs text-muted">Focus Performance Score</span>
    </div>
  );
}
