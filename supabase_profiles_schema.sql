-- Migración para la tabla public.profiles de Supabase
-- Ejecutar en: Supabase Dashboard -> SQL Editor -> New query -> Run

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS height_cm numeric,
ADD COLUMN IF NOT EXISTS weight_kg numeric,
ADD COLUMN IF NOT EXISTS goal text,
ADD COLUMN IF NOT EXISTS target_weight_kg numeric,
ADD COLUMN IF NOT EXISTS weekly_workouts_target integer,
ADD COLUMN IF NOT EXISTS training_location text,
ADD COLUMN IF NOT EXISTS preferred_duration_track text,
ADD COLUMN IF NOT EXISTS experience_level text,
ADD COLUMN IF NOT EXISTS training_years numeric,
ADD COLUMN IF NOT EXISTS preferred_split text,
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT true;
