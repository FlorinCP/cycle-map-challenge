export function calculateBounds(
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

export function estimateZoomLevel(bounds: {
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

export async function prefetchVectorTiles(
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
