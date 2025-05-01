'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { useNetworksQuery } from '@/hooks/queries/use-network-query';
import logo from '../../../../public/cycle-map-logo.svg';
import CountryFilter from './country-filter';
import NetworkSearchInput from './network-search-input';
import { PaginationNav } from '@/components/networks/list/pagination-nav';
import {
  calculateTotalPages,
  filterNetworks,
  paginateItems,
} from '@/lib/api/utils';
import NetworkList from '@/components/networks/list/network-list';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 15;

export default function NetworksListView() {
  const searchParams = useSearchParams();

  const countryCode = searchParams.get('country');
  const searchTerm = searchParams.get('search');
  const currentPage = useMemo(() => {
    const pageParam = searchParams.get('page');
    const pageNum = parseInt(pageParam || '1', 10);
    return isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
  }, [searchParams]);

  const { data: allNetworks } = useNetworksQuery();

  const filteredNetworks = useMemo(() => {
    if (!allNetworks) return [];
    return filterNetworks(allNetworks, countryCode, searchTerm);
  }, [allNetworks, countryCode, searchTerm]);

  const paginatedNetworks = useMemo(() => {
    return paginateItems(filteredNetworks, currentPage, ITEMS_PER_PAGE);
  }, [filteredNetworks, currentPage]);

  const totalPages = useMemo(() => {
    return calculateTotalPages(filteredNetworks.length, ITEMS_PER_PAGE);
  }, [filteredNetworks.length]);

  return (
    <div className="p-10 pt-0 flex flex-col w-full max-h-screen overflow-y-auto bg-white">
      <Image src={logo} alt={'CycleMapLogo'} className={'pt-10'} />
      <div className="pt-6 inline-flex flex-col justify-start items-start gap-4">
        <div className="justify-start text-primary text-3xl font-semibold leading-10">
          Discover bike networks
        </div>
        <div className="w-full h-16 justify-start text-muted-foreground text-sm font-normal leading-tight">
          Lorem ipsum dolor sit amet consectetur. A volutpat adipiscing placerat
          turpis magna sem tempor amet faucibus. Arcu praesent viverra
          pellentesque nisi quam in rhoncus.
        </div>
      </div>
      <div
        className={cn(
          'py-4 flex shrink-0 gap-2 items-center ',
          'sticky top-0 z-10',
          'bg-transparent',
          "after:content-['']",
          'after:absolute after:inset-0',
          'after:z-[-1]',
          'after:bg-gradient-to-b after:from-white after:via-white/100 after:via-[85%] after:to-white/0'
        )}
      >
        <NetworkSearchInput />
        <CountryFilter />
      </div>
      <div className="flex-grow gap-6 flex flex-col relative">
        <NetworkList networksToDisplay={paginatedNetworks} />
        <PaginationNav
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={ITEMS_PER_PAGE}
        />
      </div>
      <div className="bottom-0 absolute w-full h-[120px] bg-gradient-to-b from-white/0 to-white pointer-events-none" />
    </div>
  );
}
NetworksListView.displayName = 'NetworksListView';
