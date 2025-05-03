"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MapComponentImpl = ({ projects, center, zoom, scrollWheelZoom = true, onProjectSelect }) => {
  useEffect(() => {
    // Fix the Leaflet icon issue (this is critical for the markers to display)
    delete L.Icon.Default.prototype._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={scrollWheelZoom}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {projects.map((project) => (
        <Marker key={project.id} position={project.coordinates}>
          <Popup>
            <div className="p-1">
              <h3 className="font-medium">{project.name}</h3>
              <p className="text-xs text-gray-600">{project.location}</p>
              <div className="text-xs mt-1">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full ${
                    project.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {project.status}
                </span>
              </div>
              {onProjectSelect && (
                <button
                  onClick={() => onProjectSelect(project)}
                  className="mt-2 text-xs text-primary font-medium hover:underline"
                >
                  View Details
                </button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponentImpl;