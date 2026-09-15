import React from 'react';
import { PhoneCall, ShieldAlert, X, CheckCheck, MessageSquare, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationModal: React.FC = () => {
  const { notificationPreview, setNotificationPreview } = useApp();

  if (!notificationPreview || !notificationPreview.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top bar */}
        <div className="bg-slate-800/90 px-5 py-3.5 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Emergency Contact Dispatch</h3>
              <p className="text-[11px] text-slate-400">Simulated SMS & WhatsApp Gateway</p>
            </div>
          </div>

          <button
            onClick={() => setNotificationPreview(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">Recipient Contact:</span>
            <span className="font-mono font-bold text-emerald-400">
              {notificationPreview.recipient}
            </span>
          </div>

          {/* Simulated SMS Bubble */}
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 shadow-inner relative">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="font-bold text-slate-300">JeevanSetu Emergency SOS</span>
              <span className="font-mono text-emerald-400 flex items-center">
                <CheckCheck className="w-3.5 h-3.5 mr-1" />
                DELIVERED
              </span>
            </div>

            <p className="text-sm text-slate-100 font-sans leading-relaxed">
              &ldquo;{notificationPreview.message}&rdquo;
            </p>

            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Automated Dispatch Engine</span>
              <span>Latency: 8.0s</span>
            </div>
          </div>

          {/* Demo Notice Banner */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start space-x-2.5 text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Demo Environment Notice:</strong> This alert was simulated for demonstration and hackathon evaluation. No real personal phone numbers or carriers are contacted.
            </span>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setNotificationPreview(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm border border-slate-700 transition-colors"
            >
              Close Notification Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
