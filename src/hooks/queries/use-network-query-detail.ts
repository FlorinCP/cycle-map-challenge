import { useQuery } from '@tanstack/react-query';
import type { NetworkDetail, NetworkDetailResponse } from '@/types/city-bikes';
import { networkQueryKeys } from '@/lib/api/query-keys';

const BASE_URL = 'https://api.citybik.es/v2';

/**
 * Async function specifically for fetching network details by ID.
 */
const fetchNetworkById = async (id: string): Promise<NetworkDetail> => {
  console.log(`Fetching network detail for ID: ${id} via TanStack Query...`);
  const response = await fetch(`${BASE_URL}/networks/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      console.warn(`Network with ID "${id}" not found (404).`);
      throw new Error(`Network with ID "${id}" not found.`);
    }
    const errorBody = await response
      .text()
      .catch(() => 'Could not read error body');
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
};

/**
 * TanStack Query hook to fetch and manage state for a specific network's details.
 * @param id - The ID of the network to fetch. The query is disabled if the ID is falsy.
 */
export function useNetworkDetailQuery(id: string | null | undefined) {
  const queryKey = id ? networkQueryKeys.detail(id) : [];

  return useQuery<NetworkDetail, Error>({
    queryKey: queryKey,
    queryFn: ({ queryKey }) => {
      const networkId = queryKey[2] as string;
      if (!networkId) {
        return Promise.reject(
          new Error('Query function called without a valid Network ID.')
        );
      }
      return fetchNetworkById(networkId);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
  });
}
