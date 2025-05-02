import NetworksListView from '@/components/networks/list/networks-list-view';
import { Suspense } from 'react';
import NetworksMap from '@/components/map/networks-map';

export default function NetworksPage() {
  return (
    <Suspense fallback={<div className="h-full w-full">Loading...</div>}>
      <div className="grid grid-cols-1 md:grid-cols-[30%_70%] min-h-screen max-h-screen w-full overflow-x-hidden">
        <NetworksListView />
        <NetworksMap
          initialLatitude={45}
          initialLongitude={10}
          initialZoom={1.5}
        />
      </div>
    </Suspense>
  );
}
