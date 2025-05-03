'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BriefcaseBusiness, MapPin } from 'lucide-react';
import StationListItem from '@/components/networks/detail/station-list-item';
import StationListHeader from '@/components/networks/detail/station-list-header';
import { cn } from '@/lib/utils';
import { Station } from '@/types/city-bikes';
import { usePaginatedNetworkDetal } from '@/hooks/use-paginated-network-detail';
import { PaginationNav } from '@/components/networks/list/pagination-nav';
import { STATION_ITEMS_PER_PAGE } from '@/types/search-params';

const getCompanyDisplay = (
  company: string | string[] | undefined | null
): string => {
  if (!company) return 'N/A';
  const companies = Array.isArray(company) ? company : [company];
  return companies.filter(Boolean).join(', ') || 'N/A';
};

interface NetworkDetailDisplayProps {
  networkId: string;
  selectedStationId: string | null;
}

export default function NetworkDetailView({
  networkId,
  selectedStationId,
}: NetworkDetailDisplayProps) {
  const { networkDetail, stations, currentPage, totalPages } =
    usePaginatedNetworkDetal(networkId);

  return (
    <div className="flex flex-col w-full max-h-screen min-h-screen overflow-y-auto bg-primary">
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
          className="text-grenadier-500 h-10 w-10 rounded-full bg-white grid place-content-center flex-shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className={'flex gap-2 flex-col'}>
          <h1 className="text-3xl font-bold text-white">
            {networkDetail?.name}
          </h1>
          <span>
            <div className={'flex gap-2 items-center'}>
              <MapPin className={'text-white h-4 w-4'} />
              <p className="text-base text-white">
                {networkDetail?.location.city},{' '}
                {networkDetail?.location.country.toUpperCase()}
              </p>
            </div>
            <div className={'flex gap-2 items-center'}>
              <BriefcaseBusiness className={'text-white h-4 w-4'} />
              <p className="text-base text-white">
                {getCompanyDisplay(networkDetail?.company)}
              </p>
            </div>
          </span>
        </div>
      </div>

      <div className={'px-10 py-2 flex flex-col gap-3'}>
        <h2 className="text-lg font-semibold text-white">
          All
          <span
            className={
              'text-grenadier-400 mx-2 border border-grenadier-400 rounded-md px-1.5 py-1 text-sm'
            }
          >
            {networkDetail?.stations.length}
          </span>
          stations
        </h2>

        <>
          <div
            className={cn(
              'sticky top-0 z-10 transition-all duration-300 ease-in-out',
              !!selectedStationId ? 'py-2' : 'py-0'
            )}
          >
            <StationListHeader />
          </div>

          <div className={'pb-6'}>
            {stations.length > 0 ? (
              stations.map((station: Station) => (
                <StationListItem
                  key={station.id}
                  station={station}
                  isHighlighted={station.id === selectedStationId}
                />
              ))
            ) : networkDetail && networkDetail?.stations.length > 0 ? (
              <p className="text-center text-gray-500 mt-4">
                No stations on this page ({currentPage}).
              </p>
            ) : (
              <p className="text-center text-gray-500 mt-4">
                No station data available for this network.
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <PaginationNav
              totalPages={totalPages}
              pageSize={STATION_ITEMS_PER_PAGE}
            />
          )}
        </>
      </div>
    </div>
  );
}
