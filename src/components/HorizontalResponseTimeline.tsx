import React, { useState } from 'react';
import { Play, CheckCircle2, ShieldAlert, Car, PhoneCall, AlertTriangle, ChevronDown, ChevronUp, Info, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Incident } from '../types';

interface HorizontalResponseTimelineProps {
  incident?: Incident | null;
  onReplay?: () => void;
}

// Time offset formatter utility
const parseTimeToDate = (timeStr?: string): Date => {
  const d = new Date();
  if (!timeStr || timeStr === '--') return d;
  const parts = timeStr.split(':');
  if (parts.length >= 2) {
    d.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), parseInt(parts[2] || '0', 10), 0);
  }
  return d;
};

const formatOffsetTime = (baseTimeStr?: string, offsetSeconds = 0): string => {
  if (!baseTimeStr || baseTimeStr === '--') return '12:41:08';
  const baseDate = parseTimeToDate(baseTimeStr);
  const offsetDate = new Date(baseDate.getTime() + offsetSeconds * 1000);
  return offsetDate.toLocaleTimeString('en-GB');
};

export const HorizontalResponseTimeline: React.FC<HorizontalResponseTimelineProps> = ({
  incident,
  onReplay,
}) => {
  const { replayIncidentTimeline, isSimulating } = useApp();
  const [showAllotmentDetail, setShowAllotmentDetail] = useState(false);

  const handleReplay = () => {
    if (onReplay) {
      onReplay();
    } else {
      replayIncidentTimeline(incident || undefined);
    }
  };

  const baseTime = incident?.timestamp || '12:41:08';

  const steps = [
    {
      id: 1,
      title: 'Collision Impact',
      stage: 'T = 0.0s',
      time: baseTime,
      allotment: 'Baseline (0.0s)',
      latency: '+0.0s',
      desc: 'Vehicle kinematic shock & trajectory rupture occurs on camera feed',
      icon: AlertTriangle,
      color: 'border-rose-500 text-rose-400 bg-rose-500/10',
      badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    },
    {
      id: 2,
      title: 'AI Detection Allotment',
      stage: 'T + 2.4s',
      time: incident?.detection_time || formatOffsetTime(baseTime, 2),
      allotment: '2.4s Allotment',
      latency: '+2.4s',
      desc: 'YOLOv8 optical inference detects deceleration (-0.88G) & IoU overlap',
      icon: ShieldAlert,
      color: 'border-amber-500 text-amber-400 bg-amber-500/10',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      id: 3,
      title: 'Temporal Verification',
      stage: 'T + 4.0s',
      time: incident?.verification_time || formatOffsetTime(baseTime, 4),
      allotment: '1.6s Allotment',
      latency: '+4.0s',
      desc: '16-frame persistence filter eliminates transient occlusion & animal crossings',
      icon: CheckCircle2,
      color: 'border-sky-500 text-sky-400 bg-sky-500/10',
      badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    },
    {
      id: 4,
      title: 'ANPR & Location Match',
      stage: 'T + 6.0s',
      time: formatOffsetTime(baseTime, 6),
      allotment: '2.0s Allotment',
      latency: '+6.0s',
      desc: `HSRP Plate OCR (${incident?.plate_number || 'UP32 AB 1234'}) & MoRTH contact lookup`,
      icon: Car,
      color: 'border-blue-500 text-blue-400 bg-blue-500/10',
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    {
      id: 5,
      title: 'Multi-Agency CAD & SOS',
      stage: 'T + 8.0s',
      time: incident?.notification_time && incident?.notification_time !== '--' ? incident.notification_time : formatOffsetTime(baseTime, 8),
      allotment: '2.0s Allotment',
      latency: '+8.0s',
      desc: 'Simultaneous automated CAD payload sent to EMS 108, Police & Family SMS',
      icon: PhoneCall,
      color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center flex-wrap gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Detection-to-Notification Latency & Time Allotment
            </h3>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2 py-0.5 rounded font-mono font-semibold">
              Detection Allotment: 2.4s
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2 py-0.5 rounded font-mono font-bold">
              Total SLA: 8.0s
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Golden Hour response budget: <strong className="text-amber-400">2.4s</strong> detection allotment + <strong className="text-sky-400">1.6s</strong> verification + <strong className="text-blue-400">2.0s</strong> ANPR + <strong className="text-emerald-400">2.0s</strong> multi-agency dispatch = <strong className="text-emerald-400">8.0s Total Latency</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setShowAllotmentDetail(!showAllotmentDetail)}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-sky-400" />
            <span>Budget Allotment</span>
            {showAllotmentDetail ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleReplay}
            disabled={isSimulating}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulating...' : 'Replay Timeline'}</span>
          </button>
        </div>
      </div>

      {/* Horizontal Step Timeline */}
      <div className="relative pt-2 pb-1">
        {/* Progress track line across desktop */}
        <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1 -translate-y-6 bg-slate-800 rounded-full z-0 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-rose-500 via-amber-500 via-sky-500 to-emerald-500 w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 relative z-10">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.id}
                className="flex md:flex-col items-start md:items-center bg-slate-950/80 md:bg-slate-950/40 p-3.5 md:p-3 rounded-xl border border-slate-800 transition-all hover:border-slate-700"
              >
                {/* Node icon pill */}
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-lg ${step.color} transition-transform hover:scale-105`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="ml-3 md:ml-0 md:mt-2.5 md:text-center w-full">
                  <div className="flex items-center md:justify-center flex-wrap gap-1">
                    <span className="text-xs font-bold text-white tracking-wide">
                      {step.title}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${step.badgeBg}`}>
                      {step.latency}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-slate-300 font-semibold mt-1">
                    {step.time}
                  </div>

                  <div className="mt-1 inline-block text-[10px] font-mono text-amber-300/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    {step.allotment}
                  </div>

                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 md:line-clamp-2 leading-tight">
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Allotment Budget Bar */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>8.0s Response Allotment Budget Distribution</span>
          </span>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">
            100% On-Target SLA
          </span>
        </div>

        {/* Progress Bar Segments */}
        <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
          <div
            style={{ width: '30%' }}
            className="bg-amber-500 h-full transition-all hover:opacity-90 relative group"
            title="Detection Allotment: 2.4s (30%)"
          />
          <div
            style={{ width: '20%' }}
            className="bg-sky-500 h-full transition-all hover:opacity-90 relative group"
            title="Verification Allotment: 1.6s (20%)"
          />
          <div
            style={{ width: '25%' }}
            className="bg-blue-500 h-full transition-all hover:opacity-90 relative group"
            title="ANPR & Matching Allotment: 2.0s (25%)"
          />
          <div
            style={{ width: '25%' }}
            className="bg-emerald-500 h-full transition-all hover:opacity-90 relative group"
            title="CAD Dispatch & SOS Allotment: 2.0s (25%)"
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 shrink-0" />
            <span className="text-slate-300">Detection: <strong>2.4s (30%)</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 shrink-0" />
            <span className="text-slate-300">Verification: <strong>1.6s (20%)</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 shrink-0" />
            <span className="text-slate-300">ANPR / Geo: <strong>2.0s (25%)</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shrink-0" />
            <span className="text-slate-300">Dispatch CAD: <strong>2.0s (25%)</strong></span>
          </div>
        </div>
      </div>

      {/* Collapsible Explainer: Mathematical Breakdown of 2.4s Detection Allotment */}
      {showAllotmentDetail && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span>Technical Specification: 2.4-Second Detection Allotment</span>
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Edge TensorRT GPU Benchmark
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-mono">1. Video Ingest (30 FPS)</span>
              <span className="font-bold text-white">33 ms</span>
              <p className="text-[10px] text-slate-400 mt-0.5">RTSP H.264 frame grab & buffer</p>
            </div>

            <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-mono">2. YOLOv8 Inference</span>
              <span className="font-bold text-amber-400">45 ms</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Bounding box localization & class confidence</p>
            </div>

            <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-mono">3. Kinematic Vector Check</span>
              <span className="font-bold text-sky-400">82 ms</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Deceleration delta (-0.88G) & trajectory angle</p>
            </div>

            <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-mono">4. Detection Confirmation</span>
              <span className="font-bold text-emerald-400">2.4 sec Max Allotment</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Strict ceiling before triggering verification</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
