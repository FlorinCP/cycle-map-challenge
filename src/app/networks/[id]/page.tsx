'use client';

import React, { Suspense } from 'react';
import NetworkDetailView from '@/components/networks/detail/network-detail-view';
import CustomMap from '@/components/map/custom-map';
import { useParams } from 'next/navigation';

export default function NetworkDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <Suspense fallback={<div className="h-full w-full">Loading...</div>}>
      <div className="grid grid-cols-1 md:grid-cols-[40%_60%] min-h-screen max-h-screen w-full">
        <div className="flex flex-col w-full h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-hidden">
          {id ? (
            <NetworkDetailView networkId={id} />
          ) : (
            <div className="flex items-center justify-center h-full">
              Network ID not found
            </div>
          )}
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
