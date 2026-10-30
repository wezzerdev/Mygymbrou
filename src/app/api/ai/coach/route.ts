import { NextRequest, NextResponse } from "next/server";
import { EXERCISE_CATALOG } from "@/lib/fitness-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { exerciseId, query } = body as {
      exerciseId: string;
      query: string;
    };

    const currentExercise =
      EXERCISE_CATALOG.find((e) => e.id === exerciseId) || EXERCISE_CATALOG[0];

    const ollamaUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    const textModel = process.env.OLLAMA_TEXT_MODEL || "llama3.2";

    const systemPrompt = `Eres un coach experto en biomecánica e hipertrofia. El atleta está realizando "${currentExercise.nombre}" (Grupo: ${currentExercise.grupoMuscular}, Músculos primarios: ${currentExercise.primaryMuscles.join(", ")}, Mecánica: ${currentExercise.mechanic === "compound" ? "Multiarticular Compuesto" : "Aislamiento"}, Vector: ${currentExercise.force}, Equipo: ${currentExercise.equipoNecesario}, Curva de resistencia: ${currentExercise.curvaResistencia}).
Responde en máximo 3 oraciones concisas dando un ejercicio sustituto con la misma curva de resistencia y un consejo articular práctico.`;

    // Intentamos consultar Ollama local con timeout corto (2.5s) para respuesta instantánea en el gym
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);

      const ollamaRes = await fetch(`${ollamaUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: textModel,
          prompt: `${systemPrompt}\n\nPregunta del atleta en vivo: "${query}"`,
          stream: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (ollamaRes.ok) {
        const data = await ollamaRes.json();
        return NextResponse.json({
          source: `Ollama (${textModel})`,
          online: true,
          respuesta: data.response,
          curvaOriginal: currentExercise.curvaResistencia,
          sustitutosRecomendados: currentExercise.sustitutos,
        });
      }
    } catch {
      // Fallback instantáneo biomecánico si el contenedor Ollama aún no está activo
    }

    const qLower = (query || "").toLowerCase();
    let respuestaPersonalizada = "";

    if (qLower.includes("polea") || qLower.includes("ocupad") || qLower.includes("libre")) {
      const sub = currentExercise.sustitutos[0];
      respuestaPersonalizada = `Para replicar la curva de ${currentExercise.curvaResistencia.toLowerCase()} de "${currentExercise.nombre}" sin usar esa estación, cambia a **${sub.nombre}** (${sub.equipo}). ${sub.razonBiomecanica} Mantén un RIR 1-2 y controla 3 segundos la fase excéntrica.`;
    } else if (qLower.includes("hombro") || qLower.includes("doli") || qLower.includes("molestia") || qLower.includes("articular")) {
      const sub = currentExercise.sustitutos[0];
      respuestaPersonalizada = `Detén el movimiento si hay dolor agudo. Para liberar el espacio subacromial sin perder estímulo en ${currentExercise.grupoMuscular}, pasa a **${sub.nombre}** trabajando en el plano escapular (codos a 30-45° con agarre neutro). ${sub.razonBiomecanica}`;
    } else if (qLower.includes("estanc") || qLower.includes("subir") || qLower.includes("peso")) {
      respuestaPersonalizada = `En "${currentExercise.nombre}", aplica doble progresión: si ya completaste el rango superior de repeticiones con RIR 1, incrementa +2.5 kg hoy o añade una pausa isométrica de 1.5s en el punto de máximo estiramiento.`;
    } else {
      const sub = currentExercise.sustitutos[0];
      respuestaPersonalizada = `Para "${currentExercise.nombre}" (${currentExercise.curvaResistencia}), tu mejor variante equivalente hoy es **${sub.nombre}**. ${sub.razonBiomecanica}`;
    }

    return NextResponse.json({
      source: `Motor Biomecánico Híbrido (${textModel} Ready)`,
      online: false,
      respuesta: respuestaPersonalizada,
      curvaOriginal: currentExercise.curvaResistencia,
      sustitutosRecomendados: currentExercise.sustitutos,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error procesando consulta del asistente en vivo", details: String(error) },
      { status: 500 }
    );
  }
}
