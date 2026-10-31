import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://oasfvjaukwanhlqngtir.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hc2Z2amF1a3dhbmhscW5ndGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyNjMyOTAsImV4cCI6MjEwODgzOTI5MH0.mUxPv53wkgJSXr7T-d7DRGpGF-3BxThnPTNcXgQ6ktw";

const serverSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, fullName } = body;

    console.log(`[AUTH API] Action: ${action}, Email: ${email}`);

    if (action === "SIGNUP") {
      const { data, error } = await serverSupabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        console.error("[AUTH API SIGNUP ERROR]", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ data });
    }

    if (action === "LOGIN") {
      const { data, error } = await serverSupabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("[AUTH API LOGIN ERROR]", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ data });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("[AUTH API EXCEPTION]", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
