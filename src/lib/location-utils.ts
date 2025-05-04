import { NetworkSummary } from '@/types/city-bikes';
import { filterNetworks } from '@/api';

/**
 * Calculates the distance between two points on Earth using the Haversine formula.
 *
 * @param lat1 - Latitude of the first point (in degrees)
 * @param lon1 - Longitude of the first point (in degrees)
 * @param lat2 - Latitude of the second point (in degrees)
 * @param lon2 - Longitude of the second point (in degrees)
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

/**
 * Converts degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Filters and sorts networks based on user's location.
 *
 * @param networks - The array of NetworkSummary objects to filter.
 * @param userLat - User's latitude
 * @param userLng - User's longitude
 * @param maxDistance - Maximum distance in kilometers (optional, default: 50km)
 * @returns A new array containing networks within the specified distance, sorted by distance
 */
export function filterNetworksByDistance(
  networks: NetworkSummary[],
  userLat: number,
  userLng: number,
  maxDistance: number = 50
): NetworkSummary[] {
  return networks
    .map(network => ({
      ...network,
      distance: calculateDistance(
        userLat,
        userLng,
        network.location.latitude,
        network.location.longitude
      ),
    }))
    .filter(network => network.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .map(({ distance, ...network }) => network);
}

/**
 * Progressive search result containing networks and the search radius used
 */
export interface ProgressiveSearchResult {
  networks: NetworkSummary[];
  searchRadius: number;
}

/**
 * Enhanced filter function that includes location-based filtering
 *
 * @param networks - The array of NetworkSummary objects to filter.
 * @param countryCode - The ISO 3166-1 alpha-3 country code
 * @param searchTerm - The term to search for in network names and company names
 * @param userLat - User's latitude for location-based filtering
 * @param userLng - User's longitude for location-based filtering
 * @param maxDistance - Maximum distance in kilometers for location filtering
 * @returns A new array containing only the filtered networks.
 */
export function filterNetworksEnhanced(
  networks: NetworkSummary[],
  countryCode?: string | null,
  searchTerm?: string | null,
  userLat?: number | null,
  userLng?: number | null,
  maxDistance: number = 50
): NetworkSummary[] {
  let filteredData = [...networks];

  // First apply existing filters
  filteredData = filterNetworks(filteredData, countryCode, searchTerm);

  // Then apply location-based filtering if coordinates are provided
  if (
    userLat !== null &&
    userLat !== undefined &&
    userLng !== null &&
    userLng !== undefined
  ) {
    filteredData = filterNetworksByDistance(
      filteredData,
      userLat,
      userLng,
      maxDistance
    );
  }

  return filteredData;
}

/**
 * Performs a progressive search for networks, expanding the search radius until networks are found
 *
 * @param networks - The array of NetworkSummary objects to search
 * @param userLat - User's latitude
 * @param userLng - User's longitude
 * @param countryCode - Optional country code filter
 * @param searchTerm - Optional search term filter
 * @param searchRadii - Array of search radii to try in kilometers (default: [10, 50, 100, 200])
 * @returns Object containing found networks and the search radius used
 */
export function findNetworksProgressively(
  networks: NetworkSummary[],
  userLat: number,
  userLng: number,
  countryCode?: string | null,
  searchTerm?: string | null,
  searchRadii: number[] = [10, 50, 100, 200]
): ProgressiveSearchResult {
  // First apply country and search filters
  let baseFilteredNetworks = filterNetworks(networks, countryCode, searchTerm);

  // If no location provided, return all filtered networks
  if (
    userLat === null ||
    userLat === undefined ||
    userLng === null ||
    userLng === undefined
  ) {
    return {
      networks: baseFilteredNetworks,
      searchRadius: 0,
    };
  }

  // Try each search radius until we find networks
  for (const radius of searchRadii) {
    const nearbyNetworks = filterNetworksByDistance(
      baseFilteredNetworks,
      userLat,
      userLng,
      radius
    );

    if (nearbyNetworks.length > 0) {
      return {
        networks: nearbyNetworks,
        searchRadius: radius,
      };
    }
  }

  // If no networks found within any radius, return all filtered networks
  // sorted by distance
  const allNetworksWithDistance = baseFilteredNetworks
    .map(network => ({
      ...network,
      distance: calculateDistance(
        userLat,
        userLng,
        network.location.latitude,
        network.location.longitude
      ),
    }))
    .sort((a, b) => a.distance - b.distance);

  return {
    networks: allNetworksWithDistance.map(
      ({ distance, ...network }) => network
    ),
    searchRadius: -1, // Indicates no radius restriction was applied
  };
}
