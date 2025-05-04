import { useMemo } from 'react';
import { LngLatBounds } from 'maplibre-gl';
import { NetworkSummary } from '@/types/city-bikes';

export function useMapBounds(
  filteredNetworks: NetworkSummary[],
  userLat?: string | null,
  userLng?: string | null
) {
  return useMemo(() => {
    if (filteredNetworks.length === 0) return null;

    const bounds = new LngLatBounds();

    if (userLat && userLng) {
      bounds.extend([parseFloat(userLng), parseFloat(userLat)]);
    }

    filteredNetworks.forEach(network => {
      bounds.extend([network.location.longitude, network.location.latitude]);
    });

    return bounds.isEmpty() ? null : bounds;
  }, [filteredNetworks, userLat, userLng]);
}
