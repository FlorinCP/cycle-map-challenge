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
  return R * c;
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
  let baseFilteredNetworks = filterNetworks(networks, countryCode, searchTerm);

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
    searchRadius: -1,
  };
}
