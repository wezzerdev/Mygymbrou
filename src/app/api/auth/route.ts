import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://oasfvjaukwanhlqngtir.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hc2Z2amF1a3dhbmhscW5ndGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyNjMyOTAsImV4cCI6MjEwODgzOTI5MH0.mUxPv53wkgJSXr7T-d7DRGpGF-3BxThnPTNcXgQ6ktw";

const serverSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function POST(req: NextRequest) {
  const timestamp = new Date().toISOString();
  try {
    const body = await req.json();
    const { action, email, password, fullName } = body;

    console.log(`[AUTH-DIAGNOSTIC ${timestamp}] Action: ${action} | Email: ${email}`);

    if (action === "SIGNUP") {
      const { data, error } = await serverSupabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        console.error(`[AUTH-DIAGNOSTIC-ERROR ${timestamp}] SIGNUP failed for ${email}:`, error);
        return NextResponse.json(
          {
            error: error.message,
            diagnostic: {
              status: error.status,
              code: error.code || (error as any).name,
              details: error.message,
              supabaseUrl: SUPABASE_URL,
            },
          },
          { status: 400 }
        );
      }

      console.log(`[AUTH-DIAGNOSTIC-SUCCESS ${timestamp}] User registered successfully:`, data.user?.id);
      return NextResponse.json({ data, success: true });
    }

    if (action === "LOGIN") {
      const { data, error } = await serverSupabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error(`[AUTH-DIAGNOSTIC-ERROR ${timestamp}] LOGIN failed for ${email}:`, error);
        return NextResponse.json(
          {
            error: error.message,
            diagnostic: {
              status: error.status,
              code: error.code,
              details: error.message,
              supabaseUrl: SUPABASE_URL,
            },
          },
          { status: 400 }
        );
      }

      console.log(`[AUTH-DIAGNOSTIC-SUCCESS ${timestamp}] User logged in successfully:`, data.user?.id);
      return NextResponse.json({ data, success: true });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (err: any) {
    console.error(`[AUTH-DIAGNOSTIC-FATAL ${timestamp}] Unexpected error:`, err);
    return NextResponse.json(
      {
        error: err?.message || "Error interno del servidor",
        diagnostic: {
          fatal: true,
          stack: err?.stack,
        },
      },
      { status: 500 }
    );
  }
}
