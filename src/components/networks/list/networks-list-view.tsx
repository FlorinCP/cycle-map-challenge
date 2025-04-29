'use client';
import NetworkList from './network-list';
import CountryFilter from '@/components/networks/list/country-filter';
import NetworkSearchInput from '@/components/networks/list/network-search-input';

export default function NetworksListView() {
  return (
    <div className="flex flex-col w-full h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3 md:space-y-0 md:flex md:items-center md:space-x-4 shrink-0">
        <NetworkSearchInput />
        <CountryFilter />
      </div>
      <div className="flex-grow relative overflow-hidden">
        <NetworkList />
      </div>
    </div>
  );
}
