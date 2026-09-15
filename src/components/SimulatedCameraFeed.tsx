import React, { useState, useEffect } from 'react';
import { Video, AlertTriangle, Crosshair, RefreshCw, Eye } from 'lucide-react';

interface SimulatedCameraFeedProps {
  cameraId?: string;
  cameraName?: string;
  isAccident?: boolean;
  stage?: number;
  height?: string;
  showControls?: boolean;
}

export const SimulatedCameraFeed: React.FC<SimulatedCameraFeedProps> = ({
  cameraId = 'S-04',
  cameraName = 'Central Signal Junction',
  isAccident = false,
  stage = 0,
  height = 'h-64 sm:h-80',
  showControls = true,
}) => {
  const [timestamp, setTimestamp] = useState<string>('');
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestamp(
        now.toISOString().replace('T', ' ').substring(0, 19) +
          '.' +
          String(now.getMilliseconds()).padStart(3, '0')
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 66); // ~15 FPS clock update
    return () => clearInterval(interval);
  }, []);

  const hasCollision = isAccident || stage >= 3;
  const hasVehicleBoxes = stage >= 2 || !isAccident;
  const hasPlateOCR = stage >= 7;

  return (
    <div
      className={`relative w-full ${height} bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col group`}
    >
      {/* Top Camera HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-black/80 via-black/40 to-transparent font-mono text-xs">
        <div className="flex items-center space-x-2">
          <span className="flex items-center text-rose-500 font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5 animate-ping" />
            REC
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-200 font-semibold">{cameraId}</span>
          <span className="text-slate-400 hidden sm:inline">• {cameraName}</span>
        </div>

        <div className="flex items-center space-x-3 text-slate-300">
          <span className="bg-slate-900/80 border border-slate-700/60 px-1.5 py-0.5 rounded text-[11px] text-emerald-400">
            30.0 FPS
          </span>
          <span className="hidden md:inline text-[11px] text-slate-300">{timestamp}</span>
        </div>
      </div>

      {/* Simulated Traffic Scene using SVG Graphics & Animations */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-neutral-950">
        <svg
          viewBox="0 0 800 450"
          className="w-full h-full object-cover select-none pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Road gradient */}
            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Collision glow */}
            <radialGradient id="collisionGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(239, 68, 68, 0.8)" />
              <stop offset="50%" stopColor="rgba(245, 158, 11, 0.3)" />
              <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
            </radialGradient>
          </defs>

          {/* Perspective Road & Intersection Grid */}
          <polygon points="100,450 320,180 480,180 700,450" fill="url(#roadGrad)" />
          {/* Horizontal crossroad */}
          <polygon points="0,240 800,240 800,320 0,320" fill="#131d2e" opacity="0.9" />

          {/* Lane dividers */}
          <line
            x1="400"
            y1="180"
            x2="400"
            y2="450"
            stroke="#f8fafc"
            strokeWidth="3"
            strokeDasharray="14 12"
            opacity="0.6"
          />
          <line
            x1="260"
            y1="450"
            x2="360"
            y2="180"
            stroke="#e2e8f0"
            strokeWidth="1.5"
            strokeDasharray="8 8"
            opacity="0.3"
          />
          <line
            x1="540"
            y1="450"
            x2="440"
            y2="180"
            stroke="#e2e8f0"
            strokeWidth="1.5"
            strokeDasharray="8 8"
            opacity="0.3"
          />

          {/* Intersection zebra crossings */}
          <line x1="280" y1="230" x2="520" y2="230" stroke="#94a3b8" strokeWidth="4" strokeDasharray="10 8" opacity="0.4" />
          <line x1="250" y1="330" x2="550" y2="330" stroke="#94a3b8" strokeWidth="4" strokeDasharray="10 8" opacity="0.4" />

          {/* Background ambient traffic (Cars passing in distance) */}
          <rect x="350" y="195" width="28" height="14" rx="3" fill="#64748b" opacity="0.6" />
          <rect x="425" y="200" width="30" height="15" rx="3" fill="#475569" opacity="0.7" />

          {/* Crosshair & Optical Analysis Grid */}
          <line x1="400" y1="50" x2="400" y2="400" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.3" />
          <line x1="100" y1="280" x2="700" y2="280" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.3" />

          {/* VEHICLE 1 (White Sedan - Primary Demo Vehicle) */}
          <g transform="translate(320, 240)">
            {/* Shadow */}
            <ellipse cx="65" cy="45" rx="60" ry="12" fill="#020617" opacity="0.7" />
            {/* Vehicle body */}
            <rect x="15" y="10" width="95" height="38" rx="7" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Roof / Windshield */}
            <rect x="35" y="14" width="45" height="28" rx="4" fill="#334155" />
            {/* Headlights & Tail */}
            <rect x="16" y="14" width="4" height="8" rx="1" fill="#fef08a" />
            <rect x="16" y="28" width="4" height="8" rx="1" fill="#fef08a" />
            <rect x="105" y="14" width="4" height="8" rx="1" fill="#ef4444" />
            <rect x="105" y="28" width="4" height="8" rx="1" fill="#ef4444" />

            {/* Bounding Box 1 */}
            {showBoundingBoxes && hasVehicleBoxes && (
              <g>
                <rect
                  x="8"
                  y="4"
                  width="110"
                  height="48"
                  fill="none"
                  stroke={hasCollision ? '#ef4444' : '#10b981'}
                  strokeWidth="2"
                  strokeDasharray={hasCollision ? '4 2' : 'none'}
                />
                <rect x="8" y="-14" width="92" height="16" fill={hasCollision ? '#dc2626' : '#059669'} rx="2" />
                <text x="12" y="-3" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  Sedan 97.4%
                </text>
              </g>
            )}
          </g>

          {/* VEHICLE 2 (Silver SUV - Colliding vehicle) */}
          <g transform={`translate(${hasCollision ? 390 : 470}, 255) rotate(${hasCollision ? -18 : 0} 60 25)`}>
            {/* Shadow */}
            <ellipse cx="60" cy="48" rx="58" ry="14" fill="#020617" opacity="0.7" />
            {/* Vehicle body */}
            <rect x="10" y="8" width="105" height="42" rx="6" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
            {/* Roof */}
            <rect x="30" y="12" width="55" height="34" rx="4" fill="#1e293b" />
            {/* Headlights */}
            <rect x="11" y="12" width="4" height="8" rx="1" fill="#fef08a" />
            <rect x="11" y="32" width="4" height="8" rx="1" fill="#fef08a" />

            {/* Bounding Box 2 */}
            {showBoundingBoxes && hasVehicleBoxes && (
              <g>
                <rect
                  x="4"
                  y="2"
                  width="120"
                  height="54"
                  fill="none"
                  stroke={hasCollision ? '#ef4444' : '#0ea5e9'}
                  strokeWidth="2"
                  strokeDasharray={hasCollision ? '4 2' : 'none'}
                />
                <rect x="4" y="-14" width="76" height="16" fill={hasCollision ? '#dc2626' : '#0284c7'} rx="2" />
                <text x="8" y="-3" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  SUV 95.8%
                </text>
              </g>
            )}
          </g>

          {/* ACCIDENT / COLLISION FX */}
          {hasCollision && (
            <g>
              {/* Radial shockwave */}
              <circle cx="410" cy="275" r="70" fill="url(#collisionGlow)" />

              {/* Dynamic trajectory anomaly vectors */}
              <line x1="330" y1="260" x2="390" y2="275" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrow)" />
              <line x1="480" y1="290" x2="415" y2="278" stroke="#ef4444" strokeWidth="3" />

              {/* Kinetic collision indicator */}
              <g transform="translate(375, 235)">
                <polygon points="12,0 15,9 24,9 17,15 19,24 12,18 5,24 7,15 0,9 9,9" fill="#f59e0b" />
              </g>

              {/* Bounding Impact Zone HUD */}
              <rect
                x="315"
                y="225"
                width="210"
                height="105"
                fill="rgba(239, 68, 68, 0.12)"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />
              <rect x="315" y="202" width="180" height="20" fill="#ef4444" rx="3" />
              <text x="323" y="216" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">
                IMPACT DETECTED (0.88G)
              </text>
            </g>
          )}

          {/* ANPR OCR PLATE RECOGNITION HUD */}
          {hasPlateOCR && (
            <g transform="translate(325, 345)">
              <rect x="0" y="0" width="180" height="42" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              <rect x="6" y="8" width="168" height="26" rx="4" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
              <rect x="6" y="8" width="18" height="26" fill="#1d4ed8" rx="2" />
              <text x="9" y="24" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
                IND
              </text>
              <text x="32" y="26" fill="#0f172a" fontSize="15" fontWeight="900" fontFamily="monospace" letterSpacing="1.5">
                UP32 AB 1234
              </text>
              <rect x="135" y="-10" width="40" height="14" fill="#0284c7" rx="3" />
              <text x="138" y="-1" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace">
                OCR 98.2%
              </text>
            </g>
          )}
        </svg>

        {/* Scanline CRT overlay for realistic CCTV look */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,24,38,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />

        {/* Status overlay badge if collision */}
        {hasCollision && (
          <div className="absolute bottom-3 left-3 z-20 flex items-center space-x-2 bg-rose-950/90 border border-rose-500/80 px-3 py-1.5 rounded-lg text-xs font-mono text-rose-200 backdrop-blur shadow-lg animate-pulse">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>AI CONFIRMED: COLLISION PERSISTENCE VERIFIED</span>
          </div>
        )}
      </div>

      {/* Camera Controls Bar */}
      {showControls && (
        <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center text-slate-400">
              <Crosshair className="w-3.5 h-3.5 mr-1 text-sky-400" />
              Zone: Signal Intersection S-04
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center ${
                showBoundingBoxes
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3 h-3 mr-1" />
              AI BBoxes {showBoundingBoxes ? 'ON' : 'OFF'}
            </button>
            <span className="text-[11px] text-slate-400 px-2 py-1 bg-slate-800/80 rounded border border-slate-700/60 font-mono">
              YOLOv8n-Accident
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
