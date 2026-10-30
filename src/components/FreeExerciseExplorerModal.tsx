"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  Plus,
  ArrowLeftRight,
  Layers,
  Zap,
  Dumbbell,
  ListChecks,
  Camera,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import {
  EXERCISE_CATALOG,
  ExerciseItem,
  BiomechanicForce,
  BiomechanicMechanic,
  BiomechanicLevel,
  FORCE_LABELS,
  MECHANIC_LABELS,
  LEVEL_LABELS,
} from "@/lib/fitness-data";
import {
  FREE_EXERCISE_DB_CDN_BASE,
  registerCustomExerciseVisual,
} from "@/components/ExerciseVisualMedia";

interface RawFreeExerciseDbRecord {
  id: string;
  name: string;
  force: "push" | "pull" | "static" | null;
  level: "beginner" | "intermediate" | "expert";
  mechanic: "compound" | "isolation" | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
}

interface FreeExerciseExplorerModalProps {
  open: boolean;
  onClose: () => void;
  currentExerciseName: string;
  onAddExerciseToRoutine: (exercise: ExerciseItem) => void;
  onReplaceCurrentExercise: (exercise: ExerciseItem) => void;
}

const MUSCLE_EN_TO_ES_GROUP: Record<string, ExerciseItem["grupoMuscular"]> = {
  chest: "Pecho",
  lats: "Espalda",
  "middle back": "Espalda",
  "lower back": "Espalda",
  traps: "Espalda",
  neck: "Hombros",
  shoulders: "Hombros",
  quadriceps: "Piernas",
  hamstrings: "Piernas",
  glutes: "Piernas",
  calves: "Piernas",
  abductors: "Piernas",
  adductors: "Piernas",
  biceps: "Brazos",
  triceps: "Brazos",
  forearms: "Brazos",
  abdominals: "Core",
};

const MUSCLE_EN_TO_ES_NAME: Record<string, string> = {
  chest: "Pectoral Mayor",
  lats: "Dorsal Ancho",
  "middle back": "Espalda Media y Romboides",
  "lower back": "Erectores Espinales (Espalda Baja)",
  traps: "Trapecio",
  neck: "Cuello y Trapecio Superior",
  shoulders: "Deltoides",
  quadriceps: "Cuádriceps",
  hamstrings: "Isquiosurales (Femorales)",
  glutes: "Glúteos",
  calves: "Gemelos y Sóleo",
  abductors: "Abductores de Cadera",
  adductors: "Aductores",
  biceps: "Bíceps Braquial",
  triceps: "Tríceps Braquial",
  forearms: "Antebrazos y Braquiorradial",
  abdominals: "Recto Abdominal y Core",
};

const EQUIPMENT_EN_TO_ES: Record<string, ExerciseItem["equipoNecesario"]> = {
  barbell: "Barra",
  "e-z curl bar": "Barra",
  dumbbell: "Mancuernas",
  kettlebells: "Mancuernas",
  cable: "Polea",
  bands: "Polea",
  machine: "Máquina",
  "body only": "Peso Corporal",
  "foam roll": "Peso Corporal",
  "exercise ball": "Peso Corporal",
  "medicine ball": "Peso Corporal",
  other: "Peso Corporal",
};

const SHEET_BY_GROUP: Record<
  ExerciseItem["grupoMuscular"],
  { sheetUrl: string; row: "top" | "bottom"; defaultGif: string }
> = {
  Pecho: {
    sheetUrl: "/exercises/modern_sheet_01.png",
    row: "top",
    defaultGif:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/barbell-bench-press.gif",
  },
  Espalda: {
    sheetUrl: "/exercises/modern_sheet_01.png",
    row: "top",
    defaultGif:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/cable-pulldown-pro-lat-bar.gif",
  },
  Hombros: {
    sheetUrl: "/exercises/modern_sheet_01.png",
    row: "top",
    defaultGif:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-seated-shoulder-press.gif",
  },
  Piernas: {
    sheetUrl: "/exercises/modern_sheet_01.png",
    row: "bottom",
    defaultGif:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/sled-hack-squat.gif",
  },
  Brazos: {
    sheetUrl: "/exercises/modern_sheet_01.png",
    row: "bottom",
    defaultGif:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/ez-barbell-curl.gif",
  },
  Core: {
    sheetUrl: "/exercises/modern_sheet_01.png",
    row: "bottom",
    defaultGif:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/cable-kneeling-crunch.gif",
  },
};

function convertRawFreeDbToExerciseItem(
  raw: RawFreeExerciseDbRecord
): ExerciseItem {
  const primaryEn = raw.primaryMuscles?.[0] || "chest";
  const grupoMuscular = MUSCLE_EN_TO_ES_GROUP[primaryEn] || "Pecho";
  const equipoNecesario =
    EQUIPMENT_EN_TO_ES[raw.equipment || "dumbbell"] || "Mancuernas";
  const force: BiomechanicForce =
    raw.force === "push" || raw.force === "pull" || raw.force === "static"
      ? raw.force
      : grupoMuscular === "Espalda" || grupoMuscular === "Brazos"
      ? "pull"
      : "push";
  const mechanic: BiomechanicMechanic =
    raw.mechanic === "isolation" ? "isolation" : "compound";
  const level: BiomechanicLevel =
    raw.level === "beginner" ||
    raw.level === "intermediate" ||
    raw.level === "expert"
      ? raw.level
      : "intermediate";

  const primaryMuscles =
    raw.primaryMuscles?.map((m) => MUSCLE_EN_TO_ES_NAME[m] || m) || [
      grupoMuscular,
    ];
  const secondaryMuscles =
    raw.secondaryMuscles?.map((m) => MUSCLE_EN_TO_ES_NAME[m] || m) || [];

  const instructions =
    raw.instructions && raw.instructions.length > 0
      ? raw.instructions
      : [
          `Ajusta la estación de ${equipoNecesario.toLowerCase()} y activa ${primaryMuscles[0]}.`,
          "Controla 2-3 segundos la fase excéntrica manteniendo postura firme.",
          "Ejecuta la fase concéntrica con máxima intención sin perder alineación articular.",
        ];

  return {
    id: `freedb-${raw.id.toLowerCase()}`,
    nombre: raw.name,
    grupoMuscular,
    equipoNecesario,
    curvaResistencia:
      mechanic === "compound"
        ? "Estiramiento (Longitudinal)"
        : "Acortamiento (Contracción)",
    force,
    mechanic,
    level,
    primaryMuscles,
    secondaryMuscles,
    instructionsStepByStep: instructions,
    freeExerciseDbId: raw.id,
    tipsEjecucion: instructions.slice(0, 2).join(" "),
    descansoSugerido: mechanic === "compound" ? 120 : 90,
    pesoAnteriorKg:
      equipoNecesario === "Peso Corporal"
        ? 0
        : mechanic === "compound"
        ? 50
        : 20,
    repsAnteriores: mechanic === "compound" ? 8 : 12,
    sustitutos: [
      {
        id: EXERCISE_CATALOG[0].id,
        nombre: EXERCISE_CATALOG[0].nombre,
        equipo: EXERCISE_CATALOG[0].equipoNecesario,
        razonBiomecanica:
          "Variante principal del catálogo con tensión biomecánica equivalente.",
        comoHacerlo: EXERCISE_CATALOG[0].tipsEjecucion,
        freeExerciseDbId: EXERCISE_CATALOG[0].freeExerciseDbId,
      },
    ],
  };
}

export default function FreeExerciseExplorerModal({
  open,
  onClose,
  currentExerciseName,
  onAddExerciseToRoutine,
  onReplaceCurrentExercise,
}: FreeExerciseExplorerModalProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("TODOS");
  const [selectedMechanic, setSelectedMechanic] = useState<string>("TODOS");
  const [selectedForce, setSelectedForce] = useState<string>("TODOS");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("TODOS");
  const [selectedLevel, setSelectedLevel] = useState<string>("TODOS");

  const [remoteExercises, setRemoteExercises] = useState<ExerciseItem[]>([]);
  const [loadingRemote, setLoadingRemote] = useState<boolean>(false);
  const [remoteCount, setRemoteCount] = useState<number>(0);

  const [selectedItem, setSelectedItem] = useState<ExerciseItem>(
    () => EXERCISE_CATALOG[0]
  );
  const [activePhotoStep, setActivePhotoStep] = useState<0 | 1>(0);

  // Cargar los +870 ejercicios oficiales de yuhonas/free-exercise-db al abrir el explorador
  useEffect(() => {
    if (!open || remoteExercises.length > 0) return;
    let cancelled = false;
    setLoadingRemote(true);

    fetch(
      "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/dist/exercises.json"
    )
      .then((res) => res.json())
      .then((data: RawFreeExerciseDbRecord[]) => {
        if (cancelled || !Array.isArray(data)) return;
        const existingFreeIds = new Set(
          EXERCISE_CATALOG.map((e) => e.freeExerciseDbId)
        );
        const mapped = data
          .filter((item) => item && item.id && !existingFreeIds.has(item.id))
          .map(convertRawFreeDbToExerciseItem);
        setRemoteExercises(mapped);
        setRemoteCount(data.length);
      })
      .catch(() => {
        // Fallback silencioso: sigue operando con EXERCISE_CATALOG completo
      })
      .finally(() => {
        if (!cancelled) setLoadingRemote(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, remoteExercises.length]);

  // Alternar suavemente entre foto 0.jpg y 1.jpg en la vista previa
  useEffect(() => {
    if (!open) return;
    const timer = setInterval(() => {
      setActivePhotoStep((prev) => (prev === 0 ? 1 : 0));
    }, 1400);
    return () => clearInterval(timer);
  }, [open]);

  const allExercises = useMemo(() => {
    return [...EXERCISE_CATALOG, ...remoteExercises];
  }, [remoteExercises]);

  const filteredExercises = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allExercises
      .filter((ex) => {
        if (selectedMuscle !== "TODOS" && ex.grupoMuscular !== selectedMuscle) {
          return false;
        }
        if (
          selectedMechanic !== "TODOS" &&
          ex.mechanic !== selectedMechanic
        ) {
          return false;
        }
        if (selectedForce !== "TODOS" && ex.force !== selectedForce) {
          return false;
        }
        if (selectedLevel !== "TODOS" && ex.level !== selectedLevel) {
          return false;
        }
        if (
          selectedEquipment !== "TODOS" &&
          ex.equipoNecesario !== selectedEquipment
        ) {
          return false;
        }
        if (!q) return true;
        return (
          ex.nombre.toLowerCase().includes(q) ||
          ex.grupoMuscular.toLowerCase().includes(q) ||
          ex.equipoNecesario.toLowerCase().includes(q) ||
          ex.freeExerciseDbId.toLowerCase().includes(q) ||
          ex.primaryMuscles.some((m) => m.toLowerCase().includes(q))
        );
      })
      .slice(0, 60);
  }, [
    allExercises,
    searchQuery,
    selectedMuscle,
    selectedMechanic,
    selectedForce,
    selectedEquipment,
    selectedLevel,
  ]);

  if (!open) return null;

  const ensureRegisteredAndSelect = (ex: ExerciseItem, action: "ADD" | "REPLACE") => {
    // Asegurar que esté en EXERCISE_CATALOG y en ANATOMICAL_SPRITE_CATALOG para que funcione en toda la app
    if (!EXERCISE_CATALOG.some((item) => item.id === ex.id)) {
      EXERCISE_CATALOG.push(ex);
    }
    const groupVisual =
      SHEET_BY_GROUP[ex.grupoMuscular] || SHEET_BY_GROUP.Pecho;
    registerCustomExerciseVisual(ex.id, {
      sheetUrl: groupVisual.sheetUrl,
      row: groupVisual.row,
      gifUrl: groupVisual.defaultGif,
      freeExerciseDbId: ex.freeExerciseDbId,
      badge: ex.nombre.toUpperCase(),
      primaryLabel: ex.primaryMuscles[0] || ex.grupoMuscular,
      secondaryLabel: ex.secondaryMuscles[0] || ex.equipoNecesario,
      movementCue: ex.tipsEjecucion,
    });

    if (action === "ADD") {
      onAddExerciseToRoutine(ex);
    } else {
      onReplaceCurrentExercise(ex);
    }
    onClose();
  };

  const photo0 = `${FREE_EXERCISE_DB_CDN_BASE}/${selectedItem.freeExerciseDbId}/0.jpg`;
  const photo1 = `${FREE_EXERCISE_DB_CDN_BASE}/${selectedItem.freeExerciseDbId}/1.jpg`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Explorador Biomecánico free-exercise-db"
    >
      <div className="w-full max-w-5xl rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121214] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabecera del Explorador */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 px-5 py-4 bg-zinc-50 dark:bg-[#18181B]">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950 text-[#A3E635] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                free-exercise-db Integrado
              </span>
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                {remoteCount > 0
                  ? `${remoteCount + EXERCISE_CATALOG.length} ejercicios con fotos 0.jpg / 1.jpg y biomecánica`
                  : `${EXERCISE_CATALOG.length} ejercicios curados en español`}
              </span>
            </div>
            <h3 className="mt-1 text-lg sm:text-xl font-extrabold text-zinc-950 dark:text-zinc-50">
              Explorador de Ejercicios y Fotos Paso a Paso
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#121214] text-zinc-700 dark:text-zinc-300 hover:border-zinc-950 dark:hover:border-[#A3E635]"
            aria-label="Cerrar explorador"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Barra de Filtros estilo free-exercise-db (Búsqueda + Músculo + Mecánica + Fuerza + Equipo) */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 p-4 space-y-3 bg-white dark:bg-[#121214]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
            <div className="md:col-span-4 relative">
              <Search className="h-4 w-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar ejercicio o músculo..."
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#18181B] pl-9 pr-3 py-2 text-xs font-bold text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-zinc-950 dark:focus:border-[#A3E635] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <select
                aria-label="Filtrar por grupo muscular"
                value={selectedMuscle}
                onChange={(e) => setSelectedMuscle(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#18181B] px-2.5 py-2 text-xs font-bold text-zinc-900 dark:text-zinc-100"
              >
                <option value="TODOS">Músculo: Todos</option>
                <option value="Pecho">Pecho</option>
                <option value="Espalda">Espalda</option>
                <option value="Hombros">Hombros</option>
                <option value="Piernas">Piernas y Glúteo</option>
                <option value="Brazos">Brazos (Bíceps/Tríceps)</option>
                <option value="Core">Core / Abdomen</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                aria-label="Filtrar por nivel de dificultad"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#18181B] px-2.5 py-2 text-xs font-bold text-zinc-900 dark:text-zinc-100"
              >
                <option value="TODOS">Dificultad: Todas</option>
                <option value="beginner">Principiante (Básico)</option>
                <option value="intermediate">Intermedio</option>
                <option value="expert">Avanzado / Extremo</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                aria-label="Filtrar por mecánica articular"
                value={selectedMechanic}
                onChange={(e) => setSelectedMechanic(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#18181B] px-2.5 py-2 text-xs font-bold text-zinc-900 dark:text-zinc-100"
              >
                <option value="TODOS">Mecánica: Todas</option>
                <option value="compound">Multiarticular (Compuesto)</option>
                <option value="isolation">Aislamiento (Monoarticular)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                aria-label="Filtrar por vector de fuerza"
                value={selectedForce}
                onChange={(e) => setSelectedForce(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#18181B] px-2.5 py-2 text-xs font-bold text-zinc-900 dark:text-zinc-100"
              >
                <option value="TODOS">Vector: Todos</option>
                <option value="push">Push (Empuje)</option>
                <option value="pull">Pull (Tracción)</option>
                <option value="static">Estático / Movilidad</option>
              </select>
            </div>
          </div>

          {/* Chips rápidos de Equipo */}
          <div className="flex flex-wrap items-center gap-1.5">
            {["TODOS", "Barra", "Mancuernas", "Polea", "Máquina", "Peso Corporal"].map(
              (eq) => (
                <button
                  key={eq}
                  type="button"
                  onClick={() => setSelectedEquipment(eq)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold transition-all ${
                    selectedEquipment === eq
                      ? "bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635] dark:text-[#09090B]"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-[#18181B] dark:text-zinc-300"
                  }`}
                >
                  {eq === "TODOS" ? "Todo el Equipo" : eq}
                </button>
              )
            )}
            {loadingRemote && (
              <span className="ml-auto text-[11px] font-semibold text-emerald-600 dark:text-[#A3E635] animate-pulse">
                Sincronizando catálogo completo de free-exercise-db...
              </span>
            )}
          </div>
        </div>

        {/* Cuerpo en 2 Columnas: Lista de Resultados (Izquierda) + Ficha Técnica y Fotos 0.jpg/1.jpg (Derecha) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden">
          {/* Lista de Ejercicios (5 cols) */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto p-3 space-y-2 max-h-[34vh] lg:max-h-none">
            {filteredExercises.map((ex) => {
              const isSelected = selectedItem.id === ex.id;
              const isSpanishCurated = !ex.id.startsWith("freedb-");
              const thumbUrl = `${FREE_EXERCISE_DB_CDN_BASE}/${ex.freeExerciseDbId}/0.jpg`;

              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => setSelectedItem(ex)}
                  className={`w-full rounded-2xl border p-2.5 text-left flex items-center gap-3 transition-all ${
                    isSelected
                      ? "border-2 border-zinc-950 bg-zinc-100/90 dark:border-[#A3E635] dark:bg-[#18181B]"
                      : "border-zinc-200/80 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-[#121214] dark:hover:bg-[#18181B]/60"
                  }`}
                >
                  <div className="h-14 w-16 shrink-0 overflow-hidden rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-900 relative">
                    <img
                      src={thumbUrl}
                      alt={ex.nombre}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="rounded bg-zinc-950 text-[#A3E635] px-1.5 py-0.5 text-[9px] font-black uppercase">
                        {ex.grupoMuscular}
                      </span>
                      <span className="rounded bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 text-[9px] font-bold text-zinc-700 dark:text-zinc-300">
                        {MECHANIC_LABELS[ex.mechanic].short}
                      </span>
                      <span className={`rounded border px-1.5 py-0.5 text-[9px] font-bold ${LEVEL_LABELS[ex.level].badgeClass}`}>
                        {LEVEL_LABELS[ex.level].label}
                      </span>
                      {isSpanishCurated && (
                        <span className="rounded bg-emerald-500/15 text-emerald-700 dark:text-[#A3E635] px-1.5 py-0.5 text-[9px] font-extrabold">
                          PRO ES
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-xs font-extrabold text-zinc-950 dark:text-zinc-100">
                      {ex.nombre}
                    </p>
                    <p className="truncate text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                      {ex.equipoNecesario} • {FORCE_LABELS[ex.force].short}
                    </p>
                  </div>
                </button>
              );
            })}

            {filteredExercises.length === 0 && (
              <div className="py-12 text-center text-xs font-bold text-zinc-500">
                No se encontraron ejercicios con esos filtros. Prueba otra palabra clave.
              </div>
            )}
          </div>

          {/* Ficha Biomecánica Detallada + Fotos 0.jpg y 1.jpg (7 cols) */}
          <div className="lg:col-span-7 overflow-y-auto p-5 space-y-5 bg-zinc-50/60 dark:bg-[#09090B]/60">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-lg bg-zinc-950 text-[#A3E635] px-2.5 py-1 text-[11px] font-extrabold">
                    {selectedItem.grupoMuscular}
                  </span>
                  <span
                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-extrabold ${
                      FORCE_LABELS[selectedItem.force].badgeClass
                    }`}
                  >
                    <Zap className="inline h-3 w-3 mr-1" />
                    {FORCE_LABELS[selectedItem.force].label}
                  </span>
                  <span className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#18181B] px-2.5 py-1 text-[11px] font-extrabold text-zinc-800 dark:text-zinc-200">
                    <Layers className="inline h-3 w-3 mr-1 text-[#A3E635]" />
                    {MECHANIC_LABELS[selectedItem.mechanic].label}
                  </span>
                  <span
                    className={`rounded-lg border px-2 py-1 text-[11px] font-extrabold ${
                      LEVEL_LABELS[selectedItem.level].badgeClass
                    }`}
                  >
                    Nivel: {LEVEL_LABELS[selectedItem.level].label}
                  </span>
                </div>
                <h4 className="mt-2 text-xl font-extrabold text-zinc-950 dark:text-zinc-50">
                  {selectedItem.nombre}
                </h4>
              </div>
            </div>

            {/* Fotos 0.jpg (Inicio) y 1.jpg (Contracción) de yuhonas/free-exercise-db */}
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 p-3">
              <div
                className={`relative h-44 sm:h-52 overflow-hidden rounded-xl border transition-all ${
                  activePhotoStep === 0
                    ? "border-[#A3E635] ring-2 ring-[#A3E635]/30"
                    : "border-zinc-800 opacity-90"
                }`}
              >
                <img
                  src={photo0}
                  alt={`${selectedItem.nombre} - Posición Inicial (0.jpg)`}
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-zinc-950/90 border border-zinc-700 px-2 py-1 text-[10px] font-extrabold text-white">
                  <Camera className="h-3 w-3 text-[#A3E635]" />
                  1. Posición Inicial (0.jpg)
                </span>
              </div>

              <div
                className={`relative h-44 sm:h-52 overflow-hidden rounded-xl border transition-all ${
                  activePhotoStep === 1
                    ? "border-[#A3E635] ring-2 ring-[#A3E635]/30"
                    : "border-zinc-800 opacity-90"
                }`}
              >
                <img
                  src={photo1}
                  alt={`${selectedItem.nombre} - Contracción Final (1.jpg)`}
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-zinc-950/90 border border-[#A3E635]/50 px-2 py-1 text-[10px] font-extrabold text-[#A3E635]">
                  <CheckCircle2 className="h-3 w-3" />
                  2. Contracción Final (1.jpg)
                </span>
              </div>
            </div>

            {/* Músculos Primarios y Secundarios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121214] p-3.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                  Músculos Primarios (Target)
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {selectedItem.primaryMuscles.map((m) => (
                    <span
                      key={m}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 border border-red-500/30 px-2.5 py-1 text-xs font-extrabold text-red-700 dark:text-red-300"
                    >
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121214] p-3.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                  Sinergistas / Secundarios
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {selectedItem.secondaryMuscles.length > 0 ? (
                    selectedItem.secondaryMuscles.map((m) => (
                      <span
                        key={m}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-800 dark:text-amber-300"
                      >
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        {m}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs font-semibold text-zinc-500">
                      Aislamiento directo sin sinergistas mayores
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Instrucciones Paso a Paso */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121214] p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  <ListChecks className="h-4 w-4 text-emerald-600 dark:text-[#A3E635]" />
                  Ejecución Técnica Paso a Paso
                </span>
                <span className="text-[11px] font-bold text-zinc-500">
                  <Dumbbell className="inline h-3.5 w-3.5 mr-1" />
                  {selectedItem.equipoNecesario} • Descanso {selectedItem.descansoSugerido}s
                </span>
              </div>
              <ol className="space-y-2">
                {selectedItem.instructionsStepByStep.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-[#A3E635] font-mono text-[10px] font-black mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Botones de Acción para inyectar a la sesión en vivo */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => ensureRegisteredAndSelect(selectedItem, "ADD")}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635] dark:text-[#09090B] px-4 py-3 text-xs font-extrabold shadow-md hover:opacity-95 transition-opacity"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>Agregar a mi rutina de hoy</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  ensureRegisteredAndSelect(selectedItem, "REPLACE")
                }
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-zinc-950 dark:border-[#A3E635] bg-white dark:bg-[#121214] px-4 py-3 text-xs font-extrabold text-zinc-950 dark:text-[#A3E635] hover:bg-zinc-100 dark:hover:bg-[#18181B] transition-colors"
              >
                <ArrowLeftRight className="h-4 w-4" />
                <span className="truncate">
                  Reemplazar &ldquo;{currentExerciseName}&rdquo;
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
