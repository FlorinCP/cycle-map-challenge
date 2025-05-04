import { useMemo } from 'react';
import type { Station } from '@/types/city-bikes';

export const useStationGeojsonData = (stations: Station[] | undefined) => {
  return useMemo(() => {
    const features = stations?.map((station: Station) => ({
      type: 'Feature',
      id: station.id,
      geometry: {
        type: 'Point',
        coordinates: [station.longitude, station.latitude],
      },
      properties: {
        id: station.id,
        name: station.name,
        free_bikes: station.free_bikes,
        empty_slots: station.empty_slots,
      },
    }));

    return {
      type: 'FeatureCollection',
      features: features || [],
    };
  }, [stations]);
};