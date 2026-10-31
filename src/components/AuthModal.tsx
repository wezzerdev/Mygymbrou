"use client";

import React, { useState } from "react";
import {
  Dumbbell,
  Sparkles,
  Camera,
  Calendar,
  LineChart,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  Timer,
  Zap,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AuthModalProps {
  initialMode?: "LOGIN" | "SIGNUP";
  onSuccess: (user: any) => void;
  onClose: () => void;
}

export default function AuthModal({
  initialMode = "LOGIN",
  onSuccess,
  onClose,
}: AuthModalProps) {
  const [mode, setMode] = useState<"LOGIN" | "SIGNUP">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === "SIGNUP" && !termsAccepted) {
      setErrorMsg("Debes aceptar los Términos y Condiciones y la Política de Privacidad para crear tu cuenta.");
      return;
    }

    setLoading(true);

    try {
      // Usamos el endpoint API directo del servidor para evitar bloqueos de CORS o variables de navegador
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: mode,
          email,
          password,
          fullName: mode === "SIGNUP" ? fullName : undefined,
        }),
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        const diagInfo = result.diagnostic ? ` [Diag: ${JSON.stringify(result.diagnostic)}]` : "";
        throw new Error((result.error || "Error al procesar la solicitud con Supabase") + diagInfo);
      }

      if (result.data?.session) {
        await supabase.auth.setSession(result.data.session);
      }

      if (result.data?.user) {
        const authedUser = result.data.user;
        const initialProfile = {
          id: authedUser.id,
          email: authedUser.email || email,
          full_name: fullName || authedUser.user_metadata?.full_name || "Atleta",
          gender: "hombre",
          age: 25,
          height_cm: 175,
          weight_kg: 75,
          goal: "ganar_musculo",
          target_weight_kg: 80,
          weekly_workouts_target: 4,
          training_location: "gimnasio_comercial",
          preferred_duration_track: "standard",
          experience_level: "intermediate",
          training_years: 1.5,
          preferred_split: "PPL",
          onboarding_completed: true,
        };

        try {
          localStorage.setItem(`mygymbrou_profile_${authedUser.id}`, JSON.stringify(initialProfile));
          localStorage.setItem(`mygymbrou_onboarding_done_${authedUser.id}`, "true");
        } catch {}

        // Sincronizar en segundo plano con la base de datos
        fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile: initialProfile }),
        }).catch(() => {});

        onSuccess(authedUser);
      } else {
        throw new Error("No se pudo obtener el usuario. Revisa tu confirmación de correo o credenciales.");
      }
    } catch (err: any) {
      console.error("[AUTH ERROR]", err);
      setErrorMsg(err.message || "Error al autenticar con Supabase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="w-full max-w-md rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-[#A3E635] dark:bg-[#A3E635] dark:text-[#09090B]">
            <Dumbbell className="h-6 w-6" />
          </div>
          <h3 className="pt-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {mode === "LOGIN" ? "Inicia Sesión en MyGymBrou" : "Crea tu Cuenta Personal"}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {mode === "LOGIN"
              ? "Tus marcas, fotos nutricionales y rutinas sincronizadas en tu propia base de datos."
              : "Configura tus metas, nivel y equipo disponible para una experiencia personalizada al 100%."}
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "SIGNUP" && (
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Carlos Mendoza"
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#18181B] px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-950 dark:focus:border-[#A3E635]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="h-4 w-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#18181B] pl-9 pr-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-950 dark:focus:border-[#A3E635]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="h-4 w-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#18181B] pl-9 pr-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-950 dark:focus:border-[#A3E635]"
              />
            </div>
          </div>

          {mode === "SIGNUP" && (
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-zinc-600 dark:text-zinc-400 select-none">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 text-[#A3E635] focus:ring-[#A3E635] dark:bg-[#18181B] cursor-pointer"
                />
                <span>
                  He leído y acepto los{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="font-bold underline text-zinc-900 dark:text-[#A3E635] hover:opacity-80"
                  >
                    Términos y Condiciones
                  </button>{" "}
                  y la Política de Privacidad y Consentimiento de Salud Deportiva.
                </span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-zinc-900 text-white dark:bg-[#A3E635] dark:text-[#09090B] py-2.5 text-xs font-bold shadow hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Conectando con Supabase...</span>
            ) : (
              <>
                <span>{mode === "LOGIN" ? "Entrar a mi Gimnasio" : "Continuar a Configuración Inicial"}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-200/80 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setMode(mode === "LOGIN" ? "SIGNUP" : "LOGIN")}
            className="hover:underline text-zinc-700 dark:text-zinc-300 font-medium"
          >
            {mode === "LOGIN" ? "¿No tienes cuenta? Regístrate aquí" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

      {/* Modal Emergente de Términos y Condiciones */}
      {showTermsModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-[#121214] p-6 text-zinc-200 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#A3E635]" />
                Términos, Condiciones y Deslinde de Responsabilidad
              </h4>
            </div>

            <div className="overflow-y-auto space-y-3 text-xs text-zinc-400 pr-2 leading-relaxed flex-1">
              <p>
                <strong className="text-white">1. Propósito Informativo y Educativo:</strong> MyGymBrou es una plataforma inteligente de asistencia deportiva y seguimiento biométrico. Las sugerencias de carga, 1RM, ejercicios en casa/gimnasio y desglose nutricional por visión artificial son de carácter orientativo basadas en literatura científica deportiva.
              </p>
              <p>
                <strong className="text-white">2. Consentimiento de Actividad Física:</strong> El usuario reconoce que el entrenamiento con sobrecarga y ejercicios físicos intensos conllevan riesgo inherente de lesión. Se recomienda consultar a un médico o profesional de la salud antes de comenzar cualquier programa de ejercicio de alta intensidad.
              </p>
              <p>
                <strong className="text-white">3. Deslinde de Responsabilidad Médica:</strong> MyGymBrou y sus creadores quedan exentos de responsabilidad ante lesiones musculares, articulares o cualquier daño derivado de una técnica inadecuada o uso indebido de los pesos seleccionados.
              </p>
              <p>
                <strong className="text-white">4. Privacidad y Seguridad de Datos:</strong> Tus datos biométricos, fotos de comidas y registros de entrenamiento se almacenan en tu propia instancia segura con Row Level Security (RLS) y no son compartidos con terceros sin tu consentimiento explícito.
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setTermsAccepted(true);
                  setShowTermsModal(false);
                }}
                className="rounded-xl bg-[#A3E635] text-black px-5 py-2 text-xs font-bold shadow hover:opacity-90"
              >
                Aceptar y Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
