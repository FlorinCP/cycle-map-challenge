export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  ENDPOINTS: {
    NETWORKS: '/networks',
    NETWORK_DETAIL: (id: string) => `/networks/${id}`,
  },
  QUERY_CONFIG: {
    STALE_TIME: 1000 * 60 * 15,
    GC_TIME: 1000 * 60 * 30,
  },
} as const;
