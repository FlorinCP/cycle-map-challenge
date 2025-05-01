'use client';

import type { StationSortKey, SortDirection } from '@/types/city-bikes';
import { ArrowUp, ArrowDown, ArrowDownUp } from 'lucide-react';

interface SortControlsProps {
  sortConfig: { key: StationSortKey | null; direction: SortDirection };
  // Callback to update the sort state in the parent
  onSortChange: (newConfig: {
    key: StationSortKey | null;
    direction: SortDirection;
  }) => void;
}

const SORT_OPTIONS: { label: string; key: StationSortKey }[] = [
  { label: 'Free Bikes', key: 'free_bikes' },
  { label: 'Empty Slots', key: 'empty_slots' },
];

export default function SortControls({
  sortConfig,
  onSortChange,
}: SortControlsProps) {
  const handleSort = (key: StationSortKey) => {
    let newDirection: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      newDirection = 'desc';
    }
    onSortChange({ key, direction: newDirection });
  };

  const renderSortIcon = (key: StationSortKey) => {
    if (sortConfig.key !== key) {
      return <ArrowDownUp className="h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="h-4 w-4 " />
    ) : (
      <ArrowDown className="h-4 w-4 " />
    );
  };

  return (
    <div className="flex items-center text-white">
      {SORT_OPTIONS.map(option => (
        <div
          className={'flex gap-2 items-center cursor-pointer w-32'}
          key={option.key}
          onClick={() => handleSort(option.key)}
        >
          <p
            className={
              'text-white text-center font-sans text-sm font-medium leading-5 tracking-wider uppercase'
            }
          >
            {option.label}
          </p>
          {renderSortIcon(option.key)}
        </div>
      ))}
    </div>
  );
}
SortControls.displayName = 'SortControls';
