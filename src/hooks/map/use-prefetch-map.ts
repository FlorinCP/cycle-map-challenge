import { useQueryClient } from '@tanstack/react-query';
import { networkQueryKeys } from '@/api/query-keys';
import { NetworkDetail } from '@/types/city-bikes';
import { usePrefetchNetworkDetail } from '@/api';
import { calculateBounds, prefetchVectorTiles } from '@/lib/map/utils';

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
  const mapTilerUrl = process.env.NEXT_PUBLIC_MAPTILER_URL;
  const prefetchNetworkDetail = usePrefetchNetworkDetail();

  // Check if a resource is already cached using the Cache API
  const isResourceCached = async (url: string): Promise<boolean> => {
    if (!('caches' in window)) return false;

    try {
      const cache = await caches.open('map-assets');
      const response = await cache.match(url);
      return !!response;
    } catch {
      return false;
    }
  };

  // Cache a resource using the Cache API
  const cacheResource = async (url: string): Promise<void> => {
    if (!('caches' in window)) {
      // Fallback to regular fetch if Cache API is not available
      await fetch(url);
      return;
    }

    try {
      const cache = await caches.open('map-assets');
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response.clone());
      }
    } catch (error) {
      console.warn(`Failed to cache resource ${url}:`, error);
      // Fallback to regular fetch
      await fetch(url);
    }
  };

  return async (networkId: string) => {
    const styleUrl = `${mapTilerUrl}${mapTilerKey}`;

    try {
      // Check if we already have the map style in cache
      const existingStyle =
        queryClient.getQueryData<MapStyle>(mapStyleQueryKey);
      const existingNetwork = queryClient.getQueryData<NetworkDetail>(
        networkQueryKeys.detail(networkId)
      );

      // Only fetch if we don't have the data
      const networkPromise = existingNetwork
        ? Promise.resolve(existingNetwork)
        : prefetchNetworkDetail(networkId);

      const stylePromise = existingStyle
        ? Promise.resolve(existingStyle)
        : queryClient.prefetchQuery({
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
        // Prefetch sprite resources if not already cached
        if (style.sprite) {
          const spritePngUrl = `${style.sprite}.png`;
          const spriteJsonUrl = `${style.sprite}.json`;

          const [isPngCached, isJsonCached] = await Promise.all([
            isResourceCached(spritePngUrl),
            isResourceCached(spriteJsonUrl),
          ]);

          if (!isPngCached) await cacheResource(spritePngUrl);
          if (!isJsonCached) await cacheResource(spriteJsonUrl);
        }

        // Prefetch glyphs if not already cached
        if (style.glyphs) {
          const glyphUrl = style.glyphs
            .replace('{fontstack}', 'Open Sans Regular')
            .replace('{range}', '0-255');

          const isGlyphCached = await isResourceCached(glyphUrl);
          if (!isGlyphCached) await cacheResource(glyphUrl);
        }

        // Prefetch vector tiles if needed
        if (
          networkData?.stations &&
          networkData.stations.length > 0 &&
          style.sources?.openmaptiles?.url
        ) {
          try {
            // Check if we've already prefetched tiles for this network
            const tilesPrefetchKey = `tiles-prefetched-${networkId}`;
            const hasPrefetchedTiles = sessionStorage.getItem(tilesPrefetchKey);

            if (!hasPrefetchedTiles) {
              const tilesJsonResponse = await fetch(
                style.sources.openmaptiles.url
              );
              const tilesJson = await tilesJsonResponse.json();
              const tileUrlTemplate = tilesJson.tiles[0];
              const bounds = calculateBounds(networkData.stations);
              await prefetchVectorTiles(bounds, tileUrlTemplate);

              // Mark as prefetched for this session
              sessionStorage.setItem(tilesPrefetchKey, 'true');
            }
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
