'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

  const updateURL = useCallback(
    debounce((term: string) => {
      const current = new URLSearchParams(Array.from(searchParams.entries())); // Create mutable copy

      if (!term.trim()) {
        current.delete('search'); // Remove param if search is empty
      } else {
        current.set('search', term); // Set the search param
      }
      current.set('page', '1'); // Reset to page 1 on new search

      const search = current.toString();
      const query = search ? `?${search}` : '';
      console.log(`Updating URL search to: ${term}`);
      router.push(`${pathname}${query}`); // Update URL
    }, 500), // Adjust debounce time (e.g., 500ms)
    [pathname, router, searchParams] // Dependencies for useCallback
  );

  // Update input value if URL changes externally
  useEffect(() => {
    setInputValue(initialSearch);
  }, [initialSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    updateURL(newValue);
  };

  return (
    <div className="relative flex-grow">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        type="search"
        placeholder="Search networks or companies..."
        value={inputValue}
        onChange={handleChange}
        className="pl-8 w-full" // Add padding for icon
      />
    </div>
  );
}
NetworkSearchInput.displayName = 'NetworkSearchInput';
