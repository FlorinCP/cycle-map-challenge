import { useQueryClient } from '@tanstack/react-query';
import { networkQueryKeys } from '@/api';
import { networksApi } from '@/api';

export function usePrefetchNetworkDetail() {
  const queryClient = useQueryClient();

  return (id: string) => {
    return queryClient.prefetchQuery({
      queryKey: networkQueryKeys.detail(id),
      queryFn: ({ signal }) => networksApi.getById(id, signal),
      staleTime: 1000 * 60 * 15,
    });
  };
}
