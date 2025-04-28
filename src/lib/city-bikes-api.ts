import type {
  NetworksListResponse,
  NetworkSummary,
  NetworkDetailResponse,
  NetworkDetail,
  Station,
} from '@/types/city-bikes'; // Assuming your types are in src/types/citybikes.ts

// --- Constants ---

const BASE_URL = 'https://api.citybik.es/v2';

// --- Core Fetching Functions ---

/**
 * Fetches the list of all networks from the CityBikes API.
 * This fetches the *entire* list; filtering/pagination happen afterwards.
 *
 * @param options - Optional RequestInit options, primarily for Next.js caching/revalidation.
 * @returns A promise resolving to an array of NetworkSummary objects.
 * @throws Throws an error if the fetch fails or the API returns an error status.
 */
export async function fetchNetworks(
  options?: RequestInit
): Promise<NetworkSummary[]> {
  console.log('Fetching all networks...'); // Add logging for debugging
  try {
    // Use default cache ('force-cache') unless overridden by options
    const defaultOptions: RequestInit = { cache: 'force-cache', ...options };
    const response = await fetch(`${BASE_URL}/networks`, defaultOptions);

    if (!response.ok) {
      const errorBody = await response.text(); // Try to get more error details
      console.error(
        `API Error ${response.status}: ${response.statusText}`,
        errorBody
      );
      throw new Error(
        `Failed to fetch networks: ${response.status} ${response.statusText}`
      );
    }

    const data: NetworksListResponse = await response.json();
    console.log(`Fetched ${data.networks?.length ?? 0} networks successfully.`);
    return data.networks || []; // Return empty array if networks property is missing
  } catch (error) {
    console.error('Error in fetchNetworks:', error);
    // Re-throw to allow components to handle it (e.g., show error message)
    // Consider a more robust error handling strategy for production
    throw error;
  }
}

/**
 * Fetches the detailed information for a specific network by its ID.
 *
 * @param id - The unique ID of the network (e.g., "velib").
 * @param options - Optional RequestInit options, primarily for Next.js caching/revalidation.
 * @returns A promise resolving to a NetworkDetail object.
 * @throws Throws an error if the fetch fails, the network is not found (404), or the response format is unexpected.
 */
export async function fetchNetworkDetail(
  id: string,
  options?: RequestInit
): Promise<NetworkDetail> {
  if (!id) {
    throw new Error('Network ID is required to fetch details.');
  }
  console.log(`Fetching network detail for ID: ${id}...`);
  try {
    // Use default cache ('force-cache') unless overridden by options
    const defaultOptions: RequestInit = { cache: 'force-cache', ...options };
    const response = await fetch(`${BASE_URL}/networks/${id}`, defaultOptions);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Network with ID "${id}" not found (404).`);
        throw new Error(`Network with ID "${id}" not found.`);
      }
      const errorBody = await response.text();
      console.error(
        `API Error ${response.status}: ${response.statusText} for ID ${id}`,
        errorBody
      );
      throw new Error(
        `Failed to fetch network detail for ${id}: ${response.status} ${response.statusText}`
      );
    }

    const data: NetworkDetailResponse = await response.json();
    if (!data.network) {
      console.error(
        `API response for network ${id} did not contain a 'network' object.`,
        data
      );
      throw new Error(
        `Invalid response format for network ${id}: 'network' object missing.`
      );
    }
    console.log(
      `Fetched detail for network "${data.network.name}" successfully.`
    );
    return data.network;
  } catch (error) {
    console.error(`Error in fetchNetworkDetail for ${id}:`, error);
    throw error;
  }
}

// --- Data Manipulation Functions (Post-Fetch) ---
// These operate on the data *after* it's been fetched from the API

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
          : [network.company];
        const companyMatch = companies.some(
          company => company?.toLowerCase().includes(lowerSearchTerm) // Add nullish check for safety
        );
        return companyMatch;
      });
    }
  }

  return filteredData;
}

/**
 * Sort key options for sorting stations.
 */
export type StationSortKey = 'free_bikes' | 'empty_slots';
/**
 * Sort direction options.
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sorts an array of stations based on a specified key and direction.
 *
 * @param stations - The array of Station objects to sort.
 * @param sortBy - The key to sort by ('free_bikes' or 'empty_slots').
 * @param direction - The direction to sort ('asc' or 'desc').
 * @returns A new array containing the sorted stations.
 */
export function sortStations(
  stations: Station[],
  sortBy: StationSortKey,
  direction: SortDirection
): Station[] {
  const sortedData = [...stations]; // Work on a copy

  sortedData.sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];

    if (direction === 'asc') {
      return valueA - valueB; // Ascending numerical sort
    } else {
      return valueB - valueA; // Descending numerical sort
    }
  });

  return sortedData;
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
  const safePage = Math.max(1, page); // Ensure page is at least 1
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
 * @returns The total number of pages required.
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
