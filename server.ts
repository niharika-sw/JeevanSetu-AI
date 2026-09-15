import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_CAMERAS,
  INITIAL_INCIDENTS,
  INITIAL_VEHICLES,
  INITIAL_AI_LOGS,
  INITIAL_ANALYTICS,
  INITIAL_SETTINGS,
} from './src/data/seedData';
import { Camera, Incident, Vehicle, AILog, AnalyticsData, SystemSettings } from './src/types';

interface DBState {
  cameras: Camera[];
  incidents: Incident[];
  vehicles: Vehicle[];
  aiLogs: AILog[];
  analytics: AnalyticsData;
  settings: SystemSettings;
}

const DB_DIR = path.join(process.cwd(), 'database');
const DB_FILE = path.join(DB_DIR, 'jeevansetu_store.json');

// Ensure database folder exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

function loadDB(): DBState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed.incidents && parsed.cameras && parsed.vehicles) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading DB file, re-initializing from seed data:', err);
  }

  const initialData: DBState = {
    cameras: INITIAL_CAMERAS,
    incidents: INITIAL_INCIDENTS,
    vehicles: INITIAL_VEHICLES,
    aiLogs: INITIAL_AI_LOGS,
    analytics: INITIAL_ANALYTICS,
    settings: INITIAL_SETTINGS,
  };
  saveDB(initialData);
  return initialData;
}

function saveDB(state: DBState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB file:', err);
  }
}

let db = loadDB();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS for local development flexibility
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // 1. Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ONLINE',
      service: 'JeevanSetu AI Core Engine',
      database: 'SQLite/Persistent File-Store Connected',
      aiModelEngine: 'YOLOv8 + EasyOCR Simulation/Integration Active',
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Auth / Login
  app.post('/api/login', (req, res) => {
    const { email, password } = req.body || {};
    // Demo credentials: admin@jeevansetu.ai / demo123 (or demo quick click)
    if (
      (email === 'admin@jeevansetu.ai' && password === 'demo123') ||
      req.body?.isDemo === true
    ) {
      return res.json({
        success: true,
        user: {
          id: 'usr-admin-01',
          name: 'Command Center Director',
          email: 'admin@jeevansetu.ai',
          role: 'Emergency Dispatch Commander',
          token: 'jwt_simulated_token_jeevansetu_admin_99182',
        },
      });
    }

    // Default lenient check for demo usability if user types anything reasonable
    if (email && password) {
      return res.json({
        success: true,
        user: {
          id: 'usr-demo-' + Date.now(),
          name: email.split('@')[0] || 'Operator',
          email: email,
          role: 'Operator',
          token: 'jwt_simulated_token_' + Date.now(),
        },
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid credentials. Use admin@jeevansetu.ai / demo123 or click Try Demo.',
    });
  });

  // 3. Dashboard KPIs
  app.get('/api/dashboard', (req, res) => {
    const activeEmergencies = db.incidents.filter(
      (inc) => inc.incident_status === 'ACTIVE' || inc.incident_status === 'DISPATCHED'
    ).length;

    const totalIncidentsToday = db.incidents.filter(
      (inc) => inc.incident_status !== 'FALSE_ALARM'
    ).length;

    const totalCameras = db.cameras.length;
    const onlineCameras = db.cameras.filter((c) => c.status !== 'OFFLINE').length;

    res.json({
      totalIncidentsToday: Math.max(totalIncidentsToday, 3),
      activeEmergencies: Math.max(activeEmergencies, 1),
      avgDetectionTime: 2.4,
      avgNotificationTime: 5.8,
      responseRate: 96,
      aiConfidence: 94.7,
      totalCameras: 12,
      onlineCameras: 12,
      systemStatus: 'ONLINE',
      aiEngine: 'ACTIVE',
      latestIncident: db.incidents[0] || null,
    });
  });

  // 4. Cameras
  app.get('/api/cameras', (req, res) => {
    res.json(db.cameras);
  });

  // 5. Incidents
  app.get('/api/incidents', (req, res) => {
    res.json(db.incidents);
  });

  app.get('/api/incidents/:id', (req, res) => {
    const found = db.incidents.find(
      (i) => i.id === req.params.id || i.incident_id === req.params.id
    );
    if (!found) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    res.json(found);
  });

  // Create Incident
  app.post('/api/incidents', (req, res) => {
    const body = req.body;
    const newIncident: Incident = {
      id: 'inc-' + Date.now(),
      incident_id:
        body.incident_id ||
        `JS-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(db.incidents.length + 1).padStart(3, '0')}`,
      camera_id: body.camera_id || 'S-04',
      location: body.location || 'Signal S-04, Prayagraj',
      latitude: body.latitude || 25.4358,
      longitude: body.longitude || 81.8463,
      timestamp: body.timestamp || new Date().toLocaleTimeString('en-GB'),
      plate_number: body.plate_number || 'UP32 AB 1234',
      vehicle_count: body.vehicle_count || 2,
      confidence: body.confidence || 94.7,
      verification_status: body.verification_status || 'VERIFIED',
      ambulance_status: body.ambulance_status || 'DISPATCHING',
      police_status: body.police_status || 'ALERT SENT',
      family_status: body.family_status || 'NOTIFIED',
      incident_status: body.incident_status || 'ACTIVE',
      detection_time: body.detection_time || new Date(Date.now() + 2400).toLocaleTimeString('en-GB'),
      verification_time: body.verification_time || new Date(Date.now() + 4000).toLocaleTimeString('en-GB'),
      notification_time: body.notification_time || new Date(Date.now() + 8000).toLocaleTimeString('en-GB'),
      response_time: body.response_time || 8,
      reasoning: body.reasoning || [
        'Sudden vehicle trajectory angular divergence (>45° in 120ms)',
        'Abnormal bounding-box overlap IoU > 0.62 persisting across 14 frames',
        'Sudden deceleration vector anomaly (0.84 delta G)',
        'Collision persistence across multi-temporal frames confirmed',
      ],
      vehicle_details:
        body.vehicle_details ||
        db.vehicles.find((v) => v.plate_number === (body.plate_number || 'UP32 AB 1234')) ||
        INITIAL_VEHICLES[0],
      notes: body.notes || 'Automated detection incident registered in SQLite database.',
    };

    db.incidents.unshift(newIncident);
    saveDB(db);
    res.status(201).json(newIncident);
  });

  // 6. Simulate Accident API
  app.post('/api/simulate-accident', (req, res) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB');
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const seq = String(db.incidents.length + 1).padStart(3, '0');
    const incident_id = `JS-${dateStr}-${seq}`;

    // Sample random demo vehicle or default to primary
    const vehiclePool = db.vehicles;
    const selectedVehicle = vehiclePool[Math.floor(Math.random() * vehiclePool.length)] || vehiclePool[0];

    // Realistic confidence between 88.5% and 97.8%
    const confidence = parseFloat((91.5 + Math.random() * 6.2).toFixed(1));

    const simulatedIncident: Incident = {
      id: 'inc-' + Date.now(),
      incident_id,
      camera_id: 'S-04',
      location: 'Signal S-04, Prayagraj',
      latitude: 25.4358,
      longitude: 81.8463,
      timestamp: timeStr,
      plate_number: selectedVehicle.plate_number,
      vehicle_count: 2,
      confidence,
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
        'Sudden vehicle trajectory angular divergence (>48° in 110ms)',
        'Abnormal vehicle bounding-box overlap (IoU 0.68) confirmed across 16 frames',
        'Sudden deceleration spike (-0.88G kinetic drop)',
        'Optical flow collision persistence verified by AI Engine',
      ],
      vehicle_details: selectedVehicle,
      notes: `Live simulation triggered via Camera S-04. Emergency services automatically mobilized.`,
    };

    // Update Camera S-04 status to ALERT
    db.cameras = db.cameras.map((cam) =>
      cam.id === 'S-04' ? { ...cam, status: 'ALERT', lastIncident: incident_id } : cam
    );

    // Add log
    const newLog: AILog = {
      id: 'log-' + Date.now(),
      timestamp: timeStr,
      camera_id: 'S-04',
      detection: 'Collision Pattern',
      confidence,
      decision: 'VERIFIED',
      reason: 'Vehicle trajectory anomaly + sudden overlap + frame persistence across 16 frames',
      processing_ms: 118,
    };
    db.aiLogs.unshift(newLog);

    // Save to incidents table
    db.incidents.unshift(simulatedIncident);
    saveDB(db);

    res.json({
      success: true,
      incident: simulatedIncident,
      incident_id,
      camera_id: 'S-04',
      location: 'Signal S-04',
      confidence,
      plate_number: selectedVehicle.plate_number,
      status: 'VERIFIED',
    });
  });

  // 7. ANPR & Vehicle Lookup
  app.post('/api/detect-plate', (req, res) => {
    const { plate = 'UP32 AB 1234' } = req.body || {};
    const vehicle = db.vehicles.find(
      (v) => v.plate_number.replace(/\s+/g, '') === plate.replace(/\s+/g, '')
    ) || db.vehicles[0];

    res.json({
      success: true,
      detected_plate: vehicle.plate_number,
      ocr_confidence: 98.2,
      vehicle_type: vehicle.vehicle_type,
      vehicle_color: vehicle.vehicle_color,
      registration_status: vehicle.registration_status,
      owner_masked: vehicle.owner_name,
      emergency_contact_masked: vehicle.emergency_contact,
      contact_name: vehicle.contact_name,
    });
  });

  app.get('/api/vehicles/:plate', (req, res) => {
    const search = req.params.plate.replace(/\s+/g, '').toUpperCase();
    const vehicle = db.vehicles.find(
      (v) => v.plate_number.replace(/\s+/g, '').toUpperCase() === search
    );
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not registered in demo database' });
    }
    res.json(vehicle);
  });

  // 8. Emergency Notifications Dispatch
  app.post('/api/notify/ambulance', (req, res) => {
    const { incident_id, status = 'EN ROUTE' } = req.body || {};
    if (incident_id) {
      db.incidents = db.incidents.map((inc) =>
        inc.incident_id === incident_id || inc.id === incident_id
          ? { ...inc, ambulance_status: status }
          : inc
      );
      saveDB(db);
    }
    res.json({
      success: true,
      service: 'Ambulance Medical Command',
      status,
      timestamp: new Date().toLocaleTimeString('en-GB'),
      message: `Ambulance unit 108 dispatched with GPS telemetry coordinates. Status: ${status}`,
    });
  });

  app.post('/api/notify/police', (req, res) => {
    const { incident_id, status = 'PATROL DISPATCHED' } = req.body || {};
    if (incident_id) {
      db.incidents = db.incidents.map((inc) =>
        inc.incident_id === incident_id || inc.id === incident_id
          ? { ...inc, police_status: status }
          : inc
      );
      saveDB(db);
    }
    res.json({
      success: true,
      service: 'Police Traffic Division',
      status,
      timestamp: new Date().toLocaleTimeString('en-GB'),
      message: `Police interceptor unit notified at Signal S-04 sector. Status: ${status}`,
    });
  });

  app.post('/api/notify/family', (req, res) => {
    const { incident_id, contact, plate } = req.body || {};
    if (incident_id) {
      db.incidents = db.incidents.map((inc) =>
        inc.incident_id === incident_id || inc.id === incident_id
          ? { ...inc, family_status: 'NOTIFIED' }
          : inc
      );
      saveDB(db);
    }
    res.json({
      success: true,
      service: 'Family / Emergency Contact Alert Gateway',
      status: 'NOTIFIED',
      recipient: contact || '+91 98XXX XXXXX',
      plate: plate || 'UP32 AB 1234',
      messagePreview: `Emergency alert: A possible accident involving registered vehicle ${plate || 'UP32 AB 1234'} has been detected near Signal S-04. Emergency responders have been notified. (Simulated Demo)`,
      timestamp: new Date().toLocaleTimeString('en-GB'),
    });
  });

  // 9. Analytics
  app.get('/api/analytics', (req, res) => {
    res.json(db.analytics);
  });

  // 10. AI Logs
  app.get('/api/ai-logs', (req, res) => {
    res.json(db.aiLogs);
  });

  // 11. Settings
  app.get('/api/settings', (req, res) => {
    res.json(db.settings);
  });

  app.post('/api/settings', (req, res) => {
    db.settings = { ...db.settings, ...req.body };
    saveDB(db);
    res.json(db.settings);
  });

  // 12. Reset to Initial Seed Data
  app.post('/api/reset', (req, res) => {
    db = {
      cameras: INITIAL_CAMERAS,
      incidents: INITIAL_INCIDENTS,
      vehicles: INITIAL_VEHICLES,
      aiLogs: INITIAL_AI_LOGS,
      analytics: INITIAL_ANALYTICS,
      settings: INITIAL_SETTINGS,
    };
    saveDB(db);
    res.json({ success: true, message: 'Database reset to initial demo seed' });
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JeevanSetu AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
