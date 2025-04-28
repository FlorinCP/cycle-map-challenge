'use client';

import { Map, type MapRef } from '@vis.gl/react-maplibre';
import React, { useRef, useMemo } from 'react';

interface Props {
  longitude: number;
  latitude: number;
  zoom?: number;
  pitch?: number;
  bearing?: number;
  maxZoom?: number;
  height?: string;
}

const DefaultMapInitialState = {
  longitude: 0,
  latitude: 0,
  zoom: 12,
  pitch: 45,
  bearing: 0,
  maxZoom: 15,
};

export const CustomMap: React.FC<Props> = ({
  latitude,
  longitude,
  zoom,
  pitch,
  bearing,
  height = '24rem',
}) => {
  const mapRef = useRef<MapRef>(null);

  const initialViewState = useMemo(
    () => ({
      latitude: Number(latitude),
      longitude: Number(longitude),
      zoom: Number(zoom !== undefined ? zoom : DefaultMapInitialState.zoom),
      pitch: Number(pitch !== undefined ? pitch : DefaultMapInitialState.pitch),
      bearing: Number(
        bearing !== undefined ? bearing : DefaultMapInitialState.bearing
      ),
    }),
    [latitude, longitude, zoom, pitch, bearing]
  );

  return (
    <div style={{ height }}>
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle={{
          version: 8,
          sources: {
            'osm-source': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: 'osm-layer',
              type: 'raster',
              source: 'osm-source',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        }}
        dragPan={false}
        scrollZoom={false}
        doubleClickZoom={false}
        touchPitch={false}
        dragRotate={false}
        keyboard={false}
        attributionControl={false}
        renderWorldCopies={false}
        reuseMaps
      />
    </div>
  );
};

CustomMap.displayName = 'CustomMap';

export default CustomMap;
