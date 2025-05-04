'use client';

import { Map, type MapRef, Layer, Source, Popup } from '@vis.gl/react-maplibre';
import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { MapLayerMouseEvent } from 'maplibre-gl';
import { NearMeButton } from '@/components/near-me-feature/near-me-button';
import { useGeojsonData } from '@/hooks/map/use-geo-json-data';
import { useMapZoomConfig } from '@/hooks/map/use-map-zoom-config';
import { useMapBounds } from '@/hooks/map/use-map-bounds';
import { Spinner } from '@/components/ui/spinner';
import { SearchRadiusIndicator } from '@/components/near-me-feature/search-radius-indicator';
import { UserLocationMarker } from '@/components/near-me-feature/user-location-marker';
import { useNetworkListFiltering } from '@/hooks/use-network-list-filtering';

interface Props {
  initialLongitude?: number;
  initialLatitude?: number;
  initialZoom?: number;
}

const DefaultMapInitialState = {
  longitude: 10,
  latitude: 45,
  zoom: 1.5,
  pitch: 0,
  bearing: 0,
};

export const NetworkListMap: React.FC<Props> = ({
  initialLatitude = DefaultMapInitialState.latitude,
  initialLongitude = DefaultMapInitialState.longitude,
  initialZoom = DefaultMapInitialState.zoom,
}) => {
  const router = useRouter();
  const mapRef = useRef<MapRef>(null);
  const [hoveredFeature, setHoveredFeature] = useState<{
    coordinates: [number, number];
    name: string;
    city: string;
    country: string;
  } | null>(null);

  const [isMapReady, setIsMapReady] = useState(false);
  const mapStyle = process.env.NEXT_PUBLIC_MAP_STYLE;
  const { filteredNetworks, searchRadius, isLoading, userLat, userLng } =
    useNetworkListFiltering();
  const geojsonData = useGeojsonData(filteredNetworks);
  const mapZoomConfig = useMapZoomConfig(searchRadius, filteredNetworks.length);
  const mapBounds = useMapBounds(filteredNetworks, userLat, userLng);

  const onMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    let hoveredId: string | number | null = null;

    map.on('mouseenter', 'network-markers', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'network-markers', () => {
      map.getCanvas().style.cursor = '';

      if (hoveredId !== null) {
        map.setFeatureState(
          { source: 'networks', id: hoveredId },
          { hover: false }
        );
        hoveredId = null;
      }
      setHoveredFeature(null);
    });

    map.on('mousemove', 'network-markers', (e: MapLayerMouseEvent) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];

        if (hoveredId !== null && hoveredId !== feature.id) {
          map.setFeatureState(
            { source: 'networks', id: hoveredId },
            { hover: false }
          );
        }

        const featureId = feature.id;
        if (featureId !== undefined) {
          hoveredId = featureId;

          map.setFeatureState(
            { source: 'networks', id: featureId },
            { hover: true }
          );
        }

        setHoveredFeature({
          coordinates: [e.lngLat.lng, e.lngLat.lat],
          name: feature.properties?.name || '',
          city: feature.properties?.city || '',
          country: feature.properties?.country || '',
        });
      }
    });

    map.on('click', 'network-markers', (e: MapLayerMouseEvent) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const networkId = feature.properties?.id;

        if (networkId) {
          router.push(`/networks/${networkId}`);
        }
      }
    });

    setIsMapReady(true);
  }, [router]);

  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;

    const map = mapRef.current.getMap();
    if (!map) return;

    const timeoutId = setTimeout(() => {
      if (mapBounds) {
        map.fitBounds(mapBounds, {
          padding: mapZoomConfig.padding,
          maxZoom: mapZoomConfig.maxZoom,
          duration: 1000,
          essential: true,
        });
      } else if (userLat && userLng) {
        map.flyTo({
          center: [parseFloat(userLng), parseFloat(userLat)],
          zoom: 12,
          duration: 1000,
          essential: true,
        });
      } else {
        map.flyTo({
          center: [initialLongitude, initialLatitude],
          zoom: initialZoom,
          duration: 1000,
          essential: true,
        });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [
    isMapReady,
    mapBounds,
    mapZoomConfig,
    userLat,
    userLng,
    initialLatitude,
    initialLongitude,
    initialZoom,
  ]);

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: initialLongitude,
          latitude: initialLatitude,
          zoom: initialZoom,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        onLoad={onMapLoad}
        dragRotate={false}
        pitchWithRotate={false}
        touchZoomRotate={false}
      >
        <span className="absolute top-8 left-8 z-10 flex items-center">
          <NearMeButton />
        </span>

        {geojsonData.features.length > 0 && (
          <Source
            id="networks"
            type="geojson"
            data={geojsonData}
            generateId={true}
          >
            <Layer
              id="network-markers"
              type="circle"
              paint={{
                'circle-color': [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  'rgb(255,255,255)',
                  'rgba(247, 169, 122, 1)',
                ],
                'circle-radius': 6,
                'circle-stroke-width': 2,
                'circle-stroke-color': [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  'rgba(243, 123, 68, 1)', // Color when hovered
                  'rgba(243, 123, 68, 0.7)', // Default color
                ],
                'circle-opacity': 1,
              }}
            />
          </Source>
        )}

        {hoveredFeature && (
          <Popup
            longitude={hoveredFeature.coordinates[0]}
            latitude={hoveredFeature.coordinates[1]}
            closeButton={false}
            closeOnClick={false}
            offset={15}
          >
            <div className="p-2">
              <h3 className="font-bold">{hoveredFeature.name}</h3>
              <p className="text-sm">
                {hoveredFeature.city}, {hoveredFeature.country}
              </p>
            </div>
          </Popup>
        )}

        {isMapReady && userLat && userLng && (
          <>
            <UserLocationMarker
              userLat={userLat}
              userLng={userLng}
              searchRadius={searchRadius}
            />
            <SearchRadiusIndicator
              userLat={userLat}
              userLng={userLng}
              searchRadius={searchRadius}
            />
          </>
        )}
      </Map>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-50">
          <Spinner />
        </div>
      )}
    </div>
  );
};

NetworkListMap.displayName = 'NetworkListMap';

export default NetworkListMap;
