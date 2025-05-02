import { useQuery } from '@tanstack/react-query';
import type { NetworksListResponse, NetworkSummary } from '@/types/city-bikes';
import { networkQueryKeys } from '@/lib/api/query-keys';

const BASE_URL = 'https://api.citybik.es/v2';

const fetchAllNetworks = async (
  fields?: (keyof NetworkSummary)[]
): Promise<NetworkSummary[]> => {
  const queryParams = fields?.length ? `?fields=${fields.join(',')}` : '';

  const response = await fetch(`${BASE_URL}/networks${queryParams}`);

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
  return data.networks || [];
};

export function useNetworksQuery() {
  const fields: (keyof NetworkSummary)[] = [
    'id',
    'name',
    'company',
    'location',
  ];

  const { data, isLoading, isError, error } = useQuery<NetworkSummary[], Error>(
    {
      queryKey: [...networkQueryKeys.all, { fields }],
      queryFn: () => fetchAllNetworks(fields),
      staleTime: 1000 * 60 * 15,
      gcTime: 1000 * 60 * 30,
    }
  );

  return {
    data,
    isLoading,
    isError,
    error,
  };
}
