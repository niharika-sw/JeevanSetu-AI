-- JeevanSetu AI: SQLite Database Schema
-- Automated Accident Detection & Emergency Response

CREATE TABLE IF NOT EXISTS cameras (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('ONLINE', 'OFFLINE', 'ALERT')),
    fps INTEGER DEFAULT 30,
    resolution TEXT DEFAULT '1920x1080',
    active_vehicles INTEGER DEFAULT 0,
    last_incident TEXT
);

CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    plate_number TEXT UNIQUE NOT NULL,
    owner_name TEXT NOT NULL,
    vehicle_type TEXT NOT NULL,
    vehicle_color TEXT NOT NULL,
    emergency_contact TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    registration_status TEXT DEFAULT 'REGISTERED' CHECK(registration_status IN ('REGISTERED', 'SUSPENDED', 'EXPIRED')),
    insurance_valid_until TEXT
);

CREATE TABLE IF NOT EXISTS incidents (
    id TEXT PRIMARY KEY,
    incident_id TEXT UNIQUE NOT NULL,
    camera_id TEXT NOT NULL,
    location TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    timestamp TEXT NOT NULL,
    plate_number TEXT NOT NULL,
    vehicle_count INTEGER DEFAULT 2,
    confidence REAL NOT NULL,
    verification_status TEXT DEFAULT 'VERIFIED' CHECK(verification_status IN ('VERIFIED', 'PENDING', 'REJECTED')),
    ambulance_status TEXT DEFAULT 'DISPATCHING',
    police_status TEXT DEFAULT 'ALERT SENT',
    family_status TEXT DEFAULT 'NOTIFIED',
    incident_status TEXT DEFAULT 'ACTIVE' CHECK(incident_status IN ('ACTIVE', 'DISPATCHED', 'EN_ROUTE', 'ON_SCENE', 'RESOLVED', 'FALSE_ALARM')),
    detection_time TEXT NOT NULL,
    verification_time TEXT NOT NULL,
    notification_time TEXT NOT NULL,
    response_time INTEGER DEFAULT 8,
    reasoning_json TEXT,
    notes TEXT,
    FOREIGN KEY(camera_id) REFERENCES cameras(id),
    FOREIGN KEY(plate_number) REFERENCES vehicles(plate_number)
);

CREATE TABLE IF NOT EXISTS ai_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    camera_id TEXT NOT NULL,
    detection TEXT NOT NULL,
    confidence REAL NOT NULL,
    decision TEXT NOT NULL,
    reason TEXT NOT NULL,
    processing_ms INTEGER DEFAULT 100,
    FOREIGN KEY(camera_id) REFERENCES cameras(id)
);
