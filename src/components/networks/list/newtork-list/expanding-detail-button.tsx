'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrefetchNetworkDetail } from '@/api';

interface ExpandingDetailButtonProps {
  id: string;
  className?: string;
}

export function ExpandingDetailButton({
  id,
  className,
}: ExpandingDetailButtonProps) {
  const prefetchNetworkDetail = usePrefetchNetworkDetail();

  return (
    <Link
      href={{
        pathname: `/networks/${id}`,
      }}
      onMouseEnter={() => prefetchNetworkDetail(id)}
      onFocus={() => prefetchNetworkDetail(id)}
      className={cn(
        // --- Group Setup & Base Layout ---
        'inline-flex items-center justify-center',
        'overflow-hidden',
        'h-10',
        'min-w-10',
        'flex-shrink-0',

        // --- Initial State (No Hover) ---
        'bg-transparent', // No background initially
        'border border-transparent', // No border initially
        'px-2 py-1', // Padding just for the icon

        // --- Hover State ---
        'group-hover:bg-white', // White background on group-hover
        'group-hover:px-4', // Expand horizontal padding on group-hover
        'group-hover:py-1',
        'group-hover:rounded-[43px]',

        // --- Transitions ---
        'wrappers-all duration-300 ease-in-out', // Animate all changes smoothly

        // --- Focus ---
        'focus:outline-none focus:ring-2 focus:ring-grenadier-500 focus:ring-offset-2 focus:rounded-full',

        // --- Allow external classes ---
        className
      )}
      aria-label="View details"
    >
      {/* "Details" Text - Hidden Initially, Appears on Hover */}
      <span
        className={cn(
          // --- Initial State ---
          'w-0', // Start with zero width
          'opacity-0', // Start invisible
          'whitespace-nowrap', // Prevent wrapping during wrappers

          // --- Hover State (Triggered by parent 'group') ---
          'group-hover:w-auto', // Expand width to fit content on group-hover
          'group-hover:opacity-100', // Fade in on group-hover
          'group-hover:mr-1', // Add space between text and icon on hover
          'text-xs font-medium',
          'text-grenadier-500',
          'leading-7',

          // --- Transitions ---
          'wrappers-all duration-300 ease-in-out'
        )}
        aria-hidden="true"
      >
        Details
      </span>

      <ChevronRight
        className={cn(
          'h-5 w-5',
          'text-grenadier-500',
          'group-hover:',
          'wrappers-colors duration-300 ease-in-out'
        )}
      />
    </Link>
  );
}

ExpandingDetailButton.displayName = 'ExpandingDetailButton';
