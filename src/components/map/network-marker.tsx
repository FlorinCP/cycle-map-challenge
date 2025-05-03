import { Marker } from '@vis.gl/react-maplibre';
import React from 'react';
import { NetworkSummary } from '@/types/city-bikes';

interface Props {
  network: NetworkSummary;
  onClick: () => void;
  onMouseEnter: () => void;
}

export const NetworkMarker: React.FC<Props> = ({
  network,
  onClick,
  onMouseEnter,
}) => {
  return (
    <Marker
      key={`network-${network.id}`}
      longitude={network.location.longitude}
      latitude={network.location.latitude}
      anchor="bottom"
      onClick={e => {
        e.originalEvent.stopPropagation();
        onClick();
      }}
    >
      <div
        onMouseEnter={onMouseEnter}
        className="w-3 h-3 bg-grenadier-300 rounded-full border-2 border-grenadier-400 cursor-pointer"
        title={network.name}
      ></div>
    </Marker>
  );
};
