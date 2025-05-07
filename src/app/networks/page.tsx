import NetworksListView from '@/components/networks/list/newtork-list/networks-list-view';
import React, { Suspense } from 'react';
import NetworkListMap from '@/components/map/network-list-map';
import { LoadingScreen, Spinner } from '@/components/ui/spinner';
import { PageMapLayout } from '@/components/layouts/page-map-layout';
import { SEARCH_PARAMS } from '@/types/search-params';
import { NetworkSummary } from '@/types/city-bikes';
import { networksApi } from '@/api';
import { findNetworksProgressively } from '@/lib/location-utils';

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
  const userLat = searchParams?.[SEARCH_PARAMS.LAT] as string;
  const userLng = searchParams?.[SEARCH_PARAMS.LNG] as string;

  let allNetworks: NetworkSummary[] = [];
  try {
    allNetworks = await networksApi.getAll();
  } catch (error) {
    console.error('Failed to fetch networks:', error);
  }

  const result = findNetworksProgressively(
    allNetworks,
    parseFloat(userLat),
    parseFloat(userLng),
    countryCode,
    searchTerm,
    [10, 50, 100, 200]
  );

  return (
    <Suspense fallback={<LoadingScreen />}>
      <PageMapLayout>
        <NetworksListView networks={result.networks} page={page} />
        <Suspense
          fallback={
            <div className={'flex items-center justify-center h-full w-full'}>
              <Spinner className={'w-6 h-6'} />
            </div>
          }
        >
          <NetworkListMap result={result} searchParams={searchParams} />
        </Suspense>
      </PageMapLayout>
    </Suspense>
  );
}
