import React, { Suspense } from 'react';
import NetworkDetailDisplay from '@/components/networks/detail/network-detail-display';
import CustomMap from '@/components/map/custom-map';

export default async function NetworkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="h-full w-full">Loading...</div>}>
      <div className="grid grid-cols-1 md:grid-cols-[40%_60%] min-h-screen max-h-screen w-full">
        <div className="flex flex-col w-full h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-hidden">
          <NetworkDetailDisplay networkId={id} />
        </div>

        <div className="h-full w-full">
          <CustomMap
            key={id}
            initialLatitude={45}
            initialLongitude={10}
            initialZoom={5}
          />
        </div>
      </div>
    </Suspense>
  );
}
