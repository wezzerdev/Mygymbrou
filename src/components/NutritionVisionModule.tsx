"use client";

import React, { useState } from "react";
import {
  Camera,
  Check,
  Plus,
  Minus,
  Trash2,
  Upload,
  Sparkles,
  Utensils,
} from "lucide-react";
import {
  STANDARDIZED_NUTRITION_DB,
  VISION_PRESET_PLATES,
  INITIAL_MEALS_TODAY,
  DetectedIngredient,
  MealEntry,
} from "@/lib/fitness-data";

export default function NutritionVisionModule() {
  const [goalMode, setGoalMode] = useState<"DEFICIT" | "MAINTENANCE" | "SURPLUS">("DEFICIT");
  const [mealsToday, setMealsToday] = useState<MealEntry[]>(INITIAL_MEALS_TODAY);
  const [showScanner, setShowScanner] = useState<boolean>(true);

  const goalTargets = {
    DEFICIT: { label: "Déficit (-400 kcal)", kcal: 2250, protein: 190, carbs: 215, fats: 65 },
    MAINTENANCE: { label: "Mantenimiento", kcal: 2650, protein: 185, carbs: 295, fats: 78 },
    SURPLUS: { label: "Volumen (+300 kcal)", kcal: 2950, protein: 195, carbs: 355, fats: 82 },
  }[goalMode];

  const [selectedPresetId, setSelectedPresetId] = useState<string>(VISION_PRESET_PLATES[0].id);
  const [visionPlateTitle, setVisionPlateTitle] = useState<string>(VISION_PRESET_PLATES[0].titulo);
  const [mealTypeToSave, setMealTypeToSave] = useState<MealEntry["tipoComida"]>("Cena");
  const [savedToast, setSavedToast] = useState<string | null>(null);

  const [detectedItems, setDetectedItems] = useState<DetectedIngredient[]>(() =>
    VISION_PRESET_PLATES[0].ingredientes.map((ing) => {
      const f =
        STANDARDIZED_NUTRITION_DB.find((item) => item.id === ing.foodId) ||
        STANDARDIZED_NUTRITION_DB[0];
      return {
        foodId: f.id,
        nombre: f.nombre,
        gramosDetectados: ing.gramos,
        confianza: ing.confianza,
        kcalPor100g: f.kcalPor100g,
        proteinaPor100g: f.proteinaPor100g,
        carbsPor100g: f.carbsPor100g,
        grasaPor100g: f.grasaPor100g,
      };
    })
  );

  const runVisionAnalysis = async (opts: { presetId?: string; imageBase64?: string; fileName?: string }) => {
    try {
      const res = await fetch("/api/ai/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(opts),
      });
      const data = await res.json();
      if (data.items) {
        setVisionPlateTitle(data.tituloPlato);
        setDetectedItems(data.items);
      }
    } catch {
      // ignore
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      runVisionAnalysis({ imageBase64: base64, fileName: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateGrams = (idx: number, newGrams: number) => {
    const clamped = Math.max(10, Math.min(800, newGrams));
    setDetectedItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, gramosDetectados: clamped } : item))
    );
  };

  const handleRemoveItem = (idx: number) => {
    setDetectedItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const scannedTotals = detectedItems.reduce(
    (acc, item) => {
      const factor = item.gramosDetectados / 100;
      return {
        kcal: acc.kcal + Math.round(item.kcalPor100g * factor),
        proteinas: Number((acc.proteinas + item.proteinaPor100g * factor).toFixed(1)),
        carbs: Number((acc.carbs + item.carbsPor100g * factor).toFixed(1)),
        grasas: Number((acc.grasas + item.grasaPor100g * factor).toFixed(1)),
      };
    },
    { kcal: 0, proteinas: 0, carbs: 0, grasas: 0 }
  );

  const handleSaveScannedMeal = () => {
    if (detectedItems.length === 0) return;
    const now = new Date();
    const newMeal: MealEntry = {
      id: `meal-${Date.now()}`,
      hora: now.toTimeString().slice(0, 5),
      tipoComida: mealTypeToSave,
      nombrePlato: visionPlateTitle,
      items: detectedItems.map((item) => {
        const factor = item.gramosDetectados / 100;
        return {
          nombre: item.nombre,
          gramos: item.gramosDetectados,
          kcal: Math.round(item.kcalPor100g * factor),
          proteinas: Number((item.proteinaPor100g * factor).toFixed(1)),
          carbs: Number((item.carbsPor100g * factor).toFixed(1)),
          grasas: Number((item.grasaPor100g * factor).toFixed(1)),
        };
      }),
    };

    setMealsToday((prev) => [...prev, newMeal]);
    setSavedToast(`Plato guardado en ${mealTypeToSave} (+${scannedTotals.kcal} kcal)`);
    setTimeout(() => setSavedToast(null), 4000);
  };

  const dailyConsumed = mealsToday.reduce(
    (acc, meal) => {
      meal.items.forEach((it) => {
        acc.kcal += it.kcal;
        acc.proteinas = Number((acc.proteinas + it.proteinas).toFixed(1));
        acc.carbs = Number((acc.carbs + it.carbs).toFixed(1));
        acc.grasas = Number((acc.grasas + it.grasas).toFixed(1));
      });
      return acc;
    },
    { kcal: 0, proteinas: 0, carbs: 0, grasas: 0 }
  );

  const kcalRemaining = Math.max(0, goalTargets.kcal - dailyConsumed.kcal);
  const kcalPct = Math.min(100, Math.round((dailyConsumed.kcal / goalTargets.kcal) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. Tarjeta Limpia de Resumen Diario (Estilo Fitia) */}
      <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#121214] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635]/15 dark:text-[#A3E635] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider">
              Tu Nutrición de Hoy
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-zinc-950 dark:text-zinc-50">
              Resumen de Calorías y Macros
            </h2>
          </div>

          {/* Selector Simple de Objetivo */}
          <div className="flex rounded-2xl bg-zinc-100 dark:bg-[#18181B] p-1 border border-zinc-200 dark:border-zinc-800">
            {(
              [
                { id: "DEFICIT", label: "Déficit" },
                { id: "MAINTENANCE", label: "Mantener" },
                { id: "SURPLUS", label: "Volumen" },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setGoalMode(m.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition-all ${
                  goalMode === m.id
                    ? "bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635] dark:text-[#09090B]"
                    : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Barra Grande de Calorías */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="font-mono text-4xl font-black text-zinc-950 dark:text-zinc-50">
              {dailyConsumed.kcal}
            </span>
            <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
              {" "}
              / {goalTargets.kcal} kcal
            </span>
          </div>
          <span className="text-sm font-extrabold text-emerald-700 dark:text-[#A3E635]">
            Te quedan {kcalRemaining} kcal hoy
          </span>
        </div>

        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 p-0.5">
          <div
            className="h-full rounded-full bg-zinc-950 dark:bg-[#A3E635] transition-all duration-500"
            style={{ width: `${kcalPct}%` }}
          />
        </div>

        {/* 3 Columnas Limpias de Macros */}
        <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          {[
            {
              label: "Proteínas",
              val: dailyConsumed.proteinas,
              max: goalTargets.protein,
              bar: "bg-cyan-700 dark:bg-[#22D3EE]",
            },
            {
              label: "Carbohidratos",
              val: dailyConsumed.carbs,
              max: goalTargets.carbs,
              bar: "bg-emerald-600 dark:bg-[#A3E635]",
            },
            {
              label: "Grasas",
              val: dailyConsumed.grasas,
              max: goalTargets.fats,
              bar: "bg-amber-600 dark:bg-[#FBBF24]",
            },
          ].map((m) => {
            const p = Math.min(100, Math.round((m.val / m.max) * 100));
            return (
              <div key={m.label}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-zinc-600 dark:text-zinc-400">{m.label}</span>
                  <span className="font-mono font-extrabold text-zinc-950 dark:text-zinc-100">
                    {m.val} / {m.max}g
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className={`h-full rounded-full ${m.bar}`}
                    style={{ width: `${p}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {savedToast && (
        <div className="rounded-2xl bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635] dark:text-[#09090B] px-5 py-3.5 text-sm font-extrabold flex items-center gap-2 shadow-sm">
          <Check className="h-5 w-5 stroke-[3]" />
          <span>{savedToast}</span>
        </div>
      )}

      {/* 2. Escáner de Platos con IA (Limpio y Directo) */}
      <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#121214] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635] dark:text-[#09090B]">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-zinc-950 dark:text-zinc-50">
                Escáner de Comida con IA
              </h3>
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Sube una foto de tu plato y ajusta los gramos detectados
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowScanner((prev) => !prev)}
            className="text-xs font-extrabold text-zinc-600 dark:text-zinc-400 hover:underline"
          >
            {showScanner ? "Ocultar" : "Abrir escáner"}
          </button>
        </div>

        {showScanner && (
          <div className="mt-6 space-y-5">
            {/* Botón para subir foto o elegir plato de ejemplo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="cursor-pointer flex items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#18181B] hover:border-zinc-950 dark:hover:border-[#A3E635] p-4 text-xs font-extrabold text-zinc-900 dark:text-zinc-100 transition-colors">
                <Upload className="h-4 w-4 text-emerald-700 dark:text-[#A3E635]" />
                <span>Subir foto desde mi celular / PC</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="flex flex-col justify-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181B] px-4 py-2.5">
                <span className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400">
                  O probar con un plato ejemplo:
                </span>
                <select
                  aria-label="Seleccionar plato de ejemplo"
                  value={selectedPresetId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedPresetId(id);
                    runVisionAnalysis({ presetId: id });
                  }}
                  className="mt-0.5 bg-transparent text-xs font-extrabold text-zinc-950 dark:text-zinc-50 focus:outline-none"
                >
                  {VISION_PRESET_PLATES.map((p) => (
                    <option
                      key={p.id}
                      value={p.id}
                      className="bg-white text-zinc-950 dark:bg-[#121214] dark:text-zinc-50"
                    >
                      {p.titulo}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mensaje claro de la IA */}
            <div className="rounded-2xl bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 p-4 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-cyan-700 dark:text-[#22D3EE] shrink-0" />
              <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Detecté estos alimentos en tu plato. ¿Deseas ajustar las porciones en gramos?
              </p>
            </div>

            {/* Ingredientes detectados en filas limpias */}
            <div className="space-y-2.5">
              {detectedItems.map((item, idx) => {
                const factor = item.gramosDetectados / 100;
                const kcal = Math.round(item.kcalPor100g * factor);
                const prot = (item.proteinaPor100g * factor).toFixed(1);

                return (
                  <div
                    key={`${item.foodId}-${idx}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181B] px-4 py-3.5"
                  >
                    <div>
                      <h4 className="text-sm font-extrabold text-zinc-950 dark:text-zinc-50">
                        {item.nombre}
                      </h4>
                      <p className="font-mono text-xs font-bold text-zinc-600 dark:text-zinc-400">
                        <span className="text-emerald-700 dark:text-[#A3E635]">
                          {kcal} kcal
                        </span>{" "}
                        • {prot}g proteína
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Restar 10g"
                        onClick={() =>
                          handleUpdateGrams(idx, item.gramosDetectados - 10)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>

                      <div className="w-20 text-center">
                        <span className="font-mono text-sm font-extrabold text-zinc-950 dark:text-zinc-50">
                          {item.gramosDetectados} g
                        </span>
                      </div>

                      <button
                        type="button"
                        aria-label="Sumar 10g"
                        onClick={() =>
                          handleUpdateGrams(idx, item.gramosDetectados + 10)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        aria-label="Eliminar alimento"
                        onClick={() => handleRemoveItem(idx)}
                        className="ml-1 rounded-xl p-2 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pie del escáner: Total del plato + Guardar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                  Total de este plato:
                </span>
                <p className="font-mono text-lg font-extrabold text-zinc-950 dark:text-zinc-50">
                  {scannedTotals.kcal} kcal{" "}
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                    ({scannedTotals.proteinas}g P • {scannedTotals.carbs}g C •{" "}
                    {scannedTotals.grasas}g G)
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  aria-label="Horario de comida"
                  value={mealTypeToSave}
                  onChange={(e) =>
                    setMealTypeToSave(
                      e.target.value as MealEntry["tipoComida"]
                    )
                  }
                  className="rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#18181B] px-3.5 py-2.5 text-xs font-extrabold text-zinc-900 dark:text-zinc-100"
                >
                  <option value="Desayuno">Desayuno</option>
                  <option value="Almuerzo">Almuerzo</option>
                  <option value="Cena">Cena</option>
                  <option value="Snack">Snack</option>
                </select>

                <button
                  type="button"
                  onClick={handleSaveScannedMeal}
                  className="inline-flex items-center gap-2 rounded-2xl bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635] dark:text-[#09090B] px-5 py-2.5 text-xs font-extrabold hover:opacity-95"
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                  Agregar a mi día
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Lista Limpia de Comidas Registradas Hoy */}
      <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#121214] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
        <div className="flex items-center gap-2.5 mb-5">
          <Utensils className="h-5 w-5 text-emerald-700 dark:text-[#A3E635]" />
          <h3 className="text-lg font-extrabold text-zinc-950 dark:text-zinc-50">
            Comidas Registradas Hoy
          </h3>
        </div>

        <div className="space-y-3">
          {mealsToday.map((meal) => {
            const totalKcal = meal.items.reduce((a, b) => a + b.kcal, 0);
            const totalProt = meal.items
              .reduce((a, b) => a + b.proteinas, 0)
              .toFixed(0);

            return (
              <div
                key={meal.id}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181B] p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-700 dark:text-[#22D3EE]">
                    {meal.tipoComida} • {meal.hora}
                  </span>
                  <h4 className="mt-0.5 text-sm font-extrabold text-zinc-950 dark:text-zinc-50">
                    {meal.nombrePlato}
                  </h4>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    {meal.items.map((i) => `${i.nombre} (${i.gramos}g)`).join(", ")}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="block font-mono text-base font-extrabold text-zinc-950 dark:text-zinc-50">
                    {totalKcal} kcal
                  </span>
                  <span className="block font-mono text-xs font-bold text-emerald-700 dark:text-[#A3E635]">
                    {totalProt}g proteína
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
