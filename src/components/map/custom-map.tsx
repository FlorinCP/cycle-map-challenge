import { Map, type MapRef } from '@vis.gl/react-maplibre';
import React, { useRef, useMemo } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Props {
  longitude: number;
  latitude: number;
  children: React.ReactNode;
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

const MAP_STYLE = {
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
};

export const CustomMap: React.FC<Props> = ({
  latitude,
  longitude,
  children,
  zoom,
  pitch,
  bearing,
  height = '24rem',
}) => {
  const mapRef = useRef<MapRef>(null);

  const mapId = useRef(`map-${Math.random().toString(36).substr(2, 9)}`);

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
        id={mapId.current}
        ref={mapRef}
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE}
        dragPan={false}
        scrollZoom={false}
        doubleClickZoom={false}
        touchPitch={false}
        dragRotate={false}
        keyboard={false}
        attributionControl={false}
        renderWorldCopies={false}
        reuseMaps
      >
        {children}
      </Map>
    </div>
  );
};

CustomMap.displayName = 'CustomMap';

export default CustomMap;
