'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BriefcaseBusiness, MapPin } from 'lucide-react';

import type {
  Station,
  StationSortKey,
  SortDirection,
} from '@/types/city-bikes';

import {
  calculateTotalPages,
  paginateItems,
  sortStations,
} from '@/lib/api/utils';
import { useNetworkDetailQuery } from '@/hooks/queries/use-network-query-detail';
import StationListItem from '@/components/networks/detail/station-list-items';
import PaginationControls from '@/components/networks/detail/pagination-controls';
import SortControls from '@/components/networks/detail/sort-controls';

const STATIONS_PER_PAGE = 20;

interface NetworkDetailDisplayProps {
  networkId: string;
}

export default function NetworkDetailView({
  networkId,
}: NetworkDetailDisplayProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: StationSortKey | null;
    direction: SortDirection;
  }>({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const { data: networkDetail } = useNetworkDetailQuery(networkId);

  const handleSortChange = (newConfig: {
    key: StationSortKey | null;
    direction: SortDirection;
  }) => {
    setSortConfig(newConfig);
    setCurrentPage(1);
  };

  const processedStations = useMemo(() => {
    if (!networkDetail?.stations) return { paginated: [], totalPages: 0 };

    const sorted = sortStations(
      networkDetail.stations,
      sortConfig.key,
      sortConfig.direction
    );

    const paginated = paginateItems(sorted, currentPage, STATIONS_PER_PAGE);
    const totalPages = calculateTotalPages(sorted.length, STATIONS_PER_PAGE);

    return { paginated, totalPages };
  }, [networkDetail?.stations, sortConfig, currentPage]); // Dependencies

  const getCompanyDisplay = (
    company: string | string[] | undefined | null
  ): string => {
    if (!company) return 'N/A';
    const companies = Array.isArray(company) ? company : [company];
    return companies.filter(Boolean).join(', ') || 'N/A';
  };

  if (!networkDetail) {
    return null;
  }

  return (
    <div className="flex flex-col w-full max-h-screen overflow-y-auto">
      <div
        className="flex min-h-[252px] gap-10 p-8 md:p-10 items-start flex-col self-stretch bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #363698 100%), url('/network-details-hero.png')",
          backgroundColor: 'lightgray',
        }}
      >
        <Link
          href="/networks"
          className="text-grenadier-500 h-10 w-10 rounded-full bg-white grid place-content-center"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className={'flex gap-2 flex-col'}>
          <h1 className="text-3xl font-bold text-white">
            {networkDetail.name}
          </h1>
          <span>
            <div className={'flex gap-2 items-center'}>
              <MapPin className={'text-white h-4 w-4'} />
              <p className="text-base text-white">
                {networkDetail.location.city},{' '}
                {networkDetail.location.country.toUpperCase()}
              </p>
            </div>
            <div className={'flex gap-2 items-center'}>
              <BriefcaseBusiness className={'text-white h-4 w-4'} />
              <p className="text-base text-white">
                {getCompanyDisplay(networkDetail.company)}
              </p>
            </div>
          </span>
        </div>
      </div>

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
      <div className="flex-grow p-4 space-y-2">
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
