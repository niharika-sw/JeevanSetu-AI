import React, { useState } from 'react';
import { MapPin, Navigation, Eye, ShieldAlert, Ambulance, Camera, Radio } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LeafletMap } from '../components/LeafletMap';
import { Incident } from '../types';

export const MapPage: React.FC = () => {
  const { incidents, cameras, activeIncident, setActiveIncident, setCurrentPage } = useApp();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(activeIncident || incidents[0]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Live Geographic Incident & Emergency Dispatch Map
            </h2>
            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
              Prayagraj Smart-City Zone
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time geospatial tracking of CCTV nodes, detected collision coordinates, and emergency interceptors.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
            Center: <strong>25.4358° N, 81.8463° E</strong>
          </span>
        </div>
      </div>

      {/* Main Map + Incident Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Viewport */}
        <div className="lg:col-span-8">
          <LeafletMap
            incidents={incidents}
            cameras={cameras}
            selectedIncident={selectedIncident}
            height="h-[550px]"
          />
        </div>

        {/* Incidents & Camera Directory Side Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Active Geographic Incidents</h3>
              <span className="text-xs text-rose-400 font-mono font-bold">
                {incidents.filter((i) => i.incident_status === 'ACTIVE').length} Active
              </span>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {incidents.map((inc) => {
                const isSelected = selectedIncident?.id === inc.id;
                const isActive = inc.incident_status === 'ACTIVE';

                return (
                  <div
                    key={inc.id}
                    onClick={() => {
                      setSelectedIncident(inc);
                      setActiveIncident(inc);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-950/30'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-white">{inc.incident_id}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          isActive
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}
                      >
                        {inc.incident_status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-medium truncate">{inc.location}</p>

                    <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400 font-mono">
                      <span>Conf: <strong className="text-emerald-400">{inc.confidence}%</strong></span>
                      <span>Plate: <strong className="text-sky-300">{inc.plate_number}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedIncident && (
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setActiveIncident(selectedIncident);
                    setCurrentPage('incident-details');
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>View Details for {selectedIncident.incident_id}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
