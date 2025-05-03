'use client';

import { Station } from '@/types/city-bikes';
import { Marker, Popup } from '@vis.gl/react-maplibre';
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  station: Station;
  selectedStationId: string | null;
  onSelectStation: (stationId: string | null) => void;
}

export const StationMarker: React.FC<Props> = ({
  station,
  selectedStationId,
  onSelectStation,
}) => {
  const markerRef = useRef<HTMLDivElement>(null);
  const isSelected = selectedStationId === station.id;

  const handleMouseEnter = () => {
    onSelectStation(station.id);
  };

  const handleMouseLeave = () => {
    onSelectStation(null);
  };

  return (
    <>
      <Marker
        longitude={station.longitude}
        latitude={station.latitude}
        anchor="bottom"
      >
        <div
          className="relative grid place-items-center p-2 cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={markerRef}
            className={
              'h-3 rounded-full border-2 cursor-pointer transition-all duration-200 w-3 bg-grenadier-300 border-grenadier-400 '
            }
            title={station.name}
          />
        </div>
      </Marker>

      <Popup
        longitude={station.longitude}
        latitude={station.latitude}
        anchor="bottom"
        offset={[0, -20]}
        closeButton={false}
        closeOnClick={false}
        className={cn(
          isSelected ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-300 ease-in-out select-none'
        )}
      >
        <div className={'p-4 flex flex-col gap-2'}>
          <p className="font-medium text-base text-primary leading-7">
            {station.name}
          </p>
          {station.free_bikes !== undefined && (
            <div className="flex justify-between items-center gap-2">
              <p>Available bikes</p>
              <p className={'font-medium'}>{station.free_bikes}</p>
            </div>
          )}
          {station.empty_slots !== undefined && (
            <div className="flex justify-between items-center gap-2">
              <p>Empty slots</p>
              <p className={'font-medium'}>{station.empty_slots}</p>
            </div>
          )}
        </div>
      </Popup>
    </>
  );
};
