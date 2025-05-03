import type { NetworkSummary, Station } from '@/types/city-bikes';
import { SortDirection, StationSortKey } from '@/types/search-params';

/**
 * Filters a list of networks based on country code and a search term.
 * The search term checks against network name and company names.
 *
 * @param networks - The array of NetworkSummary objects to filter.
 * @param countryCode - The ISO 3166-1 alpha-3 country code (e.g., "FRA", "USA"). Filters if provided.
 * @param searchTerm - The term to search for in network names and company names (case-insensitive). Filters if provided.
 * @returns A new array containing only the filtered networks.
 */
export function filterNetworks(
  networks: NetworkSummary[],
  countryCode?: string | null,
  searchTerm?: string | null
): NetworkSummary[] {
  if (!countryCode && !searchTerm?.trim()) {
    return networks;
  }

  let filteredData = [...networks];

  if (countryCode) {
    const upperCountryCode = countryCode.toUpperCase();
    filteredData = filteredData.filter(
      network => network.location.country.toUpperCase() === upperCountryCode
    );
  }

  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    if (lowerSearchTerm) {
      filteredData = filteredData.filter(network => {
        const nameMatch = network.name.toLowerCase().includes(lowerSearchTerm);
        if (nameMatch) return true;

        const companies = Array.isArray(network.company)
          ? network.company
          : network.company
            ? [network.company]
            : [];
        return companies.some(company =>
          company?.toLowerCase().includes(lowerSearchTerm)
        );
      });
    }
  }

  return filteredData;
}

/**
 * Paginates an array of items.
 *
 * @template T The type of items in the array.
 * @param items - The array of items to paginate.
 * @param page - The current page number (1-based). Defaults to 1 if invalid.
 * @param itemsPerPage - The number of items to display per page.
 * @returns A new array containing the items for the specified page. Returns an empty array if inputs are invalid.
 */
export function paginateItems<T>(
  items: T[],
  page: number,
  itemsPerPage: number
): T[] {
  if (!Array.isArray(items) || itemsPerPage <= 0) {
    return [];
  }
  const safePage = Math.max(1, isNaN(page) ? 1 : page);
  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return items.slice(startIndex, endIndex);
}

/**
 * Calculates the total number of pages needed for pagination.
 *
 * @param totalItems - The total number of items to paginate.
 * @param itemsPerPage - The number of items per page.
 * @returns The total number of pages required. Returns 0 for invalid input.
 */
export function calculateTotalPages(
  totalItems: number,
  itemsPerPage: number
): number {
  if (totalItems <= 0 || itemsPerPage <= 0) {
    return 0;
  }
  return Math.ceil(totalItems / itemsPerPage);
}

/**
 * Sorts an array of stations based on a specified key and direction.
 * (Moved here as it's also a client-side data manipulation utility)
 *
 * @param stations - The array of Station objects to sort.
 * @param sortBy - The key to sort by ('free_bikes' or 'empty_slots'). Can be null/undefined to skip sorting.
 * @param direction - The direction to sort ('asc' or 'desc'). Defaults to 'asc'.
 * @returns A new array containing the sorted stations. Returns original if sortBy is not provided.
 */
export function sortStations(
  stations: Station[],
  sortBy: StationSortKey | null | undefined,
  direction: SortDirection = 'asc'
): Station[] {
  if (!sortBy) {
    return [...stations];
  }

  const sortedData = [...stations];

  sortedData.sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];

    const comparison = (valueA ?? 0) - (valueB ?? 0);

    return direction === 'asc' ? comparison : comparison * -1;
  });

  return sortedData;
}
