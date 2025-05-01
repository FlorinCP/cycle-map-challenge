import SortControls from '@/components/networks/detail/sort-controls';
import React from 'react';
import { SortDirection, StationSortKey } from '@/types/city-bikes';

interface StationListHeaderProps {
  sortConfig: { key: StationSortKey | null; direction: SortDirection };
  onSortChange: (sortConfig: {
    key: StationSortKey | null;
    direction: SortDirection;
  }) => void;
}

export default function StationListHeader({
  sortConfig,
  onSortChange,
}: StationListHeaderProps) {
  return (
    <div
      className={
        'w-full flex justify-between items-center border-b border-white p-1'
      }
    >
      <p
        className={
          'text-white text-center font-sans text-sm font-medium leading-5 tracking-wider uppercase'
        }
      >
        STATION NAME
      </p>
      <SortControls sortConfig={sortConfig} onSortChange={onSortChange} />
    </div>
  );
}
