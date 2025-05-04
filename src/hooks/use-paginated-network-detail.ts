import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  calculateTotalPages,
  paginateItems,
  sortStations,
  useGetNetworkDetailQuery,
} from '@/api';
import {
  SEARCH_PARAMS,
  SortDirection,
  StationSortKey,
} from '@/types/search-params';

export function usePaginatedNetworkDetal(
  networkId: string,
  itemsPerPage: number = 20
) {
  const searchParams = useSearchParams();

  const sortKey = searchParams.get('sortBy') as StationSortKey | null;
  const sortDirection = (searchParams.get('sortDir') ||
    'desc') as SortDirection;
  const currentPage = Number(searchParams.get(SEARCH_PARAMS.PAGE) || '1');

  const { data: networkDetail, isLoading } =
    useGetNetworkDetailQuery(networkId);

  const processedStations = useMemo(() => {
    if (!networkDetail?.stations) return { paginated: [], totalPages: 0 };

    const sorted = sortStations(networkDetail.stations, sortKey, sortDirection);

    const paginated = paginateItems(sorted, currentPage, itemsPerPage);
    const totalPages = calculateTotalPages(sorted.length, itemsPerPage);

    return { paginated, totalPages };
  }, [
    networkDetail?.stations,
    sortKey,
    sortDirection,
    currentPage,
    itemsPerPage,
  ]);

  return {
    stations: processedStations.paginated,
    totalPages: processedStations.totalPages,
    currentPage,
    sortKey,
    sortDirection,
    isLoading,
    networkDetail,
  };
}
