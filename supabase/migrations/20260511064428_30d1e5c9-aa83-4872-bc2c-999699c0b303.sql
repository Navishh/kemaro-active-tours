
-- Reference tables for trip planning
CREATE TABLE public.cities (
  id text PRIMARY KEY,
  name text NOT NULL,
  region text NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  blurb text,
  sort_order integer NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.places (
  id text PRIMARY KEY,
  name text NOT NULL,
  city_id text NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  type text NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  description text,
  hours text,
  images text[] NOT NULL DEFAULT '{}',
  highlights text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.hotels (
  id text PRIMARY KEY,
  name text NOT NULL,
  city_id text NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  stars integer NOT NULL CHECK (stars BETWEEN 1 AND 5),
  description text,
  hours text,
  dining text,
  amenities text[] NOT NULL DEFAULT '{}',
  images text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_places_city ON public.places(city_id);
CREATE INDEX idx_hotels_city ON public.hotels(city_id);

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cities are readable by everyone"
  ON public.cities FOR SELECT
  USING (true);

CREATE POLICY "Places are readable by everyone"
  ON public.places FOR SELECT
  USING (true);

CREATE POLICY "Hotels are readable by everyone"
  ON public.hotels FOR SELECT
  USING (true);
