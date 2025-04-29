'use client';

import { Button } from '@/components/ui/button';
import type { StationSortKey, SortDirection } from '@/types/city-bikes';
import { ChevronsUpDown, ArrowUp, ArrowDown } from 'lucide-react';

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
    // If clicking the same key, toggle direction; otherwise, default to 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      newDirection = 'desc';
    }
    onSortChange({ key, direction: newDirection });
  };

  const renderSortIcon = (key: StationSortKey) => {
    if (sortConfig.key !== key) {
      return <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-blue-600" />
    );
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
        Sort by:
      </span>
      {SORT_OPTIONS.map(option => (
        <Button
          key={option.key}
          variant={sortConfig.key === option.key ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => handleSort(option.key)}
          className="text-xs h-7 px-2"
        >
          {option.label}
          {renderSortIcon(option.key)}
        </Button>
      ))}
      {/* Optional: Button to clear sort */}
      {sortConfig.key && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSortChange({ key: null, direction: 'asc' })}
          className="text-xs h-7 px-2"
          title="Clear sort"
        >
          Clear
        </Button>
      )}
    </div>
  );
}
SortControls.displayName = 'SortControls';
