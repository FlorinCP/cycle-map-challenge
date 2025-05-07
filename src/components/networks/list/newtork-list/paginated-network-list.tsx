'use client';

import NetworkItemsList from '@/components/networks/list/newtork-list/network-items-list';
import { PaginationNav } from '@/components/ui/pagination-nav';
import React from 'react';
import { NETWORK_ITEMS_PER_PAGE } from '@/types/search-params';

interface NetworkListProps {
  networksToDisplay: any[];
  totalPages: number;
}

const PaginatedNetworkList: React.FC<NetworkListProps> = ({
  networksToDisplay,
  totalPages,
}) => {
  return (
    <div className="flex-grow gap-6 flex flex-col relative">
      <NetworkItemsList networksToDisplay={networksToDisplay} />
      <PaginationNav
        totalPages={totalPages}
        pageSize={NETWORK_ITEMS_PER_PAGE}
      />
    </div>
  );
};

export default PaginatedNetworkList;
