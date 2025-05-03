'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LocateIcon, Loader2, Globe, ArrowLeft } from 'lucide-react';
import { SEARCH_PARAMS } from '@/types/search-params';

export const NearMeButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLat = searchParams.get(SEARCH_PARAMS.LAT) || '';
  const currentLng = searchParams.get(SEARCH_PARAMS.LNG) || '';

  const handleLocationClick = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    if (isLocationSet) {
      handleGlobeClick();
      return;
    }

    setIsLoading(true);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
        }
      );

      const { latitude, longitude } = position.coords;

      const params = new URLSearchParams(searchParams);
      params.set(SEARCH_PARAMS.LAT, latitude.toString());
      params.set(SEARCH_PARAMS.LNG, longitude.toString());

      router.push(`${pathname}?${params.toString()}`);
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGlobeClick = () => {
    const params = new URLSearchParams(searchParams);
    params.delete(SEARCH_PARAMS.LAT);
    params.delete(SEARCH_PARAMS.LNG);

    router.push(`${pathname}?${params.toString()}`);
  };

  const isLocationSet = currentLat && currentLng;

  return (
    <Button
      onClick={handleLocationClick}
      disabled={isLoading}
      className="gap-2 items-center px-4! py-2 rounded-full leading-6 h-10"
    >
      {isLocationSet && (
        <>
          <ArrowLeft />
          <p className="font-bold">Go back</p>
        </>
      )}
      {!isLocationSet && isLoading && (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="font-bold">Near me</p>
        </>
      )}
      {!isLocationSet && !isLoading && (
        <>
          <LocateIcon className="h-4 w-4" />
          <p className="font-bold">Near me</p>
        </>
      )}
    </Button>
  );
};
