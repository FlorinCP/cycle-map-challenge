'use client';

import React from 'react';
import type { NetworkSummary } from '@/types/city-bikes';
import { NetworkItem } from './network-list-item';

interface NetworkListProps {
  networksToDisplay: NetworkSummary[];
}

export default function NetworkList({ networksToDisplay }: NetworkListProps) {
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
NetworkList.displayName = 'NetworkList';
