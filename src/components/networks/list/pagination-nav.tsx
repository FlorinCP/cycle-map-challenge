'use client';

import React, { useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePaginationRange, DOTS } from '@/hooks/use-pagination-range';
import { cn } from '@/lib/utils';
import { SEARCH_PARAMS } from '@/types/search-params';

interface PaginationNavProps {
  totalPages: number;
  pageSize: number;
  siblingCount?: number;
}

export function PaginationNav({
  totalPages,
  pageSize,
  siblingCount = 1,
}: PaginationNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get(SEARCH_PARAMS.PAGE);
  const currentPage = useMemo(() => {
    const pageNum = parseInt(page || '1', 10);
    return isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
  }, [page]);

  const paginationRange = usePaginationRange({
    currentPage,
    totalPages,
    siblingCount,
    pageSize,
    totalCount: totalPages * pageSize,
  });

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(pageNumber));
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) {
    return null;
  }

  const showPrevious = currentPage > 1;
  const showNext = currentPage < totalPages;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={showPrevious ? createPageURL(currentPage - 1) : '#'}
            aria-disabled={!showPrevious}
            tabIndex={showPrevious ? undefined : -1}
            className={
              !showPrevious ? 'pointer-events-none opacity-50' : undefined
            }
          />
        </PaginationItem>

        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return <PaginationEllipsis key={DOTS + index} />;
          }

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href={createPageURL(pageNumber)}
                isActive={currentPage === pageNumber}
                className={cn(
                  'text-accent-foreground border',
                  currentPage === pageNumber && 'bg-accent'
                )}
                aria-current={currentPage === pageNumber ? 'page' : undefined}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={showNext ? createPageURL(currentPage + 1) : '#'}
            aria-disabled={!showNext}
            tabIndex={showNext ? undefined : -1}
            className={!showNext ? 'pointer-events-none opacity-50' : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
PaginationNav.displayName = 'PaginationNav';
