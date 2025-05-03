import {
  calculateTotalPages,
  filterNetworks,
  paginateItems,
  useListNetworksQuery,
} from '@/api';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { NETWORK_ITEMS_PER_PAGE, SEARCH_PARAMS } from '@/types/search-params';

export function usePaginatedNetworksList() {
  const searchParams = useSearchParams();

  const countryCode = searchParams.get(SEARCH_PARAMS.COUNTRY);
  const searchTerm = searchParams.get(SEARCH_PARAMS.SEARCH);
  const page = searchParams.get(SEARCH_PARAMS.PAGE);

  const { data: allNetworks, isLoading } = useListNetworksQuery();

  const filteredNetworks = useMemo(() => {
    if (!allNetworks) return [];
    return filterNetworks(allNetworks, countryCode, searchTerm);
  }, [allNetworks, countryCode, searchTerm]);

  const paginatedNetworks = useMemo(() => {
    return paginateItems(
      filteredNetworks,
      Number(page),
      NETWORK_ITEMS_PER_PAGE
    );
  }, [filteredNetworks, page]);

  const totalPages = useMemo(() => {
    return calculateTotalPages(filteredNetworks.length, NETWORK_ITEMS_PER_PAGE);
  }, [filteredNetworks.length]);

  return {
    networks: paginatedNetworks,
    totalPages,
    isLoading,
    countryCode,
    searchTerm,
  };
}
