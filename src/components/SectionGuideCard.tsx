"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

interface SectionGuideCardProps {
  title: string;
  points: { title: string; desc: string }[];
  proTip?: string;
  defaultExpanded?: boolean;
}

export default function SectionGuideCard({
  title,
  points,
  proTip,
  defaultExpanded = false,
}: SectionGuideCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="w-full my-2.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-[#151518]/70 overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-zinc-100/50 dark:hover:bg-[#18181D]/50 transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-emerald-700 dark:text-[#A3E635]" />
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
          <span>{expanded ? "Ocultar guía" : "Ver guía rápida"}</span>
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-3.5 pt-1 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {points.map((p, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white dark:bg-[#101013] border border-zinc-200/60 dark:border-zinc-800/60"
              >
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block mb-0.5">
                  {idx + 1}. {p.title}
                </span>
                <span className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed block">
                  {p.desc}
                </span>
              </div>
            ))}
          </div>

          {proTip && (
            <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-800 dark:text-[#A3E635] bg-lime-500/10 dark:bg-lime-500/10 px-3 py-1.5 rounded-lg border border-lime-500/20">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>{proTip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
