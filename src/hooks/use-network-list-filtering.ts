import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useListNetworksQuery } from '@/api';
import { filterNetworks } from '@/api/utils';
import { findNetworksProgressively } from '@/lib/location-utils';
import { SEARCH_PARAMS } from '@/types/search-params';

export function useNetworkListFiltering() {
  const searchParams = useSearchParams();

  const countryCode = searchParams.get(SEARCH_PARAMS.COUNTRY);
  const searchTerm = searchParams.get(SEARCH_PARAMS.SEARCH);
  const userLat = searchParams.get(SEARCH_PARAMS.LAT);
  const userLng = searchParams.get(SEARCH_PARAMS.LNG);

  const { data: allNetworks, isLoading } = useListNetworksQuery();

  const { filteredNetworks, searchRadius } = useMemo(() => {
    if (!allNetworks || isLoading) {
      return { filteredNetworks: [], searchRadius: 0 };
    }

    if (userLat && userLng) {
      const result = findNetworksProgressively(
        allNetworks,
        parseFloat(userLat),
        parseFloat(userLng),
        countryCode,
        searchTerm,
        [10, 50, 100, 200]
      );
      return {
        filteredNetworks: result.networks,
        searchRadius: result.searchRadius,
      };
    }

    return {
      filteredNetworks: filterNetworks(allNetworks, countryCode, searchTerm),
      searchRadius: 0,
    };
  }, [allNetworks, isLoading, countryCode, searchTerm, userLat, userLng]);

  return {
    filteredNetworks,
    searchRadius,
    isLoading,
    userLat,
    userLng,
  };
}
