"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Timer,
  Pause,
  Play,
  X,
  Plus,
  Minus,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Flag,
  Flame,
  Zap,
  Clock,
} from "lucide-react";

interface FloatingRestTimerProps {
  active: boolean;
  remainingSec: number;
  totalSec: number;
  paused: boolean;
  contextLabel: string;
  onAdjustSeconds: (delta: number) => void;
  onTogglePause: () => void;
  onClose: () => void;
  onSelectPreset: (seconds: number) => void;
}

type WodTimerMode = "REST" | "TABATA" | "EMOM" | "STOPWATCH";

export function playWodBeep(type: "countdown" | "go" | "finish") {
  try {
    if (typeof window === "undefined") return;
    if ("vibrate" in navigator) {
      navigator.vibrate(
        type === "finish" ? [250, 100, 250, 100, 300] : [120]
      );
    }
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const playTone = (
      freq: number,
      startOffset: number,
      duration: number,
      wave: OscillatorType = "sine"
    ) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = wave;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, ctx.currentTime + startOffset);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + startOffset + duration
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + startOffset);
      osc.stop(ctx.currentTime + startOffset + duration);
    };

    if (type === "countdown") {
      // Pitido corto 3-2-1 estilo WOD Timer
      playTone(660, 0, 0.12, "triangle");
    } else if (type === "go") {
      // Pitido agudo de inicio de ronda
      playTone(1046.5, 0, 0.28, "square");
    } else {
      // Doble tono potente de finalización
      playTone(880, 0, 0.18, "triangle");
      playTone(1174.66, 0.2, 0.35, "triangle");
    }
  } catch {
    // Ignore audio context restrictions
  }
}

export default function FloatingRestTimer({
  active,
  remainingSec,
  totalSec,
  paused,
  contextLabel,
  onAdjustSeconds,
  onTogglePause,
  onClose,
  onSelectPreset,
}: FloatingRestTimerProps) {
  const [mode, setMode] = useState<WodTimerMode>("REST");
  const [expanded, setExpanded] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Estados internos para los modos TABATA, EMOM y STOPWATCH
  const [internalRunning, setInternalRunning] = useState<boolean>(false);
  const [tabataPhase, setTabataPhase] = useState<"WORK" | "REST">("WORK");
  const [tabataRound, setTabataRound] = useState<number>(1);
  const [tabataSec, setTabataSec] = useState<number>(20);

  const [emomRound, setEmomRound] = useState<number>(1);
  const [emomSec, setEmomSec] = useState<number>(60);

  const [stopwatchSec, setStopwatchSec] = useState<number>(0);
  const [laps, setLaps] = useState<number[]>([]);

  const prevRestRemainingRef = useRef<number>(remainingSec);

  // Sonidos 3-2-1 y Final en el modo REST principal
  useEffect(() => {
    if (!active || mode !== "REST" || !soundEnabled) return;
    if (remainingSec !== prevRestRemainingRef.current) {
      prevRestRemainingRef.current = remainingSec;
      if (remainingSec > 0 && remainingSec <= 3) {
        playWodBeep("countdown");
      } else if (remainingSec === 0) {
        playWodBeep("finish");
      }
    }
  }, [active, mode, remainingSec, soundEnabled]);

  // Motor de reloj para TABATA, EMOM y STOPWATCH
  useEffect(() => {
    if (!active || mode === "REST" || !internalRunning) return;

    const interval = setInterval(() => {
      if (mode === "TABATA") {
        setTabataSec((prev) => {
          if (prev > 1) {
            const next = prev - 1;
            if (soundEnabled && next <= 3) playWodBeep("countdown");
            return next;
          }
          // Cambio de fase Tabata
          if (tabataPhase === "WORK") {
            if (soundEnabled) playWodBeep("finish");
            setTabataPhase("REST");
            return 10;
          } else {
            if (tabataRound < 8) {
              if (soundEnabled) playWodBeep("go");
              setTabataRound((r) => r + 1);
              setTabataPhase("WORK");
              return 20;
            } else {
              if (soundEnabled) playWodBeep("finish");
              setInternalRunning(false);
              return 0;
            }
          }
        });
      } else if (mode === "EMOM") {
        setEmomSec((prev) => {
          if (prev > 1) {
            const next = prev - 1;
            if (soundEnabled && next <= 3) playWodBeep("countdown");
            return next;
          }
          if (emomRound < 10) {
            if (soundEnabled) playWodBeep("go");
            setEmomRound((r) => r + 1);
            return 60;
          } else {
            if (soundEnabled) playWodBeep("finish");
            setInternalRunning(false);
            return 0;
          }
        });
      } else if (mode === "STOPWATCH") {
        setStopwatchSec((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    active,
    mode,
    internalRunning,
    tabataPhase,
    tabataRound,
    emomRound,
    soundEnabled,
  ]);

  if (!active) return null;

  // Cálculo de tiempo y porcentaje según el modo activo
  let displaySeconds = remainingSec;
  let currentMaxSec = Math.max(1, totalSec);
  let phaseBadge = "DESCANSO";
  let accentColor = "#A3E635"; // Volt
  let subStatus = contextLabel;

  if (mode === "REST") {
    displaySeconds = remainingSec;
    currentMaxSec = Math.max(1, totalSec);
    phaseBadge = remainingSec === 0 ? "¡LISTO!" : paused ? "PAUSADO" : "REST";
    accentColor = remainingSec <= 5 && remainingSec > 0 ? "#F59E0B" : "#A3E635";
    subStatus = contextLabel;
  } else if (mode === "TABATA") {
    displaySeconds = tabataSec;
    currentMaxSec = tabataPhase === "WORK" ? 20 : 10;
    phaseBadge =
      tabataPhase === "WORK"
        ? `WORK • RONDA ${tabataRound}/8`
        : `REST • RONDA ${tabataRound}/8`;
    accentColor = tabataPhase === "WORK" ? "#F43F5E" : "#22D3EE";
    subStatus = "Tabata Pro 20s Trabajo / 10s Descanso";
  } else if (mode === "EMOM") {
    displaySeconds = emomSec;
    currentMaxSec = 60;
    phaseBadge = `EMOM • MINUTO ${emomRound}/10`;
    accentColor = "#22D3EE";
    subStatus = "Cada minuto inicia nueva serie (1:00)";
  } else if (mode === "STOPWATCH") {
    displaySeconds = stopwatchSec;
    currentMaxSec = 60;
    phaseBadge = `FOR TIME • ${laps.length} LAPS`;
    accentColor = "#A3E635";
    subStatus = "Cronómetro libre con registro de vueltas";
  }

  const mins = Math.floor(displaySeconds / 60);
  const secs = displaySeconds % 60;
  const formattedTime = `${String(mins).padStart(2, "0")}:${String(
    secs
  ).padStart(2, "0")}`;

  const progressRatio =
    mode === "STOPWATCH"
      ? (displaySeconds % 60) / 60
      : Math.min(1, Math.max(0, displaySeconds / currentMaxSec));

  const isRunning = mode === "REST" ? !paused : internalRunning;

  const handleTogglePlay = () => {
    if (mode === "REST") {
      onTogglePause();
    } else {
      setInternalRunning((prev) => !prev);
    }
  };

  const handleResetCurrentMode = () => {
    if (mode === "REST") {
      onSelectPreset(totalSec);
    } else if (mode === "TABATA") {
      setInternalRunning(false);
      setTabataPhase("WORK");
      setTabataRound(1);
      setTabataSec(20);
    } else if (mode === "EMOM") {
      setInternalRunning(false);
      setEmomRound(1);
      setEmomSec(60);
    } else if (mode === "STOPWATCH") {
      setInternalRunning(false);
      setStopwatchSec(0);
      setLaps([]);
    }
  };

  const handleRecordLap = () => {
    if (mode === "STOPWATCH" && stopwatchSec > 0) {
      setLaps((prev) => [stopwatchSec, ...prev.slice(0, 4)]);
    }
  };

  // Parámetros del anillo SVG
  const compactRadius = 26;
  const compactCircumference = 2 * Math.PI * compactRadius;
  const compactStrokeDashoffset =
    compactCircumference * (1 - progressRatio);

  const largeRadius = 92;
  const largeCircumference = 2 * Math.PI * largeRadius;
  const largeStrokeDashoffset = largeCircumference * (1 - progressRatio);

  // =====================================================================
  // MODO EXPANDIDO: ESTUDIO WOD TIMER PLUS PANTALLA COMPLETA / MODAL PRO
  // =====================================================================
  if (expanded) {
    return (
      <div
        role="dialog"
        aria-label="WOD Timer Pro"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      >
        <div className="w-full max-w-lg rounded-3xl border-2 border-zinc-800 bg-[#09090B] text-zinc-50 p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Barra superior del WOD Timer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#09090B] font-black"
                style={{ backgroundColor: accentColor }}
              >
                <Timer className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#A3E635] block">
                  WOD TIMER PRO • STUDIO
                </span>
                <span className="text-xs font-bold text-zinc-400 block truncate max-w-[230px]">
                  {subStatus}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSoundEnabled((prev) => !prev)}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-300 hover:text-white"
                title={soundEnabled ? "Silenciar pitidos" : "Activar pitidos"}
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4 text-[#A3E635]" />
                ) : (
                  <VolumeX className="h-4 w-4 text-zinc-500" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-300 hover:text-white"
                title="Minimizar a barra flotante"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-300 hover:text-rose-400"
                title="Cerrar cronómetro"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Selector de los 4 Modos de WOD Timer */}
          <div className="grid grid-cols-4 gap-1.5 rounded-2xl bg-[#121214] p-1.5 border border-zinc-800">
            {(
              [
                { id: "REST", label: "REST", icon: Clock },
                { id: "TABATA", label: "TABATA", icon: Flame },
                { id: "EMOM", label: "EMOM", icon: Zap },
                { id: "STOPWATCH", label: "CRONO", icon: Flag },
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              const isSelected = mode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-black tracking-wider transition-all ${
                    isSelected
                      ? "bg-[#A3E635] text-[#09090B] shadow-md"
                      : "text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Anillo Circular Gigante estilo WOD Timer Plus */}
          <div className="relative flex flex-col items-center justify-center py-2">
            <svg className="h-60 w-60 -rotate-90 transform" viewBox="0 0 220 220">
              <circle
                cx="110"
                cy="110"
                r={largeRadius}
                stroke="#18181B"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="110"
                cy="110"
                r={largeRadius}
                stroke={accentColor}
                strokeWidth="12"
                strokeDasharray={largeCircumference}
                strokeDashoffset={largeStrokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-300"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span
                className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#09090B]"
                style={{ backgroundColor: accentColor }}
              >
                {phaseBadge}
              </span>
              <span className="mt-2 font-mono text-6xl font-black tracking-tighter text-white">
                {formattedTime}
              </span>
              {displaySeconds > 0 && displaySeconds <= 3 && mode !== "STOPWATCH" && (
                <span className="mt-1 text-xs font-extrabold uppercase tracking-widest text-amber-400 animate-pulse">
                  ¡Prepárate • {displaySeconds}!
                </span>
              )}
            </div>
          </div>

          {/* Controles Principales de Reproducción */}
          <div className="flex items-center justify-center gap-3">
            {mode === "REST" && (
              <button
                type="button"
                onClick={() => onAdjustSeconds(-15)}
                className="rounded-2xl border border-zinc-800 bg-[#121214] px-4 py-3 font-mono text-xs font-extrabold text-zinc-200 hover:border-zinc-600"
              >
                -15s
              </button>
            )}

            <button
              type="button"
              onClick={handleResetCurrentMode}
              className="rounded-2xl border border-zinc-800 bg-[#121214] p-3.5 text-zinc-300 hover:text-white"
              title="Reiniciar"
            >
              <RotateCcw className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={handleTogglePlay}
              className="flex h-16 w-28 items-center justify-center gap-2 rounded-2xl text-sm font-black uppercase tracking-wider text-[#09090B] shadow-lg transition-transform active:scale-95"
              style={{ backgroundColor: accentColor }}
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5 fill-current" />
                  Pausa
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 fill-current" />
                  Iniciar
                </>
              )}
            </button>

            {mode === "REST" && (
              <button
                type="button"
                onClick={() => onAdjustSeconds(15)}
                className="rounded-2xl border border-zinc-800 bg-[#121214] px-4 py-3 font-mono text-xs font-extrabold text-zinc-200 hover:border-zinc-600"
              >
                +15s
              </button>
            )}

            {mode === "STOPWATCH" && (
              <button
                type="button"
                onClick={handleRecordLap}
                className="rounded-2xl border border-zinc-700 bg-[#121214] px-4 py-3 text-xs font-extrabold text-[#22D3EE] hover:border-[#22D3EE]"
              >
                + Lap
              </button>
            )}
          </div>

          {/* Presets de Descanso o Lista de Vueltas */}
          {mode === "REST" && (
            <div className="grid grid-cols-5 gap-2 pt-2">
              {[45, 60, 90, 120, 180].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => onSelectPreset(sec)}
                  className={`rounded-xl py-2 font-mono text-xs font-extrabold border transition-all ${
                    totalSec === sec
                      ? "border-[#A3E635] bg-[#A3E635]/15 text-[#A3E635]"
                      : "border-zinc-800 bg-[#121214] text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          )}

          {mode === "STOPWATCH" && laps.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {laps.map((lapSec, idx) => {
                const lm = Math.floor(lapSec / 60);
                const ls = lapSec % 60;
                return (
                  <span
                    key={`${lapSec}-${idx}`}
                    className="rounded-lg border border-zinc-800 bg-[#121214] px-2.5 py-1 font-mono text-xs font-bold text-zinc-300"
                  >
                    Lap {laps.length - idx}: {String(lm).padStart(2, "0")}:
                    {String(ls).padStart(2, "0")}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =====================================================================
  // MODO COMPACTO FLOTANTE PRO (CON ANILLO CIRCULAR Y CAMBIO DE MODO)
  // =====================================================================
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 sm:bottom-6 right-4 left-4 sm:left-auto sm:w-[410px] z-50 rounded-3xl border-2 border-zinc-800 bg-[#09090B] text-zinc-50 p-4 shadow-2xl"
    >
      {/* Fila superior: Pestañas rápidas de Modo WOD + Botones Expandir/Cerrar */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-zinc-800/90">
        <div className="flex items-center gap-1 rounded-xl bg-[#121214] p-1 border border-zinc-800">
          {(["REST", "TABATA", "EMOM", "STOPWATCH"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-wider transition-all ${
                mode === m
                  ? "bg-[#A3E635] text-[#09090B]"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {m === "STOPWATCH" ? "CRONO" : m}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
            title={soundEnabled ? "Sonido activo" : "Silenciado"}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-[#A3E635]" />
            ) : (
              <VolumeX className="h-4 w-4 text-zinc-500" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-[#A3E635]"
            title="Abrir WOD Timer en Pantalla Grande"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Cerrar cronómetro"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-rose-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Cuerpo principal: Anillo Circular SVG + Display Digital Gigante + Controles */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Anillo de progreso circular estilo Timer Plus */}
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
            <svg className="h-16 w-16 -rotate-90 transform" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r={compactRadius}
                stroke="#18181B"
                strokeWidth="5"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r={compactRadius}
                stroke={accentColor}
                strokeWidth="5"
                strokeDasharray={compactCircumference}
                strokeDashoffset={compactStrokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-300"
              />
            </svg>
            <span
              className="absolute font-mono text-[10px] font-black"
              style={{ color: accentColor }}
            >
              {Math.round(progressRatio * 100)}%
            </span>
          </div>

          <div>
            <span
              className="inline-block rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#09090B]"
              style={{ backgroundColor: accentColor }}
            >
              {phaseBadge}
            </span>
            <div className="mt-0.5 font-mono text-3xl font-black tracking-tight text-white">
              {formattedTime}
            </div>
            <span className="block truncate max-w-[165px] text-[11px] font-medium text-zinc-400">
              {subStatus}
            </span>
          </div>
        </div>

        {/* Botones de Acción Rápida */}
        <div className="flex items-center gap-1.5">
          {mode === "REST" && (
            <button
              type="button"
              aria-label="Restar 15 segundos"
              onClick={() => onAdjustSeconds(-15)}
              className="inline-flex items-center gap-0.5 rounded-xl border border-zinc-800 bg-[#121214] px-2.5 py-2 font-mono text-xs font-extrabold text-zinc-200 hover:border-zinc-700"
            >
              <Minus className="h-3 w-3" />
              15s
            </button>
          )}

          <button
            type="button"
            aria-label={isRunning ? "Pausar cronómetro" : "Iniciar cronómetro"}
            onClick={handleTogglePlay}
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-[#09090B] shadow-md transition-transform active:scale-95"
            style={{ backgroundColor: accentColor }}
          >
            {isRunning ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current" />
            )}
          </button>

          {mode === "REST" ? (
            <button
              type="button"
              aria-label="Sumar 15 segundos"
              onClick={() => onAdjustSeconds(15)}
              className="inline-flex items-center gap-0.5 rounded-xl border border-zinc-800 bg-[#121214] px-2.5 py-2 font-mono text-xs font-extrabold text-zinc-200 hover:border-zinc-700"
            >
              <Plus className="h-3 w-3" />
              15s
            </button>
          ) : (
            <button
              type="button"
              aria-label="Reiniciar modo"
              onClick={handleResetCurrentMode}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-[#121214] p-2.5 text-zinc-300 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Presets inferiores cuando está en modo REST */}
      {mode === "REST" && (
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {[60, 90, 120, 180].map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => onSelectPreset(sec)}
              className={`rounded-xl py-1 font-mono text-[11px] font-extrabold border transition-all ${
                totalSec === sec
                  ? "border-[#A3E635] bg-[#A3E635]/15 text-[#A3E635]"
                  : "border-zinc-800 bg-[#121214] text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
