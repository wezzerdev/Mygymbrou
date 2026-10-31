"use client";

import React, { useState } from "react";
import {
  User,
  Activity,
  Target,
  Dumbbell,
  Home,
  Calendar,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Award,
  Zap,
  X,
} from "lucide-react";

export interface OnboardingData {
  // 1. Info Personal
  fullName: string;
  gender: "hombre" | "mujer" | "otro";
  age: number;
  heightCm: number;
  weightKg: number;
  // 2. Metas
  goal: "ganar_musculo" | "perder_grasa" | "recomposicion" | "fuerza_pura";
  targetWeightKg: number;
  weeklyWorkoutsTarget: number;
  // 3. Lugar y equipamiento
  trainingLocation: "gimnasio_comercial" | "en_casa" | "parque_calistenia" | "ambos";
  preferredDurationTrack: "express" | "standard" | "extended";
  // 4. Experiencia
  experienceLevel: "beginner" | "intermediate" | "expert";
  trainingYears: number;
  // 5. Preferencia de Rutina
  preferredSplit: "PPL" | "UPPER_LOWER" | "FULL_BODY";
}

interface OnboardingWizardProps {
  initialEmail: string;
  initialName?: string;
  onComplete: (data: OnboardingData) => void;
  onClose?: () => void;
}

export default function OnboardingWizard({
  initialEmail,
  initialName = "",
  onComplete,
  onClose,
}: OnboardingWizardProps) {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<OnboardingData>({
    fullName: initialName || "",
    gender: "hombre",
    age: 25,
    heightCm: 175,
    weightKg: 75,
    goal: "ganar_musculo",
    targetWeightKg: 80,
    weeklyWorkoutsTarget: 4,
    trainingLocation: "gimnasio_comercial",
    preferredDurationTrack: "standard",
    experienceLevel: "intermediate",
    trainingYears: 1.5,
    preferredSplit: "PPL",
  });

  const handleSkipOrClose = () => {
    onComplete(formData);
    if (onClose) onClose();
  };

  const nextStep = () => setStep((s) => Math.min(totalSteps, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-8 shadow-2xl space-y-6 relative">
        {/* Botón de cerrar / omitir directo en la esquina superior */}
        <button
          type="button"
          onClick={handleSkipOrClose}
          className="absolute top-5 right-5 h-8 w-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title="Omitir y cerrar configuración"
          aria-label="Cerrar configuración"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Barra superior de pasos */}
        <div className="space-y-2 pr-8">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <span>Paso {step} de {totalSteps}</span>
            <span className="text-emerald-600 dark:text-[#A3E635]">
              {step === 1 && "Información Personal y Corporal"}
              {step === 2 && "Tus Metas y Objetivos"}
              {step === 3 && "¿Dónde y Cómo Entrenas?"}
              {step === 4 && "Nivel de Experiencia y Split"}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-emerald-600 dark:bg-[#A3E635] transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* PASO 1: Datos Personales y Corporales */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                ¡Bienvenido a MyGymBrou! Conozcámonos.
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Usamos estos datos para calcular tus calorías, volumen de series y descansos ideales.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Tu Nombre o Apodo
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ej. Carlos Mendoza"
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#18181B] px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900 dark:focus:border-[#A3E635]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Sexo Biológico (para cálculo de masa muscular y tasa metabólica)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["hombre", "mujer"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`rounded-xl border p-2.5 text-xs font-semibold capitalize transition-all ${
                        formData.gender === g
                          ? "border-zinc-900 bg-zinc-900 text-white dark:border-[#A3E635] dark:bg-[#A3E635] dark:text-black"
                          : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181B] text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Edad
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#18181B] px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Estatura (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.heightCm}
                    onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#18181B] px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#18181B] px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PASO 2: Metas y Objetivos */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                ¿Cuál es tu principal meta en este momento?
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Ajustaremos tus macros recomendados y los rangos de repeticiones (fuerza o hipertrofia).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: "ganar_musculo", title: "Ganar Músculo", desc: "Superávit calórico y volumen óptimo de hipertrofia" },
                { id: "perder_grasa", title: "Perder Grasa / Definir", desc: "Déficit calórico moderado protegiendo la masa magra" },
                { id: "recomposicion", title: "Recomposición Corporal", desc: "Ganar masa muscular mientras reduces porcentaje graso" },
                { id: "fuerza_pura", title: "Fuerza Pura / 1RM", desc: "Enfoque en básicos pesados y progresión de cargas" },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, goal: g.id as any })}
                  className={`rounded-2xl border p-3.5 text-left transition-all ${
                    formData.goal === g.id
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-[#A3E635] dark:bg-[#A3E635] dark:text-black shadow-sm"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181B] text-zinc-700 dark:text-zinc-300 hover:border-zinc-400"
                  }`}
                >
                  <p className="text-xs font-bold">{g.title}</p>
                  <p className={`mt-0.5 text-[11px] ${formData.goal === g.id ? "text-zinc-300 dark:text-zinc-800" : "text-zinc-500 dark:text-zinc-400"}`}>
                    {g.desc}
                  </p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Peso Deseado (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.targetWeightKg}
                  onChange={(e) => setFormData({ ...formData, targetWeightKg: Number(e.target.value) })}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#18181B] px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Días que puedes entrenar
                </label>
                <select
                  value={formData.weeklyWorkoutsTarget}
                  onChange={(e) => setFormData({ ...formData, weeklyWorkoutsTarget: Number(e.target.value) })}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#18181B] px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                >
                  <option value={3}>3 días por semana</option>
                  <option value={4}>4 días por semana (Recomendado)</option>
                  <option value={5}>5 días por semana</option>
                  <option value={6}>6 días por semana (Atleta avanzado)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* PASO 3: Dónde y cómo entrena */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                ¿Dónde y cómo haces tus ejercicios?
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Si entrenas en casa, la app priorizará variantes con mancuernas, peso corporal y toallas; si vas al gym, cargará máquinas y poleas.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: "gimnasio_comercial", label: "Gimnasio Comercial", icon: Dumbbell, desc: "Acceso completo a barras olímpicas, poleas cruzadas y máquinas guiadas." },
                { id: "en_casa", label: "En Casa", icon: Home, desc: "Mancuernas ajustables, tapete, sillas y peso corporal (sin máquinas pesadas)." },
                { id: "ambos", label: "Híbrido (Gym y Casa según el día)", icon: Zap, desc: "Usa el toggle en 1 toque para cambiar de entorno al instante." },
              ].map((loc) => {
                const Icon = loc.icon;
                const isSel = formData.trainingLocation === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, trainingLocation: loc.id as any })}
                    className={`w-full rounded-2xl border p-3.5 text-left flex items-center gap-3 transition-all ${
                      isSel
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-[#A3E635] dark:bg-[#A3E635] dark:text-black shadow-sm"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181B] text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">{loc.label}</p>
                      <p className={`text-[11px] ${isSel ? "text-zinc-300 dark:text-zinc-800" : "text-zinc-500 dark:text-zinc-400"}`}>
                        {loc.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                ¿Cuánto tiempo quieres que duren tus sesiones?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "express", name: "Express", time: "45 min", badge: "2 series" },
                  { id: "standard", name: "Estándar", time: "65 min", badge: "3 series" },
                  { id: "extended", name: "Pro / 1.5h", time: "90 min", badge: "4 series" },
                ].map((tr) => (
                  <button
                    key={tr.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredDurationTrack: tr.id as any })}
                    className={`rounded-xl border p-2.5 text-center transition-all ${
                      formData.preferredDurationTrack === tr.id
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-[#A3E635] dark:bg-[#A3E635] dark:text-black"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181B] text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <p className="text-xs font-bold">{tr.name}</p>
                    <p className="font-mono text-[11px]">{tr.time}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PASO 4: Experiencia y Split */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Tu nivel y tiempo entrenando
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Nos aseguraremos de mostrarte los descansos y técnicas justas para tu nivel.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: "beginner", title: "Principiante (< 6 meses)", desc: "Aprendiendo patrones motores básicos. Cero complejidad lesiva innecesaria." },
                { id: "intermediate", title: "Intermedio (6 meses - 2 años)", desc: "Dominio de técnica. Enfoque en sobrecarga progresiva y esfuerzo RPE 8-9." },
                { id: "expert", title: "Avanzado / Experto (> 2 años)", desc: "Rutinas pesadas, descansos completos, técnicas de intensidad y volumen alto." },
              ].map((lvl) => {
                const isSel = formData.experienceLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, experienceLevel: lvl.id as any })}
                    className={`w-full rounded-2xl border p-3.5 text-left transition-all ${
                      isSel
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-[#A3E635] dark:bg-[#A3E635] dark:text-black shadow-sm"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181B] text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <p className="text-xs font-bold">{lvl.title}</p>
                    <p className={`text-[11px] ${isSel ? "text-zinc-300 dark:text-zinc-800" : "text-zinc-500 dark:text-zinc-400"}`}>
                      {lvl.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                División de rutina preferida
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "PPL", name: "Empuje / Tirón / Pierna" },
                  { id: "UPPER_LOWER", name: "Torso / Pierna" },
                  { id: "FULL_BODY", name: "Cuerpo Completo" },
                ].map((sp) => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredSplit: sp.id as any })}
                    className={`rounded-xl border p-2 text-center text-xs font-semibold transition-all ${
                      formData.preferredSplit === sp.id
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-[#A3E635] dark:bg-[#A3E635] dark:text-black"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181B] text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {sp.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Botones de navegación */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Atrás</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleSkipOrClose}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline transition-colors px-2 py-1"
            >
              Omitir por ahora
            </button>
          </div>

          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 text-white dark:bg-[#A3E635] dark:text-black px-5 py-2.5 text-xs font-bold shadow hover:opacity-90 transition-opacity"
            >
              <span>Continuar</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onComplete(formData)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 text-white dark:bg-[#A3E635] dark:text-black px-6 py-2.5 text-xs font-bold shadow-lg hover:opacity-95 transition-opacity"
            >
              <Sparkles className="h-4 w-4" />
              <span>¡Comenzar mi Entrenamiento!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
