'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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

  useEffect(() => { routerRef.current = router; }, [router]);
  useEffect(() => { pathnameRef.current = pathname; }, [pathname]);
  useEffect(() => { searchParamsRef.current = searchParams; }, [searchParams]);


  const performUpdate = useCallback((term: string) => {
    const current = new URLSearchParams(Array.from(searchParamsRef.current.entries()));

    if (!term.trim()) {
      current.delete('search');
    } else {
      current.set('search', term);
    }
    current.set('page', '1');

    const search = current.toString();
    const query = search ? `?${search}` : '';
    console.log(`Updating URL search to: ${term}`);
    routerRef.current.push(`${pathnameRef.current}${query}`);
  }, []); // performUpdate itself has no external dependencies now

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateURL = useCallback(
    debounce((term: string) => {
      performUpdate(term);
    }, 500),
    [performUpdate] // Depends only on the stable performUpdate function
  );

  // Update input value if URL changes externally
  useEffect(() => {
    setInputValue(initialSearch);
  }, [initialSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    debouncedUpdateURL(newValue); // Call the debounced function
  };

  return (
    <div className="relative flex-grow">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        type="search"
        placeholder="Search networks or companies..."
        value={inputValue}
        onChange={handleChange}
        className="pl-8 w-full"
      />
    </div>
  );
}
NetworkSearchInput.displayName = 'NetworkSearchInput';