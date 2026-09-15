import React from 'react';
import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  Cpu,
  Eye,
  ShieldCheck,
  Check,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Car,
  MapPin,
  Siren,
  PhoneCall,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SimulatedCameraFeed } from '../components/SimulatedCameraFeed';
import { ConfidenceRing } from '../components/ConfidenceRing';
import { HorizontalResponseTimeline } from '../components/HorizontalResponseTimeline';

export const AccidentDetectionPage: React.FC = () => {
  const {
    pipelineStage,
    isSimulating,
    simulateAccidentPipeline,
    replayIncidentTimeline,
    activeIncident,
    responseTimer,
  } = useApp();

  const stages = [
    {
      id: 1,
      title: 'CAMERA INPUT',
      desc: 'Frame received & buffered from Signal S-04 RTSP stream (1080p @ 30 FPS)',
      detail: '✓ Frame received',
      allotment: '0.3s Allotment (T=0.0s)',
    },
    {
      id: 2,
      title: 'VEHICLE DETECTION',
      desc: 'YOLOv8 inference localizes bounding boxes and initial velocity vectors',
      detail: '✓ 2 vehicles detected',
      allotment: '0.7s Allotment (T=1.0s)',
    },
    {
      id: 3,
      title: 'COLLISION PATTERN ANALYSIS',
      desc: 'Optical flow & kinematic decay model detects sudden deceleration & overlap',
      detail: '✓ Sudden trajectory change detected',
      allotment: '1.4s Allotment (T=2.4s — Detection Complete)',
    },
    {
      id: 4,
      title: 'TEMPORAL VERIFICATION',
      desc: 'Multi-frame tracking eliminates transient occlusion or animal crossings',
      detail: '✓ Pattern persisted across multiple frames',
      allotment: '1.6s Allotment (T=4.0s — Verified)',
    },
    {
      id: 5,
      title: 'ACCIDENT CONFIRMED',
      desc: 'Confidence model surpasses strict 85% safety activation threshold',
      detail: `✓ Confidence: ${activeIncident?.confidence || 94.7}%`,
      allotment: '0.4s Allotment (T=4.4s)',
    },
    {
      id: 6,
      title: 'LOCATION IDENTIFIED',
      desc: 'Camera coordinate mapping maps exact GPS junction and intersection zone',
      detail: '✓ Signal S-04, Prayagraj',
      allotment: '0.6s Allotment (T=5.0s)',
    },
    {
      id: 7,
      title: 'NUMBER PLATE RECOGNITION',
      desc: 'High Security Registration Plate (HSRP) crop extracted & OCR decoded',
      detail: `✓ ${activeIncident?.plate_number || 'UP32 AB 1234'}`,
      allotment: '1.0s Allotment (T=6.0s)',
    },
    {
      id: 8,
      title: 'EMERGENCY RESPONSE INITIATED',
      desc: 'Simultaneous API dispatches sent to Medical 108, Police, & Family Contact',
      detail: '✓ Coordinated Emergency Response Active',
      allotment: '2.0s Allotment (T=8.0s — Full SLA Met)',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Simulation Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              AI Accident Detection & Verification Pipeline
            </h2>
            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
              Autonomous Verification
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end computer vision pipeline with multi-frame temporal persistence and explainable confidence scoring.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => replayIncidentTimeline()}
            disabled={isSimulating}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4 text-sky-400" />
            <span>Replay</span>
          </button>

          <button
            onClick={() => simulateAccidentPipeline('S-04')}
            disabled={isSimulating}
            className="px-5 py-2.5 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-rose-600/30 border border-rose-400/40 flex items-center space-x-2 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <AlertOctagon className={`w-4 h-4 ${isSimulating ? 'animate-spin' : 'animate-pulse'}`} />
            <span>{isSimulating ? 'PIPELINE RUNNING...' : '🚨 SIMULATE ACCIDENT'}</span>
          </button>
        </div>
      </div>

      {/* Main Split: Camera Feed + 8-Stage Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Camera Feed & Latency Timeline */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="font-bold text-white">Camera S-04 Feed (Inspection Stream)</span>
              </div>
              <span className="font-mono text-slate-400">FPS: 30 • HD AI Optical</span>
            </div>

            <SimulatedCameraFeed
              cameraId="S-04"
              cameraName="Signal S-04, Prayagraj"
              isAccident={pipelineStage >= 3}
              stage={pipelineStage}
              height="h-72 sm:h-80"
            />
          </div>

          {/* Explainable AI Confidence System & False Alarm Reduction */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Confidence Card (Section 10) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col items-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                AI Confidence System
              </span>

              <ConfidenceRing
                score={activeIncident?.confidence || 94.7}
                size={130}
                strokeWidth={9}
              />

              <div className="w-full text-left mt-4 pt-3 border-t border-slate-800 text-xs space-y-1.5">
                <span className="font-bold text-slate-200 block text-[11px]">
                  Explainable Detection Reasoning:
                </span>
                <ul className="text-slate-400 text-[11px] space-y-1">
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-1.5">•</span>
                    Sudden vehicle trajectory change (&gt;45°)
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-1.5">•</span>
                    Abnormal vehicle bounding-box overlap (IoU 0.68)
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-1.5">•</span>
                    Sudden kinetic speed reduction (-0.88G)
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-1.5">•</span>
                    Collision persistence across 16 sequential frames
                  </li>
                </ul>
              </div>
            </div>

            {/* False Alarm Reduction Card (Section 11) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    AI Verification
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    Noise Filtered
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-300">Temporal Tracking</span>
                    <span className="text-emerald-400 font-bold flex items-center">
                      <Check className="w-3.5 h-3.5 mr-1" /> Passed
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-300">Multiple Visual Cues</span>
                    <span className="text-emerald-400 font-bold flex items-center">
                      <Check className="w-3.5 h-3.5 mr-1" /> Passed
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-300">Frame Persistence</span>
                    <span className="text-emerald-400 font-bold flex items-center">
                      <Check className="w-3.5 h-3.5 mr-1" /> Passed
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-300">Collision Signature</span>
                    <span className="text-emerald-400 font-bold flex items-center">
                      <Check className="w-3.5 h-3.5 mr-1" /> Confirmed
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <span className="text-xs text-slate-400 block font-semibold">Final Decision</span>
                <span className="text-sm font-black text-emerald-400 tracking-wider font-mono">
                  ACCIDENT VERIFIED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 8-Stage Real-Time Pipeline Visualizer (Section 9) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>8-Step Autonomous Pipeline</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visual stage progression with millisecond timestamps
                </p>
              </div>

              <div className="text-right font-mono">
                <span className="text-xs text-slate-400 block">Active Stage</span>
                <span className="text-base font-bold text-rose-400">
                  {pipelineStage === 0 ? 'Ready (Idle)' : `Stage ${pipelineStage} / 8`}
                </span>
              </div>
            </div>

            {/* Stage Steps List */}
            <div className="space-y-2.5">
              {stages.map((stage) => {
                const isPassed = pipelineStage >= stage.id;
                const isCurrent = pipelineStage === stage.id && isSimulating;

                return (
                  <div
                    key={stage.id}
                    className={`p-3 rounded-xl border transition-all duration-300 ${
                      isPassed
                        ? 'bg-slate-950/90 border-emerald-500/40 shadow-sm'
                        : isCurrent
                        ? 'bg-rose-950/30 border-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                        : 'bg-slate-950/40 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isPassed
                              ? 'bg-emerald-500 text-slate-950'
                              : isCurrent
                              ? 'bg-rose-500 text-white animate-bounce'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : stage.id}
                        </div>

                        <div>
                          <div className="flex items-center flex-wrap gap-1.5">
                            <span className="text-xs font-bold text-white tracking-wide">
                              {stage.title}
                            </span>
                            {isPassed && (
                              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                                {stage.detail}
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-amber-400/90 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                              {stage.allotment}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                            {stage.desc}
                          </p>
                        </div>
                      </div>

                      {isCurrent && (
                        <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 animate-pulse shrink-0">
                          PROCESSING...
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Latency Response Timeline */}
      <HorizontalResponseTimeline incident={activeIncident} />
    </div>
  );
};
