'use client';

import { Map, type MapRef } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { MapLibreEvent } from 'maplibre-gl';

interface Props {
  children?: React.ReactNode;
  onLoad?: (evt: MapLibreEvent) => void;
  isLoading?: boolean;
}

const DefaultMapInitialState = {
  longitude: 10,
  latitude: 45,
  zoom: 1.5,
  pitch: 0,
  bearing: 0,
};

export const MapWrapper = forwardRef<MapRef, Props>(
  ({ isLoading, children, onLoad }, ref) => {
    const reactMapRef = useRef<MapRef>(null);
    const mapTilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
    const mapStyleUrl = `https://api.maptiler.com/maps/streets-v2-light/style.json?key=${mapTilerKey}`;

    useImperativeHandle(ref, () => reactMapRef.current!, []);

    return (
      <div className={'h-full w-full relative'}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-10">
            <p className="text-gray-700">Loading map data...</p>
          </div>
        )}

        <Map
          ref={reactMapRef}
          initialViewState={DefaultMapInitialState}
          onLoad={onLoad}
          style={{ width: '100%', height: '100%' }}
          mapStyle={mapStyleUrl}
          renderWorldCopies={false}
          maxTileCacheSize={100}
          refreshExpiredTiles={false}
          reuseMaps
        >
          {children}
        </Map>
      </div>
    );
  }
);

MapWrapper.displayName = 'MapWrapper';

export default MapWrapper;
