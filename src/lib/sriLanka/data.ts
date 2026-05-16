// Type definitions for Sri Lanka trip data. Actual records are loaded from
// the Lovable Cloud database via `useSriLankaData` — see ./useSriLankaData.ts.
export type LatLng = [number, number];

export type Place = {
  id: string;
  name: string;
  city: string;
  type: "historic" | "garden" | "club" | "nature" | "beach" | "temple" | "viewpoint" | "museum";
  coords: LatLng;
  description: string;
  hours: string;
  images: string[];
  highlights?: string[];
};

export type Hotel = {
  id: string;
  name: string;
  city: string;
  coords: LatLng;
  stars: 3 | 4 | 5;
  description: string;
  hours: string;
  dining: string;
  amenities: string[];
  images: string[];
};

export type City = {
  id: string;
  name: string;
  region: string;
  coords: LatLng;
  blurb: string;
};

export const SRI_LANKA_CENTER: LatLng = [7.8731, 80.7718];
