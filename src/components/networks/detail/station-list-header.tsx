import SortControls from '@/components/networks/detail/sort-controls';
import React from 'react';

export default function StationListHeader() {
  return (
    <div
      className={
        'w-full flex justify-between items-center border-b border-white p-2 bg-primary'
      }
    >
      <p
        className={
          'text-white text-center font-sans text-sm font-medium leading-5 tracking-wider uppercase'
        }
      >
        STATION NAME
      </p>
      <SortControls />
    </div>
  );
}
