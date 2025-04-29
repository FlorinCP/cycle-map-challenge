// src/components/networks/detail/NetworkDetailDisplay.tsx
'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// --- Types ---
import type {
  Station, // Import Station type
  StationSortKey,
  SortDirection,
} from '@/types/city-bikes';

// --- Utils ---
import {
  calculateTotalPages,
  paginateItems,
  sortStations,
} from '@/lib/api/utils';
import { useNetworkDetailQuery } from '@/hooks/queries/use-network-query-detail';
import StationListItem from '@/components/networks/detail/station-list-items';
import PaginationControls from '@/components/networks/detail/pagination-controls';
import SortControls from '@/components/networks/detail/sort-controls'; // Updated path

const STATIONS_PER_PAGE = 20;

// --- Props ---
interface NetworkDetailDisplayProps {
  networkId: string;
}

// --- Component ---
export default function NetworkDetailDisplay({
  networkId,
}: NetworkDetailDisplayProps) {
  // --- State ---
  const [sortConfig, setSortConfig] = useState<{
    key: StationSortKey | null;
    direction: SortDirection;
  }>({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1); // For station pagination

  // --- Data Fetching ---
  const {
    data: networkDetail,
    isLoading,
    isError,
    error,
    isFetching,
  } = useNetworkDetailQuery(networkId);

  // --- Reset page to 1 if sort order changes ---
  // Important to prevent being on a non-existent page after sorting
  const handleSortChange = (newConfig: {
    key: StationSortKey | null;
    direction: SortDirection;
  }) => {
    setSortConfig(newConfig);
    setCurrentPage(1); // Reset page when sort changes
  };

  // --- Data Processing ---
  const processedStations = useMemo(() => {
    // Return default structure if no station data
    if (!networkDetail?.stations) return { paginated: [], totalPages: 0 };

    // 1. Sort
    const sorted = sortStations(
      networkDetail.stations,
      sortConfig.key,
      sortConfig.direction
    );

    // 2. Paginate
    const paginated = paginateItems(sorted, currentPage, STATIONS_PER_PAGE);
    const totalPages = calculateTotalPages(sorted.length, STATIONS_PER_PAGE);

    return { paginated, totalPages };
  }, [networkDetail?.stations, sortConfig, currentPage]); // Dependencies

  // --- Render States ---
  if (isLoading) {
    // ... loading state ...
    return (
      <div className="flex justify-center items-center h-full p-4 text-gray-500">
        Loading network details...
      </div>
    );
  }
  if (isError) {
    // ... error state ...
    return (
      <div className="p-6 text-center text-red-600">
        <h2 className="text-xl font-semibold mb-2">Error Loading Network</h2>
        <p>{error?.message || 'Could not load network details.'}</p>
        <Link
          href="/networks"
          className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Networks
        </Link>
      </div>
    );
  }
  if (!networkDetail) {
    // ... no data state ...
    return (
      <div className="p-4 text-center">Network details not available.</div>
    );
  }

  // --- Helper ---
  const getCompanyDisplay = (
    company: string | string[] | undefined | null
  ): string => {
    if (!company) return 'N/A';
    const companies = Array.isArray(company) ? company : [company];
    return companies.filter(Boolean).join(', ') || 'N/A';
  };

  // --- Main Render ---
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
        {isFetching /* ... updating indicator ... */ && (
          <span className="text-blue-500 float-right text-xs">
            (Updating...)
          </span>
        )}
        <Link /* ... Back link ... */
          href="/networks"
          className="inline-flex items-center text-sm text-blue-600 hover:underline mb-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Networks
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {networkDetail.name}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {networkDetail.location.city},{' '}
          {networkDetail.location.country.toUpperCase()}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Operator(s): {getCompanyDisplay(networkDetail.company)}
        </p>
      </div>

      {/* Station Controls (Sorting) */}
      {networkDetail.stations.length > 0 && (
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
          {/* Use the actual SortControls component */}
          <SortControls
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
          />
        </div>
      )}

      {/* Stations List */}
      <div className="flex-grow overflow-y-auto p-4 space-y-2">
        <h2 className="text-lg font-semibold mb-2 sticky top-0 bg-white dark:bg-gray-900 py-1">
          Stations ({networkDetail.stations.length})
        </h2>
        {processedStations.paginated.length > 0 ? (
          processedStations.paginated.map(
            (
              station: Station // Ensure type here
            ) => (
              // Use the actual StationListItem component
              <StationListItem key={station.id} station={station} />
            )
          )
        ) : networkDetail.stations.length > 0 ? (
          <p className="text-center text-gray-500 mt-4">
            No stations on this page ({currentPage}).
          </p>
        ) : (
          <p className="text-center text-gray-500 mt-4">
            No station data available for this network.
          </p>
        )}
      </div>

      {/* Station Pagination Footer */}
      {processedStations.totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
          {/* Use the actual PaginationControls component */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={processedStations.totalPages}
            onPageChange={setCurrentPage} // Pass the state setter directly
          />
        </div>
      )}
    </div>
  );
}
