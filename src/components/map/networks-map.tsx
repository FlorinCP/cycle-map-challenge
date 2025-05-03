'use client';

import { type MapRef } from '@vis.gl/react-maplibre';
import { LngLatBounds } from 'maplibre-gl';
import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import type { NetworkSummary } from '@/types/city-bikes';
import { filterNetworks } from '@/api/utils';
import MapWrapper from '@/components/map/map-wrapper';
import { useListNetworksQuery } from '@/api';
import { NetworkMarker } from '@/components/map/network-marker';
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
  // const prefetchNetworkDetail = usePrefetchNetworkDetail();

  const router = useRouter();
  const mapRef = useRef<MapRef>(null);

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

  const markers = useMemo(() => {
    if (allNetworks && !isLoadingNetworks) {
      const filtered = filterNetworks(allNetworks, countryCode, searchTerm);
      return filtered.map((network: NetworkSummary) => (
        <NetworkMarker
          key={network.id}
          network={network}
          onClick={() => handleNetworkMarkerClick(network.id)}
          // onMouseEnter={() => prefetchNetworkDetail(network.id)}
        />
      ));
    }
    return null;
  }, [
    allNetworks,
    isLoadingNetworks,
    countryCode,
    searchTerm,
    handleNetworkMarkerClick,
    // prefetchNetworkDetail,
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
      <span className={"absolute top-8 left-8 z-10 flex items-center"}>
        <NearMeButton />
      </span>
      {markers}
    </MapWrapper>
  );
};

NetworksMap.displayName = 'NetworksMap';

export default NetworksMap;
