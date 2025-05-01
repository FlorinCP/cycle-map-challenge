import type { Station } from '@/types/city-bikes';

interface StationListItemProps {
  station: Station;
}

export default function StationListItem({ station }: StationListItemProps) {
  return (
    <div className="px-2 flex py-4 justify-between items-center border-b border-dashed border-white/50 bg-primary text-white">
      <p
        className="font-medium truncate text-base line-leading-7"
        title={station.name}
      >
        {station.name}
      </p>

      <div className={'flex items-center'}>
        <div className="flex items-center w-32 justify-center">
          <span className="font-bold ">{station.free_bikes ?? 'N/A'}</span>
        </div>
        <div className="flex items-center w-32 justify-center">
          <span className="font-bold ">{station.empty_slots ?? 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}
StationListItem.displayName = 'StationListItem';
