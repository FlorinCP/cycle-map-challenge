import NetworksListView from '@/components/networks/list/newtork-list/networks-list-view';
import { Suspense } from 'react';
import NetworkListMap from '@/components/map/network-list-map';
import { LoadingScreen } from '@/components/ui/spinner';
import { PageMapLayout } from '@/components/layouts/page-map-layout';

export default function NetworksPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <PageMapLayout>
        <NetworksListView />
        <NetworkListMap
          initialLatitude={45}
          initialLongitude={10}
          initialZoom={1.5}
        />
      </PageMapLayout>
    </Suspense>
  );
}
