-- RF04 — Itinerário diário por viagem

CREATE TABLE itinerary_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips (id) ON DELETE CASCADE,
  day_date DATE NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  start_time TIME,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_itinerary_trip_day ON itinerary_items (trip_id, day_date, sort_order);
