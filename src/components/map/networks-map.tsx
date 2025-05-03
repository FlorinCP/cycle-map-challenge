'use client';

import { Map, type MapRef } from '@vis.gl/react-maplibre';
import { LngLatBounds } from 'maplibre-gl';
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { filterNetworks } from '@/api/utils';
import { useListNetworksQuery } from '@/api';
import { NearMeButton } from '@/components/networks/list/near-me-button';

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

export const NetworksMap: React.FC<Props> = ({
  initialLatitude = DefaultMapInitialState.latitude,
  initialLongitude = DefaultMapInitialState.longitude,
  initialZoom = DefaultMapInitialState.zoom,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const countryCode = searchParams.get('country');
  const searchTerm = searchParams.get('search');

  const { data: allNetworks, isLoading: isLoadingNetworks } =
    useListNetworksQuery();

  const handleNetworkMarkerClick = useCallback(
    (id: string) => {
      router.push(`/networks/${id}`);
    },
    [router]
  );

  // Set up event handlers
  const setupEventHandlers = useCallback(
    (map: maplibregl.Map) => {
      // Initialize popup
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 15,
      });

      // Click on marker
      map.on('click', 'network-markers', e => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const networkId = feature.properties?.id;

          if (networkId) {
            handleNetworkMarkerClick(networkId);
            e.preventDefault();
          }
        }
      });

      // Change cursor on hover
      map.on('mouseenter', 'network-markers', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'network-markers', () => {
        map.getCanvas().style.cursor = '';
      });

      // Show popup on hover
      map.on('mouseenter', 'network-markers', e => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const coordinates = (feature.geometry as any).coordinates.slice();
          const { name, city, country } = feature.properties || {};

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          popup
            .setLngLat(coordinates)
            .setHTML(
              `
            <div class="p-2">
              <h3 class="font-bold">${name}</h3>
              <p class="text-sm">${city}, ${country}</p>
            </div>
          `
            )
            .addTo(map);
        }
      });

      map.on('mouseleave', 'network-markers', () => {
        popup.remove();
      });
    },
    [handleNetworkMarkerClick]
  );

  // Initialize map data
  const initializeMapData = useCallback(
    (map: maplibregl.Map) => {
      if (!allNetworks) return;

      const filtered = filterNetworks(allNetworks, countryCode, searchTerm);

      const geojson = {
        type: 'FeatureCollection' as const,
        features: filtered.map(network => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [
              network.location.longitude,
              network.location.latitude,
            ],
          },
          properties: {
            id: network.id,
            name: network.name,
            city: network.location.city,
            country: network.location.country,
          },
        })),
      };

      // Remove existing layers and source if they exist
      if (map.getLayer('network-markers')) map.removeLayer('network-markers');
      if (map.getSource('networks')) map.removeSource('networks');

      // Add source without clustering
      map.addSource('networks', {
        type: 'geojson',
        data: geojson,
      });

      // Add markers layer
      map.addLayer({
        id: 'network-markers',
        type: 'circle',
        source: 'networks',
        paint: {
          'circle-color': '#1E40AF',
          'circle-radius': 6,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.8,
        },
      });

      // Set up event handlers
      setupEventHandlers(map);
    },
    [allNetworks, countryCode, searchTerm, setupEventHandlers]
  );

  // Handle map load
  const onMapLoad = useCallback(() => {
    setMapLoaded(true);
    const map = mapRef.current?.getMap();
    if (map && allNetworks) {
      initializeMapData(map);
    }
  }, [allNetworks, initializeMapData]);

  // Update map data when data or filters change
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !allNetworks) return;

    const map = mapRef.current.getMap();
    if (!map) return;

    // Re-initialize map data
    initializeMapData(map);
  }, [mapLoaded, allNetworks, countryCode, searchTerm, initializeMapData]);

  // Handle bounds fitting when filters change
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !allNetworks) return;

    const map = mapRef.current.getMap();
    if (!map) return;

    const filtered = filterNetworks(allNetworks, countryCode, searchTerm);

    if (filtered.length > 0) {
      const bounds = new LngLatBounds();
      filtered.forEach(network => {
        bounds.extend([network.location.longitude, network.location.latitude]);
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 14,
          duration: 1000,
        });
      }
    } else {
      map.flyTo({
        center: [initialLongitude, initialLatitude],
        zoom: initialZoom,
        duration: 1000,
      });
    }
  }, [
    mapLoaded,
    allNetworks,
    countryCode,
    searchTerm,
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
        mapStyle="https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        onLoad={onMapLoad}
      >
        <span className={'absolute top-8 left-8 z-10 flex items-center'}>
          <NearMeButton />
        </span>
      </Map>

      {isLoadingNetworks && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <div className="loader">Loading...</div>
        </div>
      )}
    </div>
  );
};

NetworksMap.displayName = 'NetworksMap';

export default NetworksMap;
