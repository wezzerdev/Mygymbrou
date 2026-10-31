"use client";

import React, { useState } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Dumbbell,
  Box,
  Timer,
  Calendar,
  Sparkles,
  Home,
  CheckCircle2,
  Camera,
  Layers,
} from "lucide-react";

interface SystemTourModalProps {
  open: boolean;
  onClose: () => void;
}

interface TourStep {
  title: string;
  badge: string;
  icon: React.ElementType;
  iconColor: string;
  description: string;
  highlights: string[];
  tips: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Entrenamiento en Vivo & Modo En Casa",
    badge: "Paso 1 de 5 · Gimnasio & Hogar",
    icon: Dumbbell,
    iconColor: "text-[#A3E635]",
    description:
      "Registra tus series de forma rápida y sin fricción mientras entrenas en el gimnasio o en casa.",
    highlights: [
      "Selector de 1 toque: Cambia entre 'Gimnasio' y 'En Casa' (sin equipo).",
      "Controles táctiles: Botones +/- para peso y repeticiones sin necesidad de escribir.",
      "Máquinas alternativas: Elige mancuernas, barras, poleas o alternativas con sillas y toallas.",
    ],
    tips: "Toca la marca anterior para copiarla directamente a tu serie actual con un solo toque.",
  },
  {
    title: "Estudio 3D Biomecánico & Anatomía",
    badge: "Paso 2 de 5 · Visualización 360°",
    icon: Box,
    iconColor: "text-cyan-400",
    description:
      "Observa la postura perfecta y la activación muscular en tiempo real con nuestro modelo 3D.",
    highlights: [
      "Arrastra con el dedo o mouse para rotar el atleta 360° y analizar la postura.",
      "Fibras musculares en rojo carmesí y verde neón indicando los músculos principales.",
      "Láminas anatómicas de Inicio y Contracción para aprender la trayectoria perfecta.",
    ],
    tips: "Usa el botón de pausa o reinicio de ángulo para examinar el punto de máximo estiramiento.",
  },
  {
    title: "Temporizador de Descanso Inteligente",
    badge: "Paso 3 de 5 · Recuperación",
    icon: Timer,
    iconColor: "text-amber-400",
    description:
      "Cronómetro flotante optimizado que se activa al terminar cada serie y te acompaña en toda la app.",
    highlights: [
      "Ajustes preconfigurados de 60s, 90s, 120s y 180s según el ejercicio.",
      "Widget flotante minimalista: puedes navegar a Nutrición o Métricas sin perder tu tiempo.",
      "Alertas sonoras y hápticas cuando termina tu descanso para volver a la barra.",
    ],
    tips: "Puedes sumar +30s rápidamente si la serie anterior fue al fallo neuromuscular.",
  },
  {
    title: "Calendario Semanal & Detector de Fatiga",
    badge: "Paso 4 de 5 · Planificación",
    icon: Calendar,
    iconColor: "text-purple-400",
    description:
      "Planifica qué días entrenas y previene el sobreentrenamiento con alertas inteligentes.",
    highlights: [
      "Visualiza tus 7 días con colores por grupo muscular (Empuje, Tracción, Piernas).",
      "Detector de fatiga: Te avisa si acumulas 4 días de carga alta seguidos.",
      "Lanzador directo: Toca 'Entrenar Hoy' para cargar la sesión al módulo en vivo.",
    ],
    tips: "Intercambia fácilmente entre rutinas PPL (Empuje/Tracción/Pierna) o Torso/Pierna.",
  },
  {
    title: "Visión Nutricional IA & Métricas",
    badge: "Paso 5 de 5 · Progreso Integral",
    icon: Camera,
    iconColor: "text-emerald-400",
    description:
      "Escanea tus comidas con la cámara y lleva el control exacto de tus calorías y marcas de fuerza.",
    highlights: [
      "Visión IA: Detecta ingredientes y calcula proteínas, carbohidratos y calorías de tu plato.",
      "Seguimiento de peso corporal y porcentaje graso con gráficas interactivas.",
      "Historial de cargas máximas por ejercicio para asegurar sobrecarga progresiva.",
    ],
    tips: "Registra tu peso en ayunas cada semana para graficar una tendencia precisa.",
  },
];

export default function SystemTourModal({ open, onClose }: SystemTourModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!open) return null;

  const step = TOUR_STEPS[currentStep];
  const StepIcon = step.icon;
  const isLast = currentStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Recorrido guiado de MyGymBrou"
    >
      <div className="w-full max-w-lg rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] shadow-2xl overflow-hidden flex flex-col">
        {/* Barra superior con paso y botón cerrar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 px-3 py-1 text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
            <Sparkles className="h-3 w-3 text-emerald-700 dark:text-[#A3E635]" />
            <span>{step.badge}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Cerrar recorrido"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Contenido del paso actual */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-[#18181D] border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center shrink-0">
              <StepIcon className={`h-6 w-6 ${step.iconColor}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                {step.title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {step.description}
              </p>
            </div>
          </div>

          {/* Lista de características clave */}
          <div className="rounded-2xl bg-zinc-50 dark:bg-[#18181D]/60 border border-zinc-200/80 dark:border-zinc-800/80 p-4 space-y-2.5">
            {step.highlights.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-800 dark:text-zinc-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-[#A3E635] shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Tip pro */}
          <div className="rounded-xl bg-lime-500/10 border border-lime-500/20 px-3.5 py-2.5 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-[#A3E635]">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span className="font-medium">
              <strong className="font-bold">Tip:</strong> {step.tips}
            </span>
          </div>

          {/* Indicador de progreso con bolitas */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {TOUR_STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentStep(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentStep
                    ? "w-6 bg-zinc-950 dark:bg-[#A3E635]"
                    : "w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400"
                }`}
                aria-label={`Ir al paso ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer con botones Anterior y Siguiente */}
        <div className="border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-[#151518] px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white disabled:opacity-20 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Anterior</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 text-white dark:bg-[#A3E635] dark:text-[#09090B] px-5 py-2.5 text-xs font-bold shadow-md hover:opacity-90 transition-all"
          >
            <span>{isLast ? "¡Empezar a entrenar!" : "Siguiente"}</span>
            {!isLast && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
