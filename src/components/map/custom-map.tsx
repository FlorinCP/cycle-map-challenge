'use client';

import { Map, Marker, type MapRef } from '@vis.gl/react-maplibre';
import { Map as MapLibreMap, LngLatBounds } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
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

import { useNetworksQuery } from '@/hooks/queries/use-network-query';
import type { NetworkSummary, Station } from '@/types/city-bikes';
import { filterNetworks } from '@/lib/api/utils';
import { useNetworkDetailQuery } from '@/hooks/queries/use-network-query-detail';

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

export const CustomMap: React.FC<Props> = ({
  initialLatitude = DefaultMapInitialState.latitude,
  initialLongitude = DefaultMapInitialState.longitude,
  initialZoom = DefaultMapInitialState.zoom,
}) => {
  const mapRefGL = useRef<MapLibreMap | null>(null);
  const reactMapRef = useRef<MapRef>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapTilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const mapStyleUrl = `https://api.maptiler.com/maps/openstreetmap/style.json?key=${mapTilerKey}`;
  const pathname = usePathname();
  const params = useParams<{ id?: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isDetailPage = !!params.id && pathname.startsWith('/networks/');
  const networkId = isDetailPage ? params.id : null;

  const countryCode = searchParams.get('country');
  const searchTerm = searchParams.get('search');

  const { data: allNetworks, isLoading: isLoadingNetworks } =
    useNetworksQuery();
  const { data: networkDetail, isLoading: isLoadingDetail } =
    useNetworkDetailQuery(networkId);

  const handleNetworkMarkerClick = useCallback(
    (network: NetworkSummary) => {
      router.push(`/networks/${network.id}`); // Navigate
    },
    [router]
  );

  const markers = useMemo(() => {
    if (!isMapLoaded) return null;

    if (isDetailPage) {
      if (networkDetail?.stations && !isLoadingDetail) {
        return networkDetail.stations.map((station: Station) => (
          <Marker
            key={`station-${station.id}`}
            longitude={station.longitude}
            latitude={station.latitude}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation(); // prevent map click
            }}
          >
            <div
              className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white cursor-pointer"
              title={station.name}
            ></div>
          </Marker>
        ));
      }
    } else {
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
    networkDetail,
    allNetworks,
    isLoadingDetail,
    isLoadingNetworks,
    countryCode,
    searchTerm,
    handleNetworkMarkerClick,
  ]);

  useEffect(() => {
    const map = mapRefGL.current;
    if (!map || !isMapLoaded) return;

    if (isDetailPage) {
      if (networkDetail?.stations && !isLoadingDetail) {
        if (networkDetail.stations.length > 0) {
          const bounds = new LngLatBounds();
          networkDetail.stations.forEach(station => {
            bounds.extend([station.longitude, station.latitude]);
          });
          if (!bounds.isEmpty()) {
            map.fitBounds(bounds, { padding: 60, maxZoom: 16, duration: 0 });
          }
        } else if (networkDetail.location) {
          console.log('Instantly jumping to network center (no stations)');
          map.jumpTo({
            // <--- Changed from flyTo to jumpTo
            center: [
              networkDetail.location.longitude,
              networkDetail.location.latitude,
            ],
            zoom: 12,
          });
        }
      }
    } else {
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
            console.log('Fitting bounds to filtered networks (animated)');
            map.fitBounds(bounds, { padding: 40, maxZoom: 14, duration: 1000 });
          }
        } else {
          map.flyTo({
            center: [initialLongitude, initialLatitude],
            zoom: initialZoom,
            duration: 1000,
          });
        }
      }
    }
  }, [
    // Dependencies remain the same
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
    initialZoom,
  ]);

  const onMapLoad = useCallback((evt: maplibregl.MapLibreEvent) => {
    mapRefGL.current = evt.target;
    setIsMapLoaded(true);
    console.log('MapLibre Instance Loaded and Stored');
  }, []);

  return (
    <div className={'h-full w-full relative'}>
      {(isLoadingNetworks || (isDetailPage && isLoadingDetail)) && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-10">
          <p className="text-gray-700">Loading map data...</p>
        </div>
      )}

      <Map
        ref={reactMapRef} // Ref for the React component
        onLoad={onMapLoad} // Get the actual map instance on load
        initialViewState={DefaultMapInitialState}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyleUrl}
        renderWorldCopies={false}
        reuseMaps
      >
        {markers}
      </Map>
    </div>
  );
};

CustomMap.displayName = 'CustomMap';

export default CustomMap;
