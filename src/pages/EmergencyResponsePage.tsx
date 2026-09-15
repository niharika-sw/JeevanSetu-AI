import React from 'react';
import {
  Ambulance,
  Shield,
  PhoneCall,
  CheckCircle2,
  Clock,
  Navigation,
  MapPin,
  Car,
  FileText,
  Radio,
  Send,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HorizontalResponseTimeline } from '../components/HorizontalResponseTimeline';

export const EmergencyResponsePage: React.FC = () => {
  const {
    activeIncident,
    updateAmbulanceStatus,
    updatePoliceStatus,
    triggerFamilyNotification,
    setNotificationPreview,
    setCurrentPage,
  } = useApp();

  const inc = activeIncident;

  const handleSimulateAmbulance = async () => {
    if (!inc) return;
    if (inc.ambulance_status === 'DISPATCHING') {
      await updateAmbulanceStatus(inc.id, 'EN ROUTE');
    } else if (inc.ambulance_status === 'EN ROUTE') {
      await updateAmbulanceStatus(inc.id, 'ARRIVED');
    } else {
      await updateAmbulanceStatus(inc.id, 'EN ROUTE');
    }
  };

  const handleSimulatePolice = async () => {
    if (!inc) return;
    if (inc.police_status === 'ALERT SENT') {
      await updatePoliceStatus(inc.id, 'PATROL DISPATCHED');
    } else if (inc.police_status === 'PATROL DISPATCHED') {
      await updatePoliceStatus(inc.id, 'ON SCENE');
    } else {
      await updatePoliceStatus(inc.id, 'PATROL DISPATCHED');
    }
  };

  const handleViewFamilyNotification = () => {
    if (!inc) return;
    setNotificationPreview({
      open: true,
      recipient: inc.vehicle_details?.emergency_contact || '+91 98765 43210',
      plate: inc.plate_number || 'UP32 AB 1234',
      message: `Emergency alert: A possible accident involving registered vehicle ${inc.plate_number || 'UP32 AB 1234'} has been detected near ${inc.location || 'Signal S-04, Prayagraj'}. Emergency responders have been notified. (Simulated Demo)`,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <Ambulance className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Multi-Agency Emergency Response Command
            </h2>
            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
              Dispatch Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simultaneous real-time orchestration across Medical Emergency 108, Police Traffic Division, and Family SOS.
          </p>
        </div>

        {inc && (
          <div className="flex items-center space-x-3 text-xs bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 font-mono">
            <span className="text-slate-400">Incident Target:</span>
            <span className="text-white font-bold">{inc.incident_id}</span>
            <span className="text-rose-400 font-semibold">• {inc.location}</span>
          </div>
        )}
      </div>

      {/* THREE EMERGENCY RESPONSE CARDS (Section 15) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1: AMBULANCE */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <Ambulance className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AMBULANCE (108)</h3>
                  <p className="text-[11px] text-slate-400">Paramedic Trauma Response</p>
                </div>
              </div>

              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                  inc?.ambulance_status === 'ARRIVED'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : inc?.ambulance_status === 'EN ROUTE'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {inc?.ambulance_status || 'DISPATCHING'}
              </span>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Alert created automatically</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>GPS coordinates & route shared</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Incident severity & collision telematics sent</span>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 font-mono">
                <div>Unit: <strong>Prayagraj Trauma Amb-108</strong></div>
                <div>Estimated Arrival: <strong>{inc?.ambulance_status === 'ARRIVED' ? '0 mins (On Scene)' : '2.5 mins'}</strong></div>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-800">
            <button
              onClick={handleSimulateAmbulance}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>
                {inc?.ambulance_status === 'ARRIVED'
                  ? 'Ambulance On Scene (Re-simulate)'
                  : inc?.ambulance_status === 'EN ROUTE'
                  ? 'Simulate Ambulance Arrival'
                  : 'Simulate Ambulance En Route'}
              </span>
            </button>
          </div>
        </div>

        {/* CARD 2: POLICE */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">POLICE PATROL</h3>
                  <p className="text-[11px] text-slate-400">Traffic Interceptor Division</p>
                </div>
              </div>

              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                  inc?.police_status === 'ON SCENE'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                }`}
              >
                {inc?.police_status || 'ALERT SENT'}
              </span>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Incident location transmitted</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Vehicle plate ({inc?.plate_number}) mapped</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Accident confidence ({inc?.confidence}%) confirmed</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Camera feed (S-04) linked to dispatch unit</span>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-800">
            <button
              onClick={handleSimulatePolice}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>
                {inc?.police_status === 'ON SCENE'
                  ? 'Police On Scene (Re-simulate)'
                  : inc?.police_status === 'PATROL DISPATCHED'
                  ? 'Simulate Police Arrival'
                  : 'Simulate Patrol Dispatched'}
              </span>
            </button>
          </div>
        </div>

        {/* CARD 3: FAMILY / EMERGENCY CONTACT */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">FAMILY / CONTACT</h3>
                  <p className="text-[11px] text-slate-400">Registered Emergency SOS</p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                {inc?.family_status || 'NOTIFIED'}
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Emergency contact notification simulated</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                <div className="text-slate-400">Registered Contact:</div>
                <div className="font-mono font-bold text-white">
                  {inc?.vehicle_details?.contact_name || 'Kavita Demo (Spouse)'}
                </div>
                <div className="font-mono text-emerald-400">
                  {inc?.vehicle_details?.emergency_contact || '+91 98765 43210'}
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Autonomous SMS & WhatsApp SOS sent within 8 seconds of camera impact detection.
              </p>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={handleViewFamilyNotification}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Notification Message</span>
            </button>
          </div>
        </div>
      </div>

      {/* Latency Response Timeline (Section 16) */}
      <HorizontalResponseTimeline incident={inc} />
    </div>
  );
};
