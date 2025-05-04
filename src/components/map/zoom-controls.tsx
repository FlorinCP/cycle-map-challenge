import React from 'react';
import type { MapRef } from '@vis.gl/react-maplibre';
import { Plus, Minus } from 'lucide-react';

export function ZoomControls({ mapRef }: { mapRef: React.RefObject<MapRef> }) {
  const handleZoomIn = () => mapRef.current?.zoomIn({ duration: 300 });
  const handleZoomOut = () => mapRef.current?.zoomOut({ duration: 300 });

  return (
    <div className="absolute top-10 right-10 z-10">
      <div className="flex flex-col">
        <button
          onClick={handleZoomIn}
          className="flex h-8 w-8 items-center justify-center gap-2.5 flex-shrink-0 py-1 px-2 bg-white hover:bg-gray-100 transition-colors rounded-t-[43px] shadow-md"
          aria-label="Zoom in"
        >
          <Plus className="h-5 w-5 text-primary" />
        </button>
        <button
          onClick={handleZoomOut}
          className="flex h-8 w-8 items-center justify-center gap-2.5 flex-shrink-0 py-1 px-2 bg-white hover:bg-gray-100 transition-colors rounded-b-[43px] shadow-md"
          aria-label="Zoom out"
        >
          <Minus className="h-5 w-5 text-primary" />
        </button>
      </div>
    </div>
  );
}
