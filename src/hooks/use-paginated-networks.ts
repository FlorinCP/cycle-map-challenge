import {
  calculateTotalPages,
  filterNetworks,
  paginateItems,
  useListNetworksQuery,
} from '@/api';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

const ITEMS_PER_PAGE = 15;

export function usePaginatedNetworksList() {
  const searchParams = useSearchParams();

  const countryCode = searchParams.get('country');
  const searchTerm = searchParams.get('search');
  const currentPage = useMemo(() => {
    const pageParam = searchParams.get('page');
    const pageNum = parseInt(pageParam || '1', 10);
    return isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
  }, [searchParams]);

  const { data: allNetworks, isLoading } = useListNetworksQuery();

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

  return {
    networks: paginatedNetworks,
    totalPages,
    currentPage,
    isLoading,
    countryCode,
    searchTerm,
  };
}
