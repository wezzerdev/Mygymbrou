import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://oasfvjaukwanhlqngtir.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hc2Z2amF1a3dhbmhscW5ndGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyNjMyNjAsImV4cCI6MjEwODgzOTI2MH0.mUxPv53wkgJSXr7T-d7dRGpGF-3BxThnPTNcXgQ6ktw";

const serverSupabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Falta userId" }, { status: 400 });
    }

    const { data, error } = await serverSupabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.warn("[PROFILE-GET WARNING]", error.message);
      return NextResponse.json({ profile: null, error: error.message }, { status: 200 });
    }

    return NextResponse.json({ profile: data, success: true });
  } catch (err: any) {
    console.error("[PROFILE-GET FATAL]", err);
    return NextResponse.json(
      { error: err?.message || "Error al obtener perfil" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile } = body;

    if (!profile || !profile.id) {
      return NextResponse.json({ error: "Datos de perfil no válidos" }, { status: 400 });
    }

    console.log(`[PROFILE-UPSERT] Guardando perfil para: ${profile.id} (${profile.email})`);

    const { data, error } = await serverSupabase
      .from("profiles")
      .upsert(profile, { onConflict: "id" })
      .select()
      .maybeSingle();

    if (error) {
      console.warn("[PROFILE-UPSERT RETRYING WITH ESSENTIAL FIELDS]", error.message);
      // Reintentar con campos esenciales en caso de que alguna columna no exista en Supabase
      const essentialProfile: any = {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name || profile.fullName || "Atleta",
        onboarding_completed: true,
      };

      if (typeof profile.weight_kg === "number") essentialProfile.weight_kg = profile.weight_kg;
      if (typeof profile.height_cm === "number") essentialProfile.height_cm = profile.height_cm;
      if (profile.goal) essentialProfile.goal = profile.goal;

      const { data: retryData, error: retryError } = await serverSupabase
        .from("profiles")
        .upsert(essentialProfile, { onConflict: "id" })
        .select()
        .maybeSingle();

      if (retryError) {
        console.warn("[PROFILE-UPSERT RESILIENT FALLBACK]", retryError.message);
        return NextResponse.json({ profile, savedFallback: true, success: true }, { status: 200 });
      }

      return NextResponse.json({ data: retryData || profile, success: true });
    }

    console.log("[PROFILE-UPSERT SUCCESS]", data?.id);
    return NextResponse.json({ data: data || profile, success: true });
  } catch (err: any) {
    console.error("[PROFILE-UPSERT FATAL]", err);
    return NextResponse.json(
      { error: err?.message || "Error interno guardando perfil" },
      { status: 500 }
    );
  }
}
