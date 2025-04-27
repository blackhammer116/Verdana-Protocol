// File: components/Tree.tsx
import React from 'react';

interface TreeProps {
  stage: number; // 1, 2 or 3 for growth stages
}

export const Tree: React.FC<TreeProps> = ({ stage }) => {
  // Different tree SVGs based on growth stage
  const getTreeSVG = () => {
    if (stage === 1) {
      return (
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="27" y="60" width="6" height="20" fill="#8B4513" />
          <circle cx="30" cy="40" r="15" fill="#228B22" />
        </svg>
      );
    } else if (stage === 2) {
      return (
        <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="35" y="70" width="10" height="30" fill="#8B4513" />
          <circle cx="40" cy="40" r="25" fill="#228B22" />
          <circle cx="40" cy="60" r="20" fill="#228B22" />
        </svg>
      );
    } else {
      return (
        <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="45" y="80" width="10" height="40" fill="#8B4513" />
          <circle cx="50" cy="30" r="25" fill="#228B22" />
          <circle cx="50" cy="55" r="25" fill="#228B22" />
          <circle cx="50" cy="75" r="20" fill="#228B22" />
        </svg>
      );
    }
  };

  return (
    <div className="tree-container">
      {getTreeSVG()}
    </div>
  );
};