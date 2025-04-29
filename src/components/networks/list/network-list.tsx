// src/components/networks/NetworkList.tsx
'use client'; // This component needs client-side hooks and logic

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation'; // Hook to read URL search params

// Import the TanStack Query hook for fetching networks

// Import utility functions for filtering and pagination
import {
  filterNetworks,
  paginateItems,
  calculateTotalPages,
} from '@/lib/api/utils'; // Ensure this path is correct

// Import the component to render individual list items
import { useNetworksQuery } from '@/hooks/queries/use-network-query';
import NetworkListItem from '@/components/networks/list/network-list-item';

const ITEMS_PER_PAGE = 15; // How many networks to show per page

export default function NetworkList() {
  const searchParams = useSearchParams();

  const countryCode = searchParams.get('country'); // e.g., 'FR' or null
  const searchTerm = searchParams.get('search'); // e.g., 'velo' or null
  const currentPage = useMemo(() => {
    const pageParam = searchParams.get('page');
    const pageNum = parseInt(pageParam || '1', 10);
    return isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
  }, [searchParams]);

  const {
    data: allNetworks, // Contains the full list of NetworkSummary[] or undefined
    isLoading, // boolean: true while fetching for the first time
    isError, // boolean: true if the query encountered an error
    error, // Error object if isError is true
    isFetching, // boolean: true if fetching, including background refetches
  } = useNetworksQuery();

  // --- Filter data based on URL params ---
  // useMemo ensures filtering only re-runs if dependencies change
  const filteredNetworks = useMemo(() => {
    // Only filter if data is available
    if (!allNetworks) return [];
    console.log(
      `Filtering ${allNetworks.length} networks. Country: ${countryCode}, Search: ${searchTerm}`
    );
    // Apply filtering using the utility function
    return filterNetworks(allNetworks, countryCode, searchTerm);
  }, [allNetworks, countryCode, searchTerm]); // Dependencies for filtering

  // --- Paginate the filtered data ---
  // useMemo ensures pagination only re-runs if dependencies change
  const paginatedNetworks = useMemo(() => {
    console.log(
      `Paginating ${filteredNetworks.length} items for page ${currentPage}`
    );
    // Apply pagination using the utility function
    return paginateItems(filteredNetworks, currentPage, ITEMS_PER_PAGE);
  }, [filteredNetworks, currentPage]); // Dependencies for pagination

  // --- Calculate total pages for pagination controls ---
  const totalPages = useMemo(() => {
    // Calculate based on the *filtered* count
    return calculateTotalPages(filteredNetworks.length, ITEMS_PER_PAGE);
  }, [filteredNetworks.length]); // Dependency for total pages calculation

  // --- Render component UI ---

  // 1. Handle Initial Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-4 text-gray-500">
        Loading networks... {/* Add a spinner component here if desired */}
      </div>
    );
  }

  // 2. Handle Error State
  if (isError) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Error loading networks.</p>
        {/* Optionally display error message */}
        {error?.message && <p className="text-sm mt-1">({error.message})</p>}
      </div>
    );
  }

  // 3. Handle case where data might still be undefined (should be rare if not loading/error)
  if (!allNetworks) {
    return <div className="p-4 text-center">Network data not available.</div>;
  }

  // 4. Render the List and Pagination
  return (
    <div className="flex flex-col h-full">
      {/* Status/Info Header (Optional) */}
      <div className="p-4 border-b text-sm text-gray-600 shrink-0">
        {/* Show fetching indicator for background refetches */}
        {isFetching && !isLoading && (
          <span className="text-blue-500 float-right text-xs">
            {' '}
            (Updating...)
          </span>
        )}
        Showing{' '}
        {paginatedNetworks.length > 0
          ? filteredNetworks.length > ITEMS_PER_PAGE
            ? `${(currentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(currentPage * ITEMS_PER_PAGE, filteredNetworks.length)}`
            : filteredNetworks.length
          : 0}{' '}
        of {filteredNetworks.length} networks.
        {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
      </div>

      {/* Scrollable List Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {filteredNetworks.length > 0 ? (
          paginatedNetworks.map(network => (
            <NetworkListItem key={network.id} network={network} />
          ))
        ) : (
          <p className="text-center text-gray-500 mt-8">
            No networks match the current filters.
          </p>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t shrink-0">
          {/* Render your actual PaginationControls component here */}
          {/* <PaginationControls currentPage={currentPage} totalPages={totalPages} /> */}
          <p className="text-center text-sm text-gray-500">
            {/* Placeholder until PaginationControls is implemented */}
            Pagination (Page {currentPage}/{totalPages})
          </p>
        </div>
      )}
    </div>
  );
}
