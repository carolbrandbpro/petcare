CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  plan text DEFAULT 'free',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text,
  role text DEFAULT 'tutor',
  phone text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  owner_id uuid REFERENCES users(id),
  name text NOT NULL,
  species text,
  breed text,
  sex text,
  birth_date date,
  microchip text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE vaccine_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  species text,
  default_interval_days int
);

CREATE TABLE pet_vaccines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
  vaccine_catalog_id uuid REFERENCES vaccine_catalog(id),
  applied_date date,
  next_due_date date,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
  type text,
  title text,
  description text,
  start_at timestamptz,
  recurrence jsonb,
  next_trigger timestamptz,
  notify_push boolean DEFAULT true,
  notify_email boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid REFERENCES pets(id),
  user_id uuid REFERENCES users(id),
  title text,
  description text,
  start_at timestamptz,
  end_at timestamptz,
  location text,
  status text DEFAULT 'scheduled'
);

CREATE TABLE weight_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid REFERENCES pets(id),
  weight_kg numeric,
  logged_at timestamptz DEFAULT now(),
  note text
);

CREATE TABLE user_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  push_token text,
  platform text,
  created_at timestamptz DEFAULT now()
);
