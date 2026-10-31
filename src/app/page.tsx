"use client";

import React, { useState, useEffect } from "react";
import {
  Dumbbell,
  Camera,
  LineChart,
  Calendar,
  Sun,
  Moon,
  Timer,
  LogOut,
  User,
} from "lucide-react";
import GymLiveModule from "@/components/GymLiveModule";
import NutritionVisionModule from "@/components/NutritionVisionModule";
import MetricsStatsModule from "@/components/MetricsStatsModule";
import CalendarSplitModule from "@/components/CalendarSplitModule";
import FloatingRestTimer from "@/components/FloatingRestTimer";
import LandingPage from "@/components/LandingPage";
import AuthModal from "@/components/AuthModal";
import OnboardingWizard, { OnboardingData } from "@/components/OnboardingWizard";
import { WorkoutRoutineTemplate } from "@/lib/fitness-data";
import { supabase } from "@/lib/supabase";

type ActiveTab = "LIVE_GYM" | "NUTRITION" | "METRICS" | "CALENDAR";

export default function HomePage() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Modales de Auth y Onboarding
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"LOGIN" | "SIGNUP">("LOGIN");
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<ActiveTab>("LIVE_GYM");
  const [isDark, setIsDark] = useState<boolean>(true);
  const [activeRoutineId, setActiveRoutineId] =
    useState<WorkoutRoutineTemplate["id"]>("push");

  // Escuchar sesión de Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setCheckingAuth(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setProfileData(null);
        setCheckingAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (!error && data) {
        setProfileData(data);
        if (!data.onboarding_completed) {
          setShowOnboarding(true);
        }
      } else if (error && error.code === "PGRST116") {
        // No tiene perfil aún: disparar onboarding
        setShowOnboarding(true);
      }
    } catch {
      // Offline o error de red: continuar de manera tolerante
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleCompleteOnboarding = async (formData: OnboardingData) => {
    if (!sessionUser) return;
    try {
      const profilePayload = {
        id: sessionUser.id,
        email: sessionUser.email,
        full_name: formData.fullName,
        gender: formData.gender,
        age: formData.age,
        height_cm: formData.heightCm,
        weight_kg: formData.weightKg,
        goal: formData.goal,
        target_weight_kg: formData.targetWeightKg,
        weekly_workouts_target: formData.weeklyWorkoutsTarget,
        training_location: formData.trainingLocation,
        preferred_duration_track: formData.preferredDurationTrack,
        experience_level: formData.experienceLevel,
        training_years: formData.trainingYears,
        preferred_split: formData.preferredSplit,
        onboarding_completed: true,
      };

      // Guardado a través del endpoint seguro del servidor /api/profile
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: profilePayload }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        console.warn("[ONBOARDING WARNING]", json.error);
      }

      setProfileData({ ...formData, onboarding_completed: true });
      setShowOnboarding(false);
    } catch (err) {
      console.error("[ONBOARDING ERROR]", err);
      // Permitir continuar de forma bondadosa sin bloquear al usuario
      setProfileData({ ...formData, onboarding_completed: true });
      setShowOnboarding(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSessionUser(null);
    setProfileData(null);
  };

  const [restActive, setRestActive] = useState<boolean>(false);
  const [restRemaining, setRestRemaining] = useState<number>(90);
  const [restTotal, setRestTotal] = useState<number>(90);
  const [restPaused, setRestPaused] = useState<boolean>(false);
  const [restContext, setRestContext] = useState<string>(
    "Press Inclinado con Mancuernas • Serie #1"
  );

  const [workoutElapsedSec, setWorkoutElapsedSec] = useState<number>(1425);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWorkoutElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!restActive || restPaused || restRemaining <= 0) return;
    const timer = setInterval(() => {
      setRestRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [restActive, restPaused, restRemaining]);

  const handleStartRestTimer = (
    seconds: number,
    exerciseName: string,
    setNum: number
  ) => {
    setRestTotal(seconds);
    setRestRemaining(seconds);
    setRestPaused(false);
    setRestContext(`${exerciseName} • Serie #${setNum}`);
    setRestActive(true);
  };

  const formatSessionDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "LIVE_GYM", label: "Entrenar", icon: Dumbbell },
    { id: "NUTRITION", label: "Nutrición", icon: Camera },
    { id: "METRICS", label: "Progreso", icon: LineChart },
    { id: "CALENDAR", label: "Calendario", icon: Calendar },
  ];

  // Si no hay usuario autenticado, mostramos la Landing Page interactiva
  if (!checkingAuth && !sessionUser) {
    return (
      <>
        <LandingPage
          onOpenAuth={(mode) => {
            setAuthMode(mode);
            setShowAuthModal(true);
          }}
        />
        {showAuthModal && (
          <AuthModal
            initialMode={authMode}
            onSuccess={(user) => {
              setSessionUser(user);
              setShowAuthModal(false);
              loadUserProfile(user.id);
            }}
            onClose={() => setShowAuthModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#09090B] text-zinc-950 dark:text-zinc-50 pb-24 md:pb-12 transition-colors duration-200">
      {/* Wizard de Onboarding al crear cuenta nueva */}
      {showOnboarding && (
        <OnboardingWizard
          initialEmail={sessionUser?.email || ""}
          initialName={profileData?.full_name || ""}
          onComplete={handleCompleteOnboarding}
        />
      )}

      <header className="sticky top-0 z-40 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-[#09090B]/90 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 dark:bg-[#18181B] border border-zinc-800 shadow-sm">
              <Dumbbell className="h-4 w-4 text-[#A3E635]" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                MyGym<span className="text-emerald-700 dark:text-[#A3E635]">Brou</span>
              </span>
              {profileData?.full_name && (
                <span className="hidden sm:inline-block ml-2 text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                  Hola, {profileData.full_name.split(" ")[0]}
                </span>
              )}
            </div>
          </div>

          <nav
            aria-label="Secciones principales"
            className="hidden md:flex items-center gap-1 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-100/90 dark:bg-[#121214] p-1"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition-all ${
                    isActive
                      ? "bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635] dark:text-[#09090B] shadow-sm"
                      : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (!restActive) {
                  handleStartRestTimer(90, "WOD Timer • Sesión Activa", 1);
                } else {
                  setRestActive(false);
                }
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-950 text-white dark:bg-[#121214] dark:text-zinc-100 px-3 py-2 text-xs font-extrabold hover:border-[#A3E635] transition-colors shadow-sm"
              title="Abrir WOD Timer Pro (Descanso, Tabata, EMOM, Cronómetro)"
            >
              <Timer className="h-4 w-4 text-[#A3E635]" />
              <span className="hidden sm:inline text-[11px] font-black uppercase tracking-wider text-[#A3E635]">
                WOD Timer
              </span>
              <span className="font-mono">{formatSessionDuration(workoutElapsedSec)}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              aria-label="Cambiar tema claro u oscuro"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-[#A3E635] dark:bg-[#121214] dark:text-[#A3E635] hover:opacity-90 transition-opacity"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121214] text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pt-6">
        {activeTab === "LIVE_GYM" && (
          <GymLiveModule
            activeRoutineId={activeRoutineId}
            onSelectRoutine={setActiveRoutineId}
            onStartRestTimer={handleStartRestTimer}
          />
        )}
        {activeTab === "NUTRITION" && <NutritionVisionModule />}
        {activeTab === "METRICS" && <MetricsStatsModule />}
        {activeTab === "CALENDAR" && (
          <CalendarSplitModule
            onLaunchRoutineInGym={(routineId) => {
              setActiveRoutineId(routineId);
              setActiveTab("LIVE_GYM");
            }}
          />
        )}
      </main>

      <FloatingRestTimer
        active={restActive}
        remainingSec={restRemaining}
        totalSec={restTotal}
        paused={restPaused}
        contextLabel={restContext}
        onAdjustSeconds={(delta) =>
          setRestRemaining((prev) => Math.max(0, prev + delta))
        }
        onTogglePause={() => setRestPaused((prev) => !prev)}
        onClose={() => setRestActive(false)}
        onSelectPreset={(seconds) => {
          setRestTotal(seconds);
          setRestRemaining(seconds);
          setRestPaused(false);
        }}
      />

      <nav
        aria-label="Navegación móvil"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#09090B]/95 backdrop-blur-md px-3 py-2"
      >
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center rounded-xl py-2 text-[11px] font-extrabold transition-colors ${
                  isActive
                    ? "bg-zinc-950 text-[#A3E635] dark:bg-[#A3E635] dark:text-[#09090B]"
                    : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <Icon className="h-4 w-4 mb-0.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
