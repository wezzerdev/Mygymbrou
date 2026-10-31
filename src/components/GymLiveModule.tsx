"use client";

import React, { useState } from "react";
import {
  Check,
  Plus,
  Minus,
  Sparkles,
  Timer,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Send,
  Zap,
  Flame,
  ShieldCheck,
  AlertOctagon,
  Search,
  ChevronDown,
  ChevronUp,
  Home,
  Dumbbell,
} from "lucide-react";
import {
  EXERCISE_CATALOG,
  WORKOUT_ROUTINES,
  WorkoutRoutineTemplate,
  ActiveWorkoutExercise,
  SubstituteOption,
  ExerciseItem,
  MECHANIC_LABELS,
  LEVEL_LABELS,
  DURATION_TRACK_CONFIGS,
  WorkoutDurationTrack,
} from "@/lib/fitness-data";
import {
  ExerciseExecutionVisual,
  ANATOMICAL_SPRITE_CATALOG,
} from "@/components/ExerciseVisualMedia";
import InfoTooltip from "@/components/InfoTooltip";
import FreeExerciseExplorerModal from "@/components/FreeExerciseExplorerModal";

interface GymLiveModuleProps {
  activeRoutineId: WorkoutRoutineTemplate["id"];
  onSelectRoutine: (routineId: WorkoutRoutineTemplate["id"]) => void;
  onStartRestTimer: (seconds: number, exerciseName: string, setNum: number) => void;
}

interface EffortOption {
  rpe: number;
  rir: number;
  alFallo: boolean;
  shortLabel: string;
  title: string;
  subtitle: string;
  bars: number;
  badgeClass: string;
  activeRingClass: string;
  barColorClass: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const EFFORT_LEVEL_OPTIONS: EffortOption[] = [
  {
    rpe: 8,
    rir: 2,
    alFallo: false,
    shortLabel: "Cómodo",
    title: "Cómodo",
    subtitle: "Salían 2 o 3 reps más",
    bars: 1,
    badgeClass:
      "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/25",
    activeRingClass: "border-emerald-500 ring-1 ring-emerald-500/25",
    barColorClass: "bg-emerald-500",
    Icon: ShieldCheck,
  },
  {
    rpe: 9,
    rir: 1,
    alFallo: false,
    shortLabel: "Ideal",
    title: "Ideal (1 guardada)",
    subtitle: "Quedaba 1 rep en reserva",
    bars: 2,
    badgeClass:
      "bg-cyan-500/10 text-cyan-800 border-cyan-500/30 dark:bg-[#22D3EE]/10 dark:text-[#22D3EE] dark:border-[#22D3EE]/30",
    activeRingClass: "border-[#22D3EE] ring-1 ring-[#22D3EE]/25",
    barColorClass: "bg-[#22D3EE]",
    Icon: Zap,
  },
  {
    rpe: 9.5,
    rir: 0,
    alFallo: false,
    shortLabel: "Exigente",
    title: "Al límite",
    subtitle: "No salía otra completa",
    bars: 3,
    badgeClass:
      "bg-amber-500/10 text-amber-800 border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30",
    activeRingClass: "border-amber-500 ring-1 ring-amber-500/25",
    barColorClass: "bg-amber-500",
    Icon: Flame,
  },
  {
    rpe: 10,
    rir: 0,
    alFallo: true,
    shortLabel: "Al fallo",
    title: "Al fallo",
    subtitle: "Esfuerzo total",
    bars: 4,
    badgeClass:
      "bg-rose-500/10 text-rose-700 border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30",
    activeRingClass: "border-rose-500 ring-1 ring-rose-500/25",
    barColorClass: "bg-rose-500",
    Icon: AlertOctagon,
  },
];

function getEffortMeta(rpe: number): EffortOption {
  if (rpe <= 8) return EFFORT_LEVEL_OPTIONS[0];
  if (rpe <= 9) return EFFORT_LEVEL_OPTIONS[1];
  if (rpe < 10) return EFFORT_LEVEL_OPTIONS[2];
  return EFFORT_LEVEL_OPTIONS[3];
}

function buildWorkoutFromRoutine(
  routineId: WorkoutRoutineTemplate["id"],
  track: WorkoutDurationTrack = "standard"
): ActiveWorkoutExercise[] {
  const routine =
    WORKOUT_ROUTINES.find((r) => r.id === routineId) || WORKOUT_ROUTINES[0];

  const targetExerciseIds =
    track === "extended" && routine.extendedExerciseIds
      ? [...routine.exerciseIds, ...routine.extendedExerciseIds]
      : routine.exerciseIds;

  const setsCount = track === "express" ? 2 : track === "extended" ? 4 : 3;

  return targetExerciseIds.map((exId, idx) => {
    const cat =
      EXERCISE_CATALOG.find((e) => e.id === exId) || EXERCISE_CATALOG[0];
    const baseW = cat.pesoAnteriorKg;
    const baseR = cat.repsAnteriores;

    const sets = Array.from({ length: setsCount }, (_, sIdx) => {
      const setNum = sIdx + 1;
      const isFirst = setNum === 1;
      const isWarmupOrFirst = isFirst;
      return {
        setNum,
        pesoAnterior: `${baseW} kg × ${baseR}`,
        pesoKg: isFirst ? baseW : baseW > 0 ? baseW + (setNum > 2 ? 5 : 2.5) : 0,
        reps: isFirst ? baseR + 1 : baseR,
        rir: isFirst ? 2 : setNum === 2 ? 1 : 0,
        rpe: isFirst ? 8 : setNum === 2 ? 9 : 9.5,
        alFallo: false,
        completado: isWarmupOrFirst && idx === 0,
      };
    });

    return {
      exerciseId: cat.id,
      orden: idx + 1,
      sets,
    };
  });
}

export default function GymLiveModule({
  activeRoutineId,
  onSelectRoutine,
  onStartRestTimer,
}: GymLiveModuleProps) {
  // Nivel y Duración de la sesión (Express 45m / Estándar 65m / Pro 90m)
  const [durationTrack, setDurationTrack] = useState<WorkoutDurationTrack>("standard");

  const [workoutsByRoutine, setWorkoutsByRoutine] = useState<
    Record<WorkoutRoutineTemplate["id"], ActiveWorkoutExercise[]>
  >(() => ({
    push: buildWorkoutFromRoutine("push", "standard"),
    pull: buildWorkoutFromRoutine("pull", "standard"),
    legs: buildWorkoutFromRoutine("legs", "standard"),
    upper_arms: buildWorkoutFromRoutine("upper_arms", "standard"),
    active_recovery: buildWorkoutFromRoutine("active_recovery", "standard"),
  }));

  const handleSelectDurationTrack = (newTrack: WorkoutDurationTrack) => {
    setDurationTrack(newTrack);
    setWorkoutsByRoutine((prev) => ({
      ...prev,
      [activeRoutineId]: buildWorkoutFromRoutine(activeRoutineId, newTrack),
    }));
    setSelectedExIndex(0);
    setOpenEffortSetIdx(null);
  };

  const [selectedExIndex, setSelectedExIndex] = useState<number>(0);
  const [restSeconds, setRestSeconds] = useState<number>(90);
  const [showRoutineSwitcher, setShowRoutineSwitcher] = useState<boolean>(false);
  const [showExerciseExplorer, setShowExerciseExplorer] = useState<boolean>(false);
  // Cerrado por defecto para que la pantalla sea limpia y minimalista sin paredes de texto
  const [showStepByStepGuide, setShowStepByStepGuide] = useState<boolean>(false);

  // Modo sin fricción: ¿Entrenas hoy en el Gimnasio o En Casa?
  const [trainingPlace, setTrainingPlace] = useState<"GYM" | "HOME">("GYM");

  // Controla qué serie tiene abierto el selector interactivo de esfuerzo
  const [openEffortSetIdx, setOpenEffortSetIdx] = useState<number | null>(null);

  // Guarda qué variante eligió el usuario en cada ejercicio
  const [selectedMachineByEx, setSelectedMachineByEx] = useState<
    Record<string, SubstituteOption>
  >({});

  // Consulta opcional al Coach IA
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  const currentRoutine =
    WORKOUT_ROUTINES.find((r) => r.id === activeRoutineId) ||
    WORKOUT_ROUTINES[0];

  const workoutExercises = workoutsByRoutine[activeRoutineId] || [];
  const safeExIndex = Math.min(
    selectedExIndex,
    Math.max(0, workoutExercises.length - 1)
  );
  const activeWorkoutEx = workoutExercises[safeExIndex] || workoutExercises[0];

  const currentCatalogEx =
    EXERCISE_CATALOG.find((e) => e.id === activeWorkoutEx.exerciseId) ||
    EXERCISE_CATALOG[0];

  const selectionKey = `${activeRoutineId}-${safeExIndex}`;
  const homeSubForCurrent = currentCatalogEx.sustitutos.find((s) => s.esEnCasa);
  const activeSub =
    selectedMachineByEx[selectionKey] ||
    (trainingPlace === "HOME" && homeSubForCurrent
      ? homeSubForCurrent
      : undefined);

  const activeVisualId = activeSub ? activeSub.id : currentCatalogEx.id;
  const displayedExerciseName = activeSub
    ? activeSub.nombre
    : currentCatalogEx.nombre;
  const displayedEquipment = activeSub
    ? activeSub.equipo
    : currentCatalogEx.equipoNecesario;
  const displayedHowTo = activeSub
    ? activeSub.comoHacerlo
    : currentCatalogEx.tipsEjecucion;
  const displayedSteps =
    activeSub?.instructionsStepByStep &&
    activeSub.instructionsStepByStep.length > 0
      ? activeSub.instructionsStepByStep
      : currentCatalogEx.instructionsStepByStep;

  const totalSets = workoutExercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = workoutExercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completado).length,
    0
  );
  const progressPct = Math.round((completedSets / Math.max(1, totalSets)) * 100);
  const allCurrentExSetsCompleted = activeWorkoutEx.sets.every(
    (s) => s.completado
  );

  const handleTogglePlaceMode = (mode: "GYM" | "HOME") => {
    setTrainingPlace(mode);
    if (mode === "GYM") {
      // Limpia las selecciones automáticas de casa para volver a las máquinas principales
      setSelectedMachineByEx({});
    }
  };

  const handleSwitchRoutine = (newId: WorkoutRoutineTemplate["id"]) => {
    onSelectRoutine(newId);
    if (!workoutsByRoutine[newId] || workoutsByRoutine[newId].length === 0) {
      setWorkoutsByRoutine((prev) => ({
        ...prev,
        [newId]: buildWorkoutFromRoutine(newId, durationTrack),
      }));
    }
    setSelectedExIndex(0);
    setShowRoutineSwitcher(false);
    setOpenEffortSetIdx(null);
    setAiResponse(null);
  };

  const buildSetsForExercise = (ex: ExerciseItem) => {
    const baseW = ex.pesoAnteriorKg;
    const baseR = ex.repsAnteriores;
    return [
      {
        setNum: 1,
        pesoAnterior: `${baseW} kg × ${baseR}`,
        pesoKg: baseW,
        reps: baseR + 1,
        rir: 2,
        rpe: 8,
        alFallo: false,
        completado: false,
      },
      {
        setNum: 2,
        pesoAnterior: `${baseW} kg × ${baseR}`,
        pesoKg: baseW > 0 ? baseW + 2.5 : 0,
        reps: baseR,
        rir: 1,
        rpe: 9,
        alFallo: false,
        completado: false,
      },
      {
        setNum: 3,
        pesoAnterior: `${baseW} kg × ${Math.max(6, baseR - 1)}`,
        pesoKg: baseW > 0 ? baseW + 2.5 : 0,
        reps: baseR,
        rir: 0,
        rpe: 9.5,
        alFallo: false,
        completado: false,
      },
    ];
  };

  const handleAddExerciseFromExplorer = (newEx: ExerciseItem) => {
    const nextIdx = workoutExercises.length;
    setWorkoutsByRoutine((prev) => ({
      ...prev,
      [activeRoutineId]: [
        ...prev[activeRoutineId],
        {
          exerciseId: newEx.id,
          orden: nextIdx + 1,
          sets: buildSetsForExercise(newEx),
        },
      ],
    }));
    setSelectedExIndex(nextIdx);
    setOpenEffortSetIdx(null);
    setAiResponse(null);
  };

  const handleReplaceCurrentExercise = (newEx: ExerciseItem) => {
    setSelectedMachineByEx((prev) => {
      const copy = { ...prev };
      delete copy[selectionKey];
      return copy;
    });
    setWorkoutsByRoutine((prev) => ({
      ...prev,
      [activeRoutineId]: prev[activeRoutineId].map((item, idx) =>
        idx === safeExIndex
          ? {
              ...item,
              exerciseId: newEx.id,
              sets: buildSetsForExercise(newEx),
            }
          : item
      ),
    }));
    setOpenEffortSetIdx(null);
    setAiResponse(null);
  };

  const handleUpdateSet = (
    setIdx: number,
    field: "pesoKg" | "reps" | "rpe",
    value: number
  ) => {
    const cleanVal = Math.max(0, Number(value.toFixed(1)));
    setWorkoutsByRoutine((prev) => ({
      ...prev,
      [activeRoutineId]: prev[activeRoutineId].map((item, idx) => {
        if (idx !== safeExIndex) return item;
        return {
          ...item,
          sets: item.sets.map((s, sIndex) =>
            sIndex === setIdx ? { ...s, [field]: cleanVal } : s
          ),
        };
      }),
    }));
  };

  const handleCopyPreviousMark = (setIdx: number, prevStr: string) => {
    const match = prevStr.match(/([\d.]+)\s*kg\s*×\s*(\d+)/i);
    if (!match) return;
    const w = parseFloat(match[1]) || 0;
    const r = parseInt(match[2], 10) || 10;
    setWorkoutsByRoutine((prev) => ({
      ...prev,
      [activeRoutineId]: prev[activeRoutineId].map((item, idx) => {
        if (idx !== safeExIndex) return item;
        return {
          ...item,
          sets: item.sets.map((s, sIndex) =>
            sIndex === setIdx ? { ...s, pesoKg: w, reps: r } : s
          ),
        };
      }),
    }));
  };

  const handleSelectEffortOption = (setIdx: number, opt: EffortOption) => {
    setWorkoutsByRoutine((prev) => ({
      ...prev,
      [activeRoutineId]: prev[activeRoutineId].map((item, idx) => {
        if (idx !== safeExIndex) return item;
        return {
          ...item,
          sets: item.sets.map((s, sIndex) =>
            sIndex === setIdx
              ? {
                  ...s,
                  rpe: opt.rpe,
                  rir: opt.rir,
                  alFallo: opt.alFallo,
                }
              : s
          ),
        };
      }),
    }));
    setOpenEffortSetIdx(null);
  };

  const handleToggleCompleteSet = (setIdx: number) => {
    const targetSet = activeWorkoutEx.sets[setIdx];
    const willComplete = !targetSet.completado;

    setWorkoutsByRoutine((prev) => ({
      ...prev,
      [activeRoutineId]: prev[activeRoutineId].map((item, idx) => {
        if (idx !== safeExIndex) return item;
        return {
          ...item,
          sets: item.sets.map((s, sIndex) =>
            sIndex === setIdx ? { ...s, completado: willComplete } : s
          ),
        };
      }),
    }));

    if (willComplete) {
      onStartRestTimer(restSeconds, displayedExerciseName, targetSet.setNum);
    }
  };

  const handleAddSet = () => {
    const lastSet = activeWorkoutEx.sets[activeWorkoutEx.sets.length - 1];
    setWorkoutsByRoutine((prev) => ({
      ...prev,
      [activeRoutineId]: prev[activeRoutineId].map((item, idx) => {
        if (idx !== safeExIndex) return item;
        return {
          ...item,
          sets: [
            ...item.sets,
            {
              setNum: item.sets.length + 1,
              pesoAnterior: lastSet
                ? `${lastSet.pesoKg} kg × ${lastSet.reps}`
                : `${currentCatalogEx.pesoAnteriorKg} kg × ${currentCatalogEx.repsAnteriores}`,
              pesoKg: lastSet ? lastSet.pesoKg : currentCatalogEx.pesoAnteriorKg,
              reps: lastSet ? lastSet.reps : currentCatalogEx.repsAnteriores,
              rir: 1,
              rpe: 9,
              alFallo: false,
              completado: false,
            },
          ],
        };
      }),
    }));
  };

  const handleAskCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId: currentCatalogEx.id,
          query: aiPrompt,
        }),
      });
      const data = await res.json();
      setAiResponse(data.respuesta);
    } catch {
      setAiResponse(
        `Prueba cambiar a ${currentCatalogEx.sustitutos[0].nombre} para cuidar tus articulaciones manteniendo el estímulo.`
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* 1. Cabecera Minimalista con Selector "Gimnasio / En Casa" de 1 Toque */}
      <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#121214] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              {/* Selector sin fricción: Gimnasio vs En Casa */}
              <div className="inline-flex items-center rounded-xl bg-zinc-100 dark:bg-[#18181B] p-1 border border-zinc-200/80 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => handleTogglePlaceMode("GYM")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    trainingPlace === "GYM"
                      ? "bg-zinc-900 text-white dark:bg-[#A3E635] dark:text-[#09090B] shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  <Dumbbell className="h-3.5 w-3.5" />
                  <span>Gimnasio</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTogglePlaceMode("HOME")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    trainingPlace === "HOME"
                      ? "bg-emerald-600 text-white dark:bg-[#A3E635] dark:text-[#09090B] shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                  title="Cambia automáticamente todos los ejercicios a su alternativa para hacer en casa"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>En casa</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowRoutineSwitcher((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181B] hover:border-zinc-400 dark:hover:border-zinc-600 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-all"
              >
                <RefreshCw className="h-3.5 w-3.5 text-zinc-500" />
                <span>Cambiar rutina</span>
              </button>
            </div>

            <h2 className="pt-1 text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {currentRoutine.titulo}
            </h2>
          </div>

          <div className="text-right">
            <span className="font-mono text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              {progressPct}%
            </span>
            <p className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
              {completedSets} de {totalSets} series
            </p>
          </div>
        </div>

        {/* Panel Desplegable para Cambiar la Rutina */}
        {showRoutineSwitcher && (
          <div className="mt-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181B] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                Elige qué grupo muscular entrenar hoy:
              </span>
              <button
                type="button"
                onClick={() => setShowRoutineSwitcher(false)}
                className="text-xs font-medium text-zinc-500 hover:underline"
              >
                Cerrar
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => handleSwitchRoutine("pull")}
                className="rounded-xl bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:border-zinc-400"
              >
                Ayer hice Pecho → Hoy{" "}
                <span className="font-semibold text-emerald-700 dark:text-[#A3E635]">
                  Espalda y Bíceps
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchRoutine("legs")}
                className="rounded-xl bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:border-zinc-400"
              >
                Ayer hice Torso → Hoy{" "}
                <span className="font-semibold text-emerald-700 dark:text-[#A3E635]">
                  Piernas y Glúteos
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {WORKOUT_ROUTINES.map((routine) => {
                const isSelected = routine.id === activeRoutineId;
                const rLevel = LEVEL_LABELS[routine.level];
                return (
                  <button
                    key={routine.id}
                    type="button"
                    onClick={() => handleSwitchRoutine(routine.id)}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      isSelected
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-[#A3E635] dark:bg-[#A3E635] dark:text-[#09090B]"
                        : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-[#121214] dark:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="block text-xs font-semibold">
                        {routine.corto}
                      </span>
                      <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold border ${
                        isSelected
                          ? "bg-white/20 text-white dark:bg-black/20 dark:text-black border-transparent"
                          : rLevel.badgeClass
                      }`}>
                        {rLevel.label}
                      </span>
                    </div>
                    <span
                      className={`mt-1 block text-[11px] font-normal ${
                        isSelected
                          ? "text-zinc-300 dark:text-zinc-800"
                          : "text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {routine.subtitulo}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selector de Nivel / Duración: Express (45m) | Estándar (65m) | Pro (1.5h) */}
        <div className="mt-4 pt-3 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <Timer className="h-3.5 w-3.5 text-zinc-400" />
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Duración y Volumen:</span>
          </div>
          <div className="inline-flex items-center gap-1 rounded-xl bg-zinc-100 dark:bg-[#18181B] p-1 border border-zinc-200/80 dark:border-zinc-800">
            {(Object.keys(DURATION_TRACK_CONFIGS) as WorkoutDurationTrack[]).map((trKey) => {
              const cfg = DURATION_TRACK_CONFIGS[trKey];
              const isActive = durationTrack === trKey;
              return (
                <button
                  key={trKey}
                  type="button"
                  onClick={() => handleSelectDurationTrack(trKey)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-[#A3E635] shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                  title={cfg.description}
                >
                  <span>{cfg.label}</span>
                  <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                    ({cfg.durationLabel})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Barra de progreso sutil */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-zinc-900 dark:bg-[#A3E635] transition-all duration-500"
            style={{ width: `${Math.max(4, progressPct)}%` }}
          />
        </div>

        {/* Pasos de Ejercicios de la Rutina Actual */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
          {workoutExercises.map((wEx, idx) => {
            const cat =
              EXERCISE_CATALOG.find((e) => e.id === wEx.exerciseId) ||
              EXERCISE_CATALOG[0];
            const isCurrent = idx === safeExIndex;
            const isDone = wEx.sets.every((s) => s.completado);
            const homeSub = cat.sustitutos.find((s) => s.esEnCasa);
            const subForIdx =
              selectedMachineByEx[`${activeRoutineId}-${idx}`] ||
              (trainingPlace === "HOME" && homeSub ? homeSub : undefined);
            const label = subForIdx ? subForIdx.nombre : cat.nombre;

            return (
              <button
                key={`${wEx.exerciseId}-${idx}`}
                type="button"
                onClick={() => {
                  setSelectedExIndex(idx);
                  setOpenEffortSetIdx(null);
                  setAiResponse(null);
                }}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all shrink-0 border ${
                  isCurrent
                    ? "bg-zinc-900 text-white border-zinc-900 dark:bg-[#A3E635] dark:text-[#09090B] dark:border-[#A3E635]"
                    : isDone
                    ? "bg-emerald-50/80 text-emerald-800 border-emerald-200 dark:bg-zinc-900 dark:text-[#A3E635] dark:border-zinc-800"
                    : "bg-zinc-50 text-zinc-600 border-zinc-200/80 hover:bg-zinc-100 dark:bg-[#18181B] dark:text-zinc-300 dark:border-zinc-800"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full font-mono text-[11px] font-semibold ${
                    isCurrent
                      ? "bg-white/20 text-white dark:bg-black/15 dark:text-[#09090B]"
                      : "bg-zinc-200/80 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  {isDone ? "✓" : idx + 1}
                </span>
                <span className="max-w-[165px] truncate">{label}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setShowExerciseExplorer(true)}
            className="flex items-center gap-1.5 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#18181B] hover:border-zinc-900 dark:hover:border-[#A3E635] px-3.5 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-300 transition-all shrink-0"
            title="Explorar más ejercicios"
          >
            <Search className="h-3.5 w-3.5" />
            <span>+ Catálogo</span>
          </button>
        </div>
      </div>

      {/* 2. Tarjeta Principal del Ejercicio (Minimalista, Limpia y Bondadosa) */}
      <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#121214] p-5 sm:p-7 shadow-sm space-y-5">
        {/* Cabecera Despejada del Ejercicio */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            {/* Metadatos en una sola línea suave con Nivel de Dificultad (Principiante / Intermedio / Avanzado) */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-normal text-zinc-500 dark:text-zinc-400">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {currentCatalogEx.grupoMuscular}
              </span>
              <span>·</span>
              <span>{displayedEquipment}</span>
              <span>·</span>
              <span>
                {MECHANIC_LABELS[currentCatalogEx.mechanic]?.short || "Compuesto"}
              </span>
              <span>·</span>
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${
                  LEVEL_LABELS[currentCatalogEx.level]?.badgeClass || ""
                }`}
                title={LEVEL_LABELS[currentCatalogEx.level]?.description || ""}
              >
                Nivel: {LEVEL_LABELS[currentCatalogEx.level]?.label || "Intermedio"}
              </span>
              {activeSub?.esEnCasa && (
                <span className="ml-1 inline-flex items-center gap-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-[#A3E635] px-2 py-0.5 text-[11px] font-medium">
                  <Home className="h-3 w-3" />
                  Adaptado a casa
                </span>
              )}
            </div>

            <div className="mt-1 flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {displayedExerciseName}
              </h3>
              <InfoTooltip
                title="Consejo rápido"
                content={displayedHowTo}
                position="bottom"
              />
            </div>
          </div>

          {/* Selector de Descanso Ligero */}
          <div className="flex items-center gap-1 self-start sm:self-center rounded-xl bg-zinc-100 dark:bg-[#18181B] p-1 border border-zinc-200/80 dark:border-zinc-800">
            <Timer className="h-3.5 w-3.5 text-zinc-500 ml-2 mr-0.5" />
            {[60, 90, 120].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setRestSeconds(sec)}
                className={`rounded-lg px-2.5 py-1 font-mono text-xs font-medium transition-all ${
                  restSeconds === sec
                    ? "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-[#A3E635] shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {/* SECCIÓN VISUAL: Lienzo 100% Despejado + Opciones (Gym y En Casa) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 rounded-2xl bg-zinc-50/70 dark:bg-[#18181B]/70 border border-zinc-200/70 dark:border-zinc-800/80 p-3.5 sm:p-4">
          {/* Izquierda (6 cols): Imagen/Video sin ningún botón encimado */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-2">
            <div className="h-64 sm:h-72 w-full overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 dark:bg-[#09090b]">
              <ExerciseExecutionVisual exerciseId={activeVisualId} />
            </div>

            {(() => {
              const spriteInfo =
                ANATOMICAL_SPRITE_CATALOG[activeVisualId] ||
                ANATOMICAL_SPRITE_CATALOG["press-banca-inclinado-mancuernas"];
              return (
                <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
                  <div className="flex flex-wrap items-center gap-3 text-zinc-600 dark:text-zinc-400">
                    <span className="inline-flex items-center gap-1.5 font-medium text-zinc-800 dark:text-zinc-200">
                      <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                      {spriteInfo.primaryLabel}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-normal">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                      {spriteInfo.secondaryLabel}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowStepByStepGuide((prev) => !prev)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-[#A3E635] transition-colors"
                  >
                    <span>
                      {showStepByStepGuide
                        ? "Ocultar pasos"
                        : `Cómo hacerlo (${displayedSteps.length} pasos)`}
                    </span>
                    {showStepByStepGuide ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              );
            })()}
          </div>

          {/* Derecha (6 cols): Alternativas en el Gym + Alternativa para Entrenar en Casa */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Elige con qué equipo hacerlo hoy (o en casa):
                </span>
              </div>

              <div className="space-y-2">
                {/* 1. Ejercicio Principal de Gimnasio */}
                <div
                  onClick={() => {
                    setTrainingPlace("GYM");
                    setSelectedMachineByEx((prev) => {
                      const copy = { ...prev };
                      delete copy[selectionKey];
                      return copy;
                    });
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setTrainingPlace("GYM");
                      setSelectedMachineByEx((prev) => {
                        const copy = { ...prev };
                        delete copy[selectionKey];
                        return copy;
                      });
                    }
                  }}
                  className={`cursor-pointer rounded-xl border p-2 flex items-center gap-3 transition-all ${
                    !activeSub
                      ? "border-zinc-900 bg-white dark:border-[#A3E635] dark:bg-[#121214] shadow-sm"
                      : "border-zinc-200/80 bg-white/60 hover:bg-white dark:border-zinc-800 dark:bg-[#121214]/50"
                  }`}
                >
                  <div className="h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-950">
                    <ExerciseExecutionVisual
                      exerciseId={currentCatalogEx.id}
                      compact
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-normal text-zinc-500 dark:text-zinc-400">
                      Principal · {currentCatalogEx.equipoNecesario}
                    </span>
                    <p className="truncate text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      {currentCatalogEx.nombre}
                    </p>
                  </div>
                </div>

                {/* 2, 3 y 4: Máquinas Alternativas + Opción En Casa */}
                {currentCatalogEx.sustitutos.map((sub) => {
                  const isSubSelected = activeSub?.id === sub.id;
                  return (
                    <div
                      key={sub.id}
                      onClick={() =>
                        setSelectedMachineByEx((prev) => ({
                          ...prev,
                          [selectionKey]: sub,
                        }))
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setSelectedMachineByEx((prev) => ({
                            ...prev,
                            [selectionKey]: sub,
                          }));
                        }
                      }}
                      className={`cursor-pointer rounded-xl border p-2 flex items-center gap-3 transition-all ${
                        isSubSelected
                          ? "border-zinc-900 bg-white dark:border-[#A3E635] dark:bg-[#121214] shadow-sm"
                          : "border-zinc-200/80 bg-white/60 hover:bg-white dark:border-zinc-800 dark:bg-[#121214]/50"
                      }`}
                    >
                      <div className="h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-950">
                        <ExerciseExecutionVisual exerciseId={sub.id} compact />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {sub.esEnCasa ? (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 text-emerald-700 dark:text-[#A3E635] px-1.5 py-0.5 text-[10px] font-medium">
                              <Home className="h-2.5 w-2.5" />
                              En casa
                            </span>
                          ) : (
                            <span className="text-[11px] font-normal text-zinc-500 dark:text-zinc-400">
                              Alternativa · {sub.equipo}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-xs font-medium text-zinc-900 dark:text-zinc-100">
                          {sub.nombre}
                        </p>
                      </div>
                      <InfoTooltip
                        title={sub.nombre}
                        content={sub.comoHacerlo}
                        position="left"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Guía Paso a Paso (Oculta por defecto para mantener limpieza visual) */}
        {showStepByStepGuide && (
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#18181B]/50 p-4 space-y-2.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {displayedSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl bg-white dark:bg-[#121214] border border-zinc-200/60 dark:border-zinc-800/80 p-2.5 text-xs font-normal text-zinc-600 dark:text-zinc-300 leading-relaxed"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 font-mono text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TABLA DE SERIES SIN FRICCIÓN (Botones - / + y 1 toque para copiar marca anterior) */}
        <div>
          <div className="grid grid-cols-12 gap-2 px-3 pb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 items-center">
            <div className="col-span-2 sm:col-span-1">Serie</div>
            <div className="col-span-3 sm:col-span-2">Anterior</div>
            <div className="col-span-4 sm:col-span-3 text-center">Peso (kg)</div>
            <div className="col-span-3 sm:col-span-2 text-center">Reps</div>
            <div className="hidden sm:flex sm:col-span-2 justify-center">
              Sensación
            </div>
            <div className="hidden sm:block sm:col-span-2 text-right">Listo</div>
          </div>

          <div className="space-y-2.5">
            {activeWorkoutEx.sets.map((setItem, sIdx) => {
              const effortMeta = getEffortMeta(setItem.rpe);
              const EffortIcon = effortMeta.Icon;
              const isEffortPickerOpen = openEffortSetIdx === sIdx;

              return (
                <div
                  key={setItem.setNum}
                  className={`rounded-2xl px-3 py-2.5 transition-all border ${
                    setItem.completado
                      ? "bg-emerald-50/60 border-emerald-500/30 dark:bg-[#A3E635]/5 dark:border-[#A3E635]/30"
                      : "bg-zinc-50/60 border-zinc-200/80 dark:bg-[#18181B]/70 dark:border-zinc-800"
                  }`}
                >
                  <div className="grid grid-cols-12 items-center gap-2">
                    {/* Número de serie */}
                    <div className="col-span-2 sm:col-span-1">
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-medium ${
                          setItem.completado
                            ? "bg-zinc-900 text-white dark:bg-[#A3E635] dark:text-[#09090B]"
                            : "bg-zinc-200/80 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}
                      >
                        {setItem.setNum}
                      </span>
                    </div>

                    {/* Marca Anterior (1 toque para copiar sin escribir) */}
                    <div className="col-span-3 sm:col-span-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyPreviousMark(sIdx, setItem.pesoAnterior)
                        }
                        title="Toca para copiar el peso y repeticiones anteriores"
                        className="font-mono text-xs font-normal text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors text-left"
                      >
                        {setItem.pesoAnterior}
                      </button>
                    </div>

                    {/* Control de Peso con Botones - / + sin fricción */}
                    <div className="col-span-4 sm:col-span-3 flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateSet(sIdx, "pesoKg", setItem.pesoKg - 2.5)
                        }
                        className="flex h-8 w-7 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#121214] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        aria-label="Restar 2.5 kg"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <input
                        type="number"
                        step="0.5"
                        aria-label={`Peso en kg serie ${setItem.setNum}`}
                        value={setItem.pesoKg}
                        onChange={(e) =>
                          handleUpdateSet(
                            sIdx,
                            "pesoKg",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-14 sm:w-16 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#09090B] py-1.5 text-center font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-[#A3E635] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateSet(sIdx, "pesoKg", setItem.pesoKg + 2.5)
                        }
                        className="flex h-8 w-7 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#121214] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        aria-label="Sumar 2.5 kg"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Control de Reps con Botones - / + sin fricción */}
                    <div className="col-span-3 sm:col-span-2 flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateSet(sIdx, "reps", setItem.reps - 1)
                        }
                        className="flex h-8 w-6 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#121214] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        aria-label="Restar 1 repetición"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <input
                        type="number"
                        aria-label={`Repeticiones serie ${setItem.setNum}`}
                        value={setItem.reps}
                        onChange={(e) =>
                          handleUpdateSet(
                            sIdx,
                            "reps",
                            parseInt(e.target.value, 10) || 0
                          )
                        }
                        className="w-11 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#09090B] py-1.5 text-center font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-[#A3E635] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateSet(sIdx, "reps", setItem.reps + 1)
                        }
                        className="flex h-8 w-6 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#121214] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        aria-label="Sumar 1 repetición"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Sensación de esfuerzo (Desktop) */}
                    <div className="hidden sm:flex sm:col-span-2 justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenEffortSetIdx((prev) =>
                            prev === sIdx ? null : sIdx
                          )
                        }
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${effortMeta.badgeClass}`}
                      >
                        <EffortIcon className="h-3.5 w-3.5 shrink-0" />
                        <span>{effortMeta.shortLabel}</span>
                      </button>
                    </div>

                    {/* Botón Completar Serie (Desktop) */}
                    <div className="hidden sm:flex sm:col-span-2 justify-end">
                      <button
                        type="button"
                        onClick={() => handleToggleCompleteSet(sIdx)}
                        className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
                          setItem.completado
                            ? "bg-zinc-900 text-white dark:bg-[#A3E635] dark:text-[#09090B]"
                            : "bg-zinc-200/80 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>{setItem.completado ? "Hecho" : "Listo"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Fila inferior en móvil para Sensación + Completar */}
                  <div className="mt-2 flex sm:hidden items-center justify-between pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenEffortSetIdx((prev) =>
                          prev === sIdx ? null : sIdx
                        )
                      }
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${effortMeta.badgeClass}`}
                    >
                      <EffortIcon className="h-3 w-3" />
                      <span>{effortMeta.shortLabel}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleCompleteSet(sIdx)}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-medium transition-all ${
                        setItem.completado
                          ? "bg-zinc-900 text-white dark:bg-[#A3E635] dark:text-[#09090B]"
                          : "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>{setItem.completado ? "Hecho" : "Listo"}</span>
                    </button>
                  </div>

                  {/* Selector desplegable de Sensación */}
                  {isEffortPickerOpen && (
                    <div className="mt-2.5 pt-2.5 border-t border-zinc-200/70 dark:border-zinc-800">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {EFFORT_LEVEL_OPTIONS.map((opt) => {
                          const OptIcon = opt.Icon;
                          const isSelected =
                            effortMeta.shortLabel === opt.shortLabel;
                          return (
                            <button
                              key={opt.shortLabel}
                              type="button"
                              onClick={() => handleSelectEffortOption(sIdx, opt)}
                              className={`rounded-xl border p-2 text-left transition-all ${
                                isSelected
                                  ? `${opt.badgeClass} ${opt.activeRingClass}`
                                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121214]"
                              }`}
                            >
                              <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-900 dark:text-zinc-100">
                                <OptIcon className="h-3.5 w-3.5 shrink-0" />
                                <span>{opt.title}</span>
                              </div>
                              <p className="mt-0.5 text-[11px] font-normal text-zinc-500 dark:text-zinc-400">
                                {opt.subtitle}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Aviso bondadoso de siguiente ejercicio cuando terminas todas las series */}
          {allCurrentExSetsCompleted &&
            safeExIndex < workoutExercises.length - 1 && (
              <div className="mt-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-emerald-900 dark:text-emerald-200">
                  ¡Terminaste todas las series de este ejercicio!
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedExIndex((prev) =>
                      Math.min(workoutExercises.length - 1, prev + 1)
                    );
                    setOpenEffortSetIdx(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 text-white dark:bg-[#A3E635] dark:text-[#09090B] px-3.5 py-1.5 text-xs font-medium shrink-0"
                >
                  <span>Siguiente ejercicio</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
        </div>

        {/* Barra inferior: Añadir serie + Consulta rápida a Coach IA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-zinc-200/70 dark:border-zinc-800">
          <button
            type="button"
            onClick={handleAddSet}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181B] px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Agregar serie</span>
          </button>

          <form onSubmit={handleAskCoach} className="flex flex-1 max-w-md gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="¿Duda o molestia? Pregúntale al coach..."
              className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181B] px-3.5 py-2 text-xs font-normal text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 text-white dark:bg-[#A3E635] dark:text-[#09090B] px-3.5 py-2 text-xs font-medium shrink-0"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <Send className="h-3 w-3" />
            </button>
          </form>
        </div>

        {aiResponse && (
          <div className="rounded-2xl bg-zinc-900 text-zinc-100 dark:bg-[#18181B] border border-zinc-800 p-3.5 text-xs font-normal leading-relaxed">
            <span className="font-semibold text-[#A3E635] block mb-0.5">
              Sugerencia del Coach:
            </span>
            {aiResponse}
          </div>
        )}

        {/* Navegación Anterior / Siguiente */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            disabled={safeExIndex === 0}
            onClick={() => {
              setSelectedExIndex((prev) => Math.max(0, prev - 1));
              setOpenEffortSetIdx(null);
            }}
            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>
          <span className="text-xs font-normal text-zinc-400">
            {safeExIndex + 1} de {workoutExercises.length}
          </span>
          <button
            type="button"
            disabled={safeExIndex === workoutExercises.length - 1}
            onClick={() => {
              setSelectedExIndex((prev) =>
                Math.min(workoutExercises.length - 1, prev + 1)
              );
              setOpenEffortSetIdx(null);
            }}
            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-800 dark:text-[#A3E635] hover:underline disabled:opacity-30"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Modal Explorador de free-exercise-db */}
      <FreeExerciseExplorerModal
        open={showExerciseExplorer}
        onClose={() => setShowExerciseExplorer(false)}
        currentExerciseName={displayedExerciseName}
        onAddExerciseToRoutine={handleAddExerciseFromExplorer}
        onReplaceCurrentExercise={handleReplaceCurrentExercise}
      />
    </div>
  );
}
