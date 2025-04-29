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
import { Globe } from 'lucide-react';

export default function CountryFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentCountry = searchParams.get('country') || '';

  const handleCountryChange = (value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!value || value === 'ALL') {
      current.delete('country');
    } else {
      current.set('country', value);
    }
    current.set('page', '1');

    const search = current.toString();
    const query = search ? `?${search}` : '';
    console.log(`Updating URL country to: ${value || 'ALL'}`);
    router.push(`${pathname}${query}`);
  };

  return (
    <Select value={currentCountry} onValueChange={handleCountryChange}>
      <SelectTrigger className="rounded-full border-[#e2eafd] py-6 px-6 flex items-center gap-2 text-[#363698]">
        <Globe className="h-5 w-5 text-[#363698]" />
        <SelectValue placeholder="Country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">All Countries</SelectItem>
        {countries.data.map(country => (
          <SelectItem key={country.code} value={country.code}>
            {country.name} ({country.code})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
CountryFilter.displayName = 'CountryFilter';
