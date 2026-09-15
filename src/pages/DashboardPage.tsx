import React from 'react';
import {
  AlertTriangle,
  Clock,
  Send,
  CheckCircle,
  Activity,
  ShieldAlert,
  ArrowRight,
  Siren,
  MapPin,
  Car,
  Camera,
  Play,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SimulatedCameraFeed } from '../components/SimulatedCameraFeed';
import { HorizontalResponseTimeline } from '../components/HorizontalResponseTimeline';
import { LeafletMap } from '../components/LeafletMap';

export const DashboardPage: React.FC = () => {
  const {
    kpis,
    incidents,
    activeIncident,
    setActiveIncident,
    setCurrentPage,
    cameras,
    simulateAccidentPipeline,
    isSimulating,
  } = useApp();

  // Find active emergency or fall back to primary incident
  const currentEmergency =
    incidents.find((i) => i.incident_status === 'ACTIVE' || i.incident_status === 'DISPATCHED') ||
    activeIncident ||
    incidents[0];

  const handleViewIncident = () => {
    if (currentEmergency) {
      setActiveIncident(currentEmergency);
      setCurrentPage('incident-details');
    }
  };

  const handleDispatchResponse = () => {
    if (currentEmergency) {
      setActiveIncident(currentEmergency);
      setCurrentPage('emergency-response');
    }
  };

  const handleOpenMap = () => {
    if (currentEmergency) {
      setActiveIncident(currentEmergency);
      setCurrentPage('map');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* KPI 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Incidents Today</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {kpis.totalIncidentsToday}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Prayagraj Surveillance</span>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900 border border-rose-500/40 rounded-2xl p-4 shadow-lg shadow-rose-950/20 relative overflow-hidden">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-semibold flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-ping" />
              Active Emergencies
            </span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
            {kpis.activeEmergencies}
          </div>
          <span className="text-[10px] text-rose-300/80 mt-1 block font-mono">Dispatch Active</span>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Detection Time Allotment</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            {kpis.avgDetectionTime}{' '}
            <span className="text-sm font-normal text-slate-400">sec</span>
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block">Target: ≤ 2.4s (Met)</span>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Avg Notification Time</span>
            <Send className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {kpis.avgNotificationTime}{' '}
            <span className="text-sm font-normal text-slate-400">sec</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Automated Dispatch</span>
        </div>

        {/* KPI 5 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Response Rate</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {kpis.responseRate}%
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block font-mono">+4% vs manual avg</span>
        </div>

        {/* KPI 6 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">AI Confidence</span>
            <AlertTriangle className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {kpis.aiConfidence}%
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Multi-Frame Verified</span>
        </div>
      </div>

      {/* LIVE INCIDENT ALERT CARD (Section 7) */}
      {currentEmergency && (
        <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 border-2 border-rose-500/80 rounded-2xl p-5 shadow-[0_0_35px_rgba(239,68,68,0.25)] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-black bg-rose-600 text-white tracking-wider animate-pulse">
                  🚨 ACCIDENT DETECTED
                </span>
                <span className="text-xs font-mono font-bold text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  ID: {currentEmergency.incident_id}
                </span>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
                  AI Confidence: {currentEmergency.confidence}% ({currentEmergency.verification_status})
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                <div>
                  <span className="text-slate-400 block text-[11px]">Location</span>
                  <span className="font-bold text-white truncate block">{currentEmergency.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Time</span>
                  <span className="font-bold text-white font-mono">{currentEmergency.timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Vehicles Involved</span>
                  <span className="font-bold text-white">{currentEmergency.vehicle_count} Vehicles</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Plate Recognized</span>
                  <span className="font-bold text-sky-400 font-mono">{currentEmergency.plate_number}</span>
                </div>
              </div>

              <div className="text-xs font-semibold text-rose-400 flex items-center pt-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 mr-2 animate-ping" />
                Status: EMERGENCY RESPONSE ACTIVE (Ambulance & Police Notified)
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={handleViewIncident}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <span>View Incident</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={handleDispatchResponse}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Siren className="w-4 h-4" />
                <span>Dispatch Response</span>
              </button>

              <button
                onClick={handleOpenMap}
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-600/30 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>Open Map</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Simulated Camera Feed & Leaflet Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Traffic Monitoring Feed (Camera S-04) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white">Live Camera Surveillance • Signal S-04</h3>
              </div>

              <button
                onClick={() => simulateAccidentPipeline('S-04')}
                disabled={isSimulating}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow-md shadow-rose-600/20 flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                <span>{isSimulating ? 'Analyzing...' : 'Simulate Accident'}</span>
              </button>
            </div>

            <SimulatedCameraFeed
              cameraId="S-04"
              cameraName="Prayagraj Central Signal Junction"
              isAccident={true}
              stage={8}
              height="h-72 sm:h-80"
            />
          </div>

          {/* Response Latency Timeline */}
          <HorizontalResponseTimeline incident={currentEmergency} />
        </div>

        {/* Right Column: Live Map & Active Cameras Telemetry */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-white">Incident Geographic Map</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Prayagraj, UP</span>
            </div>

            <LeafletMap
              incidents={incidents}
              cameras={cameras}
              selectedIncident={currentEmergency}
              height="h-72"
            />
          </div>

          {/* Quick Monitored Cameras List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-white">
              <span>Monitored Camera Nodes</span>
              <button
                onClick={() => setCurrentPage('monitoring')}
                className="text-sky-400 hover:text-sky-300 text-xs flex items-center"
              >
                <span>View All 12</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>

            <div className="space-y-2">
              {cameras.slice(0, 4).map((cam) => (
                <div
                  key={cam.id}
                  className="flex items-center justify-between p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        cam.status === 'ALERT' ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
                      }`}
                    />
                    <div className="truncate">
                      <span className="font-bold text-white mr-1.5">{cam.id}</span>
                      <span className="text-slate-400 truncate">{cam.location}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                      cam.status === 'ALERT'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/10 text-emerald-400'
                    }`}
                  >
                    {cam.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
