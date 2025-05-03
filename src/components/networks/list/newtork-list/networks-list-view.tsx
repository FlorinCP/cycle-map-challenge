import React from 'react';
import logo from '../../../../../public/cycle-map-logo.svg';
import CountryFilter from '../country-filter';
import NetworkSearchInput from '../network-search-input';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import PaginatedNetworkList from '@/components/networks/list/newtork-list/paginated-network-list';

export default function NetworksListView() {
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
      <PaginatedNetworkList />
      <div className="bottom-0 absolute w-full h-[120px] bg-gradient-to-b from-white/0 to-white pointer-events-none" />
    </div>
  );
}
NetworksListView.displayName = 'NetworksListView';
