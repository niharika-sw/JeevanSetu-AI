import React, { useState } from 'react';
import {
  Car,
  Search,
  CheckCircle,
  AlertTriangle,
  User,
  Phone,
  ShieldCheck,
  Heart,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Vehicle } from '../types';

export const VehicleAnprPage: React.FC = () => {
  const { vehicles, activeIncident, setNotificationPreview } = useApp();
  const [searchQuery, setSearchQuery] = useState('UP32 AB 1234');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
    vehicles.find((v) => v.plate_number === 'UP32 AB 1234') || vehicles[0]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase().replace(/\s+/g, ' ');
    const found = vehicles.find(
      (v) =>
        v.plate_number.toUpperCase().includes(query) ||
        v.plate_number.replace(/\s+/g, '').includes(query.replace(/\s+/g, '')) ||
        v.owner_name.toLowerCase().includes(query.toLowerCase())
    );
    if (found) {
      setSelectedVehicle(found);
    }
  };

  const selectPlate = (veh: Vehicle) => {
    setSelectedVehicle(veh);
    setSearchQuery(veh.plate_number);
  };

  const handleTestSMS = () => {
    if (!selectedVehicle) return;
    setNotificationPreview({
      open: true,
      recipient: `${selectedVehicle.emergency_contact} (${selectedVehicle.contact_name})`,
      plate: selectedVehicle.plate_number,
      message: `Emergency alert: A possible accident involving registered vehicle ${selectedVehicle.plate_number} has been detected near Signal S-04, Prayagraj. Emergency responders have been notified. (Simulated Demo)`,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <Car className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Automated Number Plate Recognition (ANPR) & Registry
            </h2>
            <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
              OCR Engine Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulated Indian Ministry of Road Transport & Highways (MoRTH) vehicle database lookup.
          </p>
        </div>

        {/* Quick plate selection pills */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Demo Plates:</span>
          {vehicles.map((v) => (
            <button
              key={v.id}
              onClick={() => selectPlate(v)}
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                selectedVehicle?.id === v.id
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              {v.plate_number}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by license plate (e.g. UP32 AB 1234, DL01 XY 9876) or owner name..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-28 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 shadow-xl"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
        >
          Lookup
        </button>
      </form>

      {/* Main Grid: Plate Visualizer & Telematics Profile */}
      {selectedVehicle && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: High-Security Registration Plate (HSRP) Visualizer */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-center flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                HSRP Optical Character Recognition
              </span>

              {/* Realistic Indian Number Plate Display */}
              <div className="w-full max-w-sm bg-white rounded-xl p-2 border-4 border-slate-900 shadow-2xl flex items-center select-none">
                {/* Left IND Blue Flag */}
                <div className="bg-blue-700 text-white w-10 h-16 rounded-l-lg flex flex-col items-center justify-between py-1.5 shrink-0">
                  <span className="text-[9px] font-bold">🇮🇳</span>
                  <div className="w-3.5 h-3.5 rounded-full border border-yellow-300 flex items-center justify-center">
                    <span className="text-[6px] text-yellow-300 font-bold">✦</span>
                  </div>
                  <span className="text-[10px] font-black tracking-widest font-mono">IND</span>
                </div>

                {/* Embossed Characters */}
                <div className="flex-1 text-center py-2">
                  <span className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-slate-950 font-sans">
                    {selectedVehicle.plate_number}
                  </span>
                </div>
              </div>

              {/* OCR Confidence Tag */}
              <div className="mt-5 flex items-center space-x-2 text-xs font-mono">
                <span className="text-slate-400">EasyOCR Confidence:</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  98.2% (HSRP Standard Compliant)
                </span>
              </div>

              {/* Vehicle photo preview card */}
              <div className="w-full mt-6 p-4 bg-slate-950 rounded-xl border border-slate-800 text-left space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Visual Vehicle Match</span>
                  <span className="text-sky-400 font-mono font-semibold">1080p Crop Match</span>
                </div>
                <div className="h-28 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center text-slate-500 text-xs flex-col space-y-1">
                  <Car className="w-8 h-8 text-slate-400" />
                  <span className="text-slate-300 font-semibold">{selectedVehicle.model}</span>
                  <span className="text-[10px] text-slate-500">Optical color: White Metallic</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Registered Owner & Emergency Contact Registry */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">Registered Owner Profile</h3>
                  <p className="text-xs text-slate-400">Verified vehicle registration record</p>
                </div>

                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  REGISTRY VERIFIED
                </span>
              </div>

              {/* Detailed profile grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 flex items-center mb-1 text-[11px]">
                    <User className="w-3.5 h-3.5 mr-1 text-sky-400" />
                    Registered Owner
                  </span>
                  <span className="text-sm font-bold text-white block">
                    {selectedVehicle.owner_name}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 flex items-center mb-1 text-[11px]">
                    <Car className="w-3.5 h-3.5 mr-1 text-sky-400" />
                    Vehicle Make / Model
                  </span>
                  <span className="text-sm font-bold text-white block">
                    {selectedVehicle.model}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 flex items-center mb-1 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    Insurance Status
                  </span>
                  <span className="text-sm font-bold text-emerald-400 block font-mono">
                    {selectedVehicle.insurance_status}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 flex items-center mb-1 text-[11px]">
                    <Heart className="w-3.5 h-3.5 mr-1 text-rose-400" />
                    Driver Blood Group
                  </span>
                  <span className="text-sm font-bold text-rose-400 block font-mono">
                    {selectedVehicle.blood_group}
                  </span>
                </div>
              </div>

              {/* Emergency Contact SOS Card */}
              <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950 rounded-2xl border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Emergency Contact SOS
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Primary Guardian
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
                  <div>
                    <span className="text-xs text-slate-400 block font-sans">Contact Name</span>
                    <span className="text-sm font-bold text-white">
                      {selectedVehicle.contact_name}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block font-sans">Phone Number</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {selectedVehicle.emergency_contact}
                    </span>
                  </div>

                  <button
                    onClick={handleTestSMS}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Dispatched SMS</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
