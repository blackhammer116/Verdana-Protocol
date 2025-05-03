"use client";

import React, { useEffect, useState } from "react";

// We need to create a separate wrapper component that only loads on the client side
const MapComponent = ({ projects, center, zoom, scrollWheelZoom = true, onProjectSelect }) => {
  // Use this state to render something until map loads
  const [isLoading, setIsLoading] = useState(true);
  
  // Will hold our dynamic map component
  const [MapContent, setMapContent] = useState(null);

  useEffect(() => {
    // Create a function to load the map component asynchronously
    async function loadMap() {
      // Load all Leaflet dependencies
      const L = await import('leaflet');
      const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');
      
      // Fix the Leaflet icon issue
      delete L.Icon.Default.prototype._getIconUrl;
      
      // Load icon assets
      const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
      const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';
      
      L.Icon.Default.mergeOptions({
        iconUrl,
        iconRetinaUrl: iconUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      // Create a component that contains all the map elements
      const LeafletMap = () => (
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

      // Set the map component to state
      setMapContent(() => LeafletMap);
      setIsLoading(false);
    }

    // Import CSS for Leaflet
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.min.css";
    document.head.appendChild(linkElement);

    // Load the map
    loadMap();

    // Clean up
    return () => {
      document.head.removeChild(linkElement);
    };
  }, [center, zoom, scrollWheelZoom, projects, onProjectSelect]);

  // Show a loading state while the map is being prepared
  if (isLoading || !MapContent) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <p>Loading map...</p>
      </div>
    );
  }

  // Render the map
  return <MapContent />;
};

export default MapComponent;