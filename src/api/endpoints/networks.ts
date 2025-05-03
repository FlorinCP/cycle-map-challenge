import { apiClient } from '@/api';
import { API_CONFIG } from '@/api';
import type {
  NetworkDetail,
  NetworkDetailResponse,
  NetworksListResponse,
  NetworkSummary,
} from '@/types/city-bikes';

export const networksApi = {
  getAll: async (
    fields?: (keyof NetworkSummary)[],
    signal?: AbortSignal
  ): Promise<NetworkSummary[]> => {
    const queryParams = fields?.length
      ? `?fields=${encodeURIComponent(fields.join(','))}`
      : '';

    const data = await apiClient.get<NetworksListResponse>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NETWORKS}${queryParams}`,
      { signal }
    );

    return data.networks || [];
  },

  getById: async (id: string, signal?: AbortSignal): Promise<NetworkDetail> => {
    const data = await apiClient.get<NetworkDetailResponse>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NETWORK_DETAIL(id)}`,
      { signal }
    );

    return data.network;
  },
};
