import React from 'react';

interface ConfidenceRingProps {
  score: number; // 0 to 100
  size?: number; // diameter in px
  strokeWidth?: number;
  showCategory?: boolean;
}

export const ConfidenceRing: React.FC<ConfidenceRingProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  showCategory = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  let color = '#ef4444'; // Red for low
  let category = 'Low Confidence';
  let badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';

  if (score >= 80) {
    color = '#10b981'; // Emerald for high
    category = 'High Confidence';
    badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (score >= 50) {
    color = '#f59e0b'; // Amber for medium
    category = 'Medium Confidence';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold tracking-tight text-white font-mono">
            {score.toFixed(1)}%
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">AI Match</span>
        </div>
      </div>

      {showCategory && (
        <span
          className={`mt-2.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeBg}`}
        >
          <span
            className="w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse"
            style={{ backgroundColor: color }}
          />
          {category}
        </span>
      )}
    </div>
  );
};
