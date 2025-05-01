'use client';

import { Marker, type MapRef } from '@vis.gl/react-maplibre';
import { LngLatBounds } from 'maplibre-gl';
import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { useNetworksQuery } from '@/hooks/queries/use-network-query';
import type { NetworkSummary } from '@/types/city-bikes';
import { filterNetworks } from '@/lib/api/utils';
import MapWrapper from '@/components/map/map-wrapper';

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

  const countryCode = searchParams.get('country');
  const searchTerm = searchParams.get('search');

  const { data: allNetworks, isLoading: isLoadingNetworks } =
    useNetworksQuery();

  const handleNetworkMarkerClick = useCallback(
    (network: NetworkSummary) => {
      router.push(`/networks/${network.id}`);
    },
    [router]
  );

  const markers = useMemo(() => {
    if (allNetworks && !isLoadingNetworks) {
      const filtered = filterNetworks(allNetworks, countryCode, searchTerm);
      return filtered.map((network: NetworkSummary) => (
        <Marker
          key={`network-${network.id}`}
          longitude={network.location.longitude}
          latitude={network.location.latitude}
          anchor="bottom"
          onClick={e => {
            e.originalEvent.stopPropagation();
            handleNetworkMarkerClick(network);
          }}
        >
          <div
            className="w-3 h-3 bg-grenadier-300 rounded-full border-2 border-grenadier-400 cursor-pointer"
            title={network.name}
          ></div>
        </Marker>
      ));
    }
    return null;
  }, [
    allNetworks,
    isLoadingNetworks,
    countryCode,
    searchTerm,
    handleNetworkMarkerClick,
  ]);

  useEffect(() => {
    if (!mapRef.current || !allNetworks || isLoadingNetworks) return;

    const map = mapRef.current.getMap();
    if (!map) return;

    const filtered = filterNetworks(allNetworks, countryCode, searchTerm);
    if (filtered.length > 0) {
      const bounds = new LngLatBounds();
      filtered.forEach(network => {
        bounds.extend([network.location.longitude, network.location.latitude]);
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 40, maxZoom: 14, duration: 1000 });
      }
    } else {
      map.flyTo({
        center: [initialLongitude, initialLatitude],
        zoom: initialZoom,
        duration: 1000,
      });
    }
  }, [
    allNetworks,
    isLoadingNetworks,
    countryCode,
    searchTerm,
    initialLatitude,
    initialLongitude,
    initialZoom,
  ]);

  return (
    <MapWrapper ref={mapRef} isLoading={isLoadingNetworks}>
      {markers}
    </MapWrapper>
  );
};

NetworksMap.displayName = 'NetworksMap';

export default NetworksMap;
