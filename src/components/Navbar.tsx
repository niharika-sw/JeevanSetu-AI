import React, { useState, useEffect } from 'react';
import { Menu, Play, Volume2, VolumeX, ShieldAlert, Cpu, Camera, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  setMobileOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setMobileOpen }) => {
  const { startLiveDemo, isSimulating, settings, updateSettings, kpis } = useApp();
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST'
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Mobile Toggle & Command Center Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white lg:hidden border border-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                Emergency Response Command Center
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Prayagraj Smart-City Autonomous Traffic Surveillance & Incident Intervention
            </p>
          </div>
        </div>

        {/* Right: Real-time Telemetry & Live Demo CTA */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Status HUD (Hidden on very small screens) */}
          <div className="hidden xl:flex items-center space-x-3 text-xs bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl font-mono">
            <div className="flex items-center space-x-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>System: <strong className="text-emerald-400">ONLINE</strong></span>
            </div>

            <span className="text-slate-700">|</span>

            <div className="flex items-center space-x-1.5 text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              <span>AI Engine: <strong className="text-sky-400">ACTIVE</strong></span>
            </div>

            <span className="text-slate-700">|</span>

            <div className="flex items-center space-x-1.5 text-slate-300">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Cams: <strong className="text-white">12/12 ONLINE</strong></span>
            </div>

            <span className="text-slate-700">|</span>

            <div className="flex items-center space-x-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{timeStr}</span>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => updateSettings({ soundAlerts: !settings.soundAlerts })}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              settings.soundAlerts
                ? 'bg-slate-900 text-sky-400 border-slate-800 hover:border-slate-700'
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-400'
            }`}
            title={settings.soundAlerts ? 'Sound Alerts On' : 'Sound Alerts Muted'}
          >
            {settings.soundAlerts ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* HACKATHON LIVE DEMO BUTTON */}
          <button
            onClick={startLiveDemo}
            disabled={isSimulating}
            className="flex items-center space-x-2 px-3.5 sm:px-4 py-2 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-rose-600/30 border border-rose-400/40 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <ShieldAlert className={`w-4 h-4 ${isSimulating ? 'animate-spin text-amber-300' : 'animate-bounce'}`} />
            <span className="tracking-wide">
              {isSimulating ? 'AI DEMO ACTIVE...' : 'START LIVE DEMO'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
