export type StationSortKey = 'free_bikes' | 'empty_slots';

/**
 * Represents the possible directions for sorting.
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Represents the geographical location details for a network.
 */
export interface NetworkLocation {
  latitude: number;
  city: string;
  longitude: number;
  /** Country code, e.g., "FRA", "US" */
  country: string;
}

/**
 * Represents a single network summary in the list response.
 * Corresponds to the `/v2/networks` endpoint structure.
 */
export interface NetworkSummary {
  /** Can be a single string or an array of strings (flexible based on API response variations) */
  company: string | string[];
  /** API endpoint path for this specific network, e.g., "/v2/networks/velib" */
  href: string;
  /** Unique identifier for the network, e.g., "velib" */
  id: string;
  /** Geographic location of the network's primary area */
  location: NetworkLocation;
  /** Display name of the network */
  name: string;
}

/**
 * Represents the response structure for the `/v2/networks` endpoint.
 */
export interface NetworksListResponse {
  networks: NetworkSummary[];
}

/**
 * Represents the rental URIs often found in station extra data.
 */
export interface RentalUris {
  android: string;
  ios: string;
}

/**
 * Represents the 'extra' data associated with a station.
 * Structure can vary between networks. Defines known fields for type safety.
 * Includes an index signature for potential unknown keys specific to certain networks.
 */
export interface StationExtra {
  uid: string;
  /** Often 0 or 1 indicating if renting is enabled */
  renting: number;
  /** Often 0 or 1 indicating if returning is enabled */
  returning: number;
  /** Typically a Unix timestamp of the last update */
  last_updated: number;
  has_ebikes: boolean;
  ebikes: number;
  /** Array of payment methods, e.g., ["key", "creditcard"] */
  payment: string[];
  /** Indicates if a payment terminal is available (uses quotes for key with hyphen) */
  'payment-terminal': boolean;
  /** Total number of docks/slots at the station */
  slots: number;
  /** Optional object containing rental URIs, might not always be present */
  rental_uris?: RentalUris;
}

/**
 * Represents a single bike station within a network.
 */
export interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  /** Timestamp of the last update for this station data (ISO 8601 format) */
  timestamp: string;
  /** Number of available bikes */
  free_bikes: number;
  /** Number of empty docks/slots */
  empty_slots: number;
  /** Additional non-standard information */
  extra: StationExtra;
}

/**
 * Represents the 'extra' data associated with a roaming vehicle.
 * Includes an index signature for potential unknown keys.
 */
export interface VehicleExtra {
  uid: string;
  online: boolean;
}

/**
 * Defines the possible types for a roaming vehicle.
 */
export type VehicleKind = 'bike' | 'ebike' | 'scooter';

/**
 * Represents a single roaming vehicle (not docked at a station).
 * This field might not be present in all network responses.
 */
export interface Vehicle {
  id: string;
  latitude: number;
  longitude: number;
  /** Timestamp of the last update for this vehicle's location (ISO 8601 format) */
  timestamp: string;
  extra: VehicleExtra;
  /** Type of the vehicle */
  kind: VehicleKind;
}

/**
 * Represents the detailed information for a specific bike network.
 * Corresponds to the `/v2/networks/{network_id}` endpoint structure.
 */
export interface NetworkDetail {
  id: string;
  name: string;
  location: NetworkLocation;
  /** API endpoint path for this specific network */
  href: string;
  /** Usually an array of strings for the operating company/companies */
  company: string[];
  /** List of stations in the network */
  stations: Station[];
  /** Optional list of roaming vehicles, may be undefined if not available */
  vehicles?: Vehicle[];
}

/**
 * Represents the response structure for the `/v2/networks/{network_id}` endpoint.
 */
export interface NetworkDetailResponse {
  network: NetworkDetail;
}
