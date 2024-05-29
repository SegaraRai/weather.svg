// generated with https://transform.tools/json-to-typescript

export interface ReverseGeocoding {
  latitude: number;
  lookupSource: string;
  longitude: number;
  localityLanguageRequested: string;
  continent?: string;
  continentCode: string;
  /** @example "Japan" */
  countryName?: string;
  countryCode: string;
  /** @example "Tokyo" */
  principalSubdivision?: string;
  principalSubdivisionCode?: string;
  /** @example "Chiyoda" */
  city: string;
  locality: string;
  postcode: string;
  plusCode: string;
  localityInfo: LocalityInfo;
}

export interface LocalityInfo {
  administrative: Administrative[];
  informative: Informative[];
}

export interface Administrative {
  name: string;
  description: string;
  isoName?: string;
  order: number;
  adminLevel: number;
  isoCode?: string;
  wikidataId: string;
  geonameId?: number;
}

export interface Informative {
  name: string;
  description: string;
  isoName?: string;
  order: number;
  isoCode?: string;
  wikidataId?: string;
  geonameId?: number;
}
