import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Search, Filter, Download, Pause, Play, RefreshCw, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { initialAiLogs } from '../data/seedData';
import { AiLogEntry } from '../types';

export const AiLogsPage: React.FC = () => {
  const { isSimulating, activeIncident } = useApp();
  const [logs, setLogs] = useState<AiLogEntry[]>(initialAiLogs);
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // When pipeline simulation runs, append live logs dynamically
  useEffect(() => {
    if (isSimulating) {
      const newEntry: AiLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().substring(11, 23),
        camera_id: 'S-04',
        component: 'REALTIME_STREAM',
        level: 'CRITICAL',
        message: 'Collision trajectory persistence verified across buffer frames [Confidence 94.7%]',
      };
      setLogs((prev) => [newEntry, ...prev]);
    }
  }, [isSimulating]);

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.component.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.camera_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleExportLogs = () => {
    const textContent = logs
      .map(
        (l) =>
          `[${l.timestamp}] [${l.level}] [${l.camera_id}] [${l.component}]: ${l.message}`
      )
      .join('\n');

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jeevansetu_ai_telemetry_logs_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30 font-bold';
      case 'WARN':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'SUCCESS':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      default:
        return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              AI Detection & Telemetry Console Stream
            </h2>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
              30 FPS Optical Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Raw diagnostic log stream for computer vision model inference, optical flow, ANPR extraction, and dispatch APIs.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition-colors ${
              autoScroll
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {autoScroll ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoScroll ? 'Auto-Scroll ON' : 'Paused'}</span>
          </button>

          <button
            onClick={handleExportLogs}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export TXT</span>
          </button>

          <button
            onClick={handleClearLogs}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-700 transition-colors"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search telemetry (e.g. YOLO, UP32, collision, trajectory, frame)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
          >
            <option value="ALL">All Levels</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="SUCCESS">SUCCESS</option>
          </select>
        </div>
      </div>

      {/* Terminal Viewport Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-4 font-mono text-xs overflow-hidden">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-slate-500 text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="ml-2 text-slate-400">/var/log/jeevansetu-agent.log</span>
          </div>
          <span>Showing {filteredLogs.length} entries</span>
        </div>

        <div
          ref={logContainerRef}
          className="space-y-1.5 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800"
        >
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start space-x-2 p-1.5 rounded hover:bg-slate-900/60 transition-colors leading-relaxed"
            >
              <span className="text-slate-500 select-none shrink-0 font-light">
                [{log.timestamp}]
              </span>

              <span
                className={`text-[10px] px-1.5 py-0.2 rounded border shrink-0 font-bold ${getLevelColor(
                  log.level
                )}`}
              >
                {log.level}
              </span>

              <span className="text-purple-400 shrink-0 select-none">
                [{log.camera_id}]
              </span>

              <span className="text-sky-300 shrink-0 select-none font-bold">
                [{log.component}]
              </span>

              <span className="text-slate-300 break-all">{log.message}</span>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="py-8 text-center text-slate-500">
              No matching log records found for this query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
