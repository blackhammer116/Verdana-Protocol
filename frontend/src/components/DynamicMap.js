"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Create a dynamic import with no SSR
const DynamicMap = dynamic(() => import('./MapComponentImpl'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
      <p>Loading map...</p>
    </div>
  ),
});

export default DynamicMap;