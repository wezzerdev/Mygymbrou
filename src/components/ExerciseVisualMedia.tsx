"use client";

import React, { useEffect, useState } from "react";
import { Pause, Play, Columns2, Film, Home } from "lucide-react";

interface ExerciseDiagramProps {
  exerciseId: string;
  compact?: boolean;
  className?: string;
}

export interface AnatomicalSpriteSpec {
  sheetUrl: string;
  row: "top" | "bottom";
  gifUrl: string;
  freeExerciseDbId?: string;
  badge: string;
  primaryLabel: string;
  secondaryLabel: string;
  movementCue: string;
  customImageUrl?: string;
  customFrames?: string[]; // Secuencia de 2 o 3 fotogramas fluidos en alta definición estilo dark neón
  isHomeExercise?: boolean;
}

export const FREE_EXERCISE_DB_CDN_BASE =
  "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises";

export const FREE_EXERCISE_DB_ID_BY_SLUG: Record<string, string> = {
  "press-banca-inclinado-mancuernas": "Incline_Dumbbell_Press",
  "press-inclinado-multipower": "Smith_Machine_Incline_Bench_Press",
  "press-convergente-pecho": "Leverage_Incline_Chest_Press",
  "cruces-polea-alta-baja": "Low_Cable_Crossover",
  "pec-deck-contractora": "Butterfly",
  "aperturas-mancuernas-inclinado": "Incline_Dumbbell_Flyes",
  "press-militar-barra": "Standing_Military_Press",
  "press-hombro-sentado-mancuernas": "Seated_Dumbbell_Press",
  "press-hombro-maquina": "Leverage_Shoulder_Press",
  "elevaciones-laterales-polea": "One-Arm_Side_Laterals",
  "elevaciones-laterales-mancuernas": "Side_Lateral_Raise",
  "elevaciones-laterales-maquina": "Machine_Lateral_Raise",
  "extension-triceps-katana-polea": "Cable_Rope_Overhead_Triceps_Extension",
  "press-frances-mancuernas": "Lying_Dumbbell_Tricep_Extension",
  "fondos-maquina-asistida": "Dip_Machine",
  "jalon-al-pecho-neutro": "Wide-Grip_Lat_Pulldown",
  "dominadas-asistidas-maquina": "Assisted_Parallel_Close_Grip_Pull-Up",
  "remo-unilateral-mancuerna": "One-Arm_Dumbbell_Row",
  "remo-pecho-apoyado-maquina": "Leverage_Iso_Row",
  "remo-barra-inclinado": "Bent_Over_Barbell_Row",
  "remo-sentado-polea-baja": "Seated_Cable_Rows",
  "curl-biceps-banco-inclinado": "Incline_Dumbbell_Curl",
  "curl-biceps-barra-z": "EZ-Bar_Curl",
  "curl-predicador-maquina": "Machine_Preacher_Curls",
  "face-pull-polea-alta": "Face_Pull",
  "pajaros-pecho-apoyado-mancuernas": "Seated_Bent-Over_Rear_Delt_Raise",
  "pec-deck-inverso-hombro": "Reverse_Machine_Flyes",
  "sentadilla-hack-pro": "Hack_Squat",
  "prensa-45-grados": "Leg_Press",
  "sentadilla-bulgara-mancuernas": "Split_Squat_with_Dumbbells",
  "peso-muerto-rumano-barra": "Romanian_Deadlift",
  "peso-muerto-rumano-mancuernas": "Stiff-Legged_Dumbbell_Deadlift",
  "hip-thrust-maquina-barra": "Barbell_Glute_Bridge",
  "curl-femoral-sentado-maquina": "Seated_Leg_Curl",
  "curl-femoral-acostado-maquina": "Lying_Leg_Curls",
  "extension-cuadriceps-maquina": "Leg_Extensions",
  "curl-femoral-mancuerna-banco": "Dumbbell_Leg_Curl",
  "sentadilla-sissy-goblet": "Goblet_Squat",
  "prensa-unilateral-cuadriceps": "Single-Leg_Press",
  "movilidad-toracica-foam-roller": "Lower_Back_Curl",
  "estiramiento-gato-camello": "Cat_Stretch",
  "movilidad-cadera-90-90": "Groin_and_Back_Stretch",
  "zancada-movilidad-psoas": "Kneeling_Hip_Flexor",
  "press-banca-plano-barra": "Barbell_Bench_Press_-_Medium_Grip",
  "fondos-paralelas-pecho-triceps": "Dips_-_Chest_Version",
  "dominadas-libres-prono": "Pullups",
  "sentadilla-libre-barra": "Barbell_Full_Squat",
  "curl-martillo-mancuernas": "Hammer_Curls",
  "crunch-polea-alta-abs": "Cable_Crunch",
  // ALTERNATIVAS EN CASA (SIN EQUIPO / MOCHILA / SILLA)
  "flexiones-declinadas-casa": "Decline_Push-Up",
  "flexiones-abiertas-casa": "Push-Ups_-_Close_Triceps_Position",
  "pike-pushups-casa": "Handstand_Push-Ups",
  "elevaciones-laterales-mochila-casa": "Side_Lateral_Raise",
  "fondos-silla-triceps-casa": "Bench_Dips",
  "remo-toalla-puerta-casa": "Inverted_Row",
  "remo-mochila-unilateral-casa": "One-Arm_Dumbbell_Row",
  "curl-biceps-mochila-casa": "Hammer_Curls",
  "vuelos-posteriores-casa": "Seated_Bent-Over_Rear_Delt_Raise",
  "sentadilla-bulgara-casa": "Single_Leg_Butt_Kick",
  "puente-gluteo-unilateral-casa": "Single_Leg_Glute_Bridge",
  "curl-femoral-deslizante-casa": "Russian_Leg_Curl",
  "sentadilla-pared-isometrica-casa": "Wall_Squat",
  "flexiones-clasicas-casa": "Pushups",
  "plancha-abdominal-casa": "Plank",
};

/**
 * Catálogo completo de los ejercicios principales y máquinas alternativas:
 * - `gifUrl`: Animación fluida multicapa en bucle (Gym Visual / ExerciseGymGifsDB vía CDN jsDelivr)
 *   para movimiento 100% continuo y natural como video.
 * - `sheetUrl` + `row`: Lámina anatómica HD local (1024x1024) con fibras musculares en rojo carmesí
 *   para inspección anatómica detallada de Inicio y Contracción.
 */
export const ANATOMICAL_SPRITE_CATALOG: Record<string, AnatomicalSpriteSpec> = {
  // SHEET 01
  "press-banca-inclinado-mancuernas": {
    sheetUrl: "/exercises/modern_sheet_01.png",
    row: "top",
    customFrames: [
      "/exercises/neon_s01_top_1.jpg",
      "/exercises/neon_s01_top_2.jpg",
      "/exercises/neon_s01_top_3.jpg",
    ],
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-incline-bench-press.gif",
    badge: "PRESS INCLINADO MANCUERNAS 30°",
    primaryLabel: "Pectoral Superior (Clavicular)",
    secondaryLabel: "Deltoides Anterior y Tríceps",
    movementCue: "Baja profundo a los lados del pecho y empuja verticalmente",
  },
  "press-inclinado-multipower": {
    sheetUrl: "/exercises/modern_sheet_03.png",
    row: "bottom",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/smith-incline-bench-press.gif",
    badge: "PRESS INCLINADO EN SMITH / MULTIPOWER",
    primaryLabel: "Pectoral Superior",
    secondaryLabel: "Tríceps y Hombro Anterior",
    movementCue: "Baja la barra guiada hacia la clavícula y empuja sin bloquear",
  },

  // SHEET 02
  "press-convergente-pecho": {
    sheetUrl: "/exercises/modern_sheet_04.png",
    row: "top",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/lever-chest-press-0577.gif",
    badge: "MÁQUINA PRESS CONVERGENTE",
    primaryLabel: "Pectoral Mayor Completo",
    secondaryLabel: "Tríceps y Deltoides Anterior",
    movementCue: "Empuja los manerales al frente manteniendo escápulas retraídas",
  },
  "cruces-polea-alta-baja": {
    sheetUrl: "/exercises/modern_sheet_05.png",
    row: "bottom",
    customImageUrl: "/exercises/gym_cable_crossover_2.jpg",
    customFrames: [
      "/exercises/gym_cable_crossover_f1.jpg",
      "/exercises/gym_cable_crossover_f2.jpg",
      "/exercises/gym_cable_crossover_f3.jpg",
    ],
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/cable-low-fly.gif",
    badge: "CRUCES EN POLEA DE ABAJO A ARRIBA",
    primaryLabel: "Pectoral Interno y Superior",
    secondaryLabel: "Deltoides Anterior",
    movementCue: "Eleva y junta las manos frente al pecho superior en arco",
  },

  // SHEET 03
  "pec-deck-contractora": {
    sheetUrl: "/exercises/modern_sheet_05.png",
    row: "top",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/lever-seated-fly.gif",
    badge: "CONTRACTORA PEC DECK",
    primaryLabel: "Pectoral Mayor (Aducción)",
    secondaryLabel: "Deltoides Anterior",
    movementCue: "Cierra ambos brazos al centro apretando el pecho 1 segundo",
  },
  "aperturas-mancuernas-inclinado": {
    sheetUrl: "/exercises/modern_sheet_05.png",
    row: "bottom",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-incline-fly.gif",
    badge: "APERTURAS CON MANCUERNAS 30°",
    primaryLabel: "Pectoral Superior (Estiramiento)",
    secondaryLabel: "Deltoides Anterior",
    movementCue: "Abre en arco amplio con codos semiflexionados y cierra arriba",
  },

  // SHEET 04
  "press-militar-barra": {
    sheetUrl: "/exercises/modern_sheet_01.png",
    row: "top",
    customImageUrl: "/exercises/gym_military_press.jpg",
    customFrames: [
      "/exercises/gym_military_press_f1.jpg",
      "/exercises/gym_military_press_f2.jpg",
      "/exercises/gym_military_press_f3.jpg",
    ],
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/barbell-standing-wide-military-press.gif",
    badge: "PRESS MILITAR CON BARRA DE PIE",
    primaryLabel: "Deltoides Anterior y Lateral",
    secondaryLabel: "Tríceps y Core",
    movementCue: "Empuja la barra desde la clavícula hasta extensión sobre la cabeza",
  },
  "press-hombro-sentado-mancuernas": {
    sheetUrl: "/exercises/modern_sheet_09.png",
    row: "bottom",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-seated-shoulder-press.gif",
    badge: "PRESS DE HOMBROS CON MANCUERNAS",
    primaryLabel: "Deltoides Completo",
    secondaryLabel: "Tríceps Braquial",
    movementCue: "Baja las mancuernas a la altura de las orejas y presiona arriba",
  },

  // SHEET 05
  "press-hombro-maquina": {
    sheetUrl: "/exercises/modern_sheet_09.png",
    row: "top",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/lever-shoulder-press.gif",
    badge: "MÁQUINA DE PRESS DE HOMBROS",
    primaryLabel: "Deltoides Guiado",
    secondaryLabel: "Tríceps Braquial",
    movementCue: "Empuja las palancas hacia arriba manteniendo la espalda apoyada",
  },
  "elevaciones-laterales-polea": {
    sheetUrl: "/exercises/modern_sheet_10.png",
    row: "bottom",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/cable-one-arm-lateral-raise.gif",
    badge: "ELEVACIÓN LATERAL EN POLEA BAJA",
    primaryLabel: "Deltoides Lateral",
    secondaryLabel: "Trapecio Superior",
    movementCue: "Eleva el brazo en arco lateral hasta la altura del hombro",
  },

  // SHEET 06
  "elevaciones-laterales-mancuernas": {
    sheetUrl: "/exercises/modern_sheet_10.png",
    row: "bottom",
    customFrames: [
      "/exercises/neon_s06_top_1.jpg",
      "/exercises/neon_s06_top_2.jpg",
      "/exercises/neon_s06_top_3.jpg",
    ],
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-lateral-raise.gif",
    badge: "ELEVACIONES LATERALES CON MANCUERNAS",
    primaryLabel: "Deltoides Lateral (Ambas Cabezas)",
    secondaryLabel: "Antebrazo Estabilizador",
    movementCue: "Abre ambos brazos en arco lateral liderando con los codos hasta 90°",
  },
  "elevaciones-laterales-maquina": {
    sheetUrl: "/exercises/modern_sheet_11.png",
    row: "top",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/lever-lateral-raise.gif",
    badge: "MÁQUINA DE ELEVACIONES LATERALES",
    primaryLabel: "Deltoides Lateral Aislado",
    secondaryLabel: "Trapecio Superior",
    movementCue: "Eleva las almohadillas con los codos hasta la horizontal",
  },

  // SHEET 07
  "extension-triceps-katana-polea": {
    sheetUrl: "/exercises/modern_sheet_11.png",
    row: "bottom",
    customFrames: [
      "/exercises/neon_s07_top_1.jpg",
      "/exercises/neon_s07_top_2.jpg",
      "/exercises/neon_s07_top_3.jpg",
    ],
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/cable-overhead-triceps-extension-rope-attachment.gif",
    badge: "EXTENSIÓN DE TRÍCEPS TRASNUCA POLEA",
    primaryLabel: "Tríceps Braquial (Cabeza Larga)",
    secondaryLabel: "Ancóneo y Core",
    movementCue: "Extiende completamente la cuerda sobre la cabeza con codos fijos",
  },
  "press-frances-mancuernas": {
    sheetUrl: "/exercises/modern_sheet_13.png",
    row: "top",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/dumbbell-lying-triceps-extension.gif",
    badge: "PRESS FRANCÉS CON MANCUERNAS",
    primaryLabel: "Tríceps Braquial (3 Cabezas)",
    secondaryLabel: "Antebrazos",
    movementCue: "Flexiona solo los codos de forma controlada y extiende arriba",
  },

  // SHEET 08
  "fondos-maquina-asistida": {
    sheetUrl: "/exercises/modern_sheet_13.png",
    row: "top",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/assisted-triceps-dip-kneeling.gif",
    badge: "FONDOS DE TRÍCEPS EN MÁQUINA ASISTIDA",
    primaryLabel: "Tríceps Braquial y Pectoral Inferior",
    secondaryLabel: "Hombro Anterior",
    movementCue: "Baja flexionando codos a 90° y extiende empujando firme",
  },
  "jalon-al-pecho-neutro": {
    sheetUrl: "/exercises/modern_sheet_14.png",
    row: "top",
    customFrames: [
      "/exercises/neon_s08_bottom_1.jpg",
      "/exercises/neon_s08_bottom_2.jpg",
      "/exercises/neon_s08_bottom_3.jpg",
    ],
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/cable-pulldown-pro-lat-bar.gif",
    badge: "JALÓN AL PECHO EN POLEA ALTA",
    primaryLabel: "Dorsal Ancho (Espalda en V)",
    secondaryLabel: "Bíceps y Redondo Mayor",
    movementCue: "Tracciona la barra hacia la clavícula llevando los codos abajo",
  },

  // SHEET 09
  "dominadas-asistidas-maquina": {
    sheetUrl: "/exercises/modern_sheet_14.png",
    row: "top",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/assisted-parallel-close-grip-pull-up.gif",
    badge: "DOMINADAS EN MÁQUINA ASISTIDA",
    primaryLabel: "Dorsal Ancho y Redondo Mayor",
    secondaryLabel: "Bíceps y Core",
    movementCue: "Tracciona hasta pasar la barbilla sobre la barra juntando escápulas",
  },
  "remo-unilateral-mancuerna": {
    sheetUrl: "/exercises/modern_sheet_14.png",
    row: "bottom",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/dumbbell-one-arm-bent-over-row.gif",
    badge: "REMO CON MANCUERNA A UNA MANO",
    primaryLabel: "Dorsal Ancho Unilateral",
    secondaryLabel: "Romboides y Deltoides Posterior",
    movementCue: "Lleva la mancuerna en arco hacia tu cadera con espalda neutra",
  },

  // SHEET 10
  "remo-pecho-apoyado-maquina": {
    sheetUrl: "/exercises/modern_sheet_14.png",
    row: "top",
    customImageUrl: "/exercises/gym_chest_row.jpg",
    customFrames: [
      "/exercises/gym_chest_row_f1.jpg",
      "/exercises/gym_chest_row_f2.jpg",
      "/exercises/gym_chest_row_f3.jpg",
    ],
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/lever-seated-row.gif",
    badge: "REMO CON PECHO APOYADO EN MÁQUINA",
    primaryLabel: "Espalda Media, Romboides y Dorsal",
    secondaryLabel: "Deltoides Posterior y Bíceps",
    movementCue: "Apoya el pecho en el cojín y jala los manerales hacia atrás",
  },
  "remo-barra-inclinado": {
    sheetUrl: "/exercises/modern_sheet_17.png",
    row: "bottom",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/barbell-bent-over-row.gif",
    badge: "REMO CON BARRA INCLINADO 45°",
    primaryLabel: "Espalda Completa (Dorsal y Trapecio)",
    secondaryLabel: "Erectores Espinales y Bíceps",
    movementCue: "Torso firme a 45°; tracciona la barra hacia el abdomen bajo",
  },

  // SHEET 11
  "remo-sentado-polea-baja": {
    sheetUrl: "/exercises/modern_sheet_17.png",
    row: "top",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/cable-low-seated-row.gif",
    badge: "REMO SENTADO EN POLEA BAJA (GIRONDA)",
    primaryLabel: "Dorsal Ancho y Trapecio Medio",
    secondaryLabel: "Bíceps Braquial",
    movementCue: "Jala el maneral hacia el abdomen sacando el pecho al final",
  },
  "curl-biceps-banco-inclinado": {
    sheetUrl: "/exercises/modern_sheet_17.png",
    row: "bottom",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/dumbbell-incline-biceps-curl.gif",
    badge: "CURL DE BÍCEPS EN BANCO INCLINADO",
    primaryLabel: "Bíceps Braquial (Cabeza Larga)",
    secondaryLabel: "Braquiorradial",
    movementCue: "Con los codos detrás del torso, flexiona subiendo las mancuernas",
  },

  // SHEET 12
  "curl-biceps-barra-z": {
    sheetUrl: "/exercises/modern_sheet_17.png",
    row: "bottom",
    customImageUrl: "/exercises/gym_bicep_curl.jpg",
    customFrames: [
      "/exercises/gym_bicep_curl_f1.jpg",
      "/exercises/gym_bicep_curl_f2.jpg",
      "/exercises/gym_bicep_curl_f3.jpg",
    ],
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/ez-barbell-curl.gif",
    badge: "CURL DE BÍCEPS CON BARRA Z",
    primaryLabel: "Bíceps Braquial",
    secondaryLabel: "Antebrazos",
    movementCue: "Codos fijos a los costados; sube la barra Z en arco limpio",
  },
  "curl-predicador-maquina": {
    sheetUrl: "/exercises/modern_sheet_18.png",
    row: "bottom",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/lever-preacher-curl.gif",
    badge: "CURL PREDICADOR EN MÁQUINA / SCOTT",
    primaryLabel: "Bíceps Braquial (Pico y Braquial)",
    secondaryLabel: "Antebrazos",
    movementCue: "Apoya los brazos en el cojín y flexiona sin despegar los codos",
  },

  // SHEET 13
  "face-pull-polea-alta": {
    sheetUrl: "/exercises/modern_sheet_18.png",
    row: "top",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/cable-rear-delt-row-with-rope.gif",
    badge: "FACE PULL EN POLEA ALTA CON CUERDA",
    primaryLabel: "Deltoides Posterior y Trapecio",
    secondaryLabel: "Manguito Rotador",
    movementCue: "Jala la cuerda hacia la frente abriendo los codos hacia atrás",
  },
  "pajaros-pecho-apoyado-mancuernas": {
    sheetUrl: "/exercises/modern_sheet_18.png",
    row: "bottom",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-incline-rear-lateral-raise.gif",
    badge: "VUELOS POSTERIORES (PÁJAROS) EN BANCO",
    primaryLabel: "Deltoides Posterior",
    secondaryLabel: "Romboides",
    movementCue: "Pecho apoyado en banco 30°; abre los brazos hacia los lados",
  },

  // SHEET 14
  "pec-deck-inverso-hombro": {
    sheetUrl: "/exercises/modern_sheet_18.png",
    row: "top",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/lever-seated-reverse-fly.gif",
    badge: "CONTRACTORA INVERSA (REAR DELT MACHINE)",
    primaryLabel: "Deltoides Posterior",
    secondaryLabel: "Trapecio Medio y Romboides",
    movementCue: "Pecho contra el cojín; abre los brazos hacia atrás en arco",
  },
  "sentadilla-hack-pro": {
    sheetUrl: "/exercises/modern_sheet_14.png",
    row: "bottom",
    customImageUrl: "/exercises/gym_hack_squat.jpg",
    customFrames: [
      "/exercises/gym_hack_squat_f1.jpg",
      "/exercises/gym_hack_squat_f2.jpg",
      "/exercises/gym_hack_squat_f3.jpg",
    ],
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/sled-hack-squat.gif",
    badge: "SENTADILLA HACK PROFUNDA 45°",
    primaryLabel: "Cuádriceps (Recto y Vastos)",
    secondaryLabel: "Glúteo Mayor",
    movementCue: "Espalda pegada al respaldo; baja profundo a 90°+ y empuja",
  },

  // SHEET 15
  "prensa-45-grados": {
    sheetUrl: "/exercises/modern_sheet_13.png",
    row: "bottom",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/sled-45-leg-press.gif",
    badge: "PRENSA DE PIERNAS INCLINADA 45°",
    primaryLabel: "Cuádriceps y Glúteo Mayor",
    secondaryLabel: "Isquiosurales",
    movementCue: "Baja flexionando rodillas a 90° con espalda apoyada y empuja firme",
  },
  "sentadilla-bulgara-mancuernas": {
    sheetUrl: "/exercises/modern_sheet_13.png",
    row: "bottom",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/dumbbell-single-leg-split-squat.gif",
    badge: "SENTADILLA BÚLGARA CON MANCUERNAS",
    primaryLabel: "Cuádriceps y Glúteo Unilateral",
    secondaryLabel: "Isquiosurales y Core",
    movementCue: "Empeine trasero apoyado; baja profundo controlando la rodilla",
  },

  // SHEET 16
  "peso-muerto-rumano-barra": {
    sheetUrl: "/exercises/modern_sheet_17.png",
    row: "top",
    customFrames: [
      "/exercises/neon_s16_top_1.jpg",
      "/exercises/neon_s16_top_2.jpg",
      "/exercises/neon_s16_top_3.jpg",
    ],
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-romanian-deadlift.gif",
    badge: "PESO MUERTO RUMANO CON BARRA (RDL)",
    primaryLabel: "Isquiosurales y Glúteo Mayor",
    secondaryLabel: "Erectores Espinales",
    movementCue: "Empuja la cadera hacia atrás deslizando la barra por los muslos",
  },
  "peso-muerto-rumano-mancuernas": {
    sheetUrl: "/exercises/modern_sheet_17.png",
    row: "top",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/dumbbell-romanian-deadlift.gif",
    badge: "PESO MUERTO RUMANO CON MANCUERNAS",
    primaryLabel: "Isquiosurales y Glúteos",
    secondaryLabel: "Espalda Baja",
    movementCue: "Bisagra de cadera con espalda neutra y mancuernas pegadas",
  },

  // SHEET 17
  "hip-thrust-maquina-barra": {
    sheetUrl: "/exercises/modern_sheet_01.png",
    row: "top",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-glute-bridge-two-legs-on-bench-male.gif",
    badge: "HIP THRUST CON BARRA EN BANCO",
    primaryLabel: "Glúteo Mayor y Medio",
    secondaryLabel: "Isquiosurales",
    movementCue: "Escápulas en el banco; eleva la pelvis hasta alinear el cuerpo",
  },
  "curl-femoral-sentado-maquina": {
    sheetUrl: "/exercises/modern_sheet_02.png",
    row: "bottom",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/hamstrings/lever-seated-leg-curl.gif",
    badge: "CURL FEMORAL SENTADO EN MÁQUINA",
    primaryLabel: "Isquiosurales (Bíceps Femoral)",
    secondaryLabel: "Gemelos",
    movementCue: "Asegura el cojín sobre los muslos y flexiona los talones bajo el asiento",
  },

  // SHEET 18
  "curl-femoral-acostado-maquina": {
    sheetUrl: "/exercises/modern_sheet_09.png",
    row: "top",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/hamstrings/lever-lying-leg-curl.gif",
    badge: "CURL FEMORAL ACOSTADO EN MÁQUINA",
    primaryLabel: "Isquiosurales Completos",
    secondaryLabel: "Glúteo y Gemelos",
    movementCue: "Acostado boca abajo, flexiona el rodillo hacia los glúteos",
  },
  "extension-cuadriceps-maquina": {
    sheetUrl: "/exercises/modern_sheet_14.png",
    row: "bottom",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/lever-leg-extension.gif",
    badge: "EXTENSIÓN DE CUÁDRICEPS EN MÁQUINA",
    primaryLabel: "Cuádriceps (4 Vastos)",
    secondaryLabel: "Recto Femoral",
    movementCue: "Extiende ambas piernas hasta la horizontal contrayendo el cuádriceps",
  },

  // SHEET 19
  "curl-femoral-mancuerna-banco": {
    sheetUrl: "/exercises/modern_sheet_11.png",
    row: "top",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/hamstrings/dumbbell-lying-femoral.gif",
    badge: "CURL FEMORAL ACOSTADO CON MANCUERNA",
    primaryLabel: "Isquiosurales",
    secondaryLabel: "Glúteos",
    movementCue: "Sujeta la mancuerna entre los pies y flexiona las rodillas a 90°",
  },
  "sentadilla-sissy-goblet": {
    sheetUrl: "/exercises/modern_sheet_13.png",
    row: "bottom",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/dumbbell-goblet-squat.gif",
    badge: "SENTADILLA GOBLET PROFUNDA",
    primaryLabel: "Cuádriceps Profundo",
    secondaryLabel: "Glúteo y Core",
    movementCue: "Sostén la mancuerna frente al pecho y baja con el torso vertical",
  },
  "prensa-unilateral-cuadriceps": {
    sheetUrl: "/exercises/modern_sheet_01.png",
    row: "bottom",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/sled-45-degrees-one-leg-press.gif",
    badge: "PRENSA DE PIERNAS UNILATERAL 45°",
    primaryLabel: "Cuádriceps Unilateral",
    secondaryLabel: "Glúteo Mayor",
    movementCue: "Empuja la plataforma de 45° de forma controlada con una sola pierna",
  },

  // SHEET 20
  "movilidad-toracica-foam-roller": {
    sheetUrl: "/exercises/modern_sheet_03.png",
    row: "top",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/spine/roller-back-stretch.gif",
    badge: "EXTENSIÓN TORÁCICA SOBRE FOAM ROLLER",
    primaryLabel: "Columna Torácica y Dorsal",
    secondaryLabel: "Pectoral",
    movementCue: "Apoya la espalda alta sobre el rodillo y abre el pecho hacia atrás",
  },
  "estiramiento-gato-camello": {
    sheetUrl: "/exercises/modern_sheet_04.png",
    row: "bottom",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/spine/spine-stretch.gif",
    badge: "MOVILIDAD DE COLUMNA Y ESCÁPULAS",
    primaryLabel: "Columna Torácica y Lumbar",
    secondaryLabel: "Core y Escápulas",
    movementCue: "Moviliza suavemente la columna vertebral de forma controlada",
  },
  "movilidad-cadera-90-90": {
    sheetUrl: "/exercises/modern_sheet_05.png",
    row: "top",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/seated-glute-stretch.gif",
    badge: "MOVILIDAD DE CADERA Y GLÚTEO",
    primaryLabel: "Rotadores de Cadera y Glúteo",
    secondaryLabel: "Flexores de Cadera (Psoas)",
    movementCue: "Estira y moviliza la cadera de forma suave y controlada",
  },
  "zancada-movilidad-psoas": {
    sheetUrl: "/exercises/modern_sheet_02.png",
    row: "top",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/exercise-ball-hip-flexor-stretch.gif",
    freeExerciseDbId: "Kneeling_Hip_Flexor",
    badge: "ESTIRAMIENTO DINÁMICO DE PSOAS",
    primaryLabel: "Flexores de Cadera y Glúteo",
    secondaryLabel: "Cuádriceps",
    movementCue: "Adelanta la pelvis manteniendo el glúteo trasero contraído",
  },

  // CLÁSICOS EXTENDIDOS (FREE-EXERCISE-DB)
  "press-banca-plano-barra": {
    sheetUrl: "/exercises/modern_sheet_09.png",
    row: "top",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/barbell-bench-press.gif",
    freeExerciseDbId: "Barbell_Bench_Press_-_Medium_Grip",
    badge: "PRESS BANCA PLANO CON BARRA",
    primaryLabel: "Pectoral Mayor (Porción Esternal)",
    secondaryLabel: "Tríceps y Deltoides Anterior",
    movementCue: "Retrae escápulas, baja al esternón y empuja firme",
  },
  "fondos-paralelas-pecho-triceps": {
    sheetUrl: "/exercises/modern_sheet_09.png",
    row: "top",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/chest-dip.gif",
    freeExerciseDbId: "Dips_-_Chest_Version",
    badge: "FONDOS EN PARALELAS (DIPS)",
    primaryLabel: "Pectoral Inferior y Tríceps",
    secondaryLabel: "Deltoides Anterior",
    movementCue: "Inclina ligeramente el torso al frente y baja a 90°",
  },
  "dominadas-libres-prono": {
    sheetUrl: "/exercises/modern_sheet_11.png",
    row: "top",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/pull-up.gif",
    freeExerciseDbId: "Pullups",
    badge: "DOMINADAS PRONAS LIBRES",
    primaryLabel: "Dorsal Ancho y Redondo Mayor",
    secondaryLabel: "Bíceps y Core",
    movementCue: "Deprime escápulas y lleva la parte alta del pecho a la barra",
  },
  "sentadilla-libre-barra": {
    sheetUrl: "/exercises/modern_sheet_13.png",
    row: "bottom",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-full-squat.gif",
    freeExerciseDbId: "Barbell_Full_Squat",
    badge: "SENTADILLA LIBRE CON BARRA",
    primaryLabel: "Cuádriceps y Glúteo Mayor",
    secondaryLabel: "Core y Erectores Espinales",
    movementCue: "Compacta el abdomen, rompe el paralelo y empuja con toda la planta",
  },
  "curl-martillo-mancuernas": {
    sheetUrl: "/exercises/modern_sheet_14.png",
    row: "bottom",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/dumbbell-hammer-curl.gif",
    freeExerciseDbId: "Hammer_Curls",
    badge: "CURL MARTILLO CON MANCUERNAS",
    primaryLabel: "Braquial y Braquiorradial",
    secondaryLabel: "Bíceps Braquial",
    movementCue: "Agarre neutro fijo; flexiona codos sin balancear el torso",
  },
  "crunch-polea-alta-abs": {
    sheetUrl: "/exercises/modern_sheet_17.png",
    row: "bottom",
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/cable-kneeling-crunch.gif",
    freeExerciseDbId: "Cable_Crunch",
    badge: "CRUNCH ABDOMINAL EN POLEA ALTA",
    primaryLabel: "Recto Abdominal (Six-Pack)",
    secondaryLabel: "Oblicuos",
    movementCue: "Cadera inmóvil; enrolla la columna acercando costillas a la pelvis",
  },

  // ================= ALTERNATIVAS EN CASA (SIN EQUIPO / MOCHILA / SILLA) =================
  "flexiones-declinadas-casa": {
    sheetUrl: "/exercises/modern_sheet_18.png",
    row: "top",
    customImageUrl: "/exercises/home_decline_pushups.jpg",
    isHomeExercise: true,
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/decline-push-up.gif",
    freeExerciseDbId: "Decline_Push-Up",
    badge: "FLEXIONES DECLINADAS CON PIES EN SILLA",
    primaryLabel: "Pectoral Superior (Clavicular)",
    secondaryLabel: "Tríceps y Deltoides Anterior",
    movementCue: "Pies sobre silla o cama; baja el pecho al suelo y empuja firme",
  },
  "flexiones-abiertas-casa": {
    sheetUrl: "/exercises/modern_sheet_18.png",
    row: "bottom",
    customImageUrl: "/exercises/home_pushups.jpg",
    isHomeExercise: true,
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/wide-hand-push-up.gif",
    freeExerciseDbId: "Pushups",
    badge: "FLEXIONES AMPLIAS CON PAUSA EN ESTIRAMIENTO",
    primaryLabel: "Pectoral Mayor Completo",
    secondaryLabel: "Deltoides Anterior y Core",
    movementCue: "Manos más anchas que los hombros; pausa 2s abajo estirando el pecho",
  },
  "pike-pushups-casa": {
    sheetUrl: "/exercises/modern_sheet_01.png",
    row: "top",
    customImageUrl: "/exercises/home_pike_pushups.jpg",
    isHomeExercise: true,
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/pike-push-up.gif",
    freeExerciseDbId: "Handstand_Push-Ups",
    badge: "FLEXIONES EN PICA (PIKE PUSH-UPS)",
    primaryLabel: "Deltoides Anterior y Lateral",
    secondaryLabel: "Tríceps Braquial",
    movementCue: "Cadera alta en V invertida; baja la coronilla entre las manos y empuja",
  },
  "elevaciones-laterales-mochila-casa": {
    sheetUrl: "/exercises/modern_sheet_13.png",
    row: "bottom",
    customImageUrl: "/exercises/home_lateral_raises_backpack.jpg",
    isHomeExercise: true,
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-lateral-raise.gif",
    freeExerciseDbId: "Side_Lateral_Raise",
    badge: "ELEVACIONES LATERALES CON MOCHILA O BOTELLAS",
    primaryLabel: "Deltoides Lateral",
    secondaryLabel: "Antebrazo",
    movementCue: "Toma el asa de una mochila con libros y eleva el brazo hasta 90°",
  },
  "fondos-silla-triceps-casa": {
    sheetUrl: "/exercises/modern_sheet_02.png",
    row: "top",
    customImageUrl: "/exercises/home_chair_tricep_dips.jpg",
    isHomeExercise: true,
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/bench-dip-on-floor.gif",
    freeExerciseDbId: "Bench_Dips",
    badge: "FONDOS DE TRÍCEPS APOYADO EN SILLA",
    primaryLabel: "Tríceps Braquial",
    secondaryLabel: "Hombro Anterior",
    movementCue: "Manos en el borde de una silla firme; baja flexionando codos a 90°",
  },
  "remo-toalla-puerta-casa": {
    sheetUrl: "/exercises/modern_sheet_09.png",
    row: "top",
    customImageUrl: "/exercises/home_inverted_row_table.jpg",
    isHomeExercise: true,
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/inverted-row.gif",
    freeExerciseDbId: "Inverted_Row",
    badge: "REMO INVERTIDO BAJO MESA FIRME / TOALLA",
    primaryLabel: "Dorsal Ancho y Espalda Media",
    secondaryLabel: "Bíceps y Core",
    movementCue: "Sujeta el borde de una mesa resistente y lleva el pecho hacia arriba",
  },
  "remo-mochila-unilateral-casa": {
    sheetUrl: "/exercises/modern_sheet_09.png",
    row: "bottom",
    customImageUrl: "/exercises/home_backpack_row.jpg",
    isHomeExercise: true,
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/dumbbell-one-arm-bent-over-row.gif",
    freeExerciseDbId: "One-Arm_Dumbbell_Row",
    badge: "REMO A UNA MANO CON MOCHILA CARGADA",
    primaryLabel: "Dorsal Ancho y Romboides",
    secondaryLabel: "Bíceps Braquial",
    movementCue: "Apoya una mano en una silla y jala la mochila pesada hacia tu cadera",
  },
  "curl-biceps-mochila-casa": {
    sheetUrl: "/exercises/modern_sheet_11.png",
    row: "bottom",
    customImageUrl: "/exercises/home_backpack_bicep_curl.jpg",
    isHomeExercise: true,
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/dumbbell-hammer-curl.gif",
    freeExerciseDbId: "Hammer_Curls",
    badge: "CURL DE BÍCEPS CON MOCHILA Y TOALLA",
    primaryLabel: "Bíceps Braquial y Braquiorradial",
    secondaryLabel: "Antebrazo",
    movementCue: "Pasa una toalla por el asa de tu mochila cargada y flexiona los codos",
  },
  "vuelos-posteriores-casa": {
    sheetUrl: "/exercises/modern_sheet_13.png",
    row: "bottom",
    customImageUrl: "/exercises/home_lateral_raises_backpack.jpg",
    isHomeExercise: true,
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-incline-rear-lateral-raise.gif",
    freeExerciseDbId: "Seated_Bent-Over_Rear_Delt_Raise",
    badge: "PÁJAROS INCLINADO CON BOTELLAS / BANDAS",
    primaryLabel: "Deltoides Posterior",
    secondaryLabel: "Romboides y Trapecio Medio",
    movementCue: "Inclina el torso a 45° y abre los brazos sosteniendo 1s arriba",
  },
  "sentadilla-bulgara-casa": {
    sheetUrl: "/exercises/modern_sheet_14.png",
    row: "bottom",
    customImageUrl: "/exercises/home_bulgarian_split_squat.jpg",
    isHomeExercise: true,
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/dumbbell-single-leg-split-squat.gif",
    freeExerciseDbId: "Split_Squat_with_Dumbbells",
    badge: "SENTADILLA BÚLGARA CON MOCHILA EN SILLA",
    primaryLabel: "Cuádriceps y Glúteo Unilateral",
    secondaryLabel: "Core",
    movementCue: "Apoya el empeine en una silla o sofá y baja lento en 3 segundos",
  },
  "puente-gluteo-unilateral-casa": {
    sheetUrl: "/exercises/modern_sheet_17.png",
    row: "top",
    customImageUrl: "/exercises/home_single_leg_hip_thrust.jpg",
    isHomeExercise: true,
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-glute-bridge-two-legs-on-bench-male.gif",
    freeExerciseDbId: "Single_Leg_Glute_Bridge",
    badge: "HIP THRUST A UNA PIERNA APOYADO EN SOFÁ",
    primaryLabel: "Glúteo Mayor e Isquiosurales",
    secondaryLabel: "Core",
    movementCue: "Espalda en el sofá; empuja con una sola pierna apretando 2s arriba",
  },
  "curl-femoral-deslizante-casa": {
    sheetUrl: "/exercises/modern_sheet_18.png",
    row: "top",
    customImageUrl: "/exercises/home_sliding_leg_curl.jpg",
    isHomeExercise: true,
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/hamstrings/lever-lying-leg-curl.gif",
    freeExerciseDbId: "Russian_Leg_Curl",
    badge: "CURL FEMORAL DESLIZANTE CON TOALLA EN PISO",
    primaryLabel: "Isquiosurales (Femorales)",
    secondaryLabel: "Glúteos",
    movementCue: "Acostado boca arriba, desliza los talones sobre una toalla hacia el glúteo",
  },
  "sentadilla-pared-isometrica-casa": {
    sheetUrl: "/exercises/modern_sheet_18.png",
    row: "bottom",
    customImageUrl: "/exercises/home_bulgarian_split_squat.jpg",
    isHomeExercise: true,
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/sissy-squat.gif",
    freeExerciseDbId: "Wall_Squat",
    badge: "SENTADILLA SISSY / PARED EN CASA",
    primaryLabel: "Cuádriceps Completo",
    secondaryLabel: "Recto Femoral",
    movementCue: "Talones elevados o espalda en pared; baja con el torso recto",
  },
  "flexiones-clasicas-casa": {
    sheetUrl: "/exercises/modern_sheet_01.png",
    row: "top",
    customImageUrl: "/exercises/home_pushups.jpg",
    isHomeExercise: true,
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/push-up.gif",
    freeExerciseDbId: "Pushups",
    badge: "FLEXIONES DE PECHO CONTROLADAS (TEMPO 3-1-1)",
    primaryLabel: "Pectoral Mayor",
    secondaryLabel: "Tríceps y Core",
    movementCue: "Cuerpo en línea recta; baja en 3 segundos hasta rozar el suelo",
  },
  "plancha-abdominal-casa": {
    sheetUrl: "/exercises/modern_sheet_13.png",
    row: "bottom",
    customImageUrl: "/exercises/home_plank.jpg",
    isHomeExercise: true,
    gifUrl:
      "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/front-plank-with-twist.gif",
    freeExerciseDbId: "Plank",
    badge: "PLANCHA FRONTAL Y ESTABILIZACIÓN EN SUELO",
    primaryLabel: "Recto Abdominal y Transverso",
    secondaryLabel: "Oblicuos",
    movementCue: "Aprieta abdomen y glúteos manteniendo el cuerpo en una línea recta perfecta",
  },
};

export function registerCustomExerciseVisual(
  id: string,
  spec: AnatomicalSpriteSpec
) {
  ANATOMICAL_SPRITE_CATALOG[id] = spec;
  if (spec.freeExerciseDbId) {
    FREE_EXERCISE_DB_ID_BY_SLUG[id] = spec.freeExerciseDbId;
  }
}

export function getFreeExerciseDbPhotoUrls(
  exerciseId: string
): [string, string] {
  const spec =
    ANATOMICAL_SPRITE_CATALOG[exerciseId] ||
    ANATOMICAL_SPRITE_CATALOG["press-banca-inclinado-mancuernas"];
  const frames = getThreePhaseNeonFrames(spec);
  return [frames[0], frames[2]];
}

// Caché en memoria de los fotogramas locales auto-centrados y alineados por píxel
const alignedFramesCache = new Map<string, [string, string]>();

function useAlignedExerciseFrames(
  sheetUrl: string,
  row: "top" | "bottom"
): [string, string] | null {
  const cacheKey = `${sheetUrl}__${row}`;
  const [frames, setFrames] = useState<[string, string] | null>(
    () => alignedFramesCache.get(cacheKey) || null
  );

  useEffect(() => {
    if (alignedFramesCache.has(cacheKey)) {
      setFrames(alignedFramesCache.get(cacheKey)!);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      const fullW = img.naturalWidth || 1024;
      const fullH = img.naturalHeight || 1024;
      const halfW = Math.floor(fullW / 2);
      const halfH = Math.floor(fullH / 2);
      const startY = row === "top" ? 0 : halfH;

      const srcCanvas = document.createElement("canvas");
      srcCanvas.width = fullW;
      srcCanvas.height = fullH;
      const srcCtx = srcCanvas.getContext("2d", { willReadFrequently: true });
      if (!srcCtx) return;
      srcCtx.drawImage(img, 0, 0);

      const getBounds = (offsetX: number, offsetY: number) => {
        const margin = 10;
        const imgData = srcCtx.getImageData(
          offsetX + margin,
          offsetY + margin,
          halfW - margin * 2,
          halfH - margin * 2
        );
        const data = imgData.data;
        const w = halfW - margin * 2;
        const h = halfH - margin * 2;

        let minX = w;
        let maxX = 0;
        let minY = h;
        let maxY = 0;
        let sumX = 0;
        let count = 0;

        for (let y = 0; y < h; y += 2) {
          for (let x = 0; x < w; x += 2) {
            const idx = (y * w + x) * 4;
            const a = data[idx + 3];
            // En los nuevos modern_sheet PNGs con fondo transparente, a > 20 significa píxel visible
            if (a > 20) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
              sumX += x;
              count++;
            }
          }
        }

        if (count === 0) {
          return {
            minX: margin,
            maxX: halfW - margin,
            minY: margin,
            maxY: halfH - margin,
            centerX: halfW / 2,
            width: halfW - margin * 2,
            height: halfH - margin * 2,
          };
        }

        const realMinX = minX + margin;
        const realMaxX = maxX + margin;
        const realMinY = minY + margin;
        const realMaxY = maxY + margin;
        const bboxCenter = (realMinX + realMaxX) / 2;
        const massCenter = sumX / count + margin;

        return {
          minX: realMinX,
          maxX: realMaxX,
          minY: realMinY,
          maxY: realMaxY,
          centerX: bboxCenter * 0.65 + massCenter * 0.35,
          width: Math.max(1, realMaxX - realMinX),
          height: Math.max(1, realMaxY - realMinY),
        };
      };

      const b1 = getBounds(0, startY);
      const b2 = getBounds(halfW, startY);

      const outSize = 512;
      const padding = 28;
      const usableW = outSize - padding * 2;
      const usableH = outSize - padding * 2;

      const maxContentW = Math.max(b1.width, b2.width);
      const maxContentH = Math.max(b1.height, b2.height);
      const sharedScale = Math.min(
        usableW / maxContentW,
        usableH / maxContentH,
        1.08
      );

      const renderAlignedQuadrant = (
        offsetX: number,
        offsetY: number,
        bounds: ReturnType<typeof getBounds>
      ) => {
        const outCanvas = document.createElement("canvas");
        outCanvas.width = outSize;
        outCanvas.height = outSize;
        const ctx = outCanvas.getContext("2d", { willReadFrequently: true })!;
        // Fondo transparente moderno para que respete el tema oscuro de la UI
        ctx.clearRect(0, 0, outSize, outSize);

        const cropX = offsetX + bounds.minX;
        const cropY = offsetY + bounds.minY;
        const cropW = bounds.width;
        const cropH = bounds.height;

        const drawW = cropW * sharedScale;
        const drawH = cropH * sharedScale;

        const floorY =
          outSize -
          padding -
          Math.max(0, (usableH - maxContentH * sharedScale) / 2);
        const destY = floorY - drawH;
        const relativeCenterOffset =
          (bounds.centerX - bounds.minX) * sharedScale;
        const destX = outSize / 2 - relativeCenterOffset;

        ctx.drawImage(
          srcCanvas,
          cropX,
          cropY,
          cropW,
          cropH,
          destX,
          destY,
          drawW,
          drawH
        );
        return outCanvas.toDataURL("image/png");
      };

      const frame1Url = renderAlignedQuadrant(0, startY, b1);
      const frame2Url = renderAlignedQuadrant(halfW, startY, b2);
      const pair: [string, string] = [frame1Url, frame2Url];
      alignedFramesCache.set(cacheKey, pair);
      if (!cancelled) {
        setFrames(pair);
      }
    };
    img.src = sheetUrl;

    return () => {
      cancelled = true;
    };
  }, [cacheKey, sheetUrl, row]);

  return frames;
}

function getThreePhaseNeonFrames(spec: AnatomicalSpriteSpec): [string, string, string] {
  if (spec.customFrames && spec.customFrames.length >= 3) {
    return [spec.customFrames[0], spec.customFrames[1], spec.customFrames[2]];
  }
  if (spec.customImageUrl) {
    const basePrefix = spec.customImageUrl.replace(/\.jpg$/i, "");
    return [`${basePrefix}_f1.jpg`, `${basePrefix}_f2.jpg`, `${basePrefix}_f3.jpg`];
  }
  const match = spec.sheetUrl.match(/(\d{2})/);
  const num = match ? match[1] : "01";
  const base1 = `/exercises/neon_s${num}_${spec.row}_1.jpg`;
  const base2 = `/exercises/neon_s${num}_${spec.row}_2.jpg`;
  const base3 = `/exercises/neon_s${num}_${spec.row}_3.jpg`;
  return [base1, base2, base3];
}

export function ExerciseExecutionVisual({
  exerciseId,
  compact = false,
  className = "",
}: ExerciseDiagramProps) {
  const spec =
    ANATOMICAL_SPRITE_CATALOG[exerciseId] ||
    ANATOMICAL_SPRITE_CATALOG["press-banca-inclinado-mancuernas"];

  // Todas las variantes cuentan ahora con su secuencia de 3 fases en estilo Dark Studio Neón (#A3E635)
  const sequenceFrames: [string, string, string] = getThreePhaseNeonFrames(spec);

  type ViewMode = "FLUID_ANIMATION" | "MULTI_POSES" | "STATIC_HD";
  const [viewMode, setViewMode] = useState<ViewMode>("FLUID_ANIMATION");

  const [paused, setPaused] = useState<boolean>(false);
  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(0);

  // Sincronizar modo al cambiar de ejercicio
  useEffect(() => {
    setActiveFrameIndex(0);
    setViewMode("FLUID_ANIMATION");
  }, [exerciseId]);

  const activeAnimFrames: string[] = sequenceFrames;

  // Animación fluida cíclica entre los 3 fotogramas (1 -> 2 -> 3)
  useEffect(() => {
    if (!paused && activeAnimFrames.length > 1) {
      const timer = setInterval(() => {
        setActiveFrameIndex((prev) => (prev + 1) % activeAnimFrames.length);
      }, 1100);
      return () => clearInterval(timer);
    }
  }, [paused, activeAnimFrames.length]);

  // Miniatura en las tarjetas de "Máquinas e Instrumentos Alternativos"
  if (compact) {
    const compactThumb = spec.customImageUrl || sequenceFrames[0];

    return (
      <div
        className={`relative w-full h-full bg-[#090d16] flex items-center justify-center overflow-hidden select-none ${className}`}
      >
        <img
          src={compactThumb}
          alt={spec.badge}
          className="h-full w-full object-cover"
          draggable={false}
        />

        {spec.isHomeExercise && (
          <div className="absolute bottom-1 left-1 rounded bg-emerald-500/90 text-zinc-950 font-bold px-1 py-0.2 text-[8px] shadow-sm flex items-center gap-0.5">
            <Home className="h-2 w-2" />
            <span>En Casa</span>
          </div>
        )}
      </div>
    );
  }

  const phaseLabels = [
    "Fase 1: Posición Inicial",
    activeAnimFrames.length >= 3 ? "Fase 2: Descenso / Rango" : "Fase 2: Contracción Máxima",
    "Fase 3: Contracción Máxima",
  ];

  return (
    <div
      className={`w-full h-full bg-[#09090b] flex flex-col select-none overflow-hidden ${className}`}
      role="img"
      aria-label={`Demostración de ${spec.badge}`}
    >
      {/* Lienzo Visual 100% Despejado: Cero texto flotante encimado */}
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center bg-gradient-to-b from-[#09090b] via-[#101014] to-[#09090b] overflow-hidden p-2">
        {viewMode === "STATIC_HD" && spec.customImageUrl ? (
          <img
            src={spec.customImageUrl}
            alt={spec.badge}
            className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl border border-zinc-800/80"
            draggable={false}
          />
        ) : viewMode === "FLUID_ANIMATION" ? (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <img
              src={activeAnimFrames[activeFrameIndex % activeAnimFrames.length]}
              alt={`${spec.badge} - ${phaseLabels[activeFrameIndex % phaseLabels.length]}`}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl border border-zinc-800/80 transition-all duration-300"
              draggable={false}
            />
          </div>
        ) : (
          /* Vista de Poses Desglosadas (2 o 3 Poses lado a lado) */
          <div className={`w-full h-full grid ${activeAnimFrames.length >= 3 ? "grid-cols-3" : "grid-cols-2"} items-center gap-2 p-1`}>
            {activeAnimFrames.map((frameSrc, idx) => (
              <div
                key={idx}
                className="h-full w-full flex flex-col items-center justify-center rounded-2xl bg-zinc-950/70 border border-zinc-800/80 p-2 overflow-hidden relative"
              >
                <img
                  src={frameSrc}
                  alt={`${spec.badge} - Fase ${idx + 1}`}
                  className="max-h-full max-w-full rounded-xl object-contain shadow-md"
                  draggable={false}
                />
                <span className="absolute bottom-1.5 left-2 rounded-full bg-zinc-900/90 border border-zinc-700/80 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                  {idx === 0 ? "1. Inicio" : idx === 1 && activeAnimFrames.length >= 3 ? "2. Rango" : "3. Contracción"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Barra Inferior Limpia: Controles de fotogramas y alternador de vista */}
      <div className="h-10 shrink-0 border-t border-zinc-800/80 bg-[#121215] px-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {viewMode === "FLUID_ANIMATION" && activeAnimFrames.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setPaused((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                title={paused ? "Reanudar animación" : "Pausar animación"}
              >
                {paused ? (
                  <>
                    <Play className="h-3.5 w-3.5 text-[#A3E635] fill-current" />
                    <span className="hidden sm:inline">Play</span>
                  </>
                ) : (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Pausa</span>
                  </>
                )}
              </button>

              {/* Selector interactivo de fases: 1, 2, 3 */}
              <div className="flex items-center gap-1">
                {activeAnimFrames.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveFrameIndex(idx);
                      setPaused(true);
                    }}
                    className={`h-5 px-2 rounded-md text-[10px] font-bold transition-all ${
                      activeFrameIndex % activeAnimFrames.length === idx
                        ? "bg-[#A3E635] text-zinc-950 shadow-sm"
                        : "bg-zinc-800/70 text-zinc-400 hover:text-zinc-200"
                    }`}
                    title={phaseLabels[idx]}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </>
          )}

          {viewMode === "STATIC_HD" && (
            <span className="text-xs text-zinc-400 font-medium">
              Ilustración Biomecánica HD
            </span>
          )}
        </div>

        {/* Alternador simple y limpio */}
        <div className="flex items-center gap-1 rounded-lg bg-zinc-900 p-0.5 border border-zinc-800">
          {activeAnimFrames.length > 1 && (
            <button
              type="button"
              onClick={() => setViewMode("FLUID_ANIMATION")}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                viewMode === "FLUID_ANIMATION"
                  ? "bg-zinc-800 text-[#A3E635] shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Film className="h-3 w-3" />
              <span>Fluido</span>
            </button>
          )}

          {spec.customImageUrl && (
            <button
              type="button"
              onClick={() => setViewMode("STATIC_HD")}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                viewMode === "STATIC_HD"
                  ? "bg-zinc-800 text-[#A3E635] shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Ilustración
            </button>
          )}

          {activeAnimFrames.length > 1 && (
            <button
              type="button"
              onClick={() => setViewMode("MULTI_POSES")}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                viewMode === "MULTI_POSES"
                  ? "bg-zinc-800 text-[#A3E635] shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Columns2 className="h-3 w-3" />
              <span>{activeAnimFrames.length >= 3 ? "3 Fases" : "2 Fases"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
