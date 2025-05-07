'use client';

import {
  Map,
  type MapRef,
  Layer,
  Source,
  LngLatBoundsLike,
} from '@vis.gl/react-maplibre';
import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { MapLayerMouseEvent } from 'maplibre-gl';
import maplibregl from 'maplibre-gl';
import { ZoomControls } from '@/components/map/zoom-controls';
import { useRouter, useSearchParams } from 'next/navigation';
import { NetworkDetail, type Station } from '@/types/city-bikes';
import { SEARCH_PARAMS } from '@/types/search-params';

const getStationsGeoJsonData = (stations: Station[]) => {
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
};

interface Props {
  networkDetail: NetworkDetail;
}

const DefaultMapInitialState = {
  longitude: 10,
  latitude: 45,
  zoom: 12,
  pitch: 0,
  bearing: 0,
};

export const NetworkDetailMap: React.FC<Props> = ({ networkDetail }) => {
  const mapRef = useRef<MapRef>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const mapStyle = process.env.NEXT_PUBLIC_MAP_STYLE;
  const router = useRouter();
  const searchParams = useSearchParams();
  const geojsonData = getStationsGeoJsonData(networkDetail?.stations);

  const onSelectStation = useCallback(
    (stationId: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (stationId) {
        params.set(SEARCH_PARAMS.STATION_ID, stationId);
      } else {
        params.delete(SEARCH_PARAMS.STATION_ID);
      }

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      router.replace(newUrl);
    },
    [router, searchParams]
  );

  const onMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    let hoveredId: number | string | undefined = undefined;

    popupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 15,
      className: 'animated-popup',
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

        requestAnimationFrame(() => {
          const popupElement = popupRef.current?.getElement();
          if (popupElement) {
            popupElement.style.opacity = '0';
            popupElement.classList.add('popup-fade-enter');

            requestAnimationFrame(() => {
              popupElement.style.opacity = '1';
              popupElement.classList.add('popup-fade-enter-active');
            });
          }
        });
      }
    });

    map.on('mouseleave', 'station-markers', () => {
      map.getCanvas().style.cursor = '';

      if (hoveredId !== null) {
        map.setFeatureState(
          { source: 'stations', id: hoveredId },
          { hover: false }
        );
        hoveredId = undefined;
      }
      onSelectStation(null);

      const popupElement = popupRef.current?.getElement();
      if (popupElement) {
        popupElement.style.opacity = '0';
        setTimeout(() => {
          popupRef.current?.remove();
        }, 300);
      } else {
        popupRef.current?.remove();
      }
    });

    map.on('click', 'station-markers', (e: MapLayerMouseEvent) => {
      const stationId = e.features?.[0]?.properties?.id;
      if (stationId) {
        onSelectStation(stationId);
      }
    });

    const stationIdFromUrl = searchParams.get('stationId');
    if (stationIdFromUrl && map.isStyleLoaded()) {
      const features = map.querySourceFeatures('stations', {
        filter: ['==', ['get', 'id'], stationIdFromUrl],
      });

      if (features.length > 0) {
        const feature = features[0];
        hoveredId = feature.id;
        map.setFeatureState(
          { source: 'stations', id: hoveredId },
          { hover: true }
        );

        if (feature.geometry.type === 'Point') {
          map.flyTo({
            center: feature.geometry.coordinates as [number, number],
            zoom: 15,
          });
        }
      }
    }
  }, [onSelectStation, searchParams]);

  const bounds: LngLatBoundsLike | undefined = useMemo(() => {
    if (!networkDetail?.stations?.length) return undefined;

    const bounds = new maplibregl.LngLatBounds();
    networkDetail.stations.forEach(station => {
      bounds.extend([station.longitude, station.latitude]);
    });

    if (bounds.isEmpty()) return undefined;

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    return [sw.lng, sw.lat, ne.lng, ne.lat] as [number, number, number, number];
  }, [networkDetail?.stations]);

  const initialViewState = bounds
    ? { bounds, fitBoundsOptions: { padding: 60, maxZoom: 16 } }
    : networkDetail?.location
      ? {
          longitude: networkDetail.location.longitude,
          latitude: networkDetail.location.latitude,
          zoom: 12,
          pitch: 0,
          bearing: 0,
        }
      : DefaultMapInitialState;

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
        initialViewState={initialViewState}
      >
        <ZoomControls mapRef={mapRef} />

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
    </div>
  );
};

NetworkDetailMap.displayName = 'NetworkDetailMap';

export default NetworkDetailMap;
