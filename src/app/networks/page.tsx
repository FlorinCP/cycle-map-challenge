import NetworksListView from '@/components/networks/list/newtork-list/networks-list-view';
import { Suspense } from 'react';
import NetworkListMap from '@/components/map/network-list-map';
import { LoadingScreen } from '@/components/ui/spinner';
import { PageMapLayout } from '@/components/layouts/page-map-layout';
import { NETWORK_ITEMS_PER_PAGE, SEARCH_PARAMS } from '@/types/search-params';
import { NetworkSummary } from '@/types/city-bikes';
import {
  calculateTotalPages,
  filterNetworks,
  networksApi,
  paginateItems,
} from '@/api';

export default async function NetworksPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const countryCode = searchParams?.[SEARCH_PARAMS.COUNTRY] as
    | string
    | undefined;
  const searchTerm = searchParams?.[SEARCH_PARAMS.SEARCH] as string | undefined;
  const page = searchParams?.[SEARCH_PARAMS.PAGE]
    ? Number(searchParams[SEARCH_PARAMS.PAGE])
    : 1;

  const userLat = searchParams?.['lat'] as string | undefined;
  const userLng = searchParams?.['lng'] as string | undefined;
  const searchRadiusParam = searchParams?.['radius'] as string | undefined;
  const searchRadius = searchRadiusParam
    ? Number(searchRadiusParam)
    : undefined;

  let allNetworks: NetworkSummary[] = [];
  let fetchError = null;
  try {
    allNetworks = await networksApi.getAll();
  } catch (error) {
    console.error('Failed to fetch networks:', error);
    fetchError = 'Could not load network data.';
  }

  const filteredNetworks = filterNetworks(allNetworks, countryCode, searchTerm);

  const paginatedNetworks = paginateItems(
    filteredNetworks,
    page,
    NETWORK_ITEMS_PER_PAGE
  );

  const totalPages = calculateTotalPages(
    filteredNetworks.length,
    NETWORK_ITEMS_PER_PAGE
  );

  if (fetchError) {
    return (
      <PageMapLayout>
        <div className="p-10 text-red-500">Error: {fetchError}</div>
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          Map unavailable due to data error.
        </div>
      </PageMapLayout>
    );
  }

  // add suspense

  return (
    <Suspense fallback={<LoadingScreen />}>
      <PageMapLayout>
        <NetworksListView
          networksToDisplay={paginatedNetworks}
          totalPages={totalPages}
        />
        <NetworkListMap filteredNetworks={filteredNetworks}/>
      </PageMapLayout>
    </Suspense>
  );
}
