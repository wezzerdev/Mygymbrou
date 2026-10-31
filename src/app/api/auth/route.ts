import { NextRequest, NextResponse } from "next/server";

// Clave codificada en Base64 para que Docker / Dokploy / Webpack no puedan alterarla ni una sola letra
const B64_KEY =
  "ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW05aGMyWjJhbUYxYTNkaGJtaHNjVzVuZEdseUlpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzT1RNeU5qTXlOakFzSW1WNGNDSTZNakV3T0Rnek9USTJNSDAubVV4UHY1M3drZ0pTWHI3VC1kN2RSR3BHRi0zQnhUaG5QVE5jWGdRNmt0dw==";

const SUPABASE_KEY = Buffer.from(B64_KEY, "base64").toString("utf-8");
const SUPABASE_URL = "https://oasfvjaukwanhlqngtir.supabase.co";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, fullName } = body;

    console.log(`[AUTH-DIRECT] Action: ${action} | Email: ${email}`);

    const endpoint =
      action === "SIGNUP"
        ? `${SUPABASE_URL}/auth/v1/signup`
        : `${SUPABASE_URL}/auth/v1/token?grant_type=password`;

    const payload =
      action === "SIGNUP"
        ? {
            email,
            password,
            data: { full_name: fullName },
          }
        : {
            email,
            password,
          };

    // Llamada HTTP directa nativa con fetch de Node (sin SDK ni intermediarios)
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[AUTH-DIRECT ERROR]", response.status, data);
      return NextResponse.json(
        {
          error: data.msg || data.message || data.error_description || "Error de autenticación",
          diagnostic: {
            status: response.status,
            raw: data,
          },
        },
        { status: response.status }
      );
    }

    console.log("[AUTH-DIRECT SUCCESS]", data.user?.id || data.id);
    return NextResponse.json({
      data: {
        user: data.user || data,
        session: data.access_token
          ? {
              access_token: data.access_token,
              refresh_token: data.refresh_token,
              user: data.user,
            }
          : undefined,
      },
      success: true,
    });
  } catch (err: any) {
    console.error("[AUTH-DIRECT FATAL]", err);
    return NextResponse.json(
      {
        error: err?.message || "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
