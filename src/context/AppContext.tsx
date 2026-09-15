import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Camera, Incident, Vehicle, AILog, AnalyticsData, SystemSettings, DashboardKPIs, User } from '../types';
import { api } from '../services/api';
import { INITIAL_CAMERAS, INITIAL_INCIDENTS, INITIAL_VEHICLES, INITIAL_AI_LOGS, INITIAL_ANALYTICS, INITIAL_SETTINGS } from '../data/seedData';

export type PageId =
  | 'dashboard'
  | 'monitoring'
  | 'detection'
  | 'incident-details'
  | 'emergency-response'
  | 'anpr'
  | 'map'
  | 'history'
  | 'analytics'
  | 'ai-logs'
  | 'settings'
  | 'about';

interface NotificationPreview {
  open: boolean;
  message: string;
  recipient: string;
  plate: string;
}

interface AppContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  user: User | null;
  login: (email?: string, password?: string, isDemo?: boolean) => Promise<boolean>;
  logout: () => void;
  cameras: Camera[];
  incidents: Incident[];
  activeIncident: Incident | null;
  setActiveIncident: (incident: Incident | null) => void;
  alertModalIncident: Incident | null;
  dismissAlertModal: () => void;
  kpis: DashboardKPIs;
  aiLogs: AILog[];
  analytics: AnalyticsData;
  vehicles: Vehicle[];
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<void>;
  
  // Simulation & Demo
  isSimulating: boolean;
  pipelineStage: number; // 0 to 8
  responseTimer: number; // seconds
  startLiveDemo: () => Promise<void>;
  simulateAccidentPipeline: (targetCameraId?: string) => Promise<void>;
  replayIncidentTimeline: (incident?: Incident) => Promise<void>;
  
  // Emergency Actions
  updateAmbulanceStatus: (incidentId: string, status: 'DISPATCHING' | 'EN ROUTE' | 'ARRIVED') => Promise<void>;
  updatePoliceStatus: (incidentId: string, status: 'ALERT SENT' | 'PATROL DISPATCHED' | 'ON SCENE') => Promise<void>;
  triggerFamilyNotification: (incidentId: string) => Promise<void>;
  notificationPreview: NotificationPreview | null;
  setNotificationPreview: (preview: NotificationPreview | null) => void;

  // Toast & Feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isBackendConnected: boolean;
  resetToDemoSeed: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [user, setUser] = useState<User | null>({
    id: 'usr-admin-01',
    name: 'Director (Demo Commander)',
    email: 'admin@jeevansetu.ai',
    role: 'Emergency Dispatch Commander',
  });

  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [activeIncident, setActiveIncident] = useState<Incident | null>(INITIAL_INCIDENTS[0]);
  const [alertModalIncident, setAlertModalIncident] = useState<Incident | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [aiLogs, setAiLogs] = useState<AILog[]>(INITIAL_AI_LOGS);
  const [analytics, setAnalytics] = useState<AnalyticsData>(INITIAL_ANALYTICS);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);

  // Simulation states
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [pipelineStage, setPipelineStage] = useState<number>(0);
  const [responseTimer, setResponseTimer] = useState<number>(8);
  const [notificationPreview, setNotificationPreview] = useState<NotificationPreview | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  }, []);

  // Sync initial data from backend or local fallback
  const refreshData = useCallback(async () => {
    try {
      const healthy = await api.checkHealth();
      setIsBackendConnected(healthy);

      const [camData, incData, vehData, logData, anaData, settData] = await Promise.all([
        api.getCameras(),
        api.getIncidents(),
        api.getVehicles(),
        api.getAILogs(),
        api.getAnalytics(),
        api.getSettings(),
      ]);

      if (camData?.length) setCameras(camData);
      if (incData?.length) {
        setIncidents(incData);
        setActiveIncident((curr) => curr || incData[0]);
      }
      if (vehData?.length) setVehicles(vehData);
      if (logData?.length) setAiLogs(logData);
      if (anaData) setAnalytics(anaData);
      if (settData) setSettings(settData);
    } catch (e) {
      console.warn('Initial data refresh error, using local state:', e);
      setIsBackendConnected(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Periodic status poll (every 5s) to satisfy requirement 25
  useEffect(() => {
    const interval = setInterval(() => {
      api.getIncidents().then((incs) => {
        if (incs && incs.length > 0) {
          setIncidents(incs);
        }
      }).catch(() => {});
    }, (settings.cameraRefreshRate || 5) * 1000);
    return () => clearInterval(interval);
  }, [settings.cameraRefreshRate]);

  // Auth
  const login = async (email = 'admin@jeevansetu.ai', password = 'demo123', isDemo = false) => {
    try {
      const res = await api.login(email, password, isDemo);
      if (res.success && res.user) {
        setUser(res.user);
        showToast('Signed in successfully as ' + res.user.role);
        return true;
      }
    } catch (e) {
      //
    }
    setUser({
      id: 'usr-demo-01',
      name: 'Command Center Director',
      email: email || 'admin@jeevansetu.ai',
      role: 'Emergency Dispatch Commander',
    });
    showToast('Signed in to Demo Environment');
    return true;
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('dashboard');
    showToast('Logged out of command center');
  };

  const updateSettings = async (newSettings: Partial<SystemSettings>) => {
    const updated = await api.saveSettings(newSettings);
    setSettings(updated);
    showToast('System settings updated');
  };

  const dismissAlertModal = () => {
    setAlertModalIncident(null);
  };

  // 8-Stage Accident Pipeline Simulation
  const simulateAccidentPipeline = async (targetCameraId = 'S-04') => {
    if (isSimulating) return;
    setIsSimulating(true);
    setPipelineStage(1);
    setResponseTimer(0);

    // Audio cue if enabled
    if (settings.soundAlerts) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } catch (e) {
        // AudioContext restricted in iframe if unclicked
      }
    }

    showToast('AI pipeline started: Analyzing traffic stream from Camera ' + targetCameraId);

    // Stage 1: CAMERA INPUT (Frame received)
    await new Promise((r) => setTimeout(r, 1100));
    setPipelineStage(2);
    setResponseTimer(1.0);

    // Stage 2: VEHICLE DETECTION (2 vehicles tracked)
    await new Promise((r) => setTimeout(r, 1100));
    setPipelineStage(3);
    setResponseTimer(2.4);

    // Stage 3: COLLISION PATTERN ANALYSIS (Detection Allotment: 2.4s Met)
    await new Promise((r) => setTimeout(r, 1100));
    setPipelineStage(4);
    setResponseTimer(4.0);

    // Stage 4: TEMPORAL VERIFICATION (Persisted across 16 frames: 4.0s)
    await new Promise((r) => setTimeout(r, 1000));
    setPipelineStage(5);
    setResponseTimer(4.4);

    // Stage 5: ACCIDENT CONFIRMED (Confidence 94.7%)
    await new Promise((r) => setTimeout(r, 900));
    setPipelineStage(6);
    setResponseTimer(5.0);

    // Stage 6: LOCATION IDENTIFIED (Signal S-04, Prayagraj)
    await new Promise((r) => setTimeout(r, 900));
    setPipelineStage(7);
    setResponseTimer(6.0);

    // Stage 7: NUMBER PLATE RECOGNITION (UP32 AB 1234, 98.2% OCR)
    await new Promise((r) => setTimeout(r, 1000));
    setPipelineStage(8);
    setResponseTimer(8.0);

    // Stage 8: EMERGENCY RESPONSE INITIATED
    const newInc = await api.simulateAccident('UP32 AB 1234');
    
    // Update local context
    setIncidents((prev) => [newInc, ...prev.filter((i) => i.id !== newInc.id)]);
    setActiveIncident(newInc);
    setCameras((prev) =>
      prev.map((c) => (c.id === 'S-04' ? { ...c, status: 'ALERT', lastIncident: newInc.incident_id } : c))
    );

    // Add explainable AI log with detection allotment metrics
    const newLog: AILog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('en-GB'),
      camera_id: 'S-04',
      detection: 'Collision Pattern Detection',
      confidence: newInc.confidence,
      decision: 'VERIFIED',
      reason: 'Kinematic deceleration (-0.88G) detected within 2.4s detection allotment; 16-frame persistence verified',
      processing_ms: 118,
    };
    setAiLogs((prev) => [newLog, ...prev]);

    // Show prominent Emergency Alert Modal!
    setAlertModalIncident(newInc);
    showToast('🚨 ACCIDENT CONFIRMED (2.4s Detection Allotment Met) — DISPATCHED IN 8s');
    setIsSimulating(false);
  };

  // Hackathon START LIVE DEMO 1-click sequence (10-14 seconds full pipeline)
  const startLiveDemo = async () => {
    setCurrentPage('detection');
    await simulateAccidentPipeline('S-04');
  };

  // Replay Incident Sequence with exact time allotments
  const replayIncidentTimeline = async (incident?: Incident) => {
    const inc = incident || activeIncident;
    if (!inc) return;
    setIsSimulating(true);
    setPipelineStage(1);
    setResponseTimer(0);

    const steps = [
      { stage: 1, timer: 0.0, text: 'Camera feed ingested (Baseline T = 0.0s)' },
      { stage: 2, timer: 1.0, text: 'Vehicles localized & tracked via YOLOv8' },
      { stage: 3, timer: 2.4, text: 'Deceleration shock detected — 2.4s Detection Allotment Met' },
      { stage: 4, timer: 4.0, text: 'Temporal multi-frame verification passed (+1.6s allotment)' },
      { stage: 5, timer: 4.4, text: `Accident confirmed (${inc.confidence}% confidence)` },
      { stage: 6, timer: 5.0, text: `Location resolved: ${inc.location}` },
      { stage: 7, timer: 6.0, text: `HSRP Plate recognized: ${inc.plate_number}` },
      { stage: 8, timer: 8.0, text: 'Multi-service emergency dispatch triggered (8.0s Total Latency)' },
    ];

    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 900));
      setPipelineStage(step.stage);
      setResponseTimer(step.timer);
    }

    setIsSimulating(false);
    showToast(`Timeline replay completed (Allotted Latency: ${inc.response_time || 8}s)`);
  };

  // Emergency service operations
  const updateAmbulanceStatus = async (incidentId: string, status: 'DISPATCHING' | 'EN ROUTE' | 'ARRIVED') => {
    await api.notifyAmbulance(incidentId, status);
    setIncidents((prev) =>
      prev.map((i) => (i.id === incidentId || i.incident_id === incidentId ? { ...i, ambulance_status: status } : i))
    );
    if (activeIncident && (activeIncident.id === incidentId || activeIncident.incident_id === incidentId)) {
      setActiveIncident((prev) => (prev ? { ...prev, ambulance_status: status } : null));
    }
    showToast(`Ambulance status updated to: ${status}`);
  };

  const updatePoliceStatus = async (incidentId: string, status: 'ALERT SENT' | 'PATROL DISPATCHED' | 'ON SCENE') => {
    await api.notifyPolice(incidentId, status);
    setIncidents((prev) =>
      prev.map((i) => (i.id === incidentId || i.incident_id === incidentId ? { ...i, police_status: status } : i))
    );
    if (activeIncident && (activeIncident.id === incidentId || activeIncident.incident_id === incidentId)) {
      setActiveIncident((prev) => (prev ? { ...prev, police_status: status } : null));
    }
    showToast(`Police status updated to: ${status}`);
  };

  const triggerFamilyNotification = async (incidentId: string) => {
    const inc = incidents.find((i) => i.id === incidentId || i.incident_id === incidentId) || activeIncident;
    const contact = inc?.vehicle_details?.emergency_contact || '+91 98765 43210';
    const plate = inc?.plate_number || 'UP32 AB 1234';
    
    await api.notifyFamily(incidentId, contact, plate);
    setIncidents((prev) =>
      prev.map((i) => (i.id === incidentId || i.incident_id === incidentId ? { ...i, family_status: 'NOTIFIED' } : i))
    );
    if (activeIncident && (activeIncident.id === incidentId || activeIncident.incident_id === incidentId)) {
      setActiveIncident((prev) => (prev ? { ...prev, family_status: 'NOTIFIED' } : null));
    }

    setNotificationPreview({
      open: true,
      recipient: contact,
      plate,
      message: `Emergency alert: A possible accident involving registered vehicle ${plate} has been detected near ${inc?.location || 'Signal S-04, Prayagraj'}. Emergency medical responders (Ambulance 108) and Police Patrol have been dispatched.`,
    });

    showToast(`Simulated emergency alert dispatched to family contact (${contact})`);
  };

  const resetToDemoSeed = async () => {
    await api.resetToSeed();
    setCameras(INITIAL_CAMERAS);
    setIncidents(INITIAL_INCIDENTS);
    setActiveIncident(INITIAL_INCIDENTS[0]);
    setVehicles(INITIAL_VEHICLES);
    setAiLogs(INITIAL_AI_LOGS);
    setAnalytics(INITIAL_ANALYTICS);
    setSettings(INITIAL_SETTINGS);
    setAlertModalIncident(null);
    setPipelineStage(0);
    showToast('Database reset to fresh hackathon demo seed');
  };

  // KPIs calculation
  const activeEmergencies = incidents.filter(
    (i) => i.incident_status === 'ACTIVE' || i.incident_status === 'DISPATCHED'
  ).length;

  const kpis: DashboardKPIs = {
    totalIncidentsToday: incidents.filter((i) => i.incident_status !== 'FALSE_ALARM').length,
    activeEmergencies: Math.max(activeEmergencies, 1),
    avgDetectionTime: 2.4,
    avgNotificationTime: 5.8,
    responseRate: 96,
    aiConfidence: 94.7,
    totalCameras: 12,
    onlineCameras: 12,
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        user,
        login,
        logout,
        cameras,
        incidents,
        activeIncident,
        setActiveIncident,
        alertModalIncident,
        dismissAlertModal,
        kpis,
        aiLogs,
        analytics,
        vehicles,
        settings,
        updateSettings,
        isSimulating,
        pipelineStage,
        responseTimer,
        startLiveDemo,
        simulateAccidentPipeline,
        replayIncidentTimeline,
        updateAmbulanceStatus,
        updatePoliceStatus,
        triggerFamilyNotification,
        notificationPreview,
        setNotificationPreview,
        toastMessage,
        showToast,
        isBackendConnected,
        resetToDemoSeed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
