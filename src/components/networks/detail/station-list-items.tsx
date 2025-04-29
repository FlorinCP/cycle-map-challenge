import type { Station } from '@/types/city-bikes';
import { Bike, ParkingCircle } from 'lucide-react';

interface StationListItemProps {
  station: Station;
}

export default function StationListItem({ station }: StationListItemProps) {
  return (
    <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800">
      <p
        className="font-medium text-sm text-gray-900 dark:text-white truncate mb-1"
        title={station.name}
      >
        {station.name}
      </p>
      <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-1">
          <Bike className="h-3 w-3 text-green-600" />
          <span>Free Bikes:</span>
          <span className="font-semibold text-green-700 dark:text-green-400">
            {station.free_bikes ?? 'N/A'}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <ParkingCircle className="h-3 w-3 text-blue-600" />
          <span>Empty Slots:</span>
          <span className="font-semibold text-blue-700 dark:text-blue-400">
            {station.empty_slots ?? 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}
StationListItem.displayName = 'StationListItem';
