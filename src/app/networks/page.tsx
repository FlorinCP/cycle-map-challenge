'use client';
import NetworksListView from '@/components/networks/list/networks-list-view';
import CustomMap from '@/components/map/custom-map';

export default function NetworksPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen max-h-screen w-full">
      <NetworksListView />
      <div className="h-full w-full">
        <CustomMap
          initialLatitude={45}
          initialLongitude={10}
          initialZoom={1.5}
        />
      </div>
    </div>
  );
}
