export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}

export interface Camera {
  id: string; // e.g. "S-01"
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: 'ONLINE' | 'OFFLINE' | 'ALERT';
  fps: number;
  resolution: string;
  activeVehicles: number;
  lastIncident?: string;
}

export type IncidentStatus = 'ACTIVE' | 'DISPATCHED' | 'EN_ROUTE' | 'ON_SCENE' | 'RESOLVED' | 'FALSE_ALARM';

export interface Incident {
  id: string;
  incident_id: string; // e.g. "JS-2026-0913-001"
  camera_id: string;
  location: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  plate_number: string;
  vehicle_count: number;
  confidence: number; // e.g. 94.7
  verification_status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  ambulance_status: 'DISPATCHING' | 'EN ROUTE' | 'ARRIVED' | 'STANDBY';
  police_status: 'ALERT SENT' | 'PATROL DISPATCHED' | 'ON SCENE' | 'STANDBY';
  family_status: 'NOTIFIED' | 'PENDING' | 'FAILED';
  incident_status: IncidentStatus;
  accident_type?: string;
  detection_time: string;
  verification_time: string;
  notification_time: string;
  response_time: number; // in seconds, e.g. 8
  reasoning: string[];
  vehicle_details?: Vehicle;
  notes?: string;
}

export interface Vehicle {
  id: string;
  plate_number: string;
  owner_name: string;
  vehicle_type: string;
  vehicle_color: string;
  emergency_contact: string;
  contact_name: string;
  registration_status: 'REGISTERED' | 'SUSPENDED' | 'EXPIRED';
  insurance_valid_until?: string;
}

export interface AILog {
  id: string;
  timestamp: string;
  camera_id: string;
  detection: string;
  confidence: number;
  decision: 'VERIFIED' | 'FILTERED_OUT' | 'PENDING' | 'FALSE_ALARM';
  reason: string;
  processing_ms: number;
}

export interface PipelineStage {
  id: number;
  name: string;
  description: string;
  status: 'idle' | 'processing' | 'completed' | 'failed';
  timestamp?: string;
  details?: string;
}

export interface DashboardKPIs {
  totalIncidentsToday: number;
  activeEmergencies: number;
  avgDetectionTime: number; // e.g. 2.4
  avgNotificationTime: number; // e.g. 5.8
  responseRate: number; // e.g. 96
  aiConfidence: number; // e.g. 94.7
  totalCameras: number;
  onlineCameras: number;
}

export interface AnalyticsData {
  accidentsPerDay: { date: string; incidents: number; falseAlarms: number }[];
  detectionTimes: { time: string; seconds: number }[];
  notificationTimes: { time: string; seconds: number }[];
  confidenceDistribution: { range: string; count: number }[];
  incidentsByLocation: { location: string; count: number }[];
  statusDistribution: { name: string; value: number; color: string }[];
  kpis: {
    avgDetection: number;
    avgNotification: number;
    falseAlarmRate: number;
    resolvedRate: number;
  };
}

export interface AiLogEntry {
  id: string;
  timestamp: string;
  camera_id: string;
  component: string;
  level: 'INFO' | 'WARN' | 'CRITICAL' | 'SUCCESS';
  message: string;
}

export interface SystemSettings {
  demoMode: boolean;
  aiDetection: boolean;
  anprEnabled: boolean;
  familyNotification: boolean;
  policeNotification: boolean;
  ambulanceNotification: boolean;
  confidenceThreshold: number; // e.g. 85
  cameraRefreshRate: number; // seconds
  soundAlerts: boolean;
  detectionTimeAllotment?: number; // e.g. 2.4 seconds
  backendConnected?: boolean;
}
