import { useQuery } from '@tanstack/react-query';
import { networkQueryKeys } from '@/api';
import { networksApi } from '@/api';
import { API_CONFIG } from '@/api';
import type { NetworkSummary } from '@/types/city-bikes';

interface UseNetworksQueryOptions {
  fields?: (keyof NetworkSummary)[];
  enabled?: boolean;
}

export function useListNetworksQuery(options: UseNetworksQueryOptions = {}) {
  const fields = options.fields ?? ['id', 'name', 'company', 'location'];

  return useQuery({
    queryKey: [...networkQueryKeys.all, { fields }],
    queryFn: ({ signal }) => networksApi.getAll(fields, signal),
    staleTime: API_CONFIG.QUERY_CONFIG.STALE_TIME,
    gcTime: API_CONFIG.QUERY_CONFIG.GC_TIME,
    enabled: options.enabled ?? true,
  });
}
