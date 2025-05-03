import { useQuery } from '@tanstack/react-query';
import { networksApi } from '@/api';
import { networkQueryKeys } from '@/api/query-keys';
import { API_CONFIG } from '@/api';

export function useGetNetworkDetailQuery(id: string) {
  return useQuery({
    queryKey: networkQueryKeys.detail(id),
    queryFn: ({ signal }) => networksApi.getById(id, signal),
    staleTime: API_CONFIG.QUERY_CONFIG.STALE_TIME,
    gcTime: API_CONFIG.QUERY_CONFIG.GC_TIME,
    enabled: !!id,
  });
}
