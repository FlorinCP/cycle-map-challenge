import { useSyncExternalStore } from 'react';

interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

let listeners: Array<() => void> = [];
let currentWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;

const subscribe = (listener: () => void) => {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

const getSnapshot = () => currentWidth;
const getServerSnapshot = () => 1024;

if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    currentWidth = window.innerWidth;
    listeners.forEach(listener => listener());
  });
}

export function useMapZoom(): number {
  const width = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (width < 640) return 1;
  if (width < 768) return 1.2;
  if (width < 1024) return 1.5;
  if (width < 1280) return 1.8;
  return 2;
}

export function useMapState(
  longitude: number = 10,
  latitude: number = 45,
  pitch: number = 0,
  bearing: number = 0
): MapViewState {
  const zoom = useMapZoom();

  return {
    longitude,
    latitude,
    zoom,
    pitch,
    bearing,
  };
}
