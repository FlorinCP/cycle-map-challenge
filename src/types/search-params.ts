export enum SEARCH_PARAMS {
  COUNTRY = 'country',
  SEARCH = 'search',
  PAGE = 'page',
  LAT = 'lat',
  LNG = 'lng',
  SORT_KEY = 'sort_key',
  SORT_DIRECTION = 'sort_direction',
}

export type StationSortKey = 'free_bikes' | 'empty_slots';

export type SortDirection = 'asc' | 'desc';

// They are identical for now jsut to show how it can be done
export const NETWORK_ITEMS_PER_PAGE = 15;
export const STATION_ITEMS_PER_PAGE = 15;
