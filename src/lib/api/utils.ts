import type {
  NetworkSummary,
  Station,
  StationSortKey,
  SortDirection,
} from '@/types/city-bikes';

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
  // Return original array if no filters are applied
  if (!countryCode && !searchTerm?.trim()) {
    return networks;
  }

  let filteredData = [...networks]; // Work on a copy

  // 1. Filter by Country
  if (countryCode) {
    const upperCountryCode = countryCode.toUpperCase();
    filteredData = filteredData.filter(
      network => network.location.country.toUpperCase() === upperCountryCode
    );
  }

  // 2. Filter by Search Term
  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    if (lowerSearchTerm) {
      // Only filter if search term is not empty
      filteredData = filteredData.filter(network => {
        // Check network name
        const nameMatch = network.name.toLowerCase().includes(lowerSearchTerm);
        if (nameMatch) return true;

        // Check company (can be string or array)
        const companies = Array.isArray(network.company)
          ? network.company
          : network.company // Handle potential null/undefined company? API docs suggest string | string[]
            ? [network.company]
            : []; // Default to empty array if company is falsy
        const companyMatch = companies.some(
          company => company?.toLowerCase().includes(lowerSearchTerm) // Safe navigation
        );
        return companyMatch;
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
    return []; // Return empty for invalid input
  }
  // Ensure page is a valid positive number, default to 1
  const safePage = Math.max(1, isNaN(page) ? 1 : page);
  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Slice doesn't throw errors for out-of-bounds, returns what it can
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
  direction: SortDirection = 'asc' // Default direction
): Station[] {
  // If no sort key is provided, return the original array (or a copy)
  if (!sortBy) {
    return [...stations]; // Return a copy to maintain immutability principle
  }

  const sortedData = [...stations]; // Work on a copy

  sortedData.sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];

    // Handle potential non-numeric values if necessary, though these should be numbers
    const comparison = (valueA ?? 0) - (valueB ?? 0); // Default null/undefined to 0 for comparison

    return direction === 'asc' ? comparison : comparison * -1; // Apply direction
  });

  return sortedData;
}
