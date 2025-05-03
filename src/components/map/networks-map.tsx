'use client';

import { Map, type MapRef } from '@vis.gl/react-maplibre';
import { LngLatBounds } from 'maplibre-gl';
import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { filterNetworks } from '@/api/utils';
import { useListNetworksQuery } from '@/api';
import { NearMeButton } from '@/components/networks/list/near-me-button';
import { SEARCH_PARAMS } from '@/types/search-params';
import { findNetworksProgressively } from '@/lib/location-utils';

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
  const userLat = searchParams.get(SEARCH_PARAMS.LAT);
  const userLng = searchParams.get(SEARCH_PARAMS.LNG);

  const { data: allNetworks, isLoading: isLoadingNetworks } =
    useListNetworksQuery();

  const handleNetworkMarkerClick = useCallback(
    (id: string) => {
      router.push(`/networks/${id}`);
    },
    [router]
  );

  // Calculate filtered networks with progressive search
  const { filteredNetworks, searchRadius } = useMemo(() => {
    if (!allNetworks || isLoadingNetworks)
      return { filteredNetworks: [], searchRadius: 0 };

    // If user location is provided, use progressive search
    if (userLat && userLng) {
      const result = findNetworksProgressively(
        allNetworks,
        parseFloat(userLat),
        parseFloat(userLng),
        countryCode,
        searchTerm,
        [10, 50, 100, 200] // Search radii in kilometers
      );
      return {
        filteredNetworks: result.networks,
        searchRadius: result.searchRadius,
      };
    }

    // Otherwise, use standard filtering
    return {
      filteredNetworks: filterNetworks(allNetworks, countryCode, searchTerm),
      searchRadius: 0,
    };
  }, [
    allNetworks,
    isLoadingNetworks,
    countryCode,
    searchTerm,
    userLat,
    userLng,
  ]);

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
      if (!filteredNetworks || filteredNetworks.length === 0) {
        // Remove existing layers and source if no networks
        if (map.getLayer('network-markers')) map.removeLayer('network-markers');
        if (map.getSource('networks')) map.removeSource('networks');
        return;
      }

      const geojson = {
        type: 'FeatureCollection' as const,
        features: filteredNetworks.map(network => ({
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
    [filteredNetworks, setupEventHandlers]
  );

  // Handle map load
  const onMapLoad = useCallback(() => {
    setMapLoaded(true);
    const map = mapRef.current?.getMap();
    if (map) {
      initializeMapData(map);
    }
  }, [initializeMapData]);

  // Update map data when filtered networks change
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const map = mapRef.current.getMap();
    if (!map) return;

    // Re-initialize map data with the current filteredNetworks
    initializeMapData(map);
  }, [mapLoaded, filteredNetworks, initializeMapData]);

  // Handle bounds fitting with proper zoom levels
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const map = mapRef.current.getMap();
    if (!map) return;

    // Use setTimeout to ensure the map is ready for animations
    const timeoutId = setTimeout(() => {
      if (filteredNetworks.length > 0) {
        const bounds = new LngLatBounds();

        // If user location is provided, include it in the bounds
        if (userLat && userLng) {
          bounds.extend([parseFloat(userLng), parseFloat(userLat)]);
        }

        filteredNetworks.forEach(network => {
          bounds.extend([network.location.longitude, network.location.latitude]);
        });

        if (!bounds.isEmpty()) {
          let maxZoom = 15;
          let padding = 50;

          // Adjust zoom based on search radius
          if (searchRadius === -1) {
            // Showing all networks
            maxZoom = 8;
            padding = 60;
          } else if (searchRadius >= 200) {
            maxZoom = 9;
            padding = 60;
          } else if (searchRadius >= 100) {
            maxZoom = 10;
            padding = 50;
          } else if (searchRadius >= 50) {
            maxZoom = 11;
            padding = 40;
          } else if (searchRadius >= 20) {
            maxZoom = 12;
            padding = 40;
          } else if (searchRadius <= 10) {
            // Very close networks, zoom in more
            maxZoom = 13;
            padding = 30;
          }

          // If only one network is found, zoom in closer
          if (filteredNetworks.length === 1) {
            maxZoom = Math.min(maxZoom + 1, 15);
          }

          // Log for debugging
          console.log('Fitting bounds:', {
            bounds: bounds.toArray(),
            maxZoom,
            padding,
            searchRadius,
            networkCount: filteredNetworks.length
          });

          map.fitBounds(bounds, {
            padding: padding,
            maxZoom: maxZoom,
            duration: 1000,
            essential: true // This forces the animation to complete
          });
        }
      } else if (userLat && userLng) {
        // If no networks found but user location exists, center on user
        console.log('Flying to user location:', [parseFloat(userLng), parseFloat(userLat)]);

        map.flyTo({
          center: [parseFloat(userLng), parseFloat(userLat)],
          zoom: 12,
          duration: 1000,
          essential: true
        });
      } else {
        // Default view
        console.log('Flying to default view');

        map.flyTo({
          center: [initialLongitude, initialLatitude],
          zoom: initialZoom,
          duration: 1000,
          essential: true
        });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [
    mapLoaded,
    filteredNetworks,
    searchRadius,
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
        mapStyle="https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        onLoad={onMapLoad}
        dragRotate={false}
        pitchWithRotate={false}
        touchZoomRotate={false}
      >
        <span className={'absolute top-8 left-8 z-10 flex items-center'}>
          <NearMeButton />
        </span>
      </Map>

      {/* Search radius indicator */}
      {userLat && userLng && searchRadius > 0 && (
        <div className="absolute top-8 right-8 z-10 bg-white px-3 py-2 rounded-lg shadow-md text-sm">
          {searchRadius === -1
            ? 'Showing all networks (no networks found nearby)'
            : `Showing networks within ${searchRadius}km`}
        </div>
      )}

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