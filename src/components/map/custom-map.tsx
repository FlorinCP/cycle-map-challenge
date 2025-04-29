// src/components/map/CustomMap.tsx
'use client';

import { Map, Marker, type MapRef } from '@vis.gl/react-maplibre';
import { Map as MapLibreMap, LngLatBounds } from 'maplibre-gl'; // Import MapLibre types
import 'maplibre-gl/dist/maplibre-gl.css'; // Import MapLibre CSS
import React, {
  useRef,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  usePathname,
  useParams,
  useSearchParams,
  useRouter,
} from 'next/navigation';

// TanStack Query Hooks
import { useNetworksQuery } from '@/hooks/queries/use-network-query'; // Adjust path
// Types
import type { NetworkSummary, Station } from '@/types/city-bikes';
import { filterNetworks } from '@/lib/api/utils';
import { useNetworkDetailQuery } from '@/hooks/queries/use-network-query-detail'; // Adjust path

interface Props {
  initialLongitude?: number;
  initialLatitude?: number;
  initialZoom?: number;
}

const DefaultMapInitialState = {
  longitude: 10, // Centered more globally initially
  latitude: 45,
  zoom: 1.5,
  pitch: 0,
  bearing: 0,
};

export const CustomMap: React.FC<Props> = ({
  initialLatitude = DefaultMapInitialState.latitude,
  initialLongitude = DefaultMapInitialState.longitude,
  initialZoom = DefaultMapInitialState.zoom,
}) => {
  const mapRefGL = useRef<MapLibreMap | null>(null); // Ref for the actual MapLibre instance
  const reactMapRef = useRef<MapRef>(null); // Ref for the react-map-gl component wrapper
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // --- Routing & Filter Hooks ---
  const pathname = usePathname();
  const params = useParams<{ id?: string }>();
  const searchParams = useSearchParams();
  const router = useRouter(); // Needed if markers trigger navigation

  const isDetailPage = !!params.id && pathname.startsWith('/networks/');
  const networkId = isDetailPage ? params.id : null;

  const countryCode = searchParams.get('country');
  const searchTerm = searchParams.get('search');

  // --- Data Fetching Hooks ---
  const { data: allNetworks, isLoading: isLoadingNetworks } =
    useNetworksQuery();
  const { data: networkDetail, isLoading: isLoadingDetail } =
    useNetworkDetailQuery(networkId);

  // --- Memoized Initial View State (Static) ---
  const initialViewState = useMemo(
    () => ({
      latitude: Number(initialLatitude),
      longitude: Number(initialLongitude),
      zoom: Number(initialZoom),
      pitch: DefaultMapInitialState.pitch,
      bearing: DefaultMapInitialState.bearing,
    }),
    [initialLatitude, initialLongitude, initialZoom]
  );

  // --- Marker Click Handler (Example for Network Markers) ---
  const handleNetworkMarkerClick = useCallback(
    (network: NetworkSummary) => {
      console.log(`Marker clicked: ${network.name}`);
      const target = {
        lat: network.location.latitude,
        lng: network.location.longitude,
        zoom: 12, // Or desired zoom
      };
      mapRefGL.current?.flyTo({
        center: [target.lng, target.lat],
        zoom: target.zoom,
        duration: 1200,
      });
      router.push(`/networks/${network.id}`); // Navigate
    },
    [router]
  );

  // --- Render Markers ---
  // Use useMemo to create marker elements only when data/filters change
  const markers = useMemo(() => {
    if (!isMapLoaded) return null; // Don't render markers until map is loaded

    console.log(
      `Rendering markers. DetailPage: ${isDetailPage}, NetworkID: ${networkId}`
    );

    if (isDetailPage) {
      // --- Detail View: Station Markers ---
      if (networkDetail?.stations && !isLoadingDetail) {
        console.log(
          `Rendering ${networkDetail.stations.length} station markers.`
        );
        return networkDetail.stations.map((station: Station) => (
          <Marker
            key={`station-${station.id}`}
            longitude={station.longitude}
            latitude={station.latitude}
            anchor="bottom"
            // Optional: Add onClick for station popups
            onClick={e => {
              e.originalEvent.stopPropagation(); // prevent map click
              // Implement popup logic here
              console.log('Station Marker Clicked:', station.name);
            }}
          >
            {/* Simple blue dot marker - Replace with SVG or custom element */}
            <div
              className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white cursor-pointer"
              title={station.name}
            ></div>
          </Marker>
        ));
      }
    } else {
      // --- List View: Network Markers ---
      if (allNetworks && !isLoadingNetworks) {
        const filtered = filterNetworks(allNetworks, countryCode, searchTerm);
        console.log(`Rendering ${filtered.length} filtered network markers.`);
        return filtered.map((network: NetworkSummary) => (
          <Marker
            key={`network-${network.id}`}
            longitude={network.location.longitude}
            latitude={network.location.latitude}
            anchor="bottom"
            // Add onClick to trigger flyTo + navigation
            onClick={e => {
              e.originalEvent.stopPropagation(); // prevent map click
              handleNetworkMarkerClick(network);
            }}
          >
            {/* Simple red dot marker - Replace with SVG or custom element */}
            <div
              className="w-3 h-3 bg-red-600 rounded-full border-2 border-white cursor-pointer"
              title={network.name}
            ></div>
          </Marker>
        ));
      }
    }
    return null; // Return null if no markers should be shown yet
  }, [
    isMapLoaded,
    isDetailPage,
    networkId,
    networkDetail,
    allNetworks,
    isLoadingDetail,
    isLoadingNetworks,
    countryCode,
    searchTerm,
    handleNetworkMarkerClick, // Add necessary dependencies
  ]);

  // --- Effect to Move Map View ---
  useEffect(() => {
    const map = mapRefGL.current; // Use the MapLibre instance ref
    if (!map || !isMapLoaded) return; // Ensure map is ready

    console.log('View Effect Triggered. DetailPage:', isDetailPage);

    if (isDetailPage) {
      // --- Detail View: Fit Bounds to Stations or Center on Network ---
      if (networkDetail?.stations && !isLoadingDetail) {
        if (networkDetail.stations.length > 0) {
          const bounds = new LngLatBounds();
          networkDetail.stations.forEach(station => {
            bounds.extend([station.longitude, station.latitude]);
          });
          if (!bounds.isEmpty()) {
            console.log('Fitting bounds to stations');
            map.fitBounds(bounds, { padding: 60, maxZoom: 16, duration: 1200 });
          }
        } else if (networkDetail.location) {
          // Fallback if no stations
          console.log('Flying to network center (no stations)');
          map.flyTo({
            center: [
              networkDetail.location.longitude,
              networkDetail.location.latitude,
            ],
            zoom: 12,
            duration: 1200,
          });
        }
      }
    } else {
      // --- List View: Fit Bounds to Filtered Networks ---
      if (allNetworks && !isLoadingNetworks) {
        const filtered = filterNetworks(allNetworks, countryCode, searchTerm);
        if (filtered.length > 0) {
          const bounds = new LngLatBounds();
          filtered.forEach(network => {
            bounds.extend([
              network.location.longitude,
              network.location.latitude,
            ]);
          });
          if (!bounds.isEmpty()) {
            console.log('Fitting bounds to filtered networks');
            map.fitBounds(bounds, { padding: 40, maxZoom: 14, duration: 1000 });
          }
        } else {
          // Optional: Reset view if no networks match filter
          console.log('No filtered networks, resetting view');
          map.flyTo({
            center: [initialLongitude, initialLatitude],
            zoom: initialZoom,
            duration: 1000,
          });
        }
      }
    }
  }, [
    isMapLoaded,
    isDetailPage,
    networkDetail,
    allNetworks,
    isLoadingDetail,
    isLoadingNetworks,
    countryCode,
    searchTerm,
    initialLatitude,
    initialLongitude,
    initialZoom, // Ensure all dependencies affecting view are listed
  ]);

  // --- Callback to get MapLibre instance ---
  const onMapLoad = useCallback((evt: maplibregl.MapLibreEvent) => {
    mapRefGL.current = evt.target; // Store the MapLibre instance
    setIsMapLoaded(true);
    console.log('MapLibre Instance Loaded and Stored');
  }, []);

  return (
    // Container needs explicit height, typically provided by parent layout
    <div className={'h-full w-full relative'}>
      {/* Loading Indicator Overlay (Optional) */}
      {(isLoadingNetworks || (isDetailPage && isLoadingDetail)) && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-10">
          <p className="text-gray-700">Loading map data...</p>
        </div>
      )}

      <Map
        ref={reactMapRef} // Ref for the React component
        onLoad={onMapLoad} // Get the actual map instance on load
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle={{
          /* Your map style */ version: 8,
          sources: {
            'osm-source': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors',
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
        renderWorldCopies={false}
        reuseMaps
      >
        {/* Render markers as children of the Map component */}
        {markers}
      </Map>
    </div>
  );
};

CustomMap.displayName = 'CustomMap';

export default CustomMap;
