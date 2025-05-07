import React, { Suspense } from 'react';
import NetworkDetailView from '@/components/networks/detail/network-detail-view';
import NetworkDetailMap from '@/components/map/network-detail-map';
import { LoadingScreen } from '@/components/ui/spinner';
import { PageMapLayout } from '@/components/layouts/page-map-layout';
import {
  calculateTotalPages,
  networksApi,
  paginateItems,
  sortStations,
} from '@/api';
import {
  SEARCH_PARAMS,
  SortDirection,
  StationSortKey,
} from '@/types/search-params';

export default async function NetworkDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { id } = params;
  const stationId = searchParams['stationId'] as string | undefined;
  const sortKey = searchParams['sortBy'] as StationSortKey | null;
  const sortDirection = (searchParams['sortDir'] || 'desc') as SortDirection;
  const currentPage = Number(searchParams[SEARCH_PARAMS.PAGE] || '1');
  const networkDetail = await networksApi.getById(id);

  const processedStations = () => {
    if (!networkDetail?.stations) return { paginated: [], totalPages: 0 };
    const sorted = sortStations(networkDetail.stations, sortKey, sortDirection);
    const paginated = paginateItems(sorted, currentPage, 15);
    const totalPages = calculateTotalPages(sorted.length, 15);
    return { paginated, totalPages };
  };

  return (
    <Suspense fallback={<LoadingScreen />}>
      <PageMapLayout>
        <NetworkDetailView
          totalPages={processedStations().totalPages}
          currentPage={currentPage}
          stations={processedStations().paginated}
          networkDetail={networkDetail}
          stationId={stationId}
        />
        <NetworkDetailMap networkDetail={networkDetail} />
      </PageMapLayout>
    </Suspense>
  );
}
