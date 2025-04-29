import React from 'react';
import NetworkDetailDisplay from '@/components/networks/detail/network-detail-display';

interface PageProps {
  params: {
    id: string;
  };
}

export default function NetworkDetailPage({ params }: PageProps) {
  const networkId = params.id;

  return (
    <div className="flex flex-col w-full h-full bg-white dark:bg-gray-900">
      <NetworkDetailDisplay networkId={networkId} />
    </div>
  );
}
