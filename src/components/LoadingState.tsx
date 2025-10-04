import React from 'react';

export const LoadingState: React.FC = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading browser compatibility data...</p>
  </div>
);