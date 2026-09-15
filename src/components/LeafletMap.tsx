import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Incident, Camera } from '../types';
import { useApp } from '../context/AppContext';

interface LeafletMapProps {
  incidents: Incident[];
  cameras: Camera[];
  selectedIncident?: Incident | null;
  height?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  incidents,
  cameras,
  selectedIncident,
  height = 'h-[500px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const { setActiveIncident, setCurrentPage } = useApp();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const centerLat = selectedIncident?.latitude || 25.4358;
      const centerLng = selectedIncident?.longitude || 81.8463;

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 14,
        zoomControl: true,
      });

      // OpenStreetMap Tiles with dark carto style or standard OSM
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when incidents, cameras, or selectedIncident changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // 1. Render Cameras
    cameras.forEach((cam) => {
      const isAlert = cam.status === 'ALERT';
      const camIcon = L.divIcon({
        className: 'custom-cam-icon',
        html: `
          <div style="
            background: ${isAlert ? '#ef4444' : '#0ea5e9'};
            color: white;
            padding: 4px 6px;
            border-radius: 6px;
            font-size: 10px;
            font-weight: bold;
            font-family: monospace;
            border: 2px solid white;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            gap: 2px;
          ">
            📷 ${cam.id}
          </div>
        `,
        iconSize: [60, 24],
        iconAnchor: [30, 12],
      });

      const marker = L.marker([cam.latitude, cam.longitude], { icon: camIcon }).addTo(markersLayer);
      marker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 180px; color: #0f172a;">
          <h4 style="margin: 0; font-weight: bold; font-size: 13px;">${cam.name}</h4>
          <p style="margin: 2px 0 6px; font-size: 11px; color: #64748b;">${cam.location}</p>
          <div style="font-size: 11px; display: flex; justify-content: space-between;">
            <span>Status: <strong style="color: ${isAlert ? '#ef4444' : '#10b981'}">${cam.status}</strong></span>
            <span>FPS: 30</span>
          </div>
        </div>
      `);
    });

    // 2. Render Incidents
    incidents.forEach((inc) => {
      const isActive = inc.incident_status === 'ACTIVE' || inc.incident_status === 'DISPATCHED';
      const isResolved = inc.incident_status === 'RESOLVED';
      const isFalseAlarm = inc.incident_status === 'FALSE_ALARM';

      let markerColor = '#ef4444';
      if (isResolved) markerColor = '#10b981';
      if (isFalseAlarm) markerColor = '#64748b';

      const accidentIcon = L.divIcon({
        className: 'custom-accident-icon',
        html: `
          <div style="
            position: relative;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            ${isActive ? `
              <div style="
                position: absolute;
                inset: 0;
                background: ${markerColor};
                opacity: 0.4;
                border-radius: 50%;
                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
            ` : ''}
            <div style="
              width: 32px;
              height: 32px;
              background: ${markerColor};
              border: 2px solid white;
              border-radius: 50%;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              box-shadow: 0 4px 10px rgba(0,0,0,0.4);
            ">
              ${isResolved ? '✓' : '🚨'}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([inc.latitude, inc.longitude], { icon: accidentIcon }).addTo(markersLayer);

      const popupContent = document.createElement('div');
      popupContent.style.fontFamily = 'sans-serif';
      popupContent.style.color = '#0f172a';
      popupContent.style.minWidth = '220px';
      popupContent.innerHTML = `
        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 6px;">
          <span style="background: #fee2e2; color: #dc2626; font-size: 9px; font-weight: bold; padding: 2px 4px; border-radius: 3px; text-transform: uppercase;">
            ${inc.incident_status}
          </span>
          <h4 style="margin: 4px 0 0; font-weight: 800; font-size: 14px;">${inc.incident_id}</h4>
          <p style="margin: 0; font-size: 11px; color: #475569;">${inc.location}</p>
        </div>
        <div style="font-size: 11px; line-height: 1.6; margin-bottom: 8px;">
          <div>AI Confidence: <strong style="color: #059669">${inc.confidence}% (VERIFIED)</strong></div>
          <div>Vehicles: <strong>${inc.vehicle_count}</strong> | Plate: <strong style="font-family: monospace;">${inc.plate_number}</strong></div>
          <div>Ambulance: <strong>${inc.ambulance_status}</strong></div>
          <div>Police: <strong>${inc.police_status}</strong></div>
        </div>
      `;

      const viewBtn = document.createElement('button');
      viewBtn.innerText = 'View Full Incident';
      viewBtn.style.width = '100%';
      viewBtn.style.padding = '6px 10px';
      viewBtn.style.background = '#0f172a';
      viewBtn.style.color = '#ffffff';
      viewBtn.style.border = 'none';
      viewBtn.style.borderRadius = '6px';
      viewBtn.style.fontSize = '11px';
      viewBtn.style.fontWeight = 'bold';
      viewBtn.style.cursor = 'pointer';
      viewBtn.onclick = () => {
        setActiveIncident(inc);
        setCurrentPage('incident-details');
      };
      popupContent.appendChild(viewBtn);

      marker.bindPopup(popupContent);
    });

    // 3. Render Ambulance & Police Patrol Markers nearby active incident
    const active = incidents.find((i) => i.incident_status === 'ACTIVE') || incidents[0];
    if (active) {
      // Ambulance Marker
      const ambIcon = L.divIcon({
        className: 'custom-amb-icon',
        html: `
          <div style="background: #f59e0b; color: white; padding: 3px 6px; border-radius: 6px; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 3px;">
            🚑 Amb-108
          </div>
        `,
        iconSize: [75, 24],
        iconAnchor: [37, 12],
      });
      L.marker([active.latitude + 0.0035, active.longitude - 0.004], { icon: ambIcon })
        .addTo(markersLayer)
        .bindPopup('<b>Ambulance Unit 108</b><br>Status: EN ROUTE (ETA 2 mins)<br>GPS Tracking Active');

      // Police Patrol Marker
      const polIcon = L.divIcon({
        className: 'custom-pol-icon',
        html: `
          <div style="background: #2563eb; color: white; padding: 3px 6px; border-radius: 6px; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 3px;">
            👮 Police-04
          </div>
        `,
        iconSize: [75, 24],
        iconAnchor: [37, 12],
      });
      L.marker([active.latitude - 0.0028, active.longitude + 0.0035], { icon: polIcon })
        .addTo(markersLayer)
        .bindPopup('<b>Traffic Interceptor Unit 04</b><br>Status: PATROL DISPATCHED<br>Navigating to intersection');
    }
  }, [incidents, cameras, selectedIncident, setActiveIncident, setCurrentPage]);

  // Center map when selectedIncident changes
  useEffect(() => {
    if (selectedIncident && mapInstanceRef.current) {
      mapInstanceRef.current.setView([selectedIncident.latitude, selectedIncident.longitude], 15, {
        animate: true,
      });
    }
  }, [selectedIncident]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 shadow-xl bg-slate-900">
      <div ref={mapContainerRef} className={`w-full ${height} z-10`} />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur border border-slate-800 p-2.5 rounded-lg text-[11px] text-slate-300 shadow-lg flex flex-wrap gap-3 font-medium">
        <span className="flex items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1.5 animate-pulse" />
          Active Accident
        </span>
        <span className="flex items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5" />
          Resolved
        </span>
        <span className="flex items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5" />
          Ambulance
        </span>
        <span className="flex items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5" />
          Police
        </span>
        <span className="flex items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 mr-1.5" />
          Camera Feed
        </span>
      </div>
    </div>
  );
};
