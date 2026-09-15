import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Bell,
  Volume2,
  RefreshCw,
  Save,
  RotateCcw,
  CheckCircle,
  Webhook,
  Send,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testWebhookStatus, setTestWebhookStatus] = useState<string | null>(null);

  const handleSave = () => {
    updateSettings(localSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    resetSettings();
    setLocalSettings({
      detectionThreshold: 80,
      autoDispatch: true,
      familyNotification: true,
      cameraFps: 30,
      soundAlerts: true,
      webhookUrl: 'https://emergency.smartcity.gov.in/api/v1/sos-dispatch',
    });
  };

  const handleTestWebhook = () => {
    setTestWebhookStatus('Testing mock connection...');
    setTimeout(() => {
      setTestWebhookStatus('HTTP 200 OK — Mock SOS Dispatcher Verified (Latency: 24ms)');
      setTimeout(() => setTestWebhookStatus(null), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Command Center Configuration & Dispatch Rules
            </h2>
            <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
              Autonomous Governance
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Fine-tune computer vision confidence sensitivity, multi-agency dispatch triggers, and emergency contact policies.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center space-x-2 font-medium">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>Configuration parameters successfully updated and synchronized.</span>
        </div>
      )}

      {/* Settings Sections */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Detection Threshold */}
        <div className="space-y-3 pb-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Detection Confidence Threshold</h3>
              <p className="text-xs text-slate-400">
                Minimum AI confidence score required before automatically classifying a vehicle anomaly as an accident.
              </p>
            </div>
            <span className="text-sm font-black font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-xl">
              {localSettings.detectionThreshold}%
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs font-mono text-slate-500">50%</span>
            <input
              type="range"
              min="50"
              max="95"
              step="1"
              value={localSettings.detectionThreshold}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, detectionThreshold: Number(e.target.value) })
              }
              className="flex-1 accent-sky-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-500">95%</span>
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-800">
          {/* Auto-Dispatch Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Auto-Dispatch Services</span>
              <span className="text-[11px] text-slate-400">
                Instantly trigger EMS 108 and Police without human operator delay
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.autoDispatch}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, autoDispatch: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Family SOS Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Family SMS SOS Notification</span>
              <span className="text-[11px] text-slate-400">
                Transmit immediate SMS to emergency contact upon ANPR lookup
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.familyNotification}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, familyNotification: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Sound Alerts */}
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Audio Siren & Voice Cue</span>
              <span className="text-[11px] text-slate-400">
                Sound acoustic warning during live critical detection
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.soundAlerts}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, soundAlerts: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </div>

          {/* Camera FPS */}
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Camera Buffer FPS</span>
              <span className="text-[11px] text-slate-400">
                Inference frame intake frequency per stream
              </span>
            </div>
            <div className="inline-flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              {[15, 30, 60].map((fps) => (
                <button
                  key={fps}
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, cameraFps: fps })}
                  className={`px-2.5 py-1 rounded transition-colors font-mono ${
                    localSettings.cameraFps === fps
                      ? 'bg-sky-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {fps}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Dispatch Webhook URL */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Emergency Dispatch Webhook Endpoint</h3>
              <p className="text-xs text-slate-400">
                POST destination for real-time JSON packets to municipal CAD (Computer-Aided Dispatch).
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Webhook className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={localSettings.webhookUrl}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, webhookUrl: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              onClick={handleTestWebhook}
              type="button"
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span>Test Webhook</span>
            </button>
          </div>

          {testWebhookStatus && (
            <p className="text-xs text-emerald-400 font-mono flex items-center space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{testWebhookStatus}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
