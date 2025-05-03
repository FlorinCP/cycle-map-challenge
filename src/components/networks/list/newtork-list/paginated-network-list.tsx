'use client';

import NetworkItemsList from '@/components/networks/list/newtork-list/network-items-list';
import { PaginationNav } from '@/components/networks/list/pagination-nav';
import React from 'react';
import { usePaginatedNetworksList } from '@/hooks/use-paginated-networks';

const PaginatedNetworkList = () => {
  const ITEMS_PER_PAGE = 10;

  const { networks, currentPage, totalPages, isLoading } =
    usePaginatedNetworksList();

  return (
    <div className="flex-grow gap-6 flex flex-col relative">
      <NetworkItemsList networksToDisplay={networks} isLoading={isLoading} />
      <PaginationNav
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={ITEMS_PER_PAGE}
      />
    </div>
  );
};

export default PaginatedNetworkList;
