'use client';
import countries from '@/data/countries.json';
import React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import { SEARCH_PARAMS } from '@/types/search-params';

export default function CountryFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentCountry = searchParams.get(SEARCH_PARAMS.COUNTRY) || '';

  const handleCountryChange = (value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!value || value === 'ALL') {
      current.delete(SEARCH_PARAMS.COUNTRY);
    } else {
      current.set(SEARCH_PARAMS.COUNTRY, value);
    }
    current.set(SEARCH_PARAMS.PAGE, '1');

    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };

  return (
    <Select value={currentCountry} onValueChange={handleCountryChange}>
      <SelectTrigger className="rounded-full border-border py-6 px-6 flex items-center gap-2 text-primary">
        <MapPin className="h-5 w-5 text-primary" />
        <SelectValue
          placeholder="Country"
          className="text-primary placeholder:text-primary"
        />
      </SelectTrigger>
      <SelectContent className={'h-[400px] overflow-y-auto'}>
        <SelectItem value="ALL" className={'cursor-pointer'}>
          All Countries
        </SelectItem>
        {countries.data.map(country => (
          <SelectItem
            key={country.code}
            value={country.code}
            className={'cursor-pointer'}
          >
            {country.name} ({country.code})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
CountryFilter.displayName = 'CountryFilter';
