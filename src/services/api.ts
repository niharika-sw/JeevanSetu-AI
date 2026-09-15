import { Camera, Incident, Vehicle, AILog, AnalyticsData, SystemSettings, DashboardKPIs } from '../types';
import {
  INITIAL_CAMERAS,
  INITIAL_INCIDENTS,
  INITIAL_VEHICLES,
  INITIAL_AI_LOGS,
  INITIAL_ANALYTICS,
  INITIAL_SETTINGS,
} from '../data/seedData';

// Local storage fallback key for resilience
const LOCAL_STORAGE_KEY = 'jeevansetu_local_db_v1';

function getLocalFallback() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // Ignore error
  }
  const initial = {
    cameras: INITIAL_CAMERAS,
    incidents: INITIAL_INCIDENTS,
    vehicles: INITIAL_VEHICLES,
    aiLogs: INITIAL_AI_LOGS,
    analytics: INITIAL_ANALYTICS,
    settings: INITIAL_SETTINGS,
  };
  saveLocalFallback(initial);
  return initial;
}

function saveLocalFallback(data: any) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Ignore error
  }
}

export const api = {
  isBackendHealthy: true,

  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch('/api/health', { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        this.isBackendHealthy = true;
        return true;
      }
    } catch (e) {
      // Backend offline
    }
    this.isBackendHealthy = false;
    return false;
  },

  async login(email: string, password?: string, isDemo = false) {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, isDemo }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend login fallback to local demo auth');
    }
    return {
      success: true,
      user: {
        id: 'usr-demo-01',
        name: 'Command Center Director',
        email: email || 'admin@jeevansetu.ai',
        role: 'Emergency Dispatch Commander',
        token: 'local_demo_jwt_token',
      },
    };
  },

  async getDashboard(): Promise<DashboardKPIs & { latestIncident: Incident | null }> {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    const state = getLocalFallback();
    const activeEmergencies = state.incidents.filter(
      (i: Incident) => i.incident_status === 'ACTIVE' || i.incident_status === 'DISPATCHED'
    ).length;
    return {
      totalIncidentsToday: state.incidents.filter((i: Incident) => i.incident_status !== 'FALSE_ALARM').length,
      activeEmergencies: Math.max(activeEmergencies, 1),
      avgDetectionTime: 2.4,
      avgNotificationTime: 5.8,
      responseRate: 96,
      aiConfidence: 94.7,
      totalCameras: 12,
      onlineCameras: 12,
      latestIncident: state.incidents[0] || null,
    };
  },

  async getCameras(): Promise<Camera[]> {
    try {
      const res = await fetch('/api/cameras');
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return getLocalFallback().cameras;
  },

  async getIncidents(): Promise<Incident[]> {
    try {
      const res = await fetch('/api/incidents');
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return getLocalFallback().incidents;
  },

  async getIncident(id: string): Promise<Incident | null> {
    try {
      const res = await fetch(`/api/incidents/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    const state = getLocalFallback();
    return state.incidents.find((i: Incident) => i.id === id || i.incident_id === id) || null;
  },

  async simulateAccident(plate = 'UP32 AB 1234'): Promise<Incident> {
    try {
      const res = await fetch('/api/simulate-accident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.incident;
      }
    } catch (e) {
      // Fallback
    }
    const state = getLocalFallback();
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB');
    const vehicle = state.vehicles.find((v: Vehicle) => v.plate_number === plate) || state.vehicles[0];
    const newInc: Incident = {
      id: 'inc-' + Date.now(),
      incident_id: `JS-2026-0913-${String(state.incidents.length + 1).padStart(3, '0')}`,
      camera_id: 'S-04',
      location: 'Signal S-04, Prayagraj',
      latitude: 25.4358,
      longitude: 81.8463,
      timestamp: timeStr,
      plate_number: vehicle.plate_number,
      vehicle_count: 2,
      confidence: 94.7,
      verification_status: 'VERIFIED',
      ambulance_status: 'DISPATCHING',
      police_status: 'ALERT SENT',
      family_status: 'NOTIFIED',
      incident_status: 'ACTIVE',
      detection_time: new Date(now.getTime() + 2400).toLocaleTimeString('en-GB'),
      verification_time: new Date(now.getTime() + 4000).toLocaleTimeString('en-GB'),
      notification_time: new Date(now.getTime() + 8000).toLocaleTimeString('en-GB'),
      response_time: 8,
      reasoning: [
        'Sudden vehicle trajectory angular divergence (>45° in 120ms)',
        'Abnormal bounding-box overlap IoU > 0.62 persisting across 14 frames',
        'Sudden deceleration vector anomaly (0.84 delta G)',
        'Collision persistence across multi-temporal frames confirmed',
      ],
      vehicle_details: vehicle,
      notes: 'Live demo simulation verified on Camera S-04.',
    };
    state.incidents.unshift(newInc);
    saveLocalFallback(state);
    return newInc;
  },

  async notifyAmbulance(incident_id: string, status = 'EN ROUTE') {
    try {
      const res = await fetch('/api/notify/ambulance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incident_id, status }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return { success: true, status, message: `Ambulance status updated to ${status}` };
  },

  async notifyPolice(incident_id: string, status = 'PATROL DISPATCHED') {
    try {
      const res = await fetch('/api/notify/police', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incident_id, status }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return { success: true, status, message: `Police status updated to ${status}` };
  },

  async notifyFamily(incident_id: string, contact?: string, plate?: string) {
    try {
      const res = await fetch('/api/notify/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incident_id, contact, plate }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return {
      success: true,
      status: 'NOTIFIED',
      messagePreview: `Emergency alert: A possible accident involving registered vehicle ${plate || 'UP32 AB 1234'} has been detected near Signal S-04. Emergency responders have been notified. (Simulated Demo)`,
    };
  },

  async getVehicles(): Promise<Vehicle[]> {
    try {
      const res = await fetch('/api/vehicles/UP32AB1234');
      // For all vehicles:
    } catch (e) {
      //
    }
    return getLocalFallback().vehicles;
  },

  async getVehicle(plate: string): Promise<Vehicle | null> {
    try {
      const res = await fetch(`/api/vehicles/${encodeURIComponent(plate)}`);
      if (res.ok) return await res.json();
    } catch (e) {
      //
    }
    const state = getLocalFallback();
    const clean = plate.replace(/\s+/g, '').toUpperCase();
    return (
      state.vehicles.find(
        (v: Vehicle) => v.plate_number.replace(/\s+/g, '').toUpperCase() === clean
      ) || null
    );
  },

  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) return await res.json();
    } catch (e) {
      //
    }
    return getLocalFallback().analytics;
  },

  async getAILogs(): Promise<AILog[]> {
    try {
      const res = await fetch('/api/ai-logs');
      if (res.ok) return await res.json();
    } catch (e) {
      //
    }
    return getLocalFallback().aiLogs;
  },

  async getSettings(): Promise<SystemSettings> {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) return await res.json();
    } catch (e) {
      //
    }
    return getLocalFallback().settings;
  },

  async saveSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      //
    }
    const state = getLocalFallback();
    state.settings = { ...state.settings, ...settings };
    saveLocalFallback(state);
    return state.settings;
  },

  async resetToSeed(): Promise<boolean> {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) return true;
    } catch (e) {
      //
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return true;
  },
};
