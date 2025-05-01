import type { Station } from '@/types/city-bikes';
import { cn } from '@/lib/utils';

interface StationListItemProps {
  station: Station;
  isHighlighted?: boolean;
}

export default function StationListItem({
  station,
  isHighlighted = false,
}: StationListItemProps) {
  return (
    <div
      className={cn(
        'group px-2 flex py-4 justify-between items-center border-b border-dashed border-white/50 text-white hover:bg-white/10 transition-all duration-300',
        isHighlighted && 'bg-white/10'
      )}
    >
      <p
        className={cn(
          'font-medium truncate text-base leading-7 transition-all duration-300 group-hover:pl-2',
          isHighlighted && 'pl-2'
        )}
        title={station.name}
      >
        {station.name}
      </p>

      <div className="flex items-center">
        <div className="flex items-center w-32 justify-center">
          <span className="font-bold">{station.free_bikes ?? 'N/A'}</span>
        </div>
        <div className="flex items-center w-32 justify-center">
          <span className="font-bold">{station.empty_slots ?? 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}
StationListItem.displayName = 'StationListItem';
