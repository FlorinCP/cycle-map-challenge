'use client';

import React, { useMemo } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
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
  variant?: 'primary' | 'secondary';
}

export function PaginationNav({
  totalPages,
  pageSize,
  siblingCount = 1,
  variant = 'primary',
}: PaginationNavProps) {
  const router = useRouter();
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

  const handlePageChange = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(pageNumber));
    router.push(`${pathname}?${params.toString()}`, {
      scroll: true,
    });
  };

  if (totalPages <= 1) {
    return null;
  }

  const showPrevious = currentPage > 1;
  const showNext = currentPage < totalPages;

  return (
    <Pagination className={'p-10'}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => showPrevious && handlePageChange(currentPage - 1)}
            aria-disabled={!showPrevious}
            tabIndex={showPrevious ? undefined : -1}
            className={cn(
              'cursor-pointer text-primary font-semibold',
              !showPrevious && 'pointer-events-none opacity-50',
              variant === 'secondary' && 'text-white'
            )}
          />
        </PaginationItem>

        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <PaginationEllipsis
                className={cn(variant === 'secondary' && 'text-white')}
                key={DOTS + index}
              />
            );
          }

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                onClick={() => handlePageChange(pageNumber)}
                isActive={currentPage === pageNumber}
                className={cn(
                  'cursor-pointer text-accent-foreground border font-semibold',
                  currentPage === pageNumber && 'bg-accent',
                  variant === 'secondary' && 'text-white border-none',
                  variant === 'secondary' &&
                    currentPage === pageNumber &&
                    'text-torea-bay-900'
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
            onClick={() => showNext && handlePageChange(currentPage + 1)}
            aria-disabled={!showNext}
            tabIndex={showNext ? undefined : -1}
            className={cn(
              'cursor-pointer font-semibold text-primary',
              !showNext && 'pointer-events-none opacity-50',
              variant === 'secondary' && 'text-white'
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
