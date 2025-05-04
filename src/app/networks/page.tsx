import NetworksListView from '@/components/networks/list/newtork-list/networks-list-view';
import { Suspense } from 'react';
import NetworkListMap from '@/components/map/network-list-map';
import { LoadingScreen } from '@/components/ui/spinner';

export default function NetworksPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <div className="grid grid-cols-1 md:grid-cols-[30%_70%] min-h-screen max-h-screen w-full scrollbar-hide">
        <NetworksListView />
        <NetworkListMap
          initialLatitude={45}
          initialLongitude={10}
          initialZoom={1.5}
        />
      </div>
    </Suspense>
  );
}
