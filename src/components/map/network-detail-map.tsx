'use client';

import { Map, type MapRef, Layer, Source } from '@vis.gl/react-maplibre';
import React, { useRef, useCallback, useState, useEffect } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { MapLayerMouseEvent } from 'maplibre-gl';
import maplibregl from 'maplibre-gl';
import { useGetNetworkDetailQuery } from '@/api';
import { Spinner } from '@/components/ui/spinner';
import { useStationGeoJsonData } from '@/hooks/map/use-station-list-geo-json-data';

interface Props {
  networkId: string;
  selectedStationId: string | null;
  onSelectStation: (stationId: string | null) => void;
}

const DefaultMapInitialState = {
  longitude: 10,
  latitude: 45,
  zoom: 12,
  pitch: 0,
  bearing: 0,
};

export const NetworkDetailMap: React.FC<Props> = ({
  networkId,
  selectedStationId,
  onSelectStation,
}) => {
  const mapRef = useRef<MapRef>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const mapStyle = process.env.NEXT_PUBLIC_MAP_STYLE;

  const { data: networkDetail, isLoading } =
    useGetNetworkDetailQuery(networkId);
  const geojsonData = useStationGeoJsonData(networkDetail?.stations);

  const onMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    let hoveredId: string | number | null = null;

    popupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 15,
    });

    map.on('mouseenter', 'station-markers', (e: MapLayerMouseEvent) => {
      map.getCanvas().style.cursor = 'pointer';

      if (!e.features?.[0]) return;
      const feature = e.features[0];
      const stationId = feature?.properties?.id;
      if (stationId) {
        onSelectStation(stationId);
      }

      if (feature.geometry.type === 'Point' && popupRef.current) {
        const html = `
          <div class="p-4 flex flex-col gap-2">
            <p class="font-medium text-base text-primary leading-7">
              ${feature.properties?.name || ''}
            </p>
            ${
              feature.properties?.free_bikes !== undefined
                ? `
              <div class="flex justify-between items-center gap-2">
                <p>Available bikes</p>
                <p class="font-medium">${feature.properties?.free_bikes}</p>
              </div>
            `
                : ''
            }
            ${
              feature.properties?.empty_slots !== undefined
                ? `
              <div class="flex justify-between items-center gap-2">
                <p>Empty slots</p>
                <p class="font-medium">${feature.properties?.empty_slots}</p>
              </div>
            `
                : ''
            }
          </div>
        `;

        popupRef.current
          .setLngLat(feature.geometry.coordinates as [number, number])
          .setHTML(html)
          .addTo(map);
      }
    });

    map.on('mouseleave', 'station-markers', () => {
      map.getCanvas().style.cursor = '';

      if (hoveredId !== null) {
        map.setFeatureState(
          { source: 'stations', id: hoveredId },
          { hover: false }
        );
        hoveredId = null;
      }
      onSelectStation(null);
      popupRef.current?.remove();
    });

    map.on('click', 'station-markers', (e: MapLayerMouseEvent) => {
      const stationId = e.features?.[0]?.properties?.id;
      if (stationId) {
        onSelectStation(stationId);
      }
    });

    setIsMapReady(true);
  }, [onSelectStation]);

  useEffect(() => {
    if (!isMapReady || !mapRef.current || !networkDetail?.stations) return;

    const map = mapRef.current.getMap();
    if (!map) return;

    const timeoutId = setTimeout(() => {
      if (networkDetail.stations.length > 0) {
        const bounds = new maplibregl.LngLatBounds();

        networkDetail.stations.forEach(station => {
          bounds.extend([station.longitude, station.latitude]);
        });

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, {
            padding: 60,
            maxZoom: 16,
            duration: 1000,
            essential: true,
          });
        }
      } else if (networkDetail?.location) {
        map.flyTo({
          center: [
            networkDetail.location.longitude,
            networkDetail.location.latitude,
          ],
          zoom: DefaultMapInitialState.zoom,
          duration: 1000,
          essential: true,
        });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isMapReady, networkDetail]);

  useEffect(() => {
    return () => {
      popupRef.current?.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        onLoad={onMapLoad}
        dragRotate={false}
        pitchWithRotate={false}
        touchZoomRotate={false}
      >
        {geojsonData.features.length > 0 && (
          <Source
            id="stations"
            type="geojson"
            data={geojsonData}
            generateId={true}
          >
            <Layer
              id="station-markers"
              type="circle"
              paint={{
                'circle-color': 'rgba(247, 169, 122, 1)',
                'circle-radius': 6,
                'circle-stroke-width': 2,
                'circle-stroke-color': 'rgba(243, 123, 68, 1)',
                'circle-opacity': 1,
                'circle-stroke-opacity': 1,
              }}
            />
          </Source>
        )}
      </Map>

      {(isLoading || !networkDetail?.location) && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-50">
          <Spinner />
        </div>
      )}
    </div>
  );
};

NetworkDetailMap.displayName = 'NetworkDetailMap';

export default NetworkDetailMap;
