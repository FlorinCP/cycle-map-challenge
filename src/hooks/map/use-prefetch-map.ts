import { useQueryClient } from '@tanstack/react-query';
import { networkQueryKeys } from '@/lib/api/query-keys';
import { usePrefetchNetworkDetail } from '@/hooks/queries/use-network-query-detail';
import { NetworkDetail } from '@/types/city-bikes';

interface MapStyle {
  version: number;
  sprite?: string;
  glyphs?: string;
  sources?: {
    [key: string]: {
      type: string;
      url?: string;
    };
  };
}

const mapStyleQueryKey = ['mapStyle'] as const;

export function usePrefetchMap() {
  const queryClient = useQueryClient();
  const mapTilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const prefetchNetworkDetail = usePrefetchNetworkDetail();

  return async (networkId: string) => {
    const styleUrl = `https://api.maptiler.com/maps/streets-v2-light/style.json?key=${mapTilerKey}`;

    try {
      const networkPromise = prefetchNetworkDetail(networkId);
      const stylePromise = queryClient.prefetchQuery({
        queryKey: mapStyleQueryKey,
        queryFn: async () => {
          const response = await fetch(styleUrl);
          if (!response.ok) throw new Error('Failed to fetch map style');
          return response.json() as Promise<MapStyle>;
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
      });

      await Promise.all([stylePromise, networkPromise]);

      const style = queryClient.getQueryData<MapStyle>(mapStyleQueryKey);
      const networkData = queryClient.getQueryData<NetworkDetail>(
        networkQueryKeys.detail(networkId)
      );

      if (style) {
        if (style.sprite) {
          fetch(`${style.sprite}.png`);
          fetch(`${style.sprite}.json`);
        }

        if (style.glyphs) {
          const glyphUrl = style.glyphs
            .replace('{fontstack}', 'Open Sans Regular')
            .replace('{range}', '0-255');
          fetch(glyphUrl);
        }

        if (
          networkData?.stations &&
          networkData?.stations?.length > 0 &&
          style.sources?.openmaptiles?.url
        ) {
          try {
            const tilesJsonResponse = await fetch(
              style.sources.openmaptiles.url
            );
            const tilesJson = await tilesJsonResponse.json();
            const tileUrlTemplate = tilesJson.tiles[0];
            const bounds = calculateBounds(networkData.stations);
            await prefetchVectorTiles(bounds, tileUrlTemplate);
          } catch (error) {
            console.warn('Failed to prefetch vector tiles:', error);
          }
        }
      }

      return { style, networkData };
    } catch (error) {
      console.error('Failed to prefetch map assets:', error);
      throw error;
    }
  };
}

function calculateBounds(
  stations: Array<{ latitude: number; longitude: number }>
) {
  let minLat = Infinity,
    maxLat = -Infinity;
  let minLng = Infinity,
    maxLng = -Infinity;

  stations.forEach(station => {
    minLat = Math.min(minLat, station.latitude);
    maxLat = Math.max(maxLat, station.latitude);
    minLng = Math.min(minLng, station.longitude);
    maxLng = Math.max(maxLng, station.longitude);
  });

  // Add padding to bounds
  const latPadding = (maxLat - minLat) * 0.1;
  const lngPadding = (maxLng - minLng) * 0.1;

  return {
    minLat: minLat - latPadding,
    maxLat: maxLat + latPadding,
    minLng: minLng - lngPadding,
    maxLng: maxLng + lngPadding,
  };
}

function estimateZoomLevel(bounds: {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}): number {
  const latDiff = bounds.maxLat - bounds.minLat;
  const lngDiff = bounds.maxLng - bounds.minLng;
  const maxDiff = Math.max(latDiff, lngDiff);

  if (maxDiff < 0.01) return 14;
  if (maxDiff < 0.05) return 13;
  if (maxDiff < 0.1) return 12;
  if (maxDiff < 0.5) return 10;
  if (maxDiff < 1) return 8;
  return 6;
}

function latLngToTile(lat: number, lng: number, zoom: number) {
  const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
  const y = Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoom)
  );
  return { x, y };
}

async function prefetchVectorTiles(
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  tileUrlTemplate: string
) {
  const zoom = Math.min(14, estimateZoomLevel(bounds));

  const minTile = latLngToTile(bounds.minLat, bounds.minLng, zoom);
  const maxTile = latLngToTile(bounds.maxLat, bounds.maxLng, zoom);

  const tiles: string[] = [];

  for (let x = minTile.x; x <= maxTile.x && tiles.length < 9; x++) {
    for (let y = minTile.y; y <= maxTile.y && tiles.length < 9; y++) {
      const url = tileUrlTemplate
        .replace('{z}', zoom.toString())
        .replace('{x}', x.toString())
        .replace('{y}', y.toString());
      tiles.push(url);
    }
  }

  const prefetchPromises = tiles.map(url =>
    fetch(url, {
      method: 'GET',
      cache: 'force-cache',
    }).catch(err => console.warn(`Failed to prefetch tile: ${url}`, err))
  );

  await Promise.all(prefetchPromises);
}
