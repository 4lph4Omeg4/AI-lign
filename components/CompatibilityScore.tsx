import React, { useEffect, useState } from 'react';

interface CompatibilityScoreProps {
  score: number;
}

const CompatibilityScore: React.FC<CompatibilityScoreProps> = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setDisplayScore(score));
    return () => cancelAnimationFrame(animation);
  }, [score]);

  const size = 60;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            style={{ 
                strokeDashoffset: offset,
                transition: 'stroke-dashoffset 1s cubic-bezier(0.25, 1, 0.5, 1)' 
            }}
          />
          <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{Math.round(displayScore)}</span>
          <span className="text-xs font-mono text-white/80 pt-1">%</span>
        </div>
      </div>
      <p className="text-xs font-mono text-cyan-300/80 mt-1">Match %</p>
    </div>
  );
};

export default CompatibilityScore;
