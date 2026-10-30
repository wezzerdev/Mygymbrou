"use client";

import React, { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";

interface InfoTooltipProps {
  title?: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

/**
 * Botón "?" accesible para limpiar la interfaz de textos largos.
 * Funciona al pasar el mouse (hover) en PC y al tocar con el dedo (click/tap) en celular.
 */
export default function InfoTooltip({
  title,
  content,
  position = "top",
}: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const posClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }[position];

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        aria-label={title || "Ver información de ayuda"}
        aria-expanded={open}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200/90 text-zinc-700 hover:bg-zinc-950 hover:text-[#A3E635] dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-[#A3E635] dark:hover:text-[#09090B] transition-colors shrink-0"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div
          role="tooltip"
          className={`absolute z-50 w-64 sm:w-72 rounded-2xl border border-zinc-800 bg-zinc-950 p-3.5 text-left text-xs text-zinc-100 shadow-2xl ${posClasses}`}
        >
          {title && (
            <span className="block font-extrabold text-[#A3E635] mb-1">
              {title}
            </span>
          )}
          <p className="font-medium leading-relaxed text-zinc-200">{content}</p>
        </div>
      )}
    </div>
  );
}
