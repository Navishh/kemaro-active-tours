import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { City, Hotel, Place } from "./data";

type DbCity = { id: string; name: string; region: string; lat: number; lng: number; blurb: string | null; sort_order: number };
type DbPlace = {
  id: string; name: string; city_id: string; type: string;
  lat: number; lng: number; description: string | null; hours: string | null;
  images: string[] | null; highlights: string[] | null;
};
type DbHotel = {
  id: string; name: string; city_id: string;
  lat: number; lng: number; stars: number;
  description: string | null; hours: string | null; dining: string | null;
  amenities: string[] | null; images: string[] | null;
};

export type SriLankaData = {
  cities: City[];
  places: Place[];
  hotels: Hotel[];
  loading: boolean;
  error: string | null;
};

export const useSriLankaData = (): SriLankaData => {
  const [state, setState] = useState<SriLankaData>({ cities: [], places: [], hotels: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [cRes, pRes, hRes] = await Promise.all([
        supabase.from("cities").select("*").order("sort_order", { ascending: true }),
        supabase.from("places").select("*").order("name", { ascending: true }),
        supabase.from("hotels").select("*").order("name", { ascending: true }),
      ]);
      if (cancelled) return;
      const error = cRes.error?.message || pRes.error?.message || hRes.error?.message || null;
      const cities: City[] = ((cRes.data as DbCity[] | null) ?? []).map((c) => ({
        id: c.id, name: c.name, region: c.region, coords: [c.lat, c.lng], blurb: c.blurb ?? "",
      }));
      const places: Place[] = ((pRes.data as DbPlace[] | null) ?? []).map((p) => ({
        id: p.id, name: p.name, city: p.city_id, type: p.type as Place["type"],
        coords: [p.lat, p.lng], description: p.description ?? "", hours: p.hours ?? "",
        images: p.images ?? [], highlights: p.highlights ?? [],
      }));
      const hotels: Hotel[] = ((hRes.data as DbHotel[] | null) ?? []).map((h) => ({
        id: h.id, name: h.name, city: h.city_id, coords: [h.lat, h.lng],
        stars: (h.stars as 3 | 4 | 5),
        description: h.description ?? "", hours: h.hours ?? "", dining: h.dining ?? "",
        amenities: h.amenities ?? [], images: h.images ?? [],
      }));
      setState({ cities, places, hotels, loading: false, error });
    })();
    return () => { cancelled = true; };
  }, []);

  return state;
};
