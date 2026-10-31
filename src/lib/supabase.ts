"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Credenciales fijas de Supabase de producción
export const SUPABASE_URL = "https://oasfvjaukwanhlqngtir.supabase.co";

export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hc2Z2amF1a3dhbmhscW5ndGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyNjMyOTAsImV4cCI6MjEwODgzOTI5MH0.mUxPv53wkgJSXr7T-d7DRGpGF-3BxThnPTNcXgQ6ktw";

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
