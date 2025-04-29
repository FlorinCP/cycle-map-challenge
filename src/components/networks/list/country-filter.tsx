// src/components/networks/filters/CountryFilter.tsx
'use client';

import React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
// Assuming shadcn select components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// TODO: Replace with actual country data (fetched or static)
// Format: { code: 'USA', name: 'United States' }
const MOCK_COUNTRIES = [
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'ES', name: 'Spain' },
];

export default function CountryFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentCountry = searchParams.get('country') || ''; // Empty string for "All"

  const handleCountryChange = (value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!value || value === 'ALL') {
      // Use 'ALL' or empty string for clearing filter
      current.delete('country');
    } else {
      current.set('country', value);
    }
    current.set('page', '1'); // Reset to page 1 on new filter

    const search = current.toString();
    const query = search ? `?${search}` : '';
    console.log(`Updating URL country to: ${value || 'ALL'}`);
    router.push(`${pathname}${query}`);
  };

  return (
    <Select value={currentCountry} onValueChange={handleCountryChange}>
      <SelectTrigger className="w-full md:w-[180px]">
        <SelectValue placeholder="Filter by country..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">All Countries</SelectItem>
        {MOCK_COUNTRIES.map(
          (
            country // Replace with your actual country data source
          ) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name} ({country.code})
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  );
}
CountryFilter.displayName = 'CountryFilter';
