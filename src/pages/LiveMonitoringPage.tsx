import React, { useState } from 'react';
import { Camera as CameraIcon, AlertTriangle, RefreshCw, Eye, Grid, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SimulatedCameraFeed } from '../components/SimulatedCameraFeed';

export const LiveMonitoringPage: React.FC = () => {
  const { cameras, simulateAccidentPipeline, isSimulating, setCurrentPage } = useApp();
  const [selectedCamFilter, setSelectedCamFilter] = useState<string>('ALL');

  const filteredCameras =
    selectedCamFilter === 'ALL'
      ? cameras
      : cameras.filter((c) => (selectedCamFilter === 'ALERT' ? c.status === 'ALERT' : c.status === 'ONLINE'));

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <CameraIcon className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Live Traffic Camera Surveillance Grid
            </h2>
            <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs px-2.5 py-0.5 rounded-full font-mono">
              12 Streams Online
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-camera computer vision network. Edge node YOLO accident telemetry active.
          </p>
        </div>

        {/* Filter controls & Demo trigger */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            {['ALL', 'ONLINE', 'ALERT'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedCamFilter(filter)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  selectedCamFilter === filter
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            onClick={() => simulateAccidentPipeline('S-04')}
            disabled={isSimulating}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <span>{isSimulating ? 'Simulating Pipeline...' : 'Simulate Accident (Cam S-04)'}</span>
          </button>
        </div>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCameras.map((cam) => {
          const isDemoCamera = cam.id === 'S-04';
          const isAlert = cam.status === 'ALERT';

          return (
            <div
              key={cam.id}
              className={`bg-slate-900 rounded-2xl border transition-all overflow-hidden shadow-xl flex flex-col ${
                isAlert ? 'border-rose-500/80 shadow-rose-950/40' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isAlert ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
                    }`}
                  />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="text-sm font-bold text-white">{cam.name}</h3>
                      {isDemoCamera && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 rounded font-mono font-bold">
                          DEMO TARGET
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{cam.location}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    isAlert
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {cam.status}
                </span>
              </div>

              {/* Feed Visualizer */}
              <div className="p-3">
                <SimulatedCameraFeed
                  cameraId={cam.id}
                  cameraName={cam.location}
                  isAccident={isAlert || isDemoCamera}
                  stage={isAlert ? 8 : 2}
                  height="h-56"
                  showControls={false}
                />
              </div>

              {/* Telemetry Footer & Actions */}
              <div className="p-4 pt-2 border-t border-slate-800/80 bg-slate-950/30 flex items-center justify-between text-xs mt-auto">
                <div className="font-mono text-slate-400 text-[11px] space-x-3">
                  <span>Vehicles: <strong className="text-slate-200">{cam.activeVehicles}</strong></span>
                  <span>Res: <strong className="text-slate-200">1080p</strong></span>
                </div>

                {isDemoCamera ? (
                  <button
                    onClick={() => simulateAccidentPipeline('S-04')}
                    disabled={isSimulating}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{isSimulating ? 'Processing...' : 'Simulate Accident'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentPage('detection')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
                  >
                    View AI Telemetry
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
