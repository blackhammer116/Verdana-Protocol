"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import { Tree } from "@/lib/types";
import "leaflet/dist/leaflet.css";

interface TreeMapProps {
  trees: Tree[];
  height?: number;
}

export default function TreeMap({ trees, height = 400 }: TreeMapProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Calculate center of the map based on tree locations
  const centerLat = trees.reduce((sum, tree) => sum + tree.location.latitude, 0) / (trees.length || 1);
  const centerLng = trees.reduce((sum, tree) => sum + tree.location.longitude, 0) / (trees.length || 1);

  const getTreeIcon = (stage: number) => {
    // Define SVG icon sizes based on growth stage
    const sizes = [20, 25, 30, 35];
    const size = sizes[stage];
    
    return divIcon({
      html: `<div class="flex items-center justify-center h-${size} w-${size} text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tree">
                <path d="M12 22v-7"/>
                <path d="M5 8v4h14V8"/>
                <path d="M5 8l7-4 7 4"/>
                <path d="M5 12l7 4 7-4"/>
              </svg>
            </div>`,
      className: "",
      iconSize: [size, size],
      iconAnchor: [size/2, size],
    });
  };

  // Default to Null Island if no trees
  const defaultCenter = [centerLat || 0, centerLng || 0];

  return (
    <MapContainer 
      center={defaultCenter as [number, number]} 
      zoom={trees.length ? 13 : 2} 
      style={{ height: `${height}px` }} 
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {trees.map((tree) => (
        <Marker
          key={tree.id}
          position={[tree.location.latitude, tree.location.longitude]}
          icon={getTreeIcon(tree.growthStage)}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold">{tree.treeType}</h3>
              <p className="text-xs">Planted: {new Date(tree.plantedAt).toLocaleDateString()}</p>
              <p className="text-xs">Health: {tree.healthScore}%</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}