'use client';

import type React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import debounce from 'lodash.debounce';

export default function NetworkSearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialSearch = searchParams.get('search') || '';
  const [inputValue, setInputValue] = useState(initialSearch);

  const routerRef = useRef(router);
  const pathnameRef = useRef(pathname);
  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const performUpdate = useCallback((term: string) => {
    const current = new URLSearchParams(
      Array.from(searchParamsRef.current.entries())
    );

    if (!term.trim()) {
      current.delete('search');
    } else {
      current.set('search', term);
    }
    current.set('page', '1');

    const search = current.toString();
    const query = search ? `?${search}` : '';
    routerRef.current.push(`${pathnameRef.current}${query}`);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateURL = useCallback(
    debounce((term: string) => {
      performUpdate(term);
    }, 500),
    [performUpdate]
  );

  useEffect(() => {
    setInputValue(initialSearch);
  }, [initialSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    debouncedUpdateURL(newValue);
  };

  return (
    <div className="relative flex-grow">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
      <Input
        type="search"
        placeholder="Search networks or companies..."
        value={inputValue}
        onChange={handleChange}
        className="pl-10 py-6 rounded-full text-primary bg-white placeholder:text-primary border border-border leading-7 font-normal"
      />
    </div>
  );
}

NetworkSearchInput.displayName = 'NetworkSearchInput';
