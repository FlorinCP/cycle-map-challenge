'use client';

import { ArrowUp, ArrowDown, ArrowDownUp } from 'lucide-react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { SortDirection, StationSortKey } from '@/types/search-params';

interface SortControlsProps {
  // Optional prop to specify custom search param names
  sortKeyParam?: string;
  sortDirectionParam?: string;
}

const SORT_OPTIONS: { label: string; key: StationSortKey }[] = [
  { label: 'Free Bikes', key: 'free_bikes' },
  { label: 'Empty Slots', key: 'empty_slots' },
];

export default function SortControls({
  sortKeyParam = 'sortBy',
  sortDirectionParam = 'sortDir',
}: SortControlsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const sortKey = searchParams.get(sortKeyParam) as StationSortKey | null;
  const sortDirection =
    (searchParams.get(sortDirectionParam) as SortDirection | null) || 'desc';

  const handleSort = (key: StationSortKey) => {
    const params = new URLSearchParams(searchParams);

    let newDirection: SortDirection = 'desc';
    if (sortKey === key && sortDirection === 'desc') {
      newDirection = 'asc';
    }

    params.set(sortKeyParam, key);
    params.set(sortDirectionParam, newDirection);

    if (params.has('page')) {
      params.set('page', '1');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const renderSortIcon = (key: StationSortKey) => {
    if (sortKey !== key) {
      return <ArrowDownUp className="h-4 w-4" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  return (
    <div className="flex items-center text-white">
      {SORT_OPTIONS.map(option => (
        <div
          className="flex gap-2 items-center cursor-pointer w-32"
          key={option.key}
          onClick={() => handleSort(option.key)}
        >
          <p className="text-white text-center font-sans text-sm font-medium leading-5 tracking-wider uppercase">
            {option.label}
          </p>
          {renderSortIcon(option.key)}
        </div>
      ))}
    </div>
  );
}

SortControls.displayName = 'SortControls';
