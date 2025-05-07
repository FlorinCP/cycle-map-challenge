import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { filterNetworks } from '@/api/utils';
import { findNetworksProgressively } from '@/lib/location-utils';
import { SEARCH_PARAMS } from '@/types/search-params';
import { NetworkSummary } from '@/types/city-bikes';

export function useNetworkListFiltering(allNetworks: NetworkSummary[] | null) {
  const searchParams = useSearchParams();

  const countryCode = searchParams.get(SEARCH_PARAMS.COUNTRY);
  const searchTerm = searchParams.get(SEARCH_PARAMS.SEARCH);
  const userLat = searchParams.get(SEARCH_PARAMS.LAT);
  const userLng = searchParams.get(SEARCH_PARAMS.LNG);

  const { filteredNetworks, searchRadius } = useMemo(() => {
    if (!allNetworks) {
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
  }, [allNetworks, countryCode, searchTerm, userLat, userLng]);

  return {
    filteredNetworks,
    searchRadius,
    userLat,
    userLng,
  };
}
