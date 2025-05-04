export enum SEARCH_PARAMS {
  COUNTRY = 'country',
  SEARCH = 'search',
  PAGE = 'page',
  LAT = 'lat',
  LNG = 'lng',
}

export type StationSortKey = 'free_bikes' | 'empty_slots';

export type SortDirection = 'asc' | 'desc';

// They are identical for now just to show how it can be done
export const NETWORK_ITEMS_PER_PAGE = 15;
export const STATION_ITEMS_PER_PAGE = 15;
