'use client';

import { Map, type MapRef, Layer, Source } from '@vis.gl/react-maplibre';
import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { MapLayerMouseEvent } from 'maplibre-gl';
import maplibregl from 'maplibre-gl';
import { NearMeButton } from '@/components/near-me-feature/near-me-button';
import { useNetworkListGeoJsonData } from '@/hooks/map/use-network-list-geo-json-data';
import { useMapZoomConfig } from '@/hooks/map/use-map-zoom-config';
import { useMapBounds } from '@/hooks/map/use-map-bounds';
import { Spinner } from '@/components/ui/spinner';
import { SearchRadiusIndicator } from '@/components/near-me-feature/search-radius-indicator';
import { UserLocationMarker } from '@/components/near-me-feature/user-location-marker';
import { useNetworkListFiltering } from '@/hooks/use-network-list-filtering';
import { useMapState } from '@/hooks/map/use-map-dimesions';
import { ZoomControls } from '@/components/map/zoom-controls';

export const NetworkListMap: React.FC = () => {
  const mapState = useMapState();
  const router = useRouter();
  const mapRef = useRef<MapRef>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const mapStyle = process.env.NEXT_PUBLIC_MAP_STYLE;
  const { filteredNetworks, searchRadius, isLoading, userLat, userLng } =
    useNetworkListFiltering();
  const geojsonData = useNetworkListGeoJsonData(filteredNetworks);
  const mapZoomConfig = useMapZoomConfig(searchRadius, filteredNetworks.length);
  const mapBounds = useMapBounds(filteredNetworks, userLat, userLng);

  const onMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    let hoveredId: string | number | null = null;

    popupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 15,
    });

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
      popupRef.current?.remove();
    });

    map.on('mousemove', 'network-markers', (e: MapLayerMouseEvent) => {
      if (!e.features?.[0]) return;

      const feature = e.features[0];

      if (hoveredId !== null && hoveredId !== feature.id) {
        map.setFeatureState(
          { source: 'networks', id: hoveredId },
          { hover: false }
        );
      }

      if (feature.id !== undefined) {
        hoveredId = feature.id;
        map.setFeatureState(
          { source: 'networks', id: feature.id },
          { hover: true }
        );
      }

      if (feature.geometry.type === 'Point' && popupRef.current) {
        const html = `
          <div class="p-2">
            <h3 class="font-bold">${feature.properties?.name || ''}</h3>
            <p class="text-sm">
              ${feature.properties?.city || ''}, ${feature.properties?.country || ''}
            </p>
          </div>
        `;

        popupRef.current
          .setLngLat(feature.geometry.coordinates as [number, number])
          .setHTML(html)
          .addTo(map);
      }
    });

    map.on('click', 'network-markers', (e: MapLayerMouseEvent) => {
      const networkId = e.features?.[0]?.properties?.id;
      if (networkId) {
        router.push(`/networks/${networkId}`);
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
          center: [mapState.longitude, mapState.latitude],
          zoom: mapState.zoom,
          duration: 1000,
          essential: true,
        });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [
    isMapReady,
    mapBounds,
    mapState.latitude,
    mapState.longitude,
    mapState.zoom,
    mapZoomConfig,
    userLat,
    userLng,
  ]);

  useEffect(() => {
    return () => {
      popupRef.current?.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        initialViewState={mapState}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        onLoad={onMapLoad}
        dragRotate={false}
        pitchWithRotate={false}
        touchZoomRotate={false}
        attributionControl={false}
      >
        <NearMeButton />
        <ZoomControls mapRef={mapRef} />
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
                  'rgba(243, 123, 68, 1)',
                  'rgba(243, 123, 68, 0.7)',
                ],
                'circle-opacity': 1,
              }}
            />
          </Source>
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
