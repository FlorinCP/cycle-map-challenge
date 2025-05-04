import { Source, Layer } from '@vis.gl/react-maplibre';
import React from 'react';
import * as turf from '@turf/turf';

interface UserLocationMarkerProps {
  userLat: string | null;
  userLng: string | null;
  searchRadius: number;
}

export const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({
  userLat,
  userLng,
  searchRadius,
}) => {
  if (!userLat || !userLng) return null;

  const center = [parseFloat(userLng), parseFloat(userLat)];

  const radiusCircle =
    searchRadius > 0 && searchRadius !== -1
      ? turf.circle(center, searchRadius, { units: 'kilometers', steps: 64 })
      : null;

  const userPointGeoJSON = {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: center,
        },
        properties: {},
      },
    ],
  };

  return (
    <>
      {radiusCircle && (
        <Source id="radius-circle" type="geojson" data={radiusCircle}>
          <Layer
            id="radius-circle-fill"
            type="fill"
            paint={{
              'fill-color': 'rgba(144, 238, 144, 0.15)',
              'fill-outline-color': 'rgba(144, 238, 144, 0.4)',
            }}
          />
          <Layer
            id="radius-circle-line"
            type="line"
            paint={{
              'line-color': 'rgba(144, 238, 144, 0.6)',
              'line-width': 2,
            }}
          />
        </Source>
      )}

      <Source id="user-location" type="geojson" data={userPointGeoJSON}>
        <Layer
          id="user-location-marker"
          type="circle"
          paint={{
            'circle-color': '#4285F4',
            'circle-radius': 8,
            'circle-stroke-width': 3,
            'circle-stroke-color': '#FFFFFF',
          }}
        />
      </Source>

      <Source id="user-location-pulse" type="geojson" data={userPointGeoJSON}>
        <Layer
          id="user-location-pulse-layer"
          type="circle"
          paint={{
            'circle-color': '#4285F4',
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              5,
              20,
              25,
            ],
            'circle-opacity': 0.15,
            'circle-stroke-width': 0,
          }}
        />
      </Source>
    </>
  );
};
