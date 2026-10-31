"use client";

import React, { useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  Plus,
  Check,
} from "lucide-react";
import {
  INITIAL_BODY_METRICS,
  BodyMetricEntry,
  STRENGTH_PROGRESSION_DATA,
  calculateMovingAverage7Days,
} from "@/lib/fitness-data";
import InfoTooltip from "@/components/InfoTooltip";
import SectionGuideCard from "@/components/SectionGuideCard";

export default function MetricsStatsModule() {
  const [metricsList, setMetricsList] =
    useState<BodyMetricEntry[]>(INITIAL_BODY_METRICS);
  const [selectedStrengthKey, setSelectedStrengthKey] = useState<string>(
    "press-banca-barra"
  );
  const [showLogModal, setShowLogModal] = useState<boolean>(false);

  const latestMetric = metricsList[metricsList.length - 1];
  const [newWeight, setNewWeight] = useState<string>(String(latestMetric.pesoKg));
  const [newFat, setNewFat] = useState<string>(String(latestMetric.grasaPct));
  const [newWaist, setNewWaist] = useState<string>(String(latestMetric.cinturaCm));
  const [newArm] = useState<string>(String(latestMetric.brazoCm));

  const movingAvgData = calculateMovingAverage7Days(metricsList);
  const currentEntry = movingAvgData[movingAvgData.length - 1];
  const firstEntry = movingAvgData[0];
  const deltaMovingAvg = Number(
    (currentEntry.promedioMovil7d - firstEntry.promedioMovil7d).toFixed(1)
  );

  const handleAddMetric = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: BodyMetricEntry = {
      fecha: new Date().toISOString().slice(0, 10),
      etiqueta: "Hoy",
      pesoKg: parseFloat(newWeight) || latestMetric.pesoKg,
      grasaPct: parseFloat(newFat) || latestMetric.grasaPct,
      pechoCm: latestMetric.pechoCm,
      brazoCm: parseFloat(newArm) || latestMetric.brazoCm,
      cinturaCm: parseFloat(newWaist) || latestMetric.cinturaCm,
      piernaCm: latestMetric.piernaCm,
    };
    setMetricsList((prev) => [...prev.slice(1), entry]);
    setShowLogModal(false);
  };

  const weights = movingAvgData.flatMap((d) => [d.pesoDiario, d.promedioMovil7d]);
  const minW = Math.min(...weights) - 0.3;
  const maxW = Math.max(...weights) + 0.3;
  const chartWidth = 640;
  const chartHeight = 190;

  const getPointCoords = (idx: number, val: number) => {
    const x = 36 + (idx / Math.max(1, movingAvgData.length - 1)) * (chartWidth - 60);
    const y =
      chartHeight -
      28 -
      ((val - minW) / Math.max(0.1, maxW - minW)) * (chartHeight - 52);
    return { x, y };
  };

  const dailyPath = movingAvgData
    .map((d, idx) => {
      const { x, y } = getPointCoords(idx, d.pesoDiario);
      return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  const ma7Path = movingAvgData
    .map((d, idx) => {
      const { x, y } = getPointCoords(idx, d.promedioMovil7d);
      return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  const currentStrength =
    STRENGTH_PROGRESSION_DATA[selectedStrengthKey] ||
    STRENGTH_PROGRESSION_DATA["press-banca-barra"];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Guía Rápida de la Sección */}
      <SectionGuideCard
        title="¿Cómo interpretar tus Métricas y Fuerza?"
        points={[
          {
            title: "Promedio Móvil 7D",
            desc: "Elimina las fluctuaciones temporales de agua y glucógeno mostrando tu cambio de peso corporal real.",
          },
          {
            title: "Progreso 1RM Estimado",
            desc: "Monitorea tu sobrecarga progresiva en los ejercicios compuestos clave a lo largo de las semanas.",
          },
          {
            title: "Medidas Corporales",
            desc: "Registra cintura, brazos y porcentaje de grasa para verificar tu recomposición corporal.",
          },
        ]}
        proTip="Pésate en ayunas al despertar para que los datos del promedio móvil mantengan la máxima consistencia."
      />

      {/* 1. Tarjeta de Peso Corporal y Promedio Móvil de 7 Días */}
      <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#121214] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635]/15 dark:text-[#A3E635] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider">
              Evolución Corporal
            </span>
            <div className="mt-2 flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-zinc-950 dark:text-zinc-50">
                Peso y Tendencia Real (7 Días)
              </h2>
              <InfoTooltip
                title="¿Por qué usar Promedio de 7 Días?"
                content="El peso diario sube y baja por agua, sal y glucógeno. La línea sólida promedia los últimos 7 días para mostrarte tu pérdida de grasa o ganancia muscular real."
                position="bottom"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowLogModal((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-2xl bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635] dark:text-[#09090B] px-4 py-2.5 text-xs font-extrabold hover:opacity-95"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            Registrar Peso Hoy
          </button>
        </div>

        {/* 3 Métricas Clave Limpias */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 p-4">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
              Peso Hoy
            </span>
            <p className="mt-1 font-mono text-2xl font-extrabold text-zinc-950 dark:text-zinc-50">
              {latestMetric.pesoKg} kg
            </p>
          </div>
          <div className="rounded-2xl bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                Promedio 7 Días
              </span>
              <InfoTooltip
                title="Media Móvil 7d"
                content="Promedio exacto de tus últimos 7 pesajes."
                position="top"
              />
            </div>
            <p className="mt-1 font-mono text-2xl font-extrabold text-emerald-700 dark:text-[#A3E635]">
              {currentEntry.promedioMovil7d} kg
            </p>
          </div>
          <div className="rounded-2xl bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 p-4">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
              Grasa / Cintura
            </span>
            <p className="mt-1 font-mono text-xl font-extrabold text-cyan-700 dark:text-[#22D3EE]">
              {latestMetric.grasaPct}%{" "}
              <span className="text-xs text-zinc-500">
                ({latestMetric.cinturaCm}cm)
              </span>
            </p>
          </div>
        </div>

        {showLogModal && (
          <form
            onSubmit={handleAddMetric}
            className="mt-5 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#18181B] p-4 space-y-3"
          >
            <p className="text-xs font-extrabold uppercase text-zinc-700 dark:text-zinc-300">
              Nuevas medidas de hoy
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#09090B] px-3 py-2 font-mono text-sm font-extrabold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                  % Grasa
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newFat}
                  onChange={(e) => setNewFat(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#09090B] px-3 py-2 font-mono text-sm font-extrabold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                  Cintura (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newWaist}
                  onChange={(e) => setNewWaist(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#09090B] px-3 py-2 font-mono text-sm font-extrabold"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635] dark:text-[#09090B] py-2.5 text-xs font-extrabold"
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                  Guardar
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Gráfica limpia de tendencia */}
        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between text-xs font-bold mb-3">
            <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
              <TrendingDown className="h-4 w-4 text-emerald-700 dark:text-[#A3E635]" />
              Cambio en 2 semanas: {deltaMovingAvg} kg
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-zinc-500">
                <span className="h-2 w-2 rounded-full bg-zinc-400" />
                Báscula diario
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-[#A3E635]">
                <span className="h-2 w-4 rounded-full bg-zinc-950 dark:bg-[#A3E635]" />
                Tendencia 7 días
              </span>
            </div>
          </div>

          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-48 overflow-visible"
            role="img"
            aria-label="Tendencia de peso corporal"
          >
            <path
              d={dailyPath}
              fill="none"
              className="stroke-zinc-400 dark:stroke-zinc-600"
              strokeWidth={1.75}
              strokeDasharray="4 4"
            />
            <path
              d={ma7Path}
              fill="none"
              className="stroke-zinc-950 dark:stroke-[#A3E635]"
              strokeWidth={3.5}
              strokeLinecap="round"
            />
            {movingAvgData.map((d, idx) => {
              const pMa = getPointCoords(idx, d.promedioMovil7d);
              return (
                <g key={d.fecha + idx}>
                  <circle
                    cx={pMa.x}
                    cy={pMa.y}
                    r={4}
                    className="fill-zinc-950 dark:fill-[#A3E635] stroke-white dark:stroke-[#121214]"
                    strokeWidth={1.5}
                  />
                  {idx % 3 === 0 && (
                    <text
                      x={pMa.x}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      className="fill-zinc-500 dark:fill-zinc-400 font-mono text-[10px] font-bold"
                    >
                      {d.etiqueta}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 2. Tarjeta de Progreso de Fuerza (1RM Estimado) */}
      <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#121214] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-extrabold text-zinc-950 dark:text-zinc-50">
              Progreso de Fuerza por Ejercicio (1RM)
            </h3>
            <InfoTooltip
              title="Consejo de Progresión IA"
              content={currentStrength.sugerenciaIA}
              position="top"
            />
          </div>
          <TrendingUp className="h-6 w-6 text-cyan-700 dark:text-[#22D3EE]" />
        </div>

        {/* Selector de Ejercicio */}
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(STRENGTH_PROGRESSION_DATA).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedStrengthKey(key)}
              className={`rounded-2xl px-4 py-2 text-xs font-extrabold transition-all border ${
                selectedStrengthKey === key
                  ? "bg-zinc-950 text-[#A3E635] border-zinc-950 dark:bg-[#A3E635] dark:text-[#09090B] dark:border-[#A3E635]"
                  : "bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-[#18181B] dark:text-zinc-300 dark:border-zinc-800"
              }`}
            >
              {item.nombre}
            </button>
          ))}
        </div>

        {/* Historial en Barras Limpias */}
        <div className="mt-6 space-y-3">
          {currentStrength.historial.map((h, i) => {
            const maxRM = Math.max(
              ...currentStrength.historial.map((x) => x.rmEstimado)
            );
            const barPct = Math.round((h.rmEstimado / maxRM) * 100);
            const isLast = i === currentStrength.historial.length - 1;
            return (
              <div key={h.semana} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {h.semana} —{" "}
                    <strong className="font-mono text-zinc-950 dark:text-zinc-100">
                      {h.pesoKg} kg × {h.reps} reps
                    </strong>
                  </span>
                  <span className="font-mono font-extrabold text-zinc-950 dark:text-zinc-50">
                    1RM: {h.rmEstimado} kg
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isLast
                        ? "bg-zinc-950 dark:bg-[#A3E635]"
                        : "bg-cyan-700 dark:bg-[#22D3EE]"
                    }`}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
