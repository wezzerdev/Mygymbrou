"use client";

import React, { useState, useMemo } from "react";
import {
  Check,
  HeartPulse,
  RotateCcw,
  Clock,
  AlertTriangle,
  Play,
  Calendar as CalendarIcon,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Flame,
  Trophy,
} from "lucide-react";
import {
  INITIAL_WEEK_SCHEDULE,
  CalendarDayPlan,
  WorkoutRoutineTemplate,
} from "@/lib/fitness-data";
import InfoTooltip from "@/components/InfoTooltip";
import AdBanner from "@/components/AdBanner";
import SectionGuideCard from "@/components/SectionGuideCard";

interface CalendarSplitModuleProps {
  onLaunchRoutineInGym?: (routineId: WorkoutRoutineTemplate["id"]) => void;
}

interface DayRoutineOption {
  label: string;
  shortTag: string;
  routineId?: WorkoutRoutineTemplate["id"];
  tipo: CalendarDayPlan["tipo"];
  cargaNivel: CalendarDayPlan["cargaNivel"];
  musculos: string[];
  duracionMin: number;
  pillColor: string;
  dotColor: string;
}

const DAY_ROUTINE_OPTIONS: DayRoutineOption[] = [
  {
    label: "Empuje — Pecho, Hombros y Tríceps",
    shortTag: "Empuje",
    routineId: "push",
    tipo: "PUSH",
    cargaNivel: "Alta",
    musculos: ["Pecho", "Hombros", "Tríceps"],
    duracionMin: 60,
    pillColor:
      "bg-lime-500/15 text-emerald-900 border-lime-500/40 dark:bg-[#A3E635]/15 dark:text-[#A3E635] dark:border-[#A3E635]/35",
    dotColor: "bg-[#A3E635]",
  },
  {
    label: "Tracción — Espalda y Bíceps",
    shortTag: "Tracción",
    routineId: "pull",
    tipo: "PULL",
    cargaNivel: "Alta",
    musculos: ["Espalda", "Dorsal", "Bíceps"],
    duracionMin: 65,
    pillColor:
      "bg-cyan-500/15 text-cyan-900 border-cyan-500/40 dark:bg-[#22D3EE]/15 dark:text-[#22D3EE] dark:border-[#22D3EE]/35",
    dotColor: "bg-[#22D3EE]",
  },
  {
    label: "Pierna — Cuádriceps, Isquios y Glúteo",
    shortTag: "Pierna",
    routineId: "legs",
    tipo: "LEGS",
    cargaNivel: "Alta",
    musculos: ["Cuádriceps", "Isquios", "Glúteo"],
    duracionMin: 70,
    pillColor:
      "bg-amber-500/15 text-amber-900 border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/35",
    dotColor: "bg-amber-400",
  },
  {
    label: "Hombro Lateral y Brazos",
    shortTag: "Brazos",
    routineId: "upper_arms",
    tipo: "UPPER",
    cargaNivel: "Media",
    musculos: ["Hombro Lateral", "Bíceps", "Tríceps"],
    duracionMin: 50,
    pillColor:
      "bg-purple-500/15 text-purple-900 border-purple-500/40 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/35",
    dotColor: "bg-purple-400",
  },
  {
    label: "Descanso Activo y Movilidad",
    shortTag: "Movilidad",
    routineId: "active_recovery",
    tipo: "ACTIVE_RECOVERY",
    cargaNivel: "Baja",
    musculos: ["Movilidad", "Recuperación"],
    duracionMin: 30,
    pillColor:
      "bg-emerald-500/15 text-emerald-800 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
    dotColor: "bg-emerald-400",
  },
  {
    label: "Descanso Total",
    shortTag: "Descanso",
    tipo: "REST",
    cargaNivel: "Descanso",
    musculos: ["Recuperación Total"],
    duracionMin: 0,
    pillColor:
      "bg-zinc-200/70 text-zinc-600 border-zinc-300 dark:bg-zinc-800/80 dark:text-zinc-400 dark:border-zinc-700",
    dotColor: "bg-zinc-500",
  },
];

interface MonthDayRecord {
  dayNumber: number;
  weekdayIndex: number; // 0 = Lun ... 6 = Dom
  weekdayName: string;
  optionLabel: string;
  completado: boolean;
  esHoy: boolean;
}

const WEEKDAY_HEADERS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const WEEKDAY_FULL = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const MONTHS_DATA = [
  { id: "2026-09", title: "Septiembre 2026", daysInMonth: 30, startOffset: 1 }, // Martes
  { id: "2026-10", title: "Octubre 2026", daysInMonth: 31, startOffset: 3 }, // Jueves
  { id: "2026-11", title: "Noviembre 2026", daysInMonth: 30, startOffset: 6 }, // Domingo
];

function buildInitialMonthDays(
  monthIndex: number,
  splitType: "PPL" | "UPPER_LOWER"
): MonthDayRecord[] {
  const m = MONTHS_DATA[monthIndex] || MONTHS_DATA[1];
  const pplPattern = [
    DAY_ROUTINE_OPTIONS[0].label, // Lun: Empuje
    DAY_ROUTINE_OPTIONS[1].label, // Mar: Tracción
    DAY_ROUTINE_OPTIONS[2].label, // Mié: Pierna
    DAY_ROUTINE_OPTIONS[3].label, // Jue: Brazos
    DAY_ROUTINE_OPTIONS[0].label, // Vie: Empuje
    DAY_ROUTINE_OPTIONS[4].label, // Sáb: Movilidad
    DAY_ROUTINE_OPTIONS[5].label, // Dom: Descanso
  ];

  const upperLowerPattern = [
    DAY_ROUTINE_OPTIONS[0].label, // Lun: Empuje/Torso
    DAY_ROUTINE_OPTIONS[2].label, // Mar: Pierna
    DAY_ROUTINE_OPTIONS[4].label, // Mié: Movilidad
    DAY_ROUTINE_OPTIONS[1].label, // Jue: Tracción/Torso
    DAY_ROUTINE_OPTIONS[2].label, // Vie: Pierna
    DAY_ROUTINE_OPTIONS[3].label, // Sáb: Brazos
    DAY_ROUTINE_OPTIONS[5].label, // Dom: Descanso
  ];

  const pattern = splitType === "PPL" ? pplPattern : upperLowerPattern;
  const result: MonthDayRecord[] = [];

  for (let d = 1; d <= m.daysInMonth; d++) {
    const weekdayIndex = (m.startOffset + d - 1) % 7;
    const isOctToday = m.id === "2026-10" && d === 23;
    const isPastDay =
      m.id === "2026-09" || (m.id === "2026-10" && d < 23);
    const assignedOption = pattern[weekdayIndex];
    const isRest = assignedOption === DAY_ROUTINE_OPTIONS[5].label;

    result.push({
      dayNumber: d,
      weekdayIndex,
      weekdayName: WEEKDAY_FULL[weekdayIndex],
      optionLabel: assignedOption,
      completado: isPastDay && !isRest && d % 5 !== 0,
      esHoy: isOctToday,
    });
  }

  return result;
}

export default function CalendarSplitModule({
  onLaunchRoutineInGym,
}: CalendarSplitModuleProps) {
  const [viewMode, setViewMode] = useState<"WEEK" | "MONTH">("WEEK");
  const [splitType, setSplitType] = useState<"PPL" | "UPPER_LOWER">("PPL");
  const [schedule, setSchedule] = useState<CalendarDayPlan[]>(() => {
    try {
      const saved = localStorage.getItem("mygymbrou_calendar_schedule");
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_WEEK_SCHEDULE.map((d) => ({ ...d, completado: false }));
  });

  // Estado del Calendario Mensual
  const [monthIdx, setMonthIdx] = useState<number>(1); // Octubre 2026 por defecto
  const [monthRecordsByKey, setMonthRecordsByKey] = useState<
    Record<string, MonthDayRecord[]>
  >(() => ({
    "0-PPL": buildInitialMonthDays(0, "PPL"),
    "1-PPL": buildInitialMonthDays(1, "PPL"),
    "2-PPL": buildInitialMonthDays(2, "PPL"),
    "0-UPPER_LOWER": buildInitialMonthDays(0, "UPPER_LOWER"),
    "1-UPPER_LOWER": buildInitialMonthDays(1, "UPPER_LOWER"),
    "2-UPPER_LOWER": buildInitialMonthDays(2, "UPPER_LOWER"),
  }));
  const [selectedMonthDay, setSelectedMonthDay] = useState<number>(23);

  const monthKey = `${monthIdx}-${splitType}`;
  const currentMonthMeta = MONTHS_DATA[monthIdx];
  const currentMonthDays = useMemo(
    () =>
      monthRecordsByKey[monthKey] ||
      buildInitialMonthDays(monthIdx, splitType),
    [monthRecordsByKey, monthKey, monthIdx, splitType]
  );

  // Detectar si lleva 4 días seguidos de carga Alta en la semana
  let currentStreak = 0;
  let maxHighLoadStreak = 0;
  schedule.forEach((day) => {
    if (day.cargaNivel === "Alta") {
      currentStreak += 1;
      if (currentStreak > maxHighLoadStreak) maxHighLoadStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
  });

  const fatigueDetected = maxHighLoadStreak >= 4;

  const completedWeekCount = schedule.filter((d) => d.completado).length;
  const completedMonthCount = currentMonthDays.filter(
    (d) => d.completado
  ).length;

  const handleChangeDayRoutine = (dayId: string, optionLabel: string) => {
    const found = DAY_ROUTINE_OPTIONS.find((o) => o.label === optionLabel);
    if (!found) return;

    setSchedule((prev) =>
      prev.map((d) =>
        d.id === dayId
          ? {
              ...d,
              tituloSplit: found.label,
              tipo: found.tipo,
              cargaNivel: found.cargaNivel,
              duracionMin: found.duracionMin,
              musculos: found.musculos,
            }
          : d
      )
    );

    const targetDay = schedule.find((d) => d.id === dayId);
    if (targetDay?.esHoy && found.routineId && onLaunchRoutineInGym) {
      onLaunchRoutineInGym(found.routineId);
    }
  };

  const toggleDayCompleted = (dayId: string) => {
    setSchedule((prev) => {
      const updated = prev.map((d) =>
        d.id === dayId ? { ...d, completado: !d.completado } : d
      );
      try {
        localStorage.setItem("mygymbrou_calendar_schedule", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Funciones para editar cualquier día del Mes
  const handleUpdateMonthDayRoutine = (dayNum: number, newLabel: string) => {
    setMonthRecordsByKey((prev) => ({
      ...prev,
      [monthKey]: (prev[monthKey] || currentMonthDays).map((d) =>
        d.dayNumber === dayNum ? { ...d, optionLabel: newLabel } : d
      ),
    }));
  };

  const handleToggleMonthDayCompleted = (dayNum: number) => {
    setMonthRecordsByKey((prev) => ({
      ...prev,
      [monthKey]: (prev[monthKey] || currentMonthDays).map((d) =>
        d.dayNumber === dayNum ? { ...d, completado: !d.completado } : d
      ),
    }));
  };

  const activeMonthDayObj =
    currentMonthDays.find((d) => d.dayNumber === selectedMonthDay) ||
    currentMonthDays[0];
  const activeMonthDayOpt =
    DAY_ROUTINE_OPTIONS.find(
      (o) => o.label === activeMonthDayObj?.optionLabel
    ) || DAY_ROUTINE_OPTIONS[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#121214] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
        {/* Cabecera Principal con Selector SEMANA | MES */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635]/15 dark:text-[#A3E635] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider">
                Calendario Dinámico
              </span>
              <InfoTooltip
                title="Vista por Semana o por Mes"
                content="Alterna entre 'Semana' para un ajuste rápido de tus 7 días o 'Mes' para ver tu panorama mensual completo, rachas y editar cualquier fecha del calendario."
                position="bottom"
              />
            </div>
            <h2 className="mt-2 text-2xl font-extrabold text-zinc-950 dark:text-zinc-50">
              {viewMode === "WEEK"
                ? "Tu Semana de Entrenamiento"
                : `Calendario Mensual • ${currentMonthMeta.title}`}
            </h2>
          </div>

          {/* Botones de Vista: Semana vs Mes + Tipo de Split */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Switch Semana / Mes */}
            <div className="flex rounded-2xl bg-zinc-100 dark:bg-[#18181B] p-1 border border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setViewMode("WEEK")}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition-all ${
                  viewMode === "WEEK"
                    ? "bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635] dark:text-[#09090B] shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100"
                }`}
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                Semana
              </button>
              <button
                type="button"
                onClick={() => setViewMode("MONTH")}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition-all ${
                  viewMode === "MONTH"
                    ? "bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635] dark:text-[#09090B] shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Mes
              </button>
            </div>

            {/* Selector de estructura de Split */}
            <div className="flex rounded-2xl bg-zinc-100 dark:bg-[#18181B] p-1 border border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setSplitType("PPL");
                  setSchedule(INITIAL_WEEK_SCHEDULE);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all ${
                  splitType === "PPL"
                    ? "bg-zinc-950 text-white dark:bg-zinc-800 dark:text-[#A3E635]"
                    : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                PPL
              </button>
              <button
                type="button"
                onClick={() => setSplitType("UPPER_LOWER")}
                className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all ${
                  splitType === "UPPER_LOWER"
                    ? "bg-zinc-950 text-white dark:bg-zinc-800 dark:text-[#A3E635]"
                    : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                Torso / Pierna
              </button>
            </div>
          </div>
        </div>

        {/* Resumen Rápido de Estadísticas del Calendario */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-[#18181B] p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                {viewMode === "WEEK" ? "Semana Actual" : "Completados Mes"}
              </span>
              <span className="mt-0.5 font-mono text-lg sm:text-xl font-black text-zinc-950 dark:text-zinc-50">
                {viewMode === "WEEK"
                  ? `${completedWeekCount} / 7 días`
                  : `${completedMonthCount} sesiones`}
              </span>
            </div>
            <Trophy className="h-5 w-5 text-emerald-600 dark:text-[#A3E635] hidden sm:block" />
          </div>

          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-[#18181B] p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                Racha Activa
              </span>
              <span className="mt-0.5 font-mono text-lg sm:text-xl font-black text-zinc-950 dark:text-zinc-50">
                {completedWeekCount > 0 ? `${completedWeekCount} Días 🔥` : "0 Días"}
              </span>
            </div>
            <Flame className="h-5 w-5 text-amber-500 hidden sm:block" />
          </div>

          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-[#18181B] p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                Estado Muscular
              </span>
              <span className="mt-0.5 text-xs sm:text-sm font-extrabold text-emerald-700 dark:text-[#A3E635] block">
                {fatigueDetected ? "Requiere Descanso" : "Recuperación Óptima"}
              </span>
            </div>
            <HeartPulse className="h-5 w-5 text-cyan-500 hidden sm:block" />
          </div>
        </div>

        {/* Guía Rápida Explicativa del Calendario */}
        <SectionGuideCard
          title="¿Para qué sirve este Calendario y cómo usarlo?"
          points={[
            {
              title: "Organiza tu Semana",
              desc: "Elige qué días entrenas Empuje, Tracción, Piernas o Descanso Activo con los selectores de cada día.",
            },
            {
              title: "Sincroniza con 1 Toque",
              desc: "Al marcar tu rutina de hoy, se carga automáticamente en el módulo de Gimnasio para empezar tu entrenamiento.",
            },
            {
              title: "Prevención de Fatiga",
              desc: "El sistema detecta automáticamente si acumulas 4 días de carga alta y te sugiere recuperación para no sobreentrenar.",
            },
          ]}
          proTip="Si hoy estás fatigado, toca 'Descansar hoy' y el sistema equilibrará tus días restantes."
        />

        {/* Espacio Publicitario 320x50 Adsterra sin contorno */}
        <AdBanner format="320x50" placementName="Publicidad · Calendario" />

        {/* =========================================================
            VISTA 1: SEMANA (TARJETAS RÁPIDAS + LISTA INTERACTIVA)
           ========================================================= */}
        {viewMode === "WEEK" && (
          <>
            {/* Alerta Limpia de Fatiga o Cambio de Rutina */}
            {fatigueDetected ? (
              <div className="mt-6 rounded-2xl border border-amber-500/40 bg-zinc-50 dark:bg-[#18181B] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-[#FBBF24] shrink-0" />
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-zinc-950 dark:text-zinc-50">
                      4 días seguidos de carga alta detectados
                    </h3>
                    <InfoTooltip
                      title="Detector de Fatiga"
                      content="Entrenar pesado 4 días seguidos acumula fatiga articular. Te recomendamos cambiar hoy a Descanso Activo o elegir un grupo muscular fresco."
                      position="top"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleChangeDayRoutine(
                      "day-fri",
                      "Descanso Activo y Movilidad"
                    )
                  }
                  className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-zinc-950 text-[#A3E635] dark:bg-[#FBBF24] dark:text-[#09090B] px-4 py-2 text-xs font-extrabold"
                >
                  <HeartPulse className="h-4 w-4" />
                  Descansar hoy
                </button>
              </div>
            ) : (
              <div className="mt-6 flex items-center justify-between rounded-2xl bg-zinc-50 dark:bg-[#18181B] px-4 py-3 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <span>✓ Tu semana está equilibrada sin exceso de fatiga.</span>
                <button
                  type="button"
                  onClick={() => setSchedule(INITIAL_WEEK_SCHEDULE)}
                  className="inline-flex items-center gap-1 text-emerald-700 dark:text-[#A3E635] hover:underline"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Restaurar semana
                </button>
              </div>
            )}

            {/* Mini-tira visual de los 7 días de la semana (Responsive Swipeable en móvil) */}
            <div className="mt-5 flex overflow-x-auto gap-2 pb-2 sm:grid sm:grid-cols-7 sm:gap-2 no-scrollbar snap-x">
              {schedule.map((day) => {
                const matchedOpt =
                  DAY_ROUTINE_OPTIONS.find(
                    (o) => o.label === day.tituloSplit
                  ) || DAY_ROUTINE_OPTIONS[0];
                return (
                  <div
                    key={`strip-${day.id}`}
                    className={`min-w-[76px] sm:min-w-0 snap-center flex-1 rounded-2xl border p-2.5 text-center transition-all ${
                      day.esHoy
                        ? "border-2 border-zinc-950 dark:border-[#A3E635] bg-zinc-950 text-white dark:bg-[#18181B] shadow-md"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-[#141417]"
                    }`}
                  >
                    <span
                      className={`block text-[10px] font-extrabold uppercase ${
                        day.esHoy
                          ? "text-[#A3E635]"
                          : "text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {day.diaSemana.slice(0, 3)}
                    </span>
                    <span className="mt-0.5 block font-mono text-xs font-black">
                      {day.fechaCorta.split(" ")[0]}
                    </span>
                    <span
                      className={`mt-1.5 inline-block rounded-md border px-1.5 py-0.5 text-[9px] font-extrabold truncate max-w-full ${matchedOpt.pillColor}`}
                    >
                      {matchedOpt.shortTag}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Lista Vertical Editable de los 7 Días */}
            <div className="mt-5 space-y-2.5">
              {schedule.map((day) => {
                const matchedOpt = DAY_ROUTINE_OPTIONS.find(
                  (o) => o.label === day.tituloSplit
                );

                return (
                  <div
                    key={day.id}
                    className={`rounded-2xl border p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 transition-all ${
                      day.esHoy
                        ? "border-2 border-zinc-950 dark:border-[#A3E635] bg-zinc-50 dark:bg-[#18181B]"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#141417]"
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-20 shrink-0">
                        <span className="block text-xs font-extrabold uppercase text-zinc-950 dark:text-zinc-50">
                          {day.diaSemana}
                        </span>
                        <span className="block font-mono text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                          {day.fechaCorta}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            aria-label={`Cambiar rutina del ${day.diaSemana}`}
                            value={
                              matchedOpt
                                ? matchedOpt.label
                                : DAY_ROUTINE_OPTIONS[0].label
                            }
                            onChange={(e) =>
                              handleChangeDayRoutine(day.id, e.target.value)
                            }
                            className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#121214] px-3 py-1.5 text-xs sm:text-sm font-extrabold text-zinc-950 dark:text-zinc-50 focus:outline-none"
                          >
                            {DAY_ROUTINE_OPTIONS.map((opt) => (
                              <option
                                key={opt.label}
                                value={opt.label}
                                className="bg-white text-zinc-950 dark:bg-[#121214] dark:text-zinc-50"
                              >
                                {opt.label}
                              </option>
                            ))}
                          </select>

                          {day.esHoy && (
                            <span className="rounded-md bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635] dark:text-[#09090B] px-2 py-0.5 text-[10px] font-extrabold uppercase">
                              Hoy
                            </span>
                          )}
                        </div>

                        <div className="mt-1.5 flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
                          <span>{day.musculos.join(" • ")}</span>
                          {day.duracionMin > 0 && (
                            <span className="inline-flex items-center gap-1 font-mono">
                              <Clock className="h-3 w-3" />
                              {day.duracionMin}m
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {matchedOpt?.routineId && onLaunchRoutineInGym && (
                        <button
                          type="button"
                          onClick={() =>
                            onLaunchRoutineInGym(matchedOpt.routineId!)
                          }
                          className="inline-flex items-center gap-1 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#121214] px-3 py-2 text-xs font-extrabold text-zinc-900 dark:text-zinc-100 hover:border-zinc-950 dark:hover:border-[#A3E635]"
                          title="Ir a entrenar esta rutina"
                        >
                          <Play className="h-3 w-3 fill-current" />
                          <span className="hidden sm:inline">Entrenar</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleDayCompleted(day.id)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-colors ${
                          day.completado
                            ? "bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635] dark:text-[#09090B]"
                            : "border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                        <span className="hidden sm:inline">
                          {day.completado ? "Hecho" : "Listo"}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* =========================================================
            VISTA 2: CALENDARIO MENSUAL INTERACTIVO
           ========================================================= */}
        {viewMode === "MONTH" && (
          <div className="mt-6 space-y-5">
            {/* Navegador de Mes + Leyenda de Colores */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-zinc-50 dark:bg-[#18181B] p-3.5 border border-zinc-200/80 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={monthIdx === 0}
                  onClick={() => {
                    setMonthIdx((prev) => Math.max(0, prev - 1));
                    setSelectedMonthDay(1);
                  }}
                  className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#121214] p-2 text-zinc-800 dark:text-zinc-200 disabled:opacity-30"
                  aria-label="Mes anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-2 text-sm sm:text-base font-extrabold text-zinc-950 dark:text-zinc-50">
                  {currentMonthMeta.title}
                </span>
                <button
                  type="button"
                  disabled={monthIdx === MONTHS_DATA.length - 1}
                  onClick={() => {
                    setMonthIdx((prev) =>
                      Math.min(MONTHS_DATA.length - 1, prev + 1)
                    );
                    setSelectedMonthDay(1);
                  }}
                  className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#121214] p-2 text-zinc-800 dark:text-zinc-200 disabled:opacity-30"
                  aria-label="Mes siguiente"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMonthIdx(1);
                    setSelectedMonthDay(23);
                  }}
                  className="ml-1 rounded-xl bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635]/15 dark:text-[#A3E635] px-3 py-1.5 text-xs font-extrabold"
                >
                  Ir a Hoy (23 Oct)
                </button>
              </div>

              {/* Leyenda compacta */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
                {DAY_ROUTINE_OPTIONS.slice(0, 5).map((opt) => (
                  <span key={opt.shortTag} className="inline-flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${opt.dotColor}`} />
                    {opt.shortTag}
                  </span>
                ))}
              </div>
            </div>

            {/* Cuadrícula Mensual de 7 Columnas (Lunes a Domingo) */}
            <div>
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2 text-center">
                {WEEKDAY_HEADERS.map((dName) => (
                  <div
                    key={dName}
                    className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 py-1"
                  >
                    {dName}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {/* Celdas vacías de inicio de mes */}
                {Array.from({ length: currentMonthMeta.startOffset }).map(
                  (_, emptyIdx) => (
                    <div
                      key={`empty-${emptyIdx}`}
                      className="h-20 sm:h-24 rounded-2xl border border-dashed border-zinc-200/60 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/20"
                    />
                  )
                )}

                {/* Días del Mes */}
                {currentMonthDays.map((dayRec) => {
                  const opt =
                    DAY_ROUTINE_OPTIONS.find(
                      (o) => o.label === dayRec.optionLabel
                    ) || DAY_ROUTINE_OPTIONS[0];
                  const isSelected = dayRec.dayNumber === selectedMonthDay;

                  return (
                    <button
                      key={dayRec.dayNumber}
                      type="button"
                      onClick={() => setSelectedMonthDay(dayRec.dayNumber)}
                      className={`h-20 sm:h-24 rounded-2xl border p-2 flex flex-col justify-between text-left transition-all relative ${
                        isSelected
                          ? "border-2 border-zinc-950 dark:border-[#A3E635] bg-zinc-100/90 dark:bg-[#18181B] shadow-md scale-[1.02]"
                          : dayRec.esHoy
                          ? "border-2 border-emerald-600 dark:border-[#22D3EE] bg-white dark:bg-[#141417]"
                          : "border-zinc-200 dark:border-zinc-800 bg-white hover:bg-zinc-50 dark:bg-[#141417] dark:hover:bg-[#18181B]"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`font-mono text-xs sm:text-sm font-black ${
                            dayRec.esHoy
                              ? "text-emerald-700 dark:text-[#A3E635]"
                              : "text-zinc-900 dark:text-zinc-100"
                          }`}
                        >
                          {dayRec.dayNumber}
                        </span>

                        {dayRec.completado ? (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635] dark:text-[#09090B] text-[9px] font-black">
                            ✓
                          </span>
                        ) : dayRec.esHoy ? (
                          <span className="rounded bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635] dark:text-[#09090B] px-1 py-0.5 text-[8px] font-black uppercase">
                            Hoy
                          </span>
                        ) : null}
                      </div>

                      {/* Etiqueta de la rutina del día */}
                      <div className="w-full">
                        <span
                          className={`block w-full truncate rounded-lg border px-1.5 py-1 text-[9px] sm:text-[10px] font-extrabold ${opt.pillColor}`}
                        >
                          {opt.shortTag}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inspector / Editor del Día Seleccionado en el Mes */}
            {activeMonthDayObj && (
              <div className="rounded-2xl border-2 border-zinc-950 dark:border-[#A3E635] bg-zinc-50 dark:bg-[#18181B] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635] dark:text-[#09090B] px-2.5 py-1 text-xs font-extrabold">
                      {activeMonthDayObj.weekdayName} {activeMonthDayObj.dayNumber} de{" "}
                      {currentMonthMeta.title}
                    </span>
                    {activeMonthDayObj.esHoy && (
                      <span className="text-xs font-extrabold text-emerald-700 dark:text-[#A3E635]">
                        • Día de Hoy
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <label
                      htmlFor="month-day-routine-select"
                      className="text-xs font-bold text-zinc-600 dark:text-zinc-400"
                    >
                      Rutina asignada:
                    </label>
                    <select
                      id="month-day-routine-select"
                      value={activeMonthDayObj.optionLabel}
                      onChange={(e) =>
                        handleUpdateMonthDayRoutine(
                          activeMonthDayObj.dayNumber,
                          e.target.value
                        )
                      }
                      className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#121214] px-3 py-2 text-xs sm:text-sm font-extrabold text-zinc-950 dark:text-zinc-50"
                    >
                      {DAY_ROUTINE_OPTIONS.map((opt) => (
                        <option key={opt.label} value={opt.label}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    Músculos: {activeMonthDayOpt.musculos.join(" • ")}{" "}
                    {activeMonthDayOpt.duracionMin > 0
                      ? `• Duración est.: ${activeMonthDayOpt.duracionMin} min`
                      : ""}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  {activeMonthDayOpt.routineId && onLaunchRoutineInGym && (
                    <button
                      type="button"
                      onClick={() =>
                        onLaunchRoutineInGym(activeMonthDayOpt.routineId!)
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635] dark:text-[#09090B] px-4 py-2.5 text-xs font-extrabold shadow-sm"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      Entrenar esta rutina
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      handleToggleMonthDayCompleted(activeMonthDayObj.dayNumber)
                    }
                    className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-extrabold border transition-all ${
                      activeMonthDayObj.completado
                        ? "border-emerald-600 bg-emerald-600 text-white dark:border-[#22D3EE] dark:bg-[#22D3EE] dark:text-[#09090B]"
                        : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#121214] text-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                    {activeMonthDayObj.completado
                      ? "Completado"
                      : "Marcar Hecho"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
