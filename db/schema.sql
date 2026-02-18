-- Run in Supabase SQL editor:
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new

CREATE TABLE work_experiences (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  company       TEXT        NOT NULL,
  role          TEXT        NOT NULL,
  date_range    TEXT,
  bullets       TEXT[]      DEFAULT '{}',
  display_order INT         DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Allow anyone to read (anon key) but only authenticated users to write
ALTER TABLE work_experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read"
  ON work_experiences FOR SELECT
  TO anon
  USING (true);

-- Seed data — replace with your real details
INSERT INTO work_experiences (company, role, date_range, bullets, display_order) VALUES
  (
    'RBC Borealis',
    'Machine Learning Software Engineering Intern',
    'May 2024 – Aug 2024',
    ARRAY['Details coming soon'],
    1
  ),
  (
    'UC Berkeley',
    'Machine Learning Research Assistant',
    'Jan 2024 – Apr 2024',
    ARRAY['Details coming soon'],
    2
  ),
  (
    'Environment and Climate Change Canada',
    'Software Engineering Intern',
    'Sep 2023 – Dec 2023',
    ARRAY['Details coming soon'],
    3
  );
