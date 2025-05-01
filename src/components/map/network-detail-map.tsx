'use client';

import { Map, type MapRef } from '@vis.gl/react-maplibre';
import { Map as MapLibreMap, LngLatBounds } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import React, {
  useRef,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react';

import type { Station } from '@/types/city-bikes';
import { useNetworkDetailQuery } from '@/hooks/queries/use-network-query-detail';
import { StationMarker } from '@/components/map/station-marker';

interface Props {
  networkId: string;
  selectedStationId: string | null;
  onSelectStation: (stationId: string | null) => void;
}

export const NetworkDetailMap: React.FC<Props> = ({
  networkId,
  selectedStationId,
  onSelectStation,
}) => {
  const mapRefGL = useRef<MapLibreMap | null>(null);
  const reactMapRef = useRef<MapRef>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapTilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const mapStyleUrl = `https://api.maptiler.com/maps/streets-v2-light/style.json?key=${mapTilerKey}`;

  const { data: networkDetail, isLoading } = useNetworkDetailQuery(networkId);

  const markers = useMemo(() => {
    if (!isMapLoaded) return null;

    if (networkDetail?.stations && !isLoading) {
      return networkDetail.stations.map((station: Station) => (
        <StationMarker
          station={station}
          key={station.id}
          onSelectStation={onSelectStation}
          selectedStationId={selectedStationId}
        />
      ));
    }
    return null;
  }, [
    isMapLoaded,
    networkDetail?.stations,
    isLoading,
    onSelectStation,
    selectedStationId,
  ]);

  useEffect(() => {
    const map = mapRefGL.current;
    if (!map || !isMapLoaded) return;
    if (networkDetail?.stations && !isLoading) {
      if (networkDetail.stations.length > 0) {
        const bounds = new LngLatBounds();
        networkDetail.stations.forEach(station => {
          bounds.extend([station.longitude, station.latitude]);
        });
        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, { padding: 60, maxZoom: 16, duration: 0 });
        }
      } else if (networkDetail.location) {
        map.jumpTo({
          center: [
            networkDetail.location.longitude,
            networkDetail.location.latitude,
          ],
          zoom: 12,
        });
      }
    }
  }, [isLoading, isMapLoaded, networkDetail]);

  const onMapLoad = useCallback((evt: maplibregl.MapLibreEvent) => {
    mapRefGL.current = evt.target;
    setIsMapLoaded(true);
  }, []);

  return (
    <div className={'h-full w-full relative'}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-10">
          <p className="text-gray-700">Loading map data...</p>
        </div>
      )}

      <Map
        ref={reactMapRef} // Ref for the React component
        onLoad={onMapLoad} // Get the actual map instance on load
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyleUrl}
        renderWorldCopies={false}
        reuseMaps
      >
        {markers}
      </Map>
    </div>
  );
};

NetworkDetailMap.displayName = 'NetworkDetailMap';

export default NetworkDetailMap;
