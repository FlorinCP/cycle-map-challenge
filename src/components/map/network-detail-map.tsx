'use client';

import { Marker } from '@vis.gl/react-maplibre';
import { Map as MapLibreMap, LngLatBounds, MapLibreEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import React, { useRef, useMemo, useEffect } from 'react';
import type { Station } from '@/types/city-bikes';
import { useNetworkDetailQuery } from '@/hooks/queries/use-network-query-detail';
import MapWrapper from '@/components/map/map-wrapper';

interface Props {
  networkId: string;
}

export const NetworkDetailMap: React.FC<Props> = ({ networkId }) => {
  const mapRef = useRef<MapLibreMap | null>(null);

  const { data, isLoading } = useNetworkDetailQuery(networkId);

  const markers = useMemo(() => {
    if (!mapRef.current) return null;
    if (data?.stations && !isLoading) {
      return data.stations.map((station: Station) => (
        <Marker
          key={`station-${station.id}`}
          longitude={station.longitude}
          latitude={station.latitude}
          anchor="bottom"
          onClick={e => {
            e.originalEvent.stopPropagation();
          }}
        >
          <div
            className="w-3 h-3 bg-grenadier-300 rounded-full border-2 border-grenadier-400 cursor-pointer"
            title={station.name}
          ></div>
        </Marker>
      ));
    }
    return null;
  }, [data, isLoading]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (data?.stations && !isLoading) {
      if (data.stations.length > 0) {
        const bounds = new LngLatBounds();
        data.stations.forEach(station => {
          bounds.extend([station.longitude, station.latitude]);
        });
        if (!bounds.isEmpty()) {
          mapRef.current.fitBounds(bounds, {
            padding: 60,
            maxZoom: 16,
            duration: 0,
          });
        }
      } else if (data.location) {
        mapRef.current.jumpTo({
          center: [data.location.longitude, data.location.latitude],
          zoom: 12,
        });
      }
    }
  }, [data?.location, data?.stations, isLoading]);

  const handleMapLoad = (evt: MapLibreEvent) => {
    mapRef.current = evt.target;
  };

  return (
    <MapWrapper isLoading={isLoading} onLoad={handleMapLoad}>
      {markers}
    </MapWrapper>
  );
};

NetworkDetailMap.displayName = 'CustomMap';

export default NetworkDetailMap;
