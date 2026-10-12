import React from 'react';

export const LoadingSpinner = ({ text = 'Loading data...', size = 'md' }) => {
  const spinnerSize = size === 'sm' ? '1.5rem' : size === 'lg' ? '3rem' : '2rem';

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div
        className="spinner-border text-primary"
        role="status"
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderColor: 'var(--pm-violet-200)',
          borderRightColor: 'var(--pm-violet-600)'
        }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <p className="mt-3 text-muted small fw-medium">{text}</p>}
    </div>
  );
};

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="row g-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="col-12 col-md-6 col-lg-4">
          <div className="pm-card p-4 h-100">
            <div className="placeholder-glow">
              <span className="placeholder col-4 mb-2 rounded bg-secondary opacity-25"></span>
              <h5 className="placeholder-glow">
                <span className="placeholder col-10 mb-2 rounded bg-secondary opacity-25"></span>
              </h5>
              <p className="placeholder-glow">
                <span className="placeholder col-12 rounded bg-secondary opacity-25"></span>
                <span className="placeholder col-8 rounded bg-secondary opacity-25"></span>
              </p>
              <div className="d-flex gap-2 my-3">
                <span className="placeholder col-3 py-2 rounded-pill bg-secondary opacity-25"></span>
                <span className="placeholder col-3 py-2 rounded-pill bg-secondary opacity-25"></span>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                <span className="placeholder col-4 py-2 rounded bg-secondary opacity-25"></span>
                <span className="placeholder col-3 py-2 rounded bg-secondary opacity-25"></span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
