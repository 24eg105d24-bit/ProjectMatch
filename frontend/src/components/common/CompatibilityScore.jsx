import React from 'react';

const CompatibilityScore = ({
  score = 0,
  size = 'md',
  showLabel = true,
  variant = 'circle'
}) => {
  const getColor = (val) => {
    if (val >= 90) return '#10b981'; // Emerald
    if (val >= 80) return '#7c3aed'; // Violet
    if (val >= 70) return '#f59e0b'; // Amber
    return '#64748b'; // Muted
  };

  const getLabel = (val) => {
    if (val >= 90) return 'Exceptional Match';
    if (val >= 80) return 'Strong Match';
    if (val >= 70) return 'Moderate Match';
    return 'Developing Match';
  };

  const strokeColor = getColor(score);
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  if (variant === 'pill') {
    return (
      <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill" style={{
        backgroundColor: `${strokeColor}15`,
        border: `1.5px solid ${strokeColor}40`
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: strokeColor }} />
        <span className="fw-bold" style={{ color: strokeColor, fontSize: '0.875rem' }}>
          {score}% Compatibility
        </span>
      </div>
    );
  }

  const dimension = size === 'lg' ? 84 : size === 'sm' ? 56 : 68;

  return (
    <div className="d-flex align-items-center gap-3">
      <div
        className="position-relative d-flex align-items-center justify-content-center"
        style={{ width: dimension, height: dimension }}
      >
        <svg width={dimension} height={dimension} className="transform -rotate-90">
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth="5"
            fill="transparent"
          />
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="position-absolute text-center">
          <span className="fw-bold text-navy" style={{ fontSize: size === 'lg' ? '1.1rem' : '0.9rem' }}>
            {score}%
          </span>
        </div>
      </div>

      {showLabel && (
        <div>
          <span className="d-block fw-bold text-navy" style={{ fontSize: '0.9rem' }}>
            {getLabel(score)}
          </span>
          <span className="text-muted small">Compatibility Score</span>
        </div>
      )}
    </div>
  );
};

export default CompatibilityScore;
