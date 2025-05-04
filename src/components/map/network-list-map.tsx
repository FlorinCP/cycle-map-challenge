'use client';

import { Map, type MapRef, Layer, Source, Popup } from '@vis.gl/react-maplibre';
import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import 'maplibre-gl/dist/maplibre-gl.css';
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

interface HoveredFeature {
  coordinates: [number, number];
  name: string;
  city: string;
  country: string;
}

export const NetworkListMap: React.FC<Props> = ({
  initialLatitude = DefaultMapInitialState.latitude,
  initialLongitude = DefaultMapInitialState.longitude,
  initialZoom = DefaultMapInitialState.zoom,
}) => {
  const router = useRouter();
  const mapRef = useRef<MapRef>(null);
  const [hoveredFeature, setHoveredFeature] = useState<HoveredFeature | null>(
    null
  );

  const [isMapReady, setIsMapReady] = useState(false);
  const mapStyle = process.env.NEXT_PUBLIC_MAP_STYLE;
  const { filteredNetworks, searchRadius, isLoading, userLat, userLng } =
    useNetworkListFiltering();
  const geojsonData = useGeojsonData(filteredNetworks);
  const mapZoomConfig = useMapZoomConfig(searchRadius, filteredNetworks.length);
  const mapBounds = useMapBounds(filteredNetworks, userLat, userLng);

  const handleMarkerClick = useCallback(
    (e: maplibregl.MapLayerMouseEvent) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const networkId = feature.properties?.id;

        if (networkId) {
          router.push(`/networks/${networkId}`);
        }
      }
    },
    [router]
  );

  const handleMouseEnter = useCallback((e: maplibregl.MapLayerMouseEvent) => {
    if (e.features && e.features.length > 0) {
      const feature = e.features[0];
      const geometry = feature.geometry as GeoJSON.Point;

      setHoveredFeature({
        coordinates: geometry.coordinates as [number, number],
        name: feature.properties?.name,
        city: feature.properties?.city,
        country: feature.properties?.country,
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredFeature(null);
  }, []);

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

  const onMapLoad = useCallback(() => {
    setIsMapReady(true);
  }, []);

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
        interactiveLayerIds={['network-markers']}
        onClick={handleMarkerClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className={'absolute top-8 left-8 z-10 flex items-center'}>
          <NearMeButton />
        </span>

        {geojsonData.features.length > 0 && (
          <Source id="networks" type="geojson" data={geojsonData}>
            <Layer
              id="network-markers"
              type="circle"
              paint={{
                'circle-color': 'rgba(247, 169, 122, 1)',
                'circle-radius': 6,
                'circle-stroke-width': 2,
                'circle-stroke-color': 'rgba(243, 123, 68, 1)',
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
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <Spinner />
        </div>
      )}
    </div>
  );
};

NetworkListMap.displayName = 'NetworkListMap';

export default NetworkListMap;
