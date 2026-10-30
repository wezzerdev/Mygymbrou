-- ==============================================================================
-- SCHEMA COMPLETO DE POSTGRESQL PARA MYGYMBROU EN SUPABASE
-- Con soporte para Auth de Supabase (auth.users), Onboarding Personalizado,
-- RLS (Row Level Security), Métricas Corporales, Nutrición y Rutinas.
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE PERFILES (Vinculada directamente con Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('hombre', 'mujer', 'otro')),
  age INT,
  height_cm NUMERIC(5,2),
  weight_kg NUMERIC(5,2),
  
  -- Metas y Objetivos
  goal TEXT CHECK (goal IN ('ganar_musculo', 'perder_grasa', 'recomposicion', 'fuerza_pura', 'salud_general')),
  target_weight_kg NUMERIC(5,2),
  weekly_workouts_target INT DEFAULT 4,
  
  -- Nivel y Experiencia
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'expert')) DEFAULT 'intermediate',
  training_years NUMERIC(4,1) DEFAULT 1.0, -- tiempo entrenando en años
  
  -- Ubicación y Equipamiento (¿Dónde y cómo entrena?)
  training_location TEXT CHECK (training_location IN ('gimnasio_comercial', 'en_casa', 'parque_calistenia', 'ambos')) DEFAULT 'gimnasio_comercial',
  available_equipment TEXT[] DEFAULT ARRAY['mancuernas', 'barra', 'maquinas', 'poleas']::TEXT[],
  preferred_split TEXT CHECK (preferred_split IN ('PPL', 'UPPER_LOWER', 'FULL_BODY', 'CUSTOM')) DEFAULT 'PPL',
  preferred_duration_track TEXT CHECK (preferred_duration_track IN ('express', 'standard', 'extended')) DEFAULT 'standard',
  
  -- Metas nutricionales calculadas
  daily_kcal_target INT DEFAULT 2350,
  protein_target_g INT DEFAULT 180,
  carbs_target_g INT DEFAULT 240,
  fat_target_g INT DEFAULT 65,
  
  -- Estado del Onboarding
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA DE MÉTRICAS CORPORALES HISTÓRICAS
CREATE TABLE IF NOT EXISTS public.body_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC(5,2) NOT NULL,
  body_fat_pct NUMERIC(4,2),
  chest_cm NUMERIC(5,2),
  arm_cm NUMERIC(5,2),
  waist_cm NUMERIC(5,2),
  thigh_cm NUMERIC(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA DE COMIDAS REGISTRADAS (Visión IA y Manual)
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  meal_type TEXT CHECK (meal_type IN ('Desayuno', 'Almuerzo', 'Pre-Entreno', 'Cena', 'Snack')) NOT NULL,
  dish_name TEXT NOT NULL,
  total_kcal INT NOT NULL,
  protein_g NUMERIC(6,2) NOT NULL,
  carbs_g NUMERIC(6,2) NOT NULL,
  fat_g NUMERIC(6,2) NOT NULL,
  photo_url TEXT,
  ai_model_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.meal_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  grams NUMERIC(6,2) NOT NULL,
  kcal INT NOT NULL,
  protein_g NUMERIC(6,2) NOT NULL,
  carbs_g NUMERIC(6,2) NOT NULL,
  fat_g NUMERIC(6,2) NOT NULL
);

-- 5. TABLA DE SESIONES DE ENTRENAMIENTO Y SERIES
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  routine_id TEXT NOT NULL, -- 'push', 'pull', 'legs', 'upper_arms', etc.
  routine_name TEXT NOT NULL,
  training_place TEXT CHECK (training_place IN ('GYM', 'HOME')) DEFAULT 'GYM',
  duration_track TEXT CHECK (duration_track IN ('express', 'standard', 'extended')) DEFAULT 'standard',
  duration_seconds INT DEFAULT 0,
  average_rpe NUMERIC(3,1),
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.workout_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  set_number INT NOT NULL,
  weight_kg NUMERIC(6,2) NOT NULL,
  reps INT NOT NULL,
  rir INT DEFAULT 1,
  rpe NUMERIC(3,1) DEFAULT 9.0,
  is_failure BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DISPARADOR AUTOMÁTICO AL REGISTRARSE UN USUARIO EN SUPABASE AUTH
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    onboarding_completed
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    FALSE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. ACTIVAR SEGURIDAD A NIVEL DE FILAS (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS RLS: Cada usuario solo puede ver y editar sus propios datos
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own metrics" ON public.body_metrics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own meals" ON public.meals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own meal items" ON public.meal_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.meals WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid())
);
CREATE POLICY "Users can manage own workouts" ON public.workouts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sets" ON public.workout_sets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.workouts WHERE workouts.id = workout_sets.workout_id AND workouts.user_id = auth.uid())
);
