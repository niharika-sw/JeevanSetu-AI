"""
JeevanSetu AI - Python FastAPI / Flask Backend
AI-Powered Automated Accident Detection & Emergency Response Agent
"""

import os
import sqlite3
import json
import random
from datetime import datetime
from typing import Optional, Dict, Any, List

# We support running either via standard Python Flask or FastAPI if desired.
# Here is the clean Flask/FastAPI implementation compatible with SQLite.

try:
    from flask import Flask, request, jsonify
    from flask_cors import CORS
    USE_FLASK = True
except ImportError:
    USE_FLASK = False

from backend.ai.ai_service import ai_service

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "database", "jeevansetu.db")

def init_sqlite_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    schema_path = os.path.join(os.path.dirname(__file__), "..", "database", "schema.sql")
    if os.path.exists(schema_path):
        with open(schema_path, "r") as f:
            cursor.executescript(f.read())
            
    # Seed default synthetic vehicles if empty
    cursor.execute("SELECT count(*) FROM vehicles")
    if cursor.fetchone()[0] == 0:
        seed_vehicles = [
            ("v-01", "UP32 AB 1234", "Demo Citizen (Primary)", "Sedan", "White", "+91 98765 43210", "Kavita Demo (Spouse)", "REGISTERED", "2027-04-15"),
            ("v-02", "UP32 CD 5678", "Aarav Sharma", "SUV", "Silver Metallic", "+91 98123 45678", "Sunita Sharma (Mother)", "REGISTERED", "2026-11-20"),
            ("v-03", "UP70 XY 4567", "Priya Patel", "Hatchback", "Navy Blue", "+91 98987 65432", "Rajesh Patel (Father)", "REGISTERED", "2028-02-10"),
            ("v-04", "DL01 AB 9999", "Vikramaditya Roy", "Sedan", "Obsidian Black", "+91 97111 22334", "Anita Roy (Sister)", "REGISTERED", "2027-08-30"),
            ("v-05", "UP65 MN 2222", "Neha Verma", "Compact Crossover", "Crimson Red", "+91 99345 67890", "Rohan Verma (Brother)", "REGISTERED", "2026-12-05")
        ]
        cursor.executemany("INSERT INTO vehicles VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", seed_vehicles)
        
    conn.commit()
    conn.close()

if USE_FLASK:
    app = Flask(__name__)
    CORS(app)

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "ONLINE",
            "service": "JeevanSetu Python Core",
            "database": "SQLite",
            "ai_mode": ai_service.mode
        })

    @app.route("/api/simulate-accident", methods=["POST"])
    def simulate_accident():
        now = datetime.now()
        time_str = now.strftime("%H:%M:%S")
        date_str = now.strftime("%Y%m%d")
        incident_id = f"JS-{date_str}-{random.randint(100, 999)}"
        
        collision_data = ai_service.detect_collision([])
        confidence = ai_service.calculate_confidence(collision_data)
        plate_data = ai_service.read_number_plate(None)
        
        result = {
            "incident_id": incident_id,
            "camera_id": "S-04",
            "location": "Signal S-04, Prayagraj",
            "confidence": confidence,
            "plate_number": plate_data["plate_number"],
            "status": "VERIFIED",
            "detection_time": time_str,
            "ambulance_status": "DISPATCHING",
            "police_status": "ALERT SENT",
            "family_status": "NOTIFIED"
        }
        return jsonify(result)

if __name__ == "__main__":
    init_sqlite_db()
    if USE_FLASK:
        app.run(host="0.0.0.0", port=5000, debug=True)
    else:
        print("JeevanSetu AI Backend initialized. Run with flask run or uvicorn.")
