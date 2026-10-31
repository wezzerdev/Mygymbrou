"use client";

import React, { useState } from "react";
import {
  Dumbbell,
  Sparkles,
  Camera,
  LineChart,
  Timer,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Home,
  Flame,
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  Target,
  Heart,
  Scale,
  Activity,
  Play,
  RotateCcw,
  Star,
} from "lucide-react";
import AdBanner from "@/components/AdBanner";

interface LandingPageProps {
  onOpenAuth: (mode: "LOGIN" | "SIGNUP") => void;
}

// Fotografías de alta calidad fitness con personas reales (hombres, mujeres, gimnasios y mancuernas)
const FITNESS_IMAGES = {
  heroAtmosphere: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80", // Gimnasio oscuro con iluminación neon y mancuernas
  fitWomanGlutes: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80", // Mujer fit en top deportivo entrenando
  fitManStrength: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1000&q=80", // Hombre atlético con mancuernas torso definido
  fitWomanGym: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1000&q=80", // Mujer atlética levantando peso
  fitManBack: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1000&q=80", // Hombre espalda y brazos definidos
  dumbbellsGym: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80", // Mancuernas pro en rack de gym
  homeWorkoutFit: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80", // Entrenamiento intenso de acondicionamiento
  communityPower: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1000&q=80", // Mujer tonificada en gimnasio
};

export default function LandingPage({ onOpenAuth }: LandingPageProps) {
  const [activeGenderTab, setActiveGenderTab] = useState<"ALL" | "WOMEN" | "MEN">("ALL");

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 selection:bg-[#A3E635] selection:text-black">
      {/* Background Gradients Fitness & Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#A3E635]/15 via-emerald-600/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-[35%] -left-32 w-96 h-96 bg-fuchsia-600/15 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-[50%] -right-32 w-96 h-96 bg-cyan-500/15 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-[#A3E635]/8 blur-[100px] rounded-full pointer-events-none" />
      </div>

      {/* Barra de Navegación de la Landing */}
      <nav className="border-b border-zinc-800/80 bg-[#070709]/85 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#A3E635] to-emerald-500 text-black shadow-lg shadow-[#A3E635]/20">
              <Dumbbell className="h-5 w-5 transform -rotate-12" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-white">
                  MyGym<span className="text-[#A3E635]">Brou</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-[#A3E635] px-2.5 py-0.5 rounded-full border border-[#A3E635]/30">
                  AI · Biomecánica · Pro
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenAuth("LOGIN")}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-all"
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => onOpenAuth("SIGNUP")}
              className="relative group rounded-xl bg-[#A3E635] text-[#09090B] px-4 sm:px-5 py-2 text-xs font-black shadow-lg shadow-[#A3E635]/25 hover:shadow-[#A3E635]/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Empieza Gratis</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section Fitness Premium con Fondo Fotográfico de Gimnasio */}
      <section className="relative z-10 pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
        {/* Imagen de fondo sutil con overlay oscuro */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <img
            src={FITNESS_IMAGES.heroAtmosphere}
            alt="Gym Atmosphere"
            className="w-full h-full object-cover filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070709] via-[#070709]/80 to-[#070709]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Badge Social Proof / Fitness Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 px-4 py-1.5 text-xs font-semibold text-zinc-300 shadow-inner backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-[#A3E635] animate-pulse" />
            <span className="text-[#A3E635]">Nueva Era Fitness 2026:</span>
            <span>Para Mujeres & Hombres · Casa o Gimnasio</span>
          </div>

          {/* Main Title Impactante */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08] max-w-5xl mx-auto">
            El cuerpo que quieres, construido con{" "}
            <span className="bg-gradient-to-r from-[#A3E635] via-emerald-400 to-teal-300 bg-clip-text text-transparent">
              ciencia biomecánica
            </span>{" "}
            e inteligencia artificial.
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-zinc-300 font-normal leading-relaxed">
            Sin perder el tiempo ni lesionarte. Mira la técnica anatómica en bucle, sustituye al instante ejercicios en casa y registra tus cargas, fotos y comidas sin fricción.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => onOpenAuth("SIGNUP")}
              className="w-full sm:w-auto rounded-2xl bg-[#A3E635] text-black px-8 py-3.5 text-sm font-black shadow-xl shadow-[#A3E635]/25 hover:shadow-[#A3E635]/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Personalizar Mi Entrenamiento</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              type="button"
              onClick={() => onOpenAuth("LOGIN")}
              className="w-full sm:w-auto rounded-2xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 px-6 py-3.5 text-sm font-semibold text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Users className="h-4 w-4 text-[#A3E635]" />
              <span>Ya soy Miembro</span>
            </button>
          </div>

          {/* Espacio Publicitario Estratégico 320x50 Adsterra sin contorno */}
          <div className="pt-4 flex justify-center">
            <AdBanner format="320x50" placementName="Patrocinador Oficial" />
          </div>

          {/* Banner de Galería Fitness Motivacional (Hombres, Mujeres y Gimnasio) */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-5xl mx-auto">
            {/* Foto 1: Mujer Atleta / Glúteos y Pierna */}
            <div className="relative group rounded-2xl overflow-hidden border border-zinc-800/80 h-52 sm:h-64 shadow-lg">
              <img
                src={FITNESS_IMAGES.fitWomanGlutes}
                alt="Fitness Femenino"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-fuchsia-500/80 text-white px-2 py-0.5 rounded">
                  Enfoque Femenino
                </span>
                <p className="text-xs font-bold text-white mt-1">Glúteos & Cintura Fina</p>
                <p className="text-[10px] text-zinc-400">Hip Thrust & Búlgaras</p>
              </div>
            </div>

            {/* Foto 2: Hombre Atleta / Fuerza & Torso V */}
            <div className="relative group rounded-2xl overflow-hidden border border-zinc-800/80 h-52 sm:h-64 shadow-lg">
              <img
                src={FITNESS_IMAGES.fitManStrength}
                alt="Fuerza Masculina"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500/80 text-black px-2 py-0.5 rounded font-black">
                  Enfoque Masculino
                </span>
                <p className="text-xs font-bold text-white mt-1">Torso V & Hombros 3D</p>
                <p className="text-[10px] text-zinc-400">Sobrecarga Progresiva</p>
              </div>
            </div>

            {/* Foto 3: Gimnasio Pro & Mancuernas */}
            <div className="relative group rounded-2xl overflow-hidden border border-zinc-800/80 h-52 sm:h-64 shadow-lg">
              <img
                src={FITNESS_IMAGES.dumbbellsGym}
                alt="Mancuernas y Pesas Gym"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#A3E635] text-black px-2 py-0.5 rounded font-black">
                  Hierro & Pesas
                </span>
                <p className="text-xs font-bold text-white mt-1">Modo Gym Completo</p>
                <p className="text-[10px] text-zinc-400">Racks, Poleas & Barras</p>
              </div>
            </div>

            {/* Foto 4: Entrenamiento en Casa / Versatilidad */}
            <div className="relative group rounded-2xl overflow-hidden border border-zinc-800/80 h-52 sm:h-64 shadow-lg">
              <img
                src={FITNESS_IMAGES.homeWorkoutFit}
                alt="Entrenamiento Casa"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/80 text-black px-2 py-0.5 rounded font-black">
                  En Casa o Viaje
                </span>
                <p className="text-xs font-bold text-white mt-1">Sin Excusas</p>
                <p className="text-[10px] text-zinc-400">Bandas, Sillas & Mancuernas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mockup Interactivo Visual Fitness */}
        <div className="mt-12 max-w-5xl mx-auto px-4">
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 shadow-2xl">
            <div className="rounded-[22px] bg-[#0c0c0e] border border-zinc-800 p-4 sm:p-6 overflow-hidden">
              {/* Header de la App Simulado */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-zinc-400">MyGymBrou · Vista de Rutina Biomecánica</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-emerald-500/10 text-[#A3E635] px-2.5 py-1 rounded font-mono font-bold border border-[#A3E635]/30">
                    SOBRECARGA DETECTADA: +2.5 KG
                  </span>
                </div>
              </div>

              {/* Grid Simulado de Ejercicio */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Visualizador de técnica animada */}
                <div className="lg:col-span-7 bg-zinc-950 rounded-2xl border border-zinc-800 p-4 relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-[#A3E635]" />
                      Glúteos & Isquios / Pierna Completa
                    </span>
                    <span className="text-[11px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                      Nivel: Intermedio · RPE 8.5
                    </span>
                  </div>

                  <div className="relative h-60 sm:h-72 w-full rounded-xl bg-zinc-950 flex items-center justify-center overflow-hidden border border-zinc-800/60">
                    <img
                      src="/exercises/home_single_leg_hip_thrust.jpg"
                      alt="Demostración Biomecánica En Casa y Gym"
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Botones de lienzo flotante limpio */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                        <Activity className="w-3.5 h-3.5 text-[#A3E635]" />
                        <span className="font-semibold text-white">Vista: Biomecánica HD · En Casa & Gym</span>
                      </div>
                      <div className="bg-[#A3E635] text-black px-2.5 py-1 rounded-md font-bold text-[11px] shadow">
                        Músculo Activo: Glúteo Mayor & Isquios
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel de Datos Rápidos para Hombre / Mujer */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Progresión Personalizada
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-black text-white">72.5 kg</span>
                      <span className="text-xs font-bold text-[#A3E635] flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> +5% este mes
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Cálculo de 1RM estimado: <strong className="text-white">92.0 kg</strong>. Recomendación: mantén 3 series de 8 a 10 reps con 90s de descanso.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-300">¿Entrenando en Casa Hoy?</span>
                      <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">
                        1 Clic
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Sustitución inmediata por <em>Hip Thrust Unilateral con Banda o Sofá</em>. Mismo estímulo hipertrófico sin barra.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-zinc-900 border border-emerald-500/30 space-y-1.5">
                    <div className="text-xs font-bold text-[#A3E635] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Coach IA Nutricional
                    </div>
                    <p className="text-[11px] text-zinc-300">
                      "Para optimizar la síntesis proteica de tu sesión de hoy, consume 32g de proteína en tu siguiente comida."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Segmentada con Fotos Grandes: Diseñado Tanto para Ellas como para Ellos */}
      <section className="relative z-10 py-16 sm:py-24 border-t border-zinc-800/80 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A3E635] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Target className="w-3.5 h-3.5" />
              Entrenamiento a Tu Medida
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Diseñado para los objetivos que de verdad te importan
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              No importa si tu meta es tonificar glúteos y piernas, construir un torso en V con fuerza brutal o quemar grasa corporal manteniendo masa magra: el algoritmo adapta el volumen y los ejercicios.
            </p>

            {/* Selector de Pestaña de Enfoque */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveGenderTab("ALL")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeGenderTab === "ALL"
                    ? "bg-[#A3E635] text-black"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                Todos los Enfoques
              </button>
              <button
                type="button"
                onClick={() => setActiveGenderTab("WOMEN")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeGenderTab === "WOMEN"
                    ? "bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/25"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                Enfoque Femenino (Glúteos, Pierna & Cintura)
              </button>
              <button
                type="button"
                onClick={() => setActiveGenderTab("MEN")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeGenderTab === "MEN"
                    ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/25"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                Enfoque Masculino (Pecho, Espalda V-Taper & Hombros)
              </button>
            </div>
          </div>

          {/* Cards Comparativas de Metas con Fotos Reales Fitness */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Glúteos y Pierna */}
            {(activeGenderTab === "ALL" || activeGenderTab === "WOMEN") && (
              <div className="rounded-3xl border border-fuchsia-500/30 bg-gradient-to-b from-fuchsia-950/20 to-zinc-900/60 overflow-hidden relative flex flex-col justify-between group">
                <div className="h-48 w-full relative overflow-hidden">
                  <img
                    src={FITNESS_IMAGES.fitWomanGym}
                    alt="Entrenamiento Femenino Pierna"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                  <div className="absolute top-3 left-3 bg-fuchsia-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase">
                    Curvas & Firmeza
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white">
                    Glúteos, Isquios & Cintura Fina
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Programación especializada en vectores horizontales y verticales: Hip Thrust, Sentadilla Búlgara y Peso Muerto Rumano con control de tensión en elongación.
                  </p>
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-300">
                    <span className="flex items-center gap-1 font-semibold text-fuchsia-300">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Frecuencia 2-3x
                    </span>
                    <span className="font-mono text-zinc-500">Volumen adaptativo</span>
                  </div>
                </div>
              </div>
            )}

            {/* Card 2: Torso en V & Fuerza */}
            {(activeGenderTab === "ALL" || activeGenderTab === "MEN") && (
              <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-zinc-900/60 overflow-hidden relative flex flex-col justify-between group">
                <div className="h-48 w-full relative overflow-hidden">
                  <img
                    src={FITNESS_IMAGES.fitManBack}
                    alt="Entrenamiento Espalda y Torso"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                  <div className="absolute top-3 left-3 bg-cyan-500 text-black font-black text-[10px] px-2.5 py-1 rounded-full uppercase">
                    Torso & Fuerza
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white">
                    Pecho, Espalda V-Taper & Hombros 3D
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Rutinas Push-Pull-Legs o Torso/Pierna calculadas para progresar semana a semana con banca, remos pesados y elevaciones laterales con microcargas.
                  </p>
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-300">
                    <span className="flex items-center gap-1 font-semibold text-cyan-300">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Sobrecarga Progresiva
                    </span>
                    <span className="font-mono text-zinc-500">Detector 1RM</span>
                  </div>
                </div>
              </div>
            )}

            {/* Card 3: Definición & Pérdida de Grasa */}
            <div className="rounded-3xl border border-[#A3E635]/30 bg-gradient-to-b from-emerald-950/20 to-zinc-900/60 overflow-hidden relative flex flex-col justify-between group">
              <div className="h-48 w-full relative overflow-hidden">
                <img
                  src={FITNESS_IMAGES.communityPower}
                  alt="Definición y Quema Grasa"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                <div className="absolute top-3 left-3 bg-[#A3E635] text-black font-black text-[10px] px-2.5 py-1 rounded-full uppercase">
                  Definición Extrema
                </div>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-white">
                  Quema Grasa Manteniendo Músculo
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Integra timers de EMOM / AMRAP y superseries inteligentes para elevar tu gasto metabólico sin quemar tu masa magra ni vaciar tus reservas de energía.
                </p>
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-300">
                  <span className="flex items-center gap-1 font-semibold text-[#A3E635]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Déficit Controlado
                  </span>
                  <span className="font-mono text-zinc-500">Macros Automáticos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de 6 Pilares Tecnológicos de MyGymBrou */}
      <section className="relative z-10 border-t border-zinc-800/80 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Las 6 Funcionalidades que nos hacen únicos
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Hecho con ciencia biomecánica real y cero fricción para que entrenar sea tu momento favorito del día.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-3 hover:border-zinc-700 transition-colors">
              <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 text-[#A3E635] flex items-center justify-center">
                <Dumbbell className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Lienzo Visual Despejado
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Mira el ejercicio completo sin botones que tapen la imagen. Alterna con un toque entre Animación fluida, Lámina Anatómica y Fotos Reales de inicio y contracción.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-3 hover:border-zinc-700 transition-colors">
              <div className="h-11 w-11 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Home className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Alternativa En Casa al Instante
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                ¿Llueve o se te hizo tarde? Cambia cualquier ejercicio a una alternativa casera con mancuernas, bandas o peso corporal trabajando con el mismo patrón motor.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-3 hover:border-zinc-700 transition-colors">
              <div className="h-11 w-11 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Timer className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Rutinas de 45 min a 1.5 Horas
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Elige modo Express (2 series por ejercicio), Estándar (3 series) o Pro (6 ejercicios de 4 series) para no quedarte sin entrenar aunque tengas poco tiempo.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-3 hover:border-zinc-700 transition-colors">
              <div className="h-11 w-11 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Camera className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Visión IA de Comidas (USDA)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tómale una foto a tu plato y la IA desglosa calorías, proteínas, carbohidratos y grasas con base de datos científica sin tener que escribir todo a mano.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-3 hover:border-zinc-700 transition-colors">
              <div className="h-11 w-11 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <LineChart className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Detector de Mesetas y 1RM
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Te avisa si tu peso o repeticiones se han estancado por más de 3 semanas y te sugiere un ajuste de carga o cambio de variante para seguir ganando músculo.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-3 hover:border-zinc-700 transition-colors">
              <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 text-[#A3E635] flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Privacidad Supabase & Dokploy
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tus medidas corporales, fotos de progreso y registros se almacenan en tu propia base con Row Level Security. Nadie más puede acceder a tu cuenta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner de Cierre / Call to Action Final */}
      <section className="relative z-10 py-16 sm:py-24 border-t border-zinc-800/80 bg-gradient-to-b from-zinc-900/50 to-black">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/30 mb-2">
            <Award className="w-7 h-7" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            ¿Listo para tu mejor versión física?
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
            Configura en menos de 2 minutos tu perfil, tus días de entreno y si prefieres gimnasio o casa. La app adaptará todo por ti.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onOpenAuth("SIGNUP")}
              className="rounded-2xl bg-[#A3E635] text-black px-8 py-4 text-sm font-black shadow-xl shadow-[#A3E635]/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <span>Crear Cuenta y Configurar Mi Rutina</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer className="border-t border-zinc-800/80 py-8 text-center text-xs text-zinc-500">
        <p>© 2026 MyGymBrou · Listo para Dokploy & Supabase.</p>
      </footer>
    </div>
  );
}
