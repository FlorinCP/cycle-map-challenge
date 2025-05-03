'use client';

import React from 'react';
import type { NetworkSummary } from '@/types/city-bikes';
import { NetworkItem } from './network-list-item';
import { NetworkItemSkeleton } from '@/components/networks/list/newtork-list/newtork-list-item-skeleton';

interface NetworkListProps {
  networksToDisplay: NetworkSummary[];
  isLoading?: boolean;
}

export default function NetworkItemsList({
  networksToDisplay,
  isLoading = false,
}: NetworkListProps) {
  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 10 }).map((_, i) => (
          <NetworkItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div>
      {networksToDisplay.length > 0 ? (
        networksToDisplay.map(network => (
          <NetworkItem
            key={network.id}
            name={network.name}
            location={network.location}
            company={network.company}
            id={network.id}
          />
        ))
      ) : (
        <p className="text-center text-gray-500 mt-8">
          No networks match the current filters or page.
        </p>
      )}
    </div>
  );
}
NetworkItemsList.displayName = 'PaginatedNetworkList';
