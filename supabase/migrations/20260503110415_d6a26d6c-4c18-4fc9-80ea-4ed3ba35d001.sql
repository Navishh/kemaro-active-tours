
DROP POLICY IF EXISTS "Anyone can submit a proposal" ON public.trip_proposals;

CREATE POLICY "Public can submit valid proposals"
  ON public.trip_proposals
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    consent = true
    AND length(trim(full_name)) BETWEEN 2 AND 100
    AND length(trim(email)) BETWEEN 5 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(trim(destination)) BETWEEN 2 AND 80
    AND adults BETWEEN 1 AND 20
    AND children BETWEEN 0 AND 15
    AND end_date >= start_date
    AND start_date >= CURRENT_DATE
    AND status = 'draft'
  );
