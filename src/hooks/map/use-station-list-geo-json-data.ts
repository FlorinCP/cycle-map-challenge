import { useMemo } from 'react';
import type { Station } from '@/types/city-bikes';
import type { FeatureCollection, Point } from 'geojson';

export const useStationGeoJsonData = (
  stations: Station[] | undefined
): FeatureCollection<Point> => {
  return useMemo(() => {
    const features = stations?.map((station: Station) => ({
      type: 'Feature' as const,
      id: station.id,
      geometry: {
        type: 'Point' as const,
        coordinates: [station.longitude, station.latitude] as [number, number],
      },
      properties: {
        id: station.id,
        name: station.name,
        free_bikes: station.free_bikes,
        empty_slots: station.empty_slots,
      },
    }));

    return {
      type: 'FeatureCollection' as const,
      features: features || [],
    };
  }, [stations]);
};
