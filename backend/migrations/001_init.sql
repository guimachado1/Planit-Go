-- Planit Go — schema inicial (RFC + núcleo orçamentário)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE trip_profile AS ENUM (
  'urban',
  'beach',
  'international',
  'backpacker'
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  privacy_consent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  destination VARCHAR(500) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_budget NUMERIC(14, 2) NOT NULL CHECK (total_budget > 0),
  profile trip_profile NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT trips_dates_ok CHECK (end_date >= start_date)
);

CREATE TABLE trip_budget_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips (id) ON DELETE CASCADE,
  category VARCHAR(32) NOT NULL CHECK (
    category IN (
      'transport',
      'accommodation',
      'food',
      'activities'
    )
  ),
  planned_amount NUMERIC(14, 2) NOT NULL CHECK (planned_amount >= 0),
  UNIQUE (trip_id, category)
);

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips (id) ON DELETE CASCADE,
  category VARCHAR(32) NOT NULL CHECK (
    category IN (
      'transport',
      'accommodation',
      'food',
      'activities'
    )
  ),
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  spent_at DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trips_user ON trips (user_id);
CREATE INDEX idx_expenses_trip ON expenses (trip_id);
