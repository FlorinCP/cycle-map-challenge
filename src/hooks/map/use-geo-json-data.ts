import { useMemo } from 'react';
import { NetworkSummary } from '@/types/city-bikes';

export function useGeojsonData(filteredNetworks: NetworkSummary[]) {
  return useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features: filteredNetworks.map(network => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [network.location.longitude, network.location.latitude],
        },
        properties: {
          id: network.id,
          name: network.name,
          city: network.location.city,
          country: network.location.country,
        },
      })),
    };
  }, [filteredNetworks]);
}
