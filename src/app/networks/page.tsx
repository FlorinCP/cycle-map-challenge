'use client';
import NetworksListView from '@/components/networks/list/networks-list-view';
import CustomMap from '@/components/map/custom-map';
import { Suspense } from 'react';

export default function NetworksPage() {
  return (
    <Suspense fallback={<div className="h-full w-full">Loading...</div>}>
      <div className="grid grid-cols-1 md:grid-cols-[40%_60%] min-h-screen max-h-screen w-full scrollbar-hide">
        <NetworksListView />
        <div className="h-full w-full">
          <CustomMap
            initialLatitude={45}
            initialLongitude={10}
            initialZoom={1.5}
          />
        </div>
      </div>
    </Suspense>
  );
}
