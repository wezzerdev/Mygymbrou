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
      .single();

    if (error) {
      console.error("[PROFILE-UPSERT ERROR]", error);
      return NextResponse.json({ error: error.message, details: error }, { status: 400 });
    }

    console.log("[PROFILE-UPSERT SUCCESS]", data?.id);
    return NextResponse.json({ data, success: true });
  } catch (err: any) {
    console.error("[PROFILE-UPSERT FATAL]", err);
    return NextResponse.json(
      { error: err?.message || "Error interno guardando perfil" },
      { status: 500 }
    );
  }
}
