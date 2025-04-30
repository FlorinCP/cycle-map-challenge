'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { useNetworksQuery } from '@/hooks/queries/use-network-query';

import CountryFilter from './country-filter';
import NetworkSearchInput from './network-search-input';
import { PaginationNav } from '@/components/networks/list/pagination-nav';
import {
  calculateTotalPages,
  filterNetworks,
  paginateItems,
} from '@/lib/api/utils';
import NetworkList from '@/components/networks/list/network-list';

const ITEMS_PER_PAGE = 15;

export default function NetworksListView() {
  const searchParams = useSearchParams();

  const countryCode = searchParams.get('country');
  const searchTerm = searchParams.get('search');
  const currentPage = useMemo(() => {
    const pageParam = searchParams.get('page');
    const pageNum = parseInt(pageParam || '1', 10);
    return isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
  }, [searchParams]);

  const { data: allNetworks } = useNetworksQuery();

  const filteredNetworks = useMemo(() => {
    if (!allNetworks) return [];
    return filterNetworks(allNetworks, countryCode, searchTerm);
  }, [allNetworks, countryCode, searchTerm]);

  const paginatedNetworks = useMemo(() => {
    return paginateItems(filteredNetworks, currentPage, ITEMS_PER_PAGE);
  }, [filteredNetworks, currentPage]);

  const totalPages = useMemo(() => {
    return calculateTotalPages(filteredNetworks.length, ITEMS_PER_PAGE);
  }, [filteredNetworks.length]);

  return (
    <div className="flex flex-col w-full max-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3 md:space-y-0 md:flex md:items-center md:space-x-4 shrink-0">
        <NetworkSearchInput />
        <CountryFilter />
      </div>
      <div className="flex-grow relative overflow-y-auto">
        <NetworkList networksToDisplay={paginatedNetworks} />
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
        <PaginationNav
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={ITEMS_PER_PAGE}
        />
      </div>
    </div>
  );
}
NetworksListView.displayName = 'NetworksListView';
