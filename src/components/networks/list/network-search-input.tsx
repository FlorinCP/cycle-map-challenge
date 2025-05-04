'use client';

import type React from 'react';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import debounce from 'lodash.debounce';
import { SEARCH_PARAMS } from '@/types/search-params';

interface NetworkSearchInputProps {
  placeholder?: string;
  debounceMs?: number;
  onSearchChange?: (term: string) => void;
}

export default function NetworkSearchInput({
  placeholder = 'Search networks or companies...',
  debounceMs = 300,
  onSearchChange,
}: NetworkSearchInputProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialSearch = searchParams.get(SEARCH_PARAMS.SEARCH) || '';
  const [inputValue, setInputValue] = useState(initialSearch);
  const inputRef = useRef<HTMLInputElement>(null);

  const routingData = useMemo(
    () => ({
      router,
      pathname,
      searchParams,
    }),
    [router, pathname, searchParams]
  );

  const performUpdate = useCallback(
    (term: string) => {
      const current = new URLSearchParams(
        Array.from(routingData.searchParams.entries())
      );

      if (!term.trim()) {
        current.delete(SEARCH_PARAMS.SEARCH);
      } else {
        current.set(SEARCH_PARAMS.SEARCH, term.trim());
      }
      current.set(SEARCH_PARAMS.PAGE, '1');

      const search = current.toString();
      const query = search ? `?${search}` : '';

      routingData.router.replace(`${routingData.pathname}${query}`);

      onSearchChange?.(term);
    },
    [routingData, onSearchChange]
  );

  const debouncedUpdateURL = useMemo(
    () => debounce(performUpdate, debounceMs),
    [performUpdate, debounceMs]
  );

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  useEffect(() => {
    setInputValue(initialSearch);
  }, [initialSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    debouncedUpdateURL(newValue);
  };

  const handleClear = () => {
    setInputValue('');
    performUpdate('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="relative flex-grow">
      <Search
        className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary pointer-events-none"
        aria-hidden="true"
      />
      <Input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="pl-10 pr-10 py-6 rounded-full text-primary bg-white placeholder:text-primary border border-border leading-7 font-normal"
        aria-label="Search networks or companies"
        autoComplete="off"
        spellCheck="false"
      />
    </div>
  );
}

NetworkSearchInput.displayName = 'NetworkSearchInput';
