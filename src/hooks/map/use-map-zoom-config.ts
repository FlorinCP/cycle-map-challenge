import { useMemo } from 'react';

export function useMapZoomConfig(searchRadius: number, networksCount: number) {
  return useMemo(() => {
    let maxZoom = 15;
    let padding = 50;

    if (searchRadius === -1) {
      maxZoom = 8;
      padding = 60;
    } else if (searchRadius >= 200) {
      maxZoom = 9;
      padding = 60;
    } else if (searchRadius >= 100) {
      maxZoom = 10;
      padding = 50;
    } else if (searchRadius >= 50) {
      maxZoom = 11;
      padding = 40;
    } else if (searchRadius >= 20) {
      maxZoom = 12;
      padding = 40;
    } else if (searchRadius <= 10) {
      maxZoom = 13;
      padding = 30;
    }

    if (networksCount === 1) {
      maxZoom = Math.min(maxZoom + 1, 15);
    }

    return { maxZoom, padding };
  }, [searchRadius, networksCount]);
}