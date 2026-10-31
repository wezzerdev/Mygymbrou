"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (cachedClient) return cachedClient;

  // En Next.js cliente o runtime, leer las variables de entorno
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    (typeof window !== "undefined" ? (window as any).__NEXT_DATA__?.runtimeConfig?.NEXT_PUBLIC_SUPABASE_URL : "") ||
    "https://placeholder-project.supabase.co";

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    (typeof window !== "undefined" ? (window as any).__NEXT_DATA__?.runtimeConfig?.NEXT_PUBLIC_SUPABASE_ANON_KEY : "") ||
    "placeholder-anon-key";

  cachedClient = createClient(url, key);
  return cachedClient;
}

export const supabase = getSupabase();
