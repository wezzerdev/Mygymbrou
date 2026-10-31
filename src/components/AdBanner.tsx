"use client";

import React, { useEffect, useRef, useState } from "react";

interface AdBannerProps {
  format?: "320x50" | "NATIVE";
  placementName?: string;
  className?: string;
  adKey?: string;
}

/**
 * AdBanner Component para Adsterra (320x50 Mobile Leaderboard y Native Banner)
 * Sin contornos molestos, optimizado para móvil para ocupar el menor espacio visual posible.
 */
export default function AdBanner({
  format = "320x50",
  placementName = "Publicidad",
  className = "",
  adKey,
}: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Si se proporciona una clave de Adsterra, inyectar el script de Adsterra
    if (adKey && containerRef.current) {
      try {
        const container = containerRef.current;
        container.innerHTML = "";

        const scriptOptions = document.createElement("script");
        scriptOptions.type = "text/javascript";
        scriptOptions.text = `
          atOptions = {
            'key' : '${adKey}',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        `;

        const scriptInvoke = document.createElement("script");
        scriptInvoke.type = "text/javascript";
        scriptInvoke.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
        scriptInvoke.async = true;

        container.appendChild(scriptOptions);
        container.appendChild(scriptInvoke);
        setAdLoaded(true);
      } catch (e) {
        console.warn("[ADSTERRA NOTICE]", e);
      }
    }
  }, [adKey]);

  if (format === "320x50") {
    return (
      <div
        className={`w-full flex flex-col items-center justify-center my-2 select-none overflow-hidden ${className}`}
        role="complementary"
        aria-label="Espacio publicitario"
      >
        <span className="text-[9px] uppercase tracking-wider text-zinc-400 dark:text-zinc-600 mb-0.5">
          {placementName}
        </span>
        <div
          ref={containerRef}
          className="w-[320px] h-[50px] max-w-full flex items-center justify-between px-3 bg-zinc-100/80 dark:bg-[#121215]/80 rounded-lg text-zinc-500 dark:text-zinc-400 text-xs shadow-none border-0 transition-opacity"
        >
          {/* Contenedor sin contorno exterior para mínima fricción */}
          {!adKey && (
            <div className="w-full flex items-center justify-between text-[11px] gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A3E635] shrink-0" />
                <span className="truncate font-semibold text-zinc-700 dark:text-zinc-300">
                  Espacio Patrocinado · Adsterra
                </span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 shrink-0">
                320x50
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Native Banner Format (In-feed sutil)
  return (
    <div
      className={`w-full max-w-xl mx-auto my-3 select-none ${className}`}
      role="complementary"
      aria-label="Espacio publicitario nativo"
    >
      <div className="w-full rounded-2xl bg-zinc-100/70 dark:bg-[#141418]/70 p-3 flex items-center justify-between gap-3 border-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-[#A3E635] shrink-0">
            Ad
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-semibold text-zinc-400 dark:text-zinc-500 block">
              {placementName}
            </span>
            <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">
              Patrocinadores de la Comunidad MyGymBrou
            </p>
          </div>
        </div>
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 shrink-0">
          Anuncio
        </span>
      </div>
    </div>
  );
}
