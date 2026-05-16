
CREATE TABLE public.trip_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'draft',
  category TEXT NOT NULL,
  interests TEXT[] NOT NULL DEFAULT '{}',
  destination TEXT NOT NULL,
  region TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  flexible BOOLEAN NOT NULL DEFAULT false,
  adults INTEGER NOT NULL,
  children INTEGER NOT NULL DEFAULT 0,
  pace TEXT NOT NULL,
  accommodation TEXT NOT NULL,
  budget TEXT NOT NULL,
  notes TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  consent BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.trip_proposals ENABLE ROW LEVEL SECURITY;

-- No SELECT/UPDATE/DELETE policies => only service role (backend) can read/modify.
-- Public can only INSERT (submissions from the trip builder).
CREATE POLICY "Anyone can submit a proposal"
  ON public.trip_proposals
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX idx_trip_proposals_created_at ON public.trip_proposals (created_at DESC);
CREATE INDEX idx_trip_proposals_email ON public.trip_proposals (email);
