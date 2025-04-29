import React from 'react';
import NetworkDetailDisplay from '@/components/networks/detail/network-detail-display';
import CustomMap from '@/components/map/custom-map';

export default function NetworkDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const networkId = params.id;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen max-h-screen w-full">
      <div className="flex flex-col w-full h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-hidden">
        <NetworkDetailDisplay networkId={networkId} />
      </div>

      <div className="h-full w-full">
        <CustomMap
          key={networkId}
          initialLatitude={45}
          initialLongitude={10}
          initialZoom={5}
        />
      </div>
    </div>
  );
}
