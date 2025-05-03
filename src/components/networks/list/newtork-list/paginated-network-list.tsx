'use client';

import NetworkItemsList from '@/components/networks/list/newtork-list/network-items-list';
import { PaginationNav } from '@/components/ui/pagination-nav';
import React from 'react';
import { usePaginatedNetworksList } from '@/hooks/use-paginated-networks';
import { NETWORK_ITEMS_PER_PAGE } from '@/types/search-params';

const PaginatedNetworkList = () => {
  const { networks, totalPages, isLoading } = usePaginatedNetworksList();

  return (
    <div className="flex-grow gap-6 flex flex-col relative">
      <NetworkItemsList networksToDisplay={networks} isLoading={isLoading} />
      <PaginationNav
        totalPages={totalPages}
        pageSize={NETWORK_ITEMS_PER_PAGE}
      />
    </div>
  );
};

export default PaginatedNetworkList;
