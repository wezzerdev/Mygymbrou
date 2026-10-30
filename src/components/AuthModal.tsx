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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === "SIGNUP") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        if (data.user) {
          onSuccess(data.user);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          onSuccess(data.user);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error al autenticar con Supabase");
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
}
