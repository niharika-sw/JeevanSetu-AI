import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Incident } from '../types';

export const IncidentHistoryPage: React.FC = () => {
  const { incidents, setActiveIncident, setCurrentPage } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.incident_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.camera_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || inc.incident_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleView = (inc: Incident) => {
    setActiveIncident(inc);
    setCurrentPage('incident-details');
  };

  const handleExportCSV = () => {
    const headers = [
      'Incident ID',
      'Timestamp',
      'Location',
      'Camera ID',
      'Vehicles',
      'AI Confidence',
      'Plate Number',
      'Status',
      'Ambulance',
      'Police',
      'Family SOS',
    ];
    const rows = filteredIncidents.map((i) => [
      i.incident_id,
      i.timestamp,
      `"${i.location}"`,
      i.camera_id,
      i.vehicle_count,
      `${i.confidence}%`,
      i.plate_number,
      i.incident_status,
      i.ambulance_status,
      i.police_status,
      i.family_status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'jeevansetu_incident_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(filteredIncidents, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jeevansetu_incident_history.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Incident Audit Log & Historical Records
            </h2>
            <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
              {filteredIncidents.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete cryptographic audit trail of all detected traffic collisions, emergency response dispatches, and resolutions.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, Location, Plate (UP32 AB 1234), or Camera..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="DISPATCHED">DISPATCHED</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="FALSE_ALARM">FALSE ALARM</option>
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
              <tr>
                <th className="px-4 py-3.5">Incident ID</th>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Location & Cam</th>
                <th className="px-4 py-3.5">Vehicles</th>
                <th className="px-4 py-3.5">AI Confidence</th>
                <th className="px-4 py-3.5">Plate Number</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredIncidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-white whitespace-nowrap">
                    {inc.incident_id}
                  </td>
                  <td className="px-4 py-3 text-slate-300 font-mono whitespace-nowrap">
                    {inc.timestamp}
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <div className="font-semibold text-white truncate">{inc.location}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Camera: {inc.camera_id}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                    {inc.vehicle_count}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {inc.confidence}%
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-sky-300 whitespace-nowrap">
                    {inc.plate_number}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        inc.incident_status === 'ACTIVE'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : inc.incident_status === 'RESOLVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {inc.incident_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleView(inc)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold rounded-lg border border-slate-700 transition-colors inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-400" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
