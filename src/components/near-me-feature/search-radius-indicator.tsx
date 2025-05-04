interface SearchRadiusIndicatorProps {
  userLat: string | null;
  userLng: string | null;
  searchRadius: number;
}

export const SearchRadiusIndicator: React.FC<SearchRadiusIndicatorProps> = ({
  userLat,
  userLng,
  searchRadius,
}) => {
  if (!userLat || !userLng || searchRadius <= 0) return null;

  return (
    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 bg-white px-3 py-2 rounded-lg shadow-md text-sm">
      {' '}
      {searchRadius === -1
        ? 'Showing all networks (no networks found nearby)'
        : `Showing networks within ${searchRadius}km`}
    </div>
  );
};
