import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { BarChart3, TrendingUp, Zap, Clock, ShieldCheck, Award } from 'lucide-react';
import {
  hotspotsData,
  timeOfDayData,
  accuracyTrendData,
  responseTimeComparisonData,
} from '../data/seedData';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Predictive Incident Analytics & Performance Metrics
            </h2>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
              Telematics v2.4
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical benchmarking and algorithmic response latency comparisons for urban traffic safety.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-emerald-400 font-bold">
            Response Acceleration: 98.9%
          </span>
        </div>
      </div>

      {/* Hero Metric Comparison: Manual (8-15 min) vs JeevanSetu AI (8 sec) */}
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-emerald-950/60 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Life-Saving Latency Compression</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Golden Hour Impact: 8 Seconds vs 12 Minutes
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Conventional accident reporting relies on passing bystanders dialing emergency services, resulting in an average latency of 8 to 15 minutes. JeevanSetu AI compresses detection-to-dispatch latency down to <strong>8 seconds</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 shrink-0 font-mono">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-rose-500/40 text-center">
              <span className="text-[11px] text-slate-400 block font-sans">Manual Reporting</span>
              <span className="text-2xl font-black text-rose-400 block mt-1">12.0 min</span>
              <span className="text-[10px] text-slate-400 font-sans">Human witness delay</span>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-500/40 text-center shadow-lg shadow-emerald-950/40">
              <span className="text-[11px] text-slate-400 block font-sans">JeevanSetu AI</span>
              <span className="text-2xl font-black text-emerald-400 block mt-1">0.13 min</span>
              <span className="text-[10px] text-emerald-400 font-sans font-bold">8.0 seconds automated</span>
            </div>
          </div>
        </div>

        {/* Response comparison chart */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={responseTimeComparisonData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" tickFormatter={(v) => `${v} min`} />
              <YAxis dataKey="method" type="category" stroke="#94a3b8" width={110} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value) => [`${value} minutes`, 'Response Latency']}
              />
              <Bar dataKey="time_minutes" fill="#0ea5e9" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Hotspots, Time-of-Day, & AI Accuracy Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hotspots Chart (Section 19) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Accident Frequency by Junction (Hotspots)</h3>
            <span className="text-[11px] text-slate-400 font-mono">Monthly Aggregate</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hotspotsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="camera" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="accidents" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time of Day Distribution (Section 19) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Collision Distribution by Time of Day</h3>
            <span className="text-[11px] text-slate-400 font-mono">24h Hourly Cycle</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeOfDayData}>
                <defs>
                  <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="count" stroke="#f59e0b" fillOpacity={1} fill="url(#timeGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Accuracy & Confidence Trend (Section 19) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white">Model Precision & Confidence Evolution</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">YOLOv8n + EasyOCR Fine-Tuning</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis domain={[80, 100]} stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="confidence" name="Mean Confidence" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="accuracy" name="Verified Accuracy" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
