import { useQuery } from '@tanstack/react-query';
import type { NetworkSummary, NetworksListResponse } from '@/types/city-bikes';
import { networkQueryKeys } from '@/lib/api/query-keys';

const BASE_URL = 'https://api.citybik.es/v2';

/**
 * Async function specifically for fetching all networks.
 * This keeps the actual fetch logic separate from the hook itself.
 */
const fetchAllNetworks = async (): Promise<NetworkSummary[]> => {
  const response = await fetch(`${BASE_URL}/networks`); // Using default Next.js fetch cache behavior here

  if (!response.ok) {
    const errorBody = await response
      .text()
      .catch(() => 'Could not read error body');
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
  return data.networks || [];
};

/**
 * TanStack Query hook to fetch and manage the state for the list of all bicycle networks.
 */
export function useNetworksQuery() {
  return useQuery<NetworkSummary[], Error>({
    queryKey: networkQueryKeys.all,
    queryFn: fetchAllNetworks,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
  });
}
