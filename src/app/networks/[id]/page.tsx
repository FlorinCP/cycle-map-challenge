'use client';

import React, { Suspense } from 'react';
import NetworkDetailView from '@/components/networks/detail/network-detail-view';
import NetworkDetailMap from '@/components/map/network-detail-map';
import { LoadingScreen } from '@/components/ui/spinner';
import { PageMapLayout } from '@/components/layouts/page-map-layout';

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
      <PageMapLayout>
        <NetworkDetailView
          networkId={id}
          selectedStationId={selectedStationId}
        />
        <NetworkDetailMap
          networkId={id}
          onSelectStation={setSelectedStationId}
        />
      </PageMapLayout>
    </Suspense>
  );
}
