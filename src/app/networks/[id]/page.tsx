'use client';

import React, { Suspense } from 'react';
import NetworkDetailView from '@/components/networks/detail/network-detail-view';
import NetworkDetailMap from '@/components/map/network-detail-map';
import { LoadingScreen } from '@/components/ui/spinner';

export default function NetworkDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [selectedStationId, setSelectedStationId] = React.useState<
    string | null
  >(null);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <div className="grid grid-cols-1 md:grid-cols-[30%_70%] min-h-screen max-h-screen w-full">
        <NetworkDetailView
          networkId={id}
          selectedStationId={selectedStationId}
        />
        <NetworkDetailMap
          networkId={id}
          selectedStationId={selectedStationId}
          onSelectStation={setSelectedStationId}
        />
      </div>
    </Suspense>
  );
}
