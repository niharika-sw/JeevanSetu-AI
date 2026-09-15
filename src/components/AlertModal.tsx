import React from 'react';
import { AlertOctagon, ArrowRight, ShieldCheck, Siren, X, MapPin, Car } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AlertModal: React.FC = () => {
  const { alertModalIncident, dismissAlertModal, setCurrentPage, setActiveIncident } = useApp();

  if (!alertModalIncident) return null;

  const handleViewIncident = () => {
    setActiveIncident(alertModalIncident);
    dismissAlertModal();
    setCurrentPage('incident-details');
  };

  const handleDispatch = () => {
    setActiveIncident(alertModalIncident);
    dismissAlertModal();
    setCurrentPage('emergency-response');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-rose-500 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.4)] overflow-hidden">
        {/* Top Emergency Header Banner */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <span className="p-2 bg-black/30 rounded-xl animate-bounce">
              <AlertOctagon className="w-7 h-7 text-white" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold tracking-widest uppercase bg-black/40 px-2 py-0.5 rounded">
                  CRITICAL ALERT
                </span>
                <span className="text-xs opacity-90">{alertModalIncident.incident_id}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight mt-0.5">
                ACCIDENT DETECTED
              </h2>
            </div>
          </div>

          <button
            onClick={dismissAlertModal}
            className="text-rose-200 hover:text-white p-1.5 rounded-lg hover:bg-rose-800/60 transition-colors"
            title="Dismiss demo alert"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 flex items-center mb-1">
                <MapPin className="w-3.5 h-3.5 mr-1 text-rose-400" />
                Location
              </span>
              <p className="font-semibold text-white truncate">{alertModalIncident.location}</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 flex items-center mb-1">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                AI Confidence
              </span>
              <p className="font-semibold text-emerald-400 font-mono text-base">
                {alertModalIncident.confidence}%{' '}
                <span className="text-[11px] text-slate-400">(VERIFIED)</span>
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 flex items-center mb-1">
                <Car className="w-3.5 h-3.5 mr-1 text-sky-400" />
                Detected Plate
              </span>
              <p className="font-bold text-sky-300 font-mono">{alertModalIncident.plate_number}</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 flex items-center mb-1">
                <Siren className="w-3.5 h-3.5 mr-1 text-amber-400" />
                Response Status
              </span>
              <p className="font-semibold text-rose-400 flex items-center">
                <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5 animate-ping" />
                ACTIVE DISPATCH
              </p>
            </div>
          </div>

          {/* Reasoning pill */}
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-xs text-slate-300">
            <strong className="text-rose-400 block mb-1">Explainable AI Verification:</strong>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400">
              <li>Sudden vehicle trajectory angular divergence (&gt;45° in 120ms)</li>
              <li>Abnormal bounding-box overlap persisted across 16 frames</li>
              <li>Emergency medical (108) and police interceptors alerted</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleDispatch}
              className="w-full sm:flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
            >
              <Siren className="w-4 h-4" />
              <span>DISPATCH RESPONSE</span>
            </button>

            <button
              onClick={handleViewIncident}
              className="w-full sm:flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <span>VIEW INCIDENT</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="text-center pt-1">
            <button
              onClick={dismissAlertModal}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-4"
            >
              Dismiss Demo Alert (Keeps incident active in database)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
