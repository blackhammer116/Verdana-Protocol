// File: components/TreeMap.tsx
import React, { useEffect, useState } from 'react';
import { Tree } from './Tree';

interface TreeMapProps {
  treeCount: number;
  location?: { latitude: string, longitude: string };
}

export const TreeMap: React.FC<TreeMapProps> = ({ treeCount, location }) => {
  const [trees, setTrees] = useState<Array<{ id: number, x: number, y: number, stage: number }>>([]);
  
  // Generate tree positions when count changes
  useEffect(() => {
    if (treeCount > 0) {
      // Generate positions for trees
      const newTrees = Array.from({ length: Math.min(treeCount, 20) }, (_, i) => ({
        id: i,
        x: Math.floor(Math.random() * 80) + 10, // 10-90% of width
        y: Math.floor(Math.random() * 80) + 10, // 10-90% of height
        stage: 3, // Fully grown trees for existing count
      }));
      
      setTrees(newTrees);
    }
  }, [treeCount]);
  
  // No trees to display
  if (treeCount === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center h-64">
        <p className="text-gray-500">No trees planted yet. Start planting to see your forest grow!</p>
      </div>
    );
  }
  
  return (
    <div className="relative bg-green-100 border border-green-200 rounded-lg overflow-hidden" style={{ height: '400px' }}>
      {/* Simulated satellite map */}
      <div className="absolute inset-0 bg-green-200 opacity-30 z-0">
        {/* Grid lines */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      {/* Location marker */}
      {location && (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="h-4 w-4 bg-red-500 rounded-full animate-ping absolute"></div>
          <div className="h-4 w-4 bg-red-500 rounded-full relative"></div>
        </div>
      )}
      
      {/* Trees */}
      {trees.map(tree => (
        <div 
          key={tree.id} 
          className="absolute z-10"
          style={{ 
            left: `${tree.x}%`, 
            top: `${tree.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Tree stage={tree.stage} />
        </div>
      ))}
      
      {/* Info panel */}
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-md z-30">
        <h4 className="font-medium text-sm">Your Forest</h4>
        <p className="text-xs text-gray-600">
          {treeCount} {treeCount === 1 ? 'tree' : 'trees'} planted
        </p>
        {location && (
          <p className="text-xs text-gray-500 mt-1">
            Location: {location.latitude}, {location.longitude}
          </p>
        )}
      </div>
      
      {/* Tree count label */}
      {treeCount > 20 && (
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-2 py-1 rounded shadow-sm text-xs">
          Showing 20 of {treeCount} trees
        </div>
      )}
    </div>
  );
};

// Add this to the Dashboard component
// To use the TreeMap, modify the Dashboard.tsx file to include:

/*
// Inside the Dashboard component:
const [location, setLocation] = useState(null);

// Get location from local storage
useEffect(() => {
  const farmerData = localStorage.getItem('farmer_data_' + address);
  if (farmerData) {
    const parsed = JSON.parse(farmerData);
    if (parsed.latitude && parsed.longitude) {
      setLocation({
        latitude: parsed.latitude,
        longitude: parsed.longitude
      });
    }
  }
}, [address]);

// Then add this below the activity section:
<div className="mt-6">
  <h3 className="font-medium mb-4">Your Forest Map</h3>
  <TreeMap treeCount={treeCount} location={location} />
</div>
*/