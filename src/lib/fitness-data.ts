export type BiomechanicForce = "push" | "pull" | "static";
export type BiomechanicMechanic = "compound" | "isolation";
export type BiomechanicLevel = "beginner" | "intermediate" | "expert";

export interface SubstituteOption {
  id: string;
  nombre: string;
  equipo: string;
  razonBiomecanica: string;
  comoHacerlo: string;
  esEnCasa?: boolean;
  freeExerciseDbId?: string;
  instructionsStepByStep?: string[];
}

export interface ExerciseItem {
  id: string;
  nombre: string;
  grupoMuscular: "Pecho" | "Espalda" | "Hombros" | "Piernas" | "Brazos" | "Core";
  equipoNecesario: "Barra" | "Mancuernas" | "Polea" | "Máquina" | "Peso Corporal";
  curvaResistencia: "Estiramiento (Longitudinal)" | "Rango Medio" | "Acortamiento (Contracción)";
  // Taxonomía enriquecida de yuhonas/free-exercise-db:
  force: BiomechanicForce;
  mechanic: BiomechanicMechanic;
  level: BiomechanicLevel;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructionsStepByStep: string[];
  freeExerciseDbId: string;
  tipsEjecucion: string;
  descansoSugerido: 60 | 90 | 120 | 180;
  pesoAnteriorKg: number;
  repsAnteriores: number;
  sustitutos: SubstituteOption[];
}

export const FORCE_LABELS: Record<
  BiomechanicForce,
  { label: string; short: string; badgeClass: string }
> = {
  push: {
    label: "Vector Push (Empuje)",
    short: "Empuje (Push)",
    badgeClass:
      "bg-amber-500/15 text-amber-800 border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
  },
  pull: {
    label: "Vector Pull (Tracción)",
    short: "Tracción (Pull)",
    badgeClass:
      "bg-cyan-500/15 text-cyan-800 border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30",
  },
  static: {
    label: "Isométrico / Movilidad",
    short: "Movilidad / Estático",
    badgeClass:
      "bg-purple-500/15 text-purple-800 border-purple-500/40 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30",
  },
};

export const MECHANIC_LABELS: Record<
  BiomechanicMechanic,
  { label: string; short: string; description: string }
> = {
  compound: {
    label: "Multiarticular (Compuesto)",
    short: "Compuesto",
    description:
      "Involucra 2 o más articulaciones; ideal para mover cargas altas al inicio de la sesión.",
  },
  isolation: {
    label: "Monoarticular (Aislamiento)",
    short: "Aislamiento",
    description:
      "Concentra el estímulo en un solo vientre muscular sin fatigar sinergistas.",
  },
};

export const LEVEL_LABELS: Record<
  BiomechanicLevel,
  { label: string; badgeClass: string; description: string }
> = {
  beginner: {
    label: "Principiante",
    badgeClass:
      "bg-emerald-500/15 text-emerald-800 border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30",
    description: "Patrón de movimiento guiado o estable; ideal para aprender control motor y técnica sin riesgo.",
  },
  intermediate: {
    label: "Intermedio",
    badgeClass:
      "bg-sky-500/15 text-sky-800 border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/30",
    description: "Carga libre o multiarticular; requiere estabilidad y control de la respiración (Valsalva).",
  },
  expert: {
    label: "Avanzado / Extremo",
    badgeClass:
      "bg-purple-500/15 text-purple-800 border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30",
    description: "Alta demanda neuromuscular, equilibrio unipodal o carga axial pesada; requiere dominio absoluto de la técnica.",
  },
};

export type WorkoutDurationTrack = "express" | "standard" | "extended";

export interface DurationTrackConfig {
  id: WorkoutDurationTrack;
  label: string;
  durationLabel: string;
  estimatedMinutes: number;
  setsPerExercise: number;
  exerciseCount: number;
  description: string;
  badgeClass: string;
}

export const DURATION_TRACK_CONFIGS: Record<WorkoutDurationTrack, DurationTrackConfig> = {
  express: {
    id: "express",
    label: "Express",
    durationLabel: "45 min",
    estimatedMinutes: 45,
    setsPerExercise: 2,
    exerciseCount: 4,
    description: "Ideal para días con poco tiempo o principiantes adaptando su sistema nervioso (8-10 series totales).",
    badgeClass: "bg-emerald-500/15 text-emerald-800 border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
  standard: {
    id: "standard",
    label: "Estándar",
    durationLabel: "60-70 min",
    estimatedMinutes: 65,
    setsPerExercise: 3,
    exerciseCount: 5,
    description: "El punto dulce de hipertrofia y fuerza (15 series totales) con descansos completos de 90-120s.",
    badgeClass: "bg-sky-500/15 text-sky-800 border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300",
  },
  extended: {
    id: "extended",
    label: "Pro / 1.5 Horas",
    durationLabel: "90 min",
    estimatedMinutes: 90,
    setsPerExercise: 4,
    exerciseCount: 6,
    description: "Sesión completa y profunda (20-24 series totales) para intermedios y avanzados que buscan volumen máximo.",
    badgeClass: "bg-purple-500/15 text-purple-800 border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300",
  },
};

export interface WorkoutRoutineTemplate {
  id: "push" | "pull" | "legs" | "upper_arms" | "active_recovery";
  corto: string;
  titulo: string;
  subtitulo: string;
  recomendadoSiAyerHiciste: string[];
  level: BiomechanicLevel;
  targetDurationMinutes: number;
  exerciseIds: string[];
  extendedExerciseIds?: string[];
}

export interface SetRecord {
  setNum: number;
  pesoAnterior: string;
  pesoKg: number;
  reps: number;
  rir: number;
  rpe: number;
  alFallo: boolean;
  completado: boolean;
}

export interface ActiveWorkoutExercise {
  exerciseId: string;
  orden: number;
  sets: SetRecord[];
}

export interface StandardizedFood {
  id: string;
  nombre: string;
  categoria: "Proteína" | "Carbohidrato" | "Grasa Saludable" | "Vegetal";
  kcalPor100g: number;
  proteinaPor100g: number;
  carbsPor100g: number;
  grasaPor100g: number;
  porcionTipicaG: number;
}

export interface DetectedIngredient {
  foodId: string;
  nombre: string;
  gramosDetectados: number;
  confianza: number;
  kcalPor100g: number;
  proteinaPor100g: number;
  carbsPor100g: number;
  grasaPor100g: number;
}

export interface MealEntry {
  id: string;
  hora: string;
  tipoComida: "Desayuno" | "Almuerzo" | "Pre-Entreno" | "Cena" | "Snack";
  nombrePlato: string;
  items: {
    nombre: string;
    gramos: number;
    kcal: number;
    proteinas: number;
    carbs: number;
    grasas: number;
  }[];
}

export interface BodyMetricEntry {
  fecha: string;
  etiqueta: string;
  pesoKg: number;
  grasaPct: number;
  pechoCm: number;
  brazoCm: number;
  cinturaCm: number;
  piernaCm: number;
}

export interface CalendarDayPlan {
  id: string;
  diaSemana: string;
  fechaCorta: string;
  tituloSplit: string;
  tipo: "PUSH" | "PULL" | "LEGS" | "UPPER" | "LOWER" | "REST" | "ACTIVE_RECOVERY";
  cargaNivel: "Alta" | "Media" | "Baja" | "Descanso";
  rpePromedio: number | null;
  duracionMin: number;
  completado: boolean;
  esHoy?: boolean;
  musculos: string[];
}

export const WORKOUT_ROUTINES: WorkoutRoutineTemplate[] = [
  {
    id: "push",
    corto: "Pecho, Hombro y Tríceps",
    titulo: "Empuje — Pecho, Hombros y Tríceps",
    subtitulo: "Día de Empuje (Push)",
    level: "intermediate",
    targetDurationMinutes: 65,
    recomendadoSiAyerHiciste: ["Piernas", "Espalda", "Descanso"],
    exerciseIds: [
      "press-banca-inclinado-mancuernas",
      "cruces-polea-alta-baja",
      "press-militar-barra",
      "extension-triceps-katana-polea",
    ],
    extendedExerciseIds: [
      "press-banca-plano-barra",
      "fondos-paralelas-pecho-triceps",
    ],
  },
  {
    id: "pull",
    corto: "Espalda y Bíceps",
    titulo: "Tracción — Espalda, Dorsal y Bíceps",
    subtitulo: "Ideal si ayer hiciste Pecho/Hombros",
    level: "intermediate",
    targetDurationMinutes: 65,
    recomendadoSiAyerHiciste: ["Pecho, Hombros y Tríceps", "Piernas"],
    exerciseIds: [
      "jalon-al-pecho-neutro",
      "remo-pecho-apoyado-maquina",
      "curl-biceps-banco-inclinado",
      "face-pull-polea-alta",
    ],
    extendedExerciseIds: [
      "dominadas-libres-prono",
      "curl-martillo-mancuernas",
    ],
  },
  {
    id: "legs",
    corto: "Piernas y Glúteos",
    titulo: "Tren Inferior — Cuádriceps, Isquios y Glúteo",
    subtitulo: "Cero carga en torso (Ideal si ayer hiciste Pecho o Espalda)",
    level: "expert",
    targetDurationMinutes: 75,
    recomendadoSiAyerHiciste: ["Pecho, Hombros y Tríceps", "Espalda y Bíceps"],
    exerciseIds: [
      "sentadilla-hack-pro",
      "peso-muerto-rumano-barra",
      "curl-femoral-sentado-maquina",
      "extension-cuadriceps-maquina",
    ],
    extendedExerciseIds: [
      "sentadilla-libre-barra",
      "crunch-polea-alta-abs",
    ],
  },
  {
    id: "upper_arms",
    corto: "Hombro Lateral y Brazos",
    titulo: "Deltoides Lateral, Bíceps y Tríceps",
    subtitulo: "Sesión ligera articular de bombeo y brazos",
    level: "beginner",
    targetDurationMinutes: 50,
    recomendadoSiAyerHiciste: ["Piernas y Glúteos"],
    exerciseIds: [
      "elevaciones-laterales-polea",
      "curl-biceps-banco-inclinado",
      "extension-triceps-katana-polea",
      "face-pull-polea-alta",
    ],
    extendedExerciseIds: [
      "curl-martillo-mancuernas",
      "crunch-polea-alta-abs",
    ],
  },
  {
    id: "active_recovery",
    corto: "Descanso Activo y Movilidad",
    titulo: "Movilidad Articular, Cadera y Manguito Rotador",
    subtitulo: "Recuperación muscular sin fatiga del sistema nervioso",
    level: "beginner",
    targetDurationMinutes: 35,
    recomendadoSiAyerHiciste: ["4 días seguidos de carga"],
    exerciseIds: [
      "movilidad-toracica-foam-roller",
      "movilidad-cadera-90-90",
      "face-pull-polea-alta",
    ],
    extendedExerciseIds: [
      "crunch-polea-alta-abs",
    ],
  },
];

export const EXERCISE_CATALOG: ExerciseItem[] = [
  // ================= RUTINA PUSH (PECHO, HOMBRO, TRÍCEPS) =================
  {
    id: "press-banca-inclinado-mancuernas",
    nombre: "Press Inclinado con Mancuernas (30°)",
    grupoMuscular: "Pecho",
    equipoNecesario: "Mancuernas",
    curvaResistencia: "Estiramiento (Longitudinal)",
    force: "push",
    mechanic: "compound",
    level: "intermediate",
    primaryMuscles: ["Pectoral Superior (Porción Clavicular)"],
    secondaryMuscles: ["Deltoides Anterior", "Tríceps Braquial", "Serrato Anterior"],
    freeExerciseDbId: "Incline_Dumbbell_Press",
    instructionsStepByStep: [
      "Ajusta el respaldo del banco a 30° (1 o 2 muescas arriba del plano) y siéntate con las mancuernas apoyadas sobre los muslos.",
      "Impulsa las mancuernas una a una con las rodillas mientras te recuestas, retrae las escápulas (junta los omóplatos) y planta los pies firmes en el suelo.",
      "Desciende en 2-3 segundos con los codos a 45° respecto al torso (plano escapular) hasta que las mancuernas lleguen a los costados de tu pecho superior.",
      "Empuja explosivamente hacia el techo siguiendo un ligero arco convergente sin chocar las mancuernas arriba y exhala al finalizar.",
    ],
    tipsEjecucion: "Ajusta el respaldo a 30°. Baja con los codos a 45° del torso buscando estirar las fibras superiores del pecho y empuja sin chocar las mancuernas arriba.",
    descansoSugerido: 120,
    pesoAnteriorKg: 34,
    repsAnteriores: 9,
    sustitutos: [
      {
        id: "press-inclinado-multipower",
        nombre: "Press Inclinado en Multipower / Smith",
        equipo: "Máquina Smith",
        razonBiomecanica: "Los rieles fijos eliminan la necesidad de estabilizar y permiten enfocar el 100% de la fuerza en el pectoral superior.",
        comoHacerlo: "Coloca el banco a 30° bajo la barra guiada. Baja la barra hacia la parte alta del pecho (clavícula), haz una pausa de 1s y empuja desbloqueando el seguro.",
        freeExerciseDbId: "Smith_Machine_Incline_Bench_Press",
        instructionsStepByStep: [
          "Alinea el banco inclinado a 30° en el centro del Multipower de modo que la barra baje directo hacia tu clavícula.",
          "Toma la barra con un agarre ligeramente más ancho que tus hombros, gira las muñecas para liberar los ganchos de seguridad.",
          "Baja controlado durante 2-3 segundos hasta rozar el pecho superior, haz una pausa de 1 segundo y empuja sin bloquear los codos.",
        ],
      },
      {
        id: "press-convergente-pecho",
        nombre: "Press Convergente Inclinado en Máquina",
        equipo: "Máquina de Discos",
        razonBiomecanica: "Los brazos de la máquina se juntan al empujar, imitando el arco natural del pectoral.",
        comoHacerlo: "Ajusta el asiento para que los agarres queden a la altura de la parte superior del pecho. Empuja manteniendo los hombros pegados al respaldo.",
        freeExerciseDbId: "Leverage_Incline_Chest_Press",
        instructionsStepByStep: [
          "Regula la altura del asiento para que los manerales queden alineados con la mitad superior del pecho.",
          "Pega la espalda alta y la cabeza al respaldo manteniendo el pecho elevado.",
          "Empuja ambos brazos convergentes hasta casi extender los codos y regresa lento sintiendo el estiramiento pectoral.",
        ],
      },
      {
        id: "flexiones-declinadas-casa",
        nombre: "Flexiones Declinadas con Pies en Silla",
        equipo: "En Casa • Silla o Cama",
        esEnCasa: true,
        razonBiomecanica: "Elevar los pies reproduce exactamente el ángulo de 30° del banco inclinado para trabajar el pectoral superior sin pesas.",
        comoHacerlo: "Apoya las puntas de los pies sobre una silla o cama, manos en el suelo un poco más anchas que los hombros y baja el pecho controlado en 3 segundos.",
        freeExerciseDbId: "Decline_Push-Up",
        instructionsStepByStep: [
          "Apoya los pies sobre una silla estable o el borde de tu cama y coloca las manos en el suelo al ancho de los hombros.",
          "Mantén el abdomen firme y baja lentamente durante 3 segundos hasta acercar la parte alta del pecho al piso.",
          "Empuja firme hasta extender los brazos. Si quieres más carga, usa una mochila con libros.",
        ],
      },
    ],
  },
  {
    id: "cruces-polea-alta-baja",
    nombre: "Cruces en Polea de Abajo hacia Arriba",
    grupoMuscular: "Pecho",
    equipoNecesario: "Polea",
    curvaResistencia: "Acortamiento (Contracción)",
    force: "push",
    mechanic: "isolation",
    level: "intermediate",
    primaryMuscles: ["Pectoral Mayor (Fibras Internas y Superiores)"],
    secondaryMuscles: ["Deltoides Anterior", "Bíceps Braquial (Estabilizador)"],
    freeExerciseDbId: "Low_Cable_Crossover",
    instructionsStepByStep: [
      "Sitúa ambas poleas en la posición más baja de la estación, toma los estribos con las palmas mirando al frente (supinación) y da un paso adelante.",
      "Mantén el torso erguido con una ligera inclinación y los codos semiflexionados a 15-20° fijos durante todo el recorrido.",
      "Eleva y junta los brazos en un arco ascendente hasta que tus manos se encuentren frente a la parte alta de tu pecho.",
      "Aprieta el pectoral 1 segundo completo en la cima y regresa en 3 segundos controlando la resistencia de los cables.",
    ],
    tipsEjecucion: "Da un paso al frente para estabilizar, mantén los codos ligeramente flexionados y junta las manos a la altura del esternón superior.",
    descansoSugerido: 90,
    pesoAnteriorKg: 17.5,
    repsAnteriores: 12,
    sustitutos: [
      {
        id: "pec-deck-contractora",
        nombre: "Aperturas en Máquina Contractora (Pec Deck)",
        equipo: "Máquina",
        razonBiomecanica: "Tensión constante durante todo el cierre pectoral sin necesitar poleas libres.",
        comoHacerlo: "Siéntate con la espalda pegada al respaldo, toma los manerales a la altura de los hombros y junta los brazos al centro apretando 1 segundo.",
        freeExerciseDbId: "Butterfly",
        instructionsStepByStep: [
          "Ajusta el asiento de la contractora para que los manerales queden justo a la altura de tus hombros.",
          "Sujeta los agarres con los codos ligeramente doblados y las escápulas retraídas contra el respaldo.",
          "Cierra los brazos al centro apretando fuerte el pecho durante 1.5 segundos y abre controlado sin que las placas choquen.",
        ],
      },
      {
        id: "aperturas-mancuernas-inclinado",
        nombre: "Aperturas con Mancuernas en Banco a 30°",
        equipo: "Mancuernas",
        razonBiomecanica: "Excelente estiramiento pectoral usando solo un banco y un par de mancuernas.",
        comoHacerlo: "Abre los brazos en arco amplio con codos semiflexionados hasta sentir el estiramiento en el pecho y sube hasta la línea de los hombros.",
        freeExerciseDbId: "Incline_Dumbbell_Flyes",
        instructionsStepByStep: [
          "Recuéstate en el banco a 30° sosteniendo las mancuernas con agarre neutro (palmas mirándose entre sí).",
          "Abre los brazos en un arco amplio manteniendo un ángulo fijo en los codos como si abrazaras un árbol.",
          "Detente al sentir estiramiento profundo en el pectoral y vuelve a subir hasta alinear las mancuernas con tus hombros.",
        ],
      },
      {
        id: "flexiones-abiertas-casa",
        nombre: "Flexiones Amplias con Pausa Abajo",
        equipo: "En Casa • Peso Corporal",
        esEnCasa: true,
        razonBiomecanica: "Un agarre amplio con pausa de 2 segundos abajo maximiza el estiramiento y reclutamiento de las fibras pectorales en casa.",
        comoHacerlo: "Coloca las manos un palmo más abiertas que tus hombros, baja en 3 segundos, sostén 2 segundos a ras del suelo y sube apretando el pecho.",
        freeExerciseDbId: "Pushups",
        instructionsStepByStep: [
          "Coloca las manos en el suelo más abiertas que el ancho de tus hombros con los dedos apuntando ligeramente hacia afuera.",
          "Desciende en 3 segundos hasta que el pecho quede a 2 cm del piso y mantén una pausa de 2 segundos estirando el pectoral.",
          "Sube pensando en juntar tus manos contra el suelo para contraer el pecho al máximo.",
        ],
      },
    ],
  },
  {
    id: "press-militar-barra",
    nombre: "Press Militar con Barra de Pie (OHP)",
    grupoMuscular: "Hombros",
    equipoNecesario: "Barra",
    curvaResistencia: "Estiramiento (Longitudinal)",
    force: "push",
    mechanic: "compound",
    level: "intermediate",
    primaryMuscles: ["Deltoides Anterior", "Deltoides Lateral"],
    secondaryMuscles: ["Tríceps Braquial", "Trapecio Superior", "Core y Glúteos"],
    freeExerciseDbId: "Standing_Military_Press",
    instructionsStepByStep: [
      "Coloca la barra en el rack a la altura de tus clavículas; sujétala un poco más ancho que tus hombros con los codos apuntando ligeramente al frente.",
      "Saca la barra del rack, da un paso atrás, coloca los pies al ancho de la cadera y contrae con fuerza glúteos y abdomen.",
      "Empuja la barra verticalmente en línea recta; retrae ligeramente la barbilla al pasar frente al rostro y encaja la cabeza bajo la barra al bloquear arriba.",
      "Baja la barra de forma controlada hasta volver a apoyarla cerca de la parte alta del pecho.",
    ],
    tipsEjecucion: "Aprieta glúteos y abdomen, coloca las manos ligeramente más anchas que los hombros y empuja la barra verticalmente pasando cerca de la barbilla.",
    descansoSugerido: 120,
    pesoAnteriorKg: 52.5,
    repsAnteriores: 8,
    sustitutos: [
      {
        id: "press-hombro-sentado-mancuernas",
        nombre: "Press de Hombros Sentado con Mancuernas",
        equipo: "Mancuernas",
        razonBiomecanica: "Permite rotar las muñecas a un ángulo de 45° (plano escapular), protegiendo la articulación del hombro.",
        comoHacerlo: "Siéntate en banco a 75-80°. Baja las mancuernas hasta la altura de las orejas con codos ligeramente adelantados y empuja hacia el techo.",
        freeExerciseDbId: "Seated_Dumbbell_Press",
        instructionsStepByStep: [
          "Ajusta el respaldo del banco a 75-80° para no hiperextender la zona lumbar.",
          "Sube las mancuernas a la altura de las orejas con los codos adelantados unos 30° en el plano escapular.",
          "Presiona hacia arriba sin chocar las mancuernas y desciende en 2 segundos controlados.",
        ],
      },
      {
        id: "press-hombro-maquina",
        nombre: "Press de Hombros en Máquina Convergente",
        equipo: "Máquina",
        razonBiomecanica: "Trayectoria guiada segura que aísla los deltoides sin fatigar la espalda baja.",
        comoHacerlo: "Usa el agarre neutro (palmas mirándose) si tienes molestia articular, o el agarre prono tradicional para máximo énfasis en deltoides anterior.",
        freeExerciseDbId: "Leverage_Shoulder_Press",
        instructionsStepByStep: [
          "Ajusta el asiento para que los manerales inicien a la altura de tus hombros o barbilla.",
          "Mantén la espalda bien apoyada y empuja las palancas hasta casi extender los brazos sobre la cabeza.",
          "Baja lento durante 2-3 segundos sin dejar que el peso descanse en los topes.",
        ],
      },
      {
        id: "pike-pushups-casa",
        nombre: "Flexiones en Pica (Pike Push-Ups)",
        equipo: "En Casa • Peso Corporal",
        esEnCasa: true,
        razonBiomecanica: "Al elevar la cadera en V invertida conviertes el peso de tu torso en un empuje vertical directo sobre los deltoides.",
        comoHacerlo: "Forma una V invertida subiendo la cadera, baja la parte superior de la cabeza hacia el suelo entre tus manos y empuja fuerte.",
        freeExerciseDbId: "Handstand_Push-Ups",
        instructionsStepByStep: [
          "Apoya manos y pies en el suelo elevando la cadera hacia el techo hasta formar una V invertida.",
          "Flexiona los codos llevando la coronilla hacia adelante entre tus manos (formando un triángulo).",
          "Empuja el suelo regresando la cabeza entre los brazos hasta extender por completo.",
        ],
      },
    ],
  },
  {
    id: "elevaciones-laterales-polea",
    nombre: "Elevaciones Laterales en Polea Baja",
    grupoMuscular: "Hombros",
    equipoNecesario: "Polea",
    curvaResistencia: "Estiramiento (Longitudinal)",
    force: "push",
    mechanic: "isolation",
    level: "beginner",
    primaryMuscles: ["Deltoides Lateral (Cabeza Media)"],
    secondaryMuscles: ["Supraespinoso", "Trapecio Superior"],
    freeExerciseDbId: "One-Arm_Side_Laterals",
    instructionsStepByStep: [
      "Sitúa la polea a la altura de tu muñeca o espinilla para lograr la máxima tensión justo al inicio del movimiento.",
      "Párate de costado a la columna, sujeta la estructura con la mano libre e inclina ligeramente tu cuerpo hacia afuera.",
      "Eleva el brazo en el plano escapular (15° hacia adelante) pensando en alejar la mano hacia la pared lateral hasta llegar a la altura del hombro.",
      "Haz una micropausa arriba y desciende en 3 segundos resistiendo el tirón del cable.",
    ],
    tipsEjecucion: "Coloca la polea a la altura de tu muñeca. Eleva el brazo hacia el costado pensando en alejar la mano de tu cuerpo hasta la altura del hombro.",
    descansoSugerido: 60,
    pesoAnteriorKg: 10,
    repsAnteriores: 14,
    sustitutos: [
      {
        id: "elevaciones-laterales-mancuernas",
        nombre: "Elevaciones Laterales con Mancuernas",
        equipo: "Mancuernas",
        razonBiomecanica: "La variante clásica con peso libre para desarrollar la cabeza lateral del hombro en cualquier rincón del gym.",
        comoHacerlo: "Inclina el torso 10° hacia adelante, sube las mancuernas en el plano escapular liderando con los codos y baja en 2 segundos controlados.",
        freeExerciseDbId: "Side_Lateral_Raise",
        instructionsStepByStep: [
          "De pie con una mancuerna en cada mano, inclina el torso 10° al frente y deprime las escápulas (hombros lejos de las orejas).",
          "Eleva ambos brazos liderando con los codos hasta los 90° de abducción.",
          "Baja lentamente en 2-3 segundos manteniendo tensión continua en los deltoides.",
        ],
      },
      {
        id: "elevaciones-laterales-maquina",
        nombre: "Máquina de Elevaciones Laterales",
        equipo: "Máquina",
        razonBiomecanica: "Los cojines en los codos eliminan la tensión en muñecas y antebrazos, aislando al 100% el deltoides lateral.",
        comoHacerlo: "Apoya los codos contra las almohadillas laterales y empuja hacia afuera hasta que tus brazos queden paralelos al piso.",
        freeExerciseDbId: "Machine_Lateral_Raise",
        instructionsStepByStep: [
          "Alinea la articulación de tus hombros con el eje de rotación de la máquina.",
          "Apoya la parte externa de los codos contra los cojines y eleva hasta la horizontal.",
          "Sostén 1 segundo arriba y baja controlado sin usar impulso del trapecio.",
        ],
      },
      {
        id: "elevaciones-laterales-mochila-casa",
        nombre: "Elevaciones Laterales con Mochila o Botellas",
        equipo: "En Casa • Mochila / Banda",
        esEnCasa: true,
        razonBiomecanica: "El deltoides lateral responde excelente a cargas ligeras-moderadas con pausa de 1.5 segundos arriba usando una mochila o garrafas.",
        comoHacerlo: "Sujeta una mochila con libros por el asa superior (a una mano) e inclínate ligeramente apoyándote en una pared mientras elevas a 90°.",
        freeExerciseDbId: "Side_Lateral_Raise",
        instructionsStepByStep: [
          "Mete 2 o 3 libros o botellas de agua en una mochila y tómala por el asa superior con una mano.",
          "Sujétate del marco de una puerta con la mano libre, inclínate un poco y eleva el brazo hasta la altura del hombro.",
          "Haz una pausa de 1.5 segundos arriba y baja en 3 segundos lentos.",
        ],
      },
    ],
  },
  {
    id: "extension-triceps-katana-polea",
    nombre: "Extensión de Tríceps Trasnuca en Polea",
    grupoMuscular: "Brazos",
    equipoNecesario: "Polea",
    curvaResistencia: "Estiramiento (Longitudinal)",
    force: "push",
    mechanic: "isolation",
    level: "intermediate",
    primaryMuscles: ["Tríceps Braquial (Cabeza Larga)"],
    secondaryMuscles: ["Cabeza Lateral y Medial del Tríceps", "Ancóneo"],
    freeExerciseDbId: "Cable_Rope_Overhead_Triceps_Extension",
    instructionsStepByStep: [
      "Coloca la cuerda en la polea media-baja, sujeta ambos extremos y gira dando la espalda a la torre con un pie adelantado.",
      "Eleva los brazos sobre la cabeza manteniendo los codos fijos a unos 45°; deja que las manos bajen detrás de la nuca para estirar la cabeza larga del tríceps.",
      "Extiende únicamente los antebrazos hacia arriba y adelante separando las puntas de la cuerda al final del recorrido.",
      "Regresa lentamente durante 3 segundos sintiendo el estiramiento profundo detrás de los brazos.",
    ],
    tipsEjecucion: "De espaldas a la polea, mantén los codos fijos apuntando a 45° hacia arriba y extiende los antebrazos por completo.",
    descansoSugerido: 90,
    pesoAnteriorKg: 25,
    repsAnteriores: 11,
    sustitutos: [
      {
        id: "press-frances-mancuernas",
        nombre: "Press Francés con Mancuernas Acostado",
        equipo: "Mancuernas",
        razonBiomecanica: "Estira profundamente la cabeza larga del tríceps sin depender de poleas ocupadas.",
        comoHacerlo: "Acuéstate en un banco plano, lleva las mancuernas hacia los lados de tu frente flexionando solo los codos y extiende de vuelta arriba.",
        freeExerciseDbId: "Lying_Dumbbell_Tricep_Extension",
        instructionsStepByStep: [
          "Acuéstate en un banco plano sosteniendo dos mancuernas con agarre neutro e inclina los brazos 15° hacia atrás.",
          "Flexiona únicamente los codos bajando las mancuernas a los costados de tus sienes.",
          "Extiende los codos manteniendo los húmeros fijos hasta volver a la posición inicial.",
        ],
      },
      {
        id: "fondos-maquina-asistida",
        nombre: "Fondos de Tríceps en Máquina / Paralelas",
        equipo: "Máquina",
        razonBiomecanica: "Empuje vertical pesado para trabajar las 3 cabezas del tríceps simultáneamente.",
        comoHacerlo: "Mantén el torso erguido y los codos pegados a las costillas al bajar; empuja hasta extender por completo los brazos.",
        freeExerciseDbId: "Dip_Machine",
        instructionsStepByStep: [
          "Siéntate o sujétate en las barras manteniendo el torso erguido y los codos cerrados pegados al cuerpo.",
          "Flexiona los codos hasta formar un ángulo de 90° sin encoger los hombros.",
          "Empuja firme hacia abajo hasta extender por completo los brazos.",
        ],
      },
      {
        id: "fondos-silla-triceps-casa",
        nombre: "Fondos de Tríceps Apoyado en Silla",
        equipo: "En Casa • Silla o Cama",
        esEnCasa: true,
        razonBiomecanica: "Trabaja intensamente las 3 cabezas del tríceps usando el borde de una silla firme o sofá.",
        comoHacerlo: "Apoya las manos en el borde de una silla detrás de ti, desliza la cadera al frente y baja flexionando los codos a 90°.",
        freeExerciseDbId: "Bench_Dips",
        instructionsStepByStep: [
          "Apoya las palmas en el borde de una silla firme con los dedos mirando al frente y las piernas extendidas.",
          "Baja lento manteniendo la espalda cerca de la silla hasta que tus codos formen 90 grados.",
          "Empuja fuerte con los tríceps hasta bloquear suavemente arriba.",
        ],
      },
    ],
  },

  // ================= RUTINA PULL (ESPALDA Y BÍCEPS) =================
  {
    id: "jalon-al-pecho-neutro",
    nombre: "Jalón al Pecho en Polea Alta",
    grupoMuscular: "Espalda",
    equipoNecesario: "Polea",
    curvaResistencia: "Estiramiento (Longitudinal)",
    force: "pull",
    mechanic: "compound",
    level: "beginner",
    primaryMuscles: ["Dorsal Ancho (Amplitud en V)", "Redondo Mayor"],
    secondaryMuscles: ["Bíceps Braquial", "Romboides", "Trapecio Inferior"],
    freeExerciseDbId: "Wide-Grip_Lat_Pulldown",
    instructionsStepByStep: [
      "Ajusta las almohadillas firmemente sobre tus muslos para anclar la cadera y sujeta la barra ligeramente más ancho que tus hombros.",
      "Saca el pecho, inclina el torso apenas 10-15° hacia atrás y deprime las escápulas antes de doblar los codos.",
      "Tracciona la barra hacia la parte superior del pecho pensando en clavar tus codos hacia tus bolsillos laterales.",
      "Sostén 1 segundo abajo y deja subir la barra en 2-3 segundos hasta estirar por completo los dorsales.",
    ],
    tipsEjecucion: "Asegura los muslos bajo el cojín, saca el pecho y lleva la barra hacia la parte alta del pecho dirigiendo los codos hacia tus caderas.",
    descansoSugerido: 120,
    pesoAnteriorKg: 70,
    repsAnteriores: 10,
    sustitutos: [
      {
        id: "dominadas-asistidas-maquina",
        nombre: "Dominadas en Máquina Asistida / Libre",
        equipo: "Máquina",
        razonBiomecanica: "Mismo patrón de tracción vertical de arriba hacia abajo para ensanchar los dorsales.",
        comoHacerlo: "Sujeta las barras superiores, deja estirar los hombros abajo y sube llevando el pecho hacia la barra sin balancear las piernas.",
        freeExerciseDbId: "Assisted_Parallel_Close_Grip_Pull-Up",
        instructionsStepByStep: [
          "Selecciona el contrapeso de asistencia, apoya las rodillas o pies en la plataforma y sujeta los agarres superiores.",
          "Inicia desde colgado completo, retrae las escápulas y sube hasta que la barbilla supere el nivel de las manos.",
          "Desciende lentamente durante 3 segundos controlando todo el rango articular.",
        ],
      },
      {
        id: "remo-unilateral-mancuerna",
        nombre: "Remo con Mancuerna a Una Mano en Banco",
        equipo: "Mancuernas",
        razonBiomecanica: "Llevar la mancuerna en arco hacia la cadera trabaja el dorsal ancho con peso libre.",
        comoHacerlo: "Apoya rodilla y mano en un banco plano; jala la mancuerna hacia tu bolsillo trasero manteniendo la espalda recta.",
        freeExerciseDbId: "One-Arm_Dumbbell_Row",
        instructionsStepByStep: [
          "Apoya una rodilla y la mano del mismo lado sobre un banco plano manteniendo la columna totalmente horizontal y neutra.",
          "Toma la mancuerna con la mano libre dejando estirar el hombro hacia el suelo.",
          "Tracciona la mancuerna en un arco limpio hacia tu cadera (no hacia el hombro) y baja controlado.",
        ],
      },
      {
        id: "remo-toalla-puerta-casa",
        nombre: "Remo Invertido Bajo Mesa Firme / Toalla",
        equipo: "En Casa • Mesa o Toalla",
        esEnCasa: true,
        razonBiomecanica: "Permite traccionar tu propio peso corporal en casa activando intensamente dorsales, romboides y bíceps.",
        comoHacerlo: "Colócate debajo de una mesa de comedor resistente sujetando el borde, mantén el cuerpo recto y jala el pecho hacia la mesa.",
        freeExerciseDbId: "Inverted_Row",
        instructionsStepByStep: [
          "Acuéstate boca arriba debajo de una mesa sólida, sujeta el borde con ambas manos y apoya los talones en el suelo.",
          "Aprieta glúteos y abdomen para formar una tabla recta y tracciona llevando el pecho hacia el borde.",
          "Haz una pausa de 1 segundo arriba juntando los omóplatos y baja controlado.",
        ],
      },
    ],
  },
  {
    id: "remo-pecho-apoyado-maquina",
    nombre: "Remo con Pecho Apoyado en Máquina",
    grupoMuscular: "Espalda",
    equipoNecesario: "Máquina",
    curvaResistencia: "Acortamiento (Contracción)",
    force: "pull",
    mechanic: "compound",
    level: "beginner",
    primaryMuscles: ["Espalda Media (Romboides y Trapecio Medio)", "Dorsal Ancho"],
    secondaryMuscles: ["Deltoides Posterior", "Bíceps Braquial", "Braquiorradial"],
    freeExerciseDbId: "Leverage_Iso_Row",
    instructionsStepByStep: [
      "Ajusta la altura del asiento para que el cojín quede en la mitad de tu esternón y tus brazos salgan horizontales hacia las asas.",
      "Apoya el pecho contra el cojín, sujeta los manerales y deja que las escápulas se separen (protracción) al inicio para estirar la espalda alta.",
      "Inicia el tirón juntando los omóplatos y lleva los codos hacia atrás lo más lejos posible sin despegar el pecho del cojín.",
      "Mantén la contracción máxima 1 segundo y regresa lentamente en 2-3 segundos.",
    ],
    tipsEjecucion: "Apoya el pecho contra el cojín, deja que los hombros se estiren al frente y rema juntando las escápulas con fuerza atrás.",
    descansoSugerido: 120,
    pesoAnteriorKg: 65,
    repsAnteriores: 10,
    sustitutos: [
      {
        id: "remo-barra-inclinado",
        nombre: "Remo con Barra Inclinado (45°)",
        equipo: "Barra",
        razonBiomecanica: "Constructor clásico de densidad en toda la espalda media y trapecios.",
        comoHacerlo: "Inclina el torso a 45° con rodillas semiflexionadas, mantén el abdomen firme y lleva la barra hacia la parte baja de las costillas.",
        freeExerciseDbId: "Bent_Over_Barbell_Row",
        instructionsStepByStep: [
          "De pie con pies al ancho de hombros, realiza una bisagra de cadera inclinando el torso a 45° con la espalda recta.",
          "Sujeta la barra con agarre prono o supino y tracciona hacia la parte baja de las costillas / ombligo.",
          "Aprieta las escápulas arriba y baja la barra de forma controlada sin columpiar el torso.",
        ],
      },
      {
        id: "remo-sentado-polea-baja",
        nombre: "Remo Sentado en Polea Baja (Gironda)",
        equipo: "Polea",
        razonBiomecanica: "Tensión continua horizontal sobre romboides, trapecio medio y dorsal.",
        comoHacerlo: "Siéntate con las plantas de los pies firmes, mantén el torso erguido y jala el maneral hacia el abdomen juntando los omóplatos.",
        freeExerciseDbId: "Seated_Cable_Rows",
        instructionsStepByStep: [
          "Siéntate frente a la polea baja con los pies en la plataforma y las rodillas ligeramente flexionadas.",
          "Mantén el pecho alto y la espalda neutra; jala el maneral en V hacia la boca del estómago.",
          "Junta fuerte los omóplatos 1 segundo y extiende los brazos al frente controlando el peso.",
        ],
      },
      {
        id: "remo-mochila-unilateral-casa",
        nombre: "Remo a Una Mano con Mochila Pesada",
        equipo: "En Casa • Mochila + Silla",
        esEnCasa: true,
        razonBiomecanica: "Apoyar la mano libre en el respaldo de una silla estabiliza la columna igual que un banco y permite remar pesado con una mochila.",
        comoHacerlo: "Llena una mochila con libros o botellas, apoya tu mano libre en una silla y jala la mochila hacia tu cadera apretando 1s atrás.",
        freeExerciseDbId: "One-Arm_Dumbbell_Row",
        instructionsStepByStep: [
          "Carga una mochila firme con libros o botellas de agua y apoya tu mano libre sobre el asiento de una silla.",
          "Toma la mochila por el asa o correas cortas y déjala bajar estirando el dorsal.",
          "Jala el codo hacia atrás pegado al cuerpo, sostén 1 segundo arriba y baja en 3 segundos.",
        ],
      },
    ],
  },
  {
    id: "curl-biceps-banco-inclinado",
    nombre: "Curl de Bíceps con Mancuernas en Banco Inclinado",
    grupoMuscular: "Brazos",
    equipoNecesario: "Mancuernas",
    curvaResistencia: "Estiramiento (Longitudinal)",
    force: "pull",
    mechanic: "isolation",
    level: "intermediate",
    primaryMuscles: ["Bíceps Braquial (Cabeza Larga)"],
    secondaryMuscles: ["Braquial Anterior", "Braquiorradial (Antebrazo)"],
    freeExerciseDbId: "Incline_Dumbbell_Curl",
    instructionsStepByStep: [
      "Ajusta un banco a 45° o 60° y recuéstate con toda la espalda y la cabeza pegadas al respaldo.",
      "Deja colgar ambos brazos completamente verticales detrás de la línea de tu torso con las palmas mirando al frente (supinación).",
      "Sin adelantar los codos, flexiona los antebrazos subiendo las mancuernas y apretando fuerte el bíceps en la parte alta.",
      "Baja en 3 segundos hasta estirar por completo los codos en la posición inicial.",
    ],
    tipsEjecucion: "Recuéstate en un banco a 45-60°, deja colgar los brazos detrás del torso y flexiona los codos sin adelantar los hombros.",
    descansoSugerido: 90,
    pesoAnteriorKg: 16,
    repsAnteriores: 10,
    sustitutos: [
      {
        id: "curl-biceps-barra-z",
        nombre: "Curl de Bíceps de Pie con Barra Z",
        equipo: "Barra",
        razonBiomecanica: "El agarre angulado de la barra Z protege las muñecas y permite mover mayor carga total.",
        comoHacerlo: "De pie con los codos pegados al torso, sube la barra Z en un arco controlado apretando los bíceps arriba y baja en 2-3 segundos.",
        freeExerciseDbId: "EZ-Bar_Curl",
        instructionsStepByStep: [
          "Toma la barra Z por la curvatura externa o interna manteniendo los codos pegados a las costillas.",
          "Sube la barra en un arco limpio contrayendo los bíceps sin balancear la espalda.",
          "Desciende en 2-3 segundos resistiendo la gravedad hasta extender los brazos.",
        ],
      },
      {
        id: "curl-predicador-maquina",
        nombre: "Curl Predicador en Máquina / Banco Scott",
        equipo: "Máquina",
        razonBiomecanica: "El cojín bloquea cualquier balanceo de hombros y aísla por completo el bíceps braquial.",
        comoHacerlo: "Apoya toda la parte posterior de los brazos en el cojín, baja controlando el estiramiento y sube hasta contraer por completo.",
        freeExerciseDbId: "Machine_Preacher_Curls",
        instructionsStepByStep: [
          "Ajusta el asiento para que las axilas descansen cómodamente sobre el borde superior del cojín Scott.",
          "Apoya los tríceps en toda la almohadilla y flexiona los codos llevando los agarres hacia tus hombros.",
          "Baja lentamente sin hiperextender bruscamente el codo al final.",
        ],
      },
      {
        id: "curl-biceps-mochila-casa",
        nombre: "Curl de Bíceps con Mochila y Toalla",
        equipo: "En Casa • Mochila + Toalla",
        esEnCasa: true,
        razonBiomecanica: "Pasar una toalla por el asa de una mochila cargada crea un agarre neutro/supino idéntico al curl con cuerda en polea.",
        comoHacerlo: "Pasa una toalla pequeña por el asa superior de tu mochila con libros, pega los codos a las costillas y sube apretando 2s arriba.",
        freeExerciseDbId: "Hammer_Curls",
        instructionsStepByStep: [
          "Pasa una toalla de manos por el asa superior de una mochila cargada y sujeta ambos extremos.",
          "Pega la espalda a la pared para evitar balanceos, flexiona los codos y aprieta fuerte los bíceps arriba.",
          "Baja en 3 segundos controlados hasta extender los brazos.",
        ],
      },
    ],
  },
  {
    id: "face-pull-polea-alta",
    nombre: "Face Pull en Polea con Cuerda (Deltoides Posterior)",
    grupoMuscular: "Hombros",
    equipoNecesario: "Polea",
    curvaResistencia: "Acortamiento (Contracción)",
    force: "pull",
    mechanic: "isolation",
    level: "beginner",
    primaryMuscles: ["Deltoides Posterior", "Trapecio Medio e Inferior"],
    secondaryMuscles: ["Infraespinoso y Redondo Menor (Manguito Rotador)", "Romboides"],
    freeExerciseDbId: "Face_Pull",
    instructionsStepByStep: [
      "Sitúa la polea a la altura de la parte superior de tu pecho o rostro y coloca el accesorio de cuerda doble.",
      "Toma los extremos de la cuerda, da un paso atrás para tensar el cable y mantén el pecho erguido.",
      "Jala el centro de la cuerda hacia tu frente mientras abres las manos hacia los lados y rotas externamente los hombros (terminando en pose de doble bíceps).",
      "Mantén 1.5 segundos la contracción atrás y regresa controlado.",
    ],
    tipsEjecucion: "Jala la cuerda hacia tu frente separando las manos al final en una pose de doble bíceps para activar hombro posterior y manguito rotador.",
    descansoSugerido: 60,
    pesoAnteriorKg: 22.5,
    repsAnteriores: 15,
    sustitutos: [
      {
        id: "pajaros-pecho-apoyado-mancuernas",
        nombre: "Vuelos Posteriores (Pájaros) con Mancuernas",
        equipo: "Mancuernas",
        razonBiomecanica: "Aísla el deltoides posterior usando solo mancuernas ligeras y un banco inclinado.",
        comoHacerlo: "Apoya el pecho en un banco inclinado a 30° y abre los brazos hacia los lados llevando los codos hacia el techo.",
        freeExerciseDbId: "Seated_Bent-Over_Rear_Delt_Raise",
        instructionsStepByStep: [
          "Apoya el pecho sobre un banco inclinado a 30° o inclina el torso hacia tus rodillas.",
          "Con los codos ligeramente flexionados, eleva las mancuernas hacia los costados enfocándote en el hombro posterior.",
          "Baja en 2 segundos sin usar inercia.",
        ],
      },
      {
        id: "pec-deck-inverso-hombro",
        nombre: "Contractora Inversa (Rear Delt Machine)",
        equipo: "Máquina",
        razonBiomecanica: "Estabilidad máxima y tensión constante en la parte posterior del hombro.",
        comoHacerlo: "Siéntate mirando hacia la máquina con el pecho contra el cojín y empuja los brazos hacia atrás en un arco amplio.",
        freeExerciseDbId: "Reverse_Machine_Flyes",
        instructionsStepByStep: [
          "Ajusta el asiento para que los agarres queden exactamente al nivel de tus hombros.",
          "Siéntate mirando hacia el respaldo con el pecho pegado al cojín y toma los manerales horizontales.",
          "Abre los brazos en arco hacia atrás sin encoger el trapecio y regresa lento.",
        ],
      },
      {
        id: "vuelos-posteriores-casa",
        nombre: "Pájaros Inclinado con Botellas / Banda",
        equipo: "En Casa • Botellas o Banda",
        esEnCasa: true,
        razonBiomecanica: "El deltoides posterior es un músculo pequeño que se estimula al 100% con 2 botellas de agua o una banda elástica haciendo pausa arriba.",
        comoHacerlo: "Siéntate al borde de una silla, inclina el pecho hacia tus rodillas y abre los brazos hacia el techo sosteniendo 2s arriba.",
        freeExerciseDbId: "Seated_Bent-Over_Rear_Delt_Raise",
        instructionsStepByStep: [
          "Siéntate en el borde de una silla con una botella de agua en cada mano e inclina el torso sobre los muslos.",
          "Eleva los brazos hacia los lados con los codos abiertos a 90° y sostén 2 segundos en la cima.",
          "Baja lento sin dejar caer los brazos.",
        ],
      },
    ],
  },

  // ================= RUTINA LEGS (PIERNAS Y GLÚTEO) =================
  {
    id: "sentadilla-hack-pro",
    nombre: "Sentadilla Hack Profunda (Hack Squat)",
    grupoMuscular: "Piernas",
    equipoNecesario: "Máquina",
    curvaResistencia: "Estiramiento (Longitudinal)",
    force: "push",
    mechanic: "compound",
    level: "intermediate",
    primaryMuscles: ["Cuádriceps (Vasto Externo, Interno y Recto Femoral)"],
    secondaryMuscles: ["Glúteo Mayor", "Aductores", "Core"],
    freeExerciseDbId: "Hack_Squat",
    instructionsStepByStep: [
      "Apoya toda la espalda y el sacro contra el respaldo acolchado, encaja los hombros bajo los cojines y coloca los pies al ancho de caderas en la mitad inferior de la plataforma.",
      "Extiende las piernas para liberar los seguros laterales e inhala profundo compactando el abdomen.",
      "Baja en 3 segundos controlados flexionando las rodillas al máximo (pasando los 90°) sin que la pelvis ni los talones se despeguen.",
      "Empuja fuerte contra la plataforma con toda la planta del pie sin bloquear en seco las rodillas arriba.",
    ],
    tipsEjecucion: "Pega toda la espalda y cadera al respaldo, coloca los pies en la parte media-baja de la plataforma y baja lento hasta máxima flexión de rodilla.",
    descansoSugerido: 180,
    pesoAnteriorKg: 120,
    repsAnteriores: 8,
    sustitutos: [
      {
        id: "prensa-45-grados",
        nombre: "Prensa de Piernas Inclinada 45°",
        equipo: "Máquina",
        razonBiomecanica: "Misma demanda de extensión de rodilla y glúteo sin cargar peso sobre los hombros.",
        comoHacerlo: "Mantén el sacro pegado al asiento, baja la plataforma hasta que tus rodillas se acerquen al pecho y empuja con toda la planta del pie.",
        freeExerciseDbId: "Leg_Press",
        instructionsStepByStep: [
          "Siéntate en la prensa a 45° con la espalda baja y los glúteos totalmente pegados al asiento.",
          "Coloca los pies al ancho de tus hombros, quita los seguros y desciende la plataforma hasta que tus rodillas formen 90° o más.",
          "Empuja con los talones y mediopié manteniendo las rodillas alineadas con las puntas de los pies.",
        ],
      },
      {
        id: "sentadilla-bulgara-mancuernas",
        nombre: "Sentadilla Búlgara con Mancuernas",
        equipo: "Mancuernas",
        razonBiomecanica: "Estímulo unilateral brutal en cuádriceps y glúteo cuando las máquinas están ocupadas.",
        comoHacerlo: "Apoya el empeine trasero en un banco, da un paso adelante y baja verticalmente flexionando la rodilla delantera.",
        freeExerciseDbId: "Split_Squat_with_Dumbbells",
        instructionsStepByStep: [
          "Apoya el empeine de tu pie trasero sobre un banco detrás de ti y da un paso moderado hacia adelante.",
          "Sostén las mancuernas a los costados y desciende flexionando la rodilla delantera hasta que el muslo quede paralelo al piso.",
          "Empuja con el pie delantero para subir manteniendo el control del equilibrio.",
        ],
      },
      {
        id: "sentadilla-bulgara-casa",
        nombre: "Sentadilla Búlgara en Silla / Sofá",
        equipo: "En Casa • Silla + Mochila",
        esEnCasa: true,
        razonBiomecanica: "Al concentrar todo el peso de tu cuerpo en una sola pierna logras estímulo de hipertrofia real sin necesitar máquinas.",
        comoHacerlo: "Apoya el empeine trasero en tu sofá o silla, baja en 3 segundos hasta el fondo y empuja con la pierna delantera.",
        freeExerciseDbId: "Split_Squat_with_Dumbbells",
        instructionsStepByStep: [
          "Apoya el empeine de un pie sobre el borde del sofá o una silla estable.",
          "Baja lentamente en 3 segundos llevando la rodilla delantera al frente y sube sin bloquear arriba.",
        ],
      },
    ],
  },
  {
    id: "peso-muerto-rumano-barra",
    nombre: "Peso Muerto Rumano con Barra (RDL)",
    grupoMuscular: "Piernas",
    equipoNecesario: "Barra",
    curvaResistencia: "Estiramiento (Longitudinal)",
    force: "pull",
    mechanic: "compound",
    level: "intermediate",
    primaryMuscles: ["Isquiosurales (Bíceps Femoral, Semitendinoso)", "Glúteo Mayor"],
    secondaryMuscles: ["Erectores Espinales (Espalda Baja)", "Dorsal Ancho", "Antebrazos"],
    freeExerciseDbId: "Romanian_Deadlift",
    instructionsStepByStep: [
      "Saca la barra del rack a la altura de tus muslos con agarre prono al ancho de los hombros; coloca los pies al ancho de la cadera.",
      "Desbloquea las rodillas con una flexión suave de 15-20° que se mantendrá fija todo el ejercicio.",
      "Inicia el movimiento empujando la cadera horizontalmente hacia la pared detrás de ti mientras deslizas la barra pegada a tus muslos y espinillas.",
      "Detente a mitad de la espinilla (cuando sientas máximo estiramiento en los femorales sin encorvar la espalda) y extiende la cadera apretando glúteos.",
    ],
    tipsEjecucion: "Desliza la barra pegada a tus muslos empujando la cadera hacia atrás con rodillas semiflexionadas hasta sentir máximo estiramiento en isquios.",
    descansoSugerido: 120,
    pesoAnteriorKg: 100,
    repsAnteriores: 9,
    sustitutos: [
      {
        id: "peso-muerto-rumano-mancuernas",
        nombre: "Peso Muerto Rumano con Mancuernas",
        equipo: "Mancuernas",
        razonBiomecanica: "Permite colocar las pesas a los lados del cuerpo reduciendo el estrés en la espalda baja.",
        comoHacerlo: "Sostén las mancuernas a los costados de tus muslos, lleva la cadera hacia la pared detrás de ti manteniendo la espalda neutra y sube.",
        freeExerciseDbId: "Stiff-Legged_Dumbbell_Deadlift",
        instructionsStepByStep: [
          "Sostén un par de mancuernas frente o a los lados de tus muslos con las escápulas retraídas.",
          "Empuja la cadera hacia atrás en bisagra pura manteniendo la espalda totalmente neutra.",
          "Al llegar bajo las rodillas con máximo estiramiento de isquios, sube extendiendo la cadera.",
        ],
      },
      {
        id: "hip-thrust-maquina-barra",
        nombre: "Hip Thrust (Empuje de Cadera) en Máquina / Banco",
        equipo: "Máquina",
        razonBiomecanica: "Enfoca la cadena posterior y glúteos en máxima contracción sin fatigar la zona lumbar.",
        comoHacerlo: "Apoya las escápulas en el respaldo, empuja con los talones hasta alinear rodillas, cadera y hombros, apretando glúteos 1s arriba.",
        freeExerciseDbId: "Barbell_Glute_Bridge",
        instructionsStepByStep: [
          "Apoya la parte inferior de tus escápulas en el borde del banco y coloca la barra acolchada sobre el pliegue de la cadera.",
          "Ubica los pies de forma que al subir tus espinillas queden totalmente verticales (rodillas a 90°).",
          "Empuja con los talones elevando la pelvis hasta formar una mesa recta y aprieta los glúteos 1 segundo arriba.",
        ],
      },
      {
        id: "puente-gluteo-unilateral-casa",
        nombre: "Hip Thrust a Una Pierna en Sofá",
        equipo: "En Casa • Sofá o Cama",
        esEnCasa: true,
        razonBiomecanica: "Hacerlo a una sola pierna duplica la carga sobre el glúteo e isquiosurales sin necesitar barra olímpica.",
        comoHacerlo: "Apoya la espalda alta en el borde del sofá, levanta un pie en el aire y empuja la cadera con el talón de apoyo sosteniendo 2s arriba.",
        freeExerciseDbId: "Single_Leg_Glute_Bridge",
        instructionsStepByStep: [
          "Apoya los omóplatos en el borde de tu sofá o cama con un pie firme en el suelo y la otra rodilla elevada.",
          "Empuja con el talón hasta alinear cadera y hombro, apretando fuerte 2 segundos arriba.",
        ],
      },
    ],
  },
  {
    id: "curl-femoral-sentado-maquina",
    nombre: "Curl Femoral Sentado en Máquina",
    grupoMuscular: "Piernas",
    equipoNecesario: "Máquina",
    curvaResistencia: "Estiramiento (Longitudinal)",
    force: "pull",
    mechanic: "isolation",
    level: "beginner",
    primaryMuscles: ["Isquiosurales (Semimembranoso, Semitendinoso y Bíceps Femoral)"],
    secondaryMuscles: ["Gastrocnemio (Gemelos)"],
    freeExerciseDbId: "Seated_Leg_Curl",
    instructionsStepByStep: [
      "Ajusta el respaldo para que tus rodillas coincidan con el eje de giro de la máquina y coloca el rodillo inferior justo encima de los talones (tendón de Aquiles).",
      "Baja y asegura con firmeza el cojín superior sobre tus muslos para bloquear la pelvis contra el asiento.",
      "Flexiona las rodillas llevando los talones lo más atrás y abajo posible bajo el asiento.",
      "Pausa 1 segundo en máxima contracción y extiende las piernas en 3 segundos controlados.",
    ],
    tipsEjecucion: "Ajusta el cojín sobre tus muslos para no levantarte del asiento y flexiona las rodillas llevando los talones lo más atrás posible.",
    descansoSugerido: 90,
    pesoAnteriorKg: 60,
    repsAnteriores: 12,
    sustitutos: [
      {
        id: "curl-femoral-acostado-maquina",
        nombre: "Curl Femoral Acostado (Tumbado) en Máquina",
        equipo: "Máquina",
        razonBiomecanica: "Aísla directamente los isquiosurales con máxima contracción en la parte final.",
        comoHacerlo: "Mantén la pelvis pegada al banco al subir el rodillo hacia los glúteos y controla 2 segundos la bajada.",
        freeExerciseDbId: "Lying_Leg_Curls",
        instructionsStepByStep: [
          "Acuéstate boca abajo ajustando el rodillo detrás de los tobillos y sujeta los manerales frontales.",
          "Presiona la cadera contra el tapiz y flexiona las piernas acercando el rodillo a los glúteos.",
          "Desciende lentamente durante 3 segundos sin despegar la pelvis.",
        ],
      },
      {
        id: "curl-femoral-mancuerna-banco",
        nombre: "Curl Femoral Acostado con Mancuerna entre los Pies",
        equipo: "Mancuernas",
        razonBiomecanica: "Alternativa efectiva con peso libre cuando las máquinas de femoral están ocupadas.",
        comoHacerlo: "Acuéstate boca abajo en un banco sujetando una mancuerna entre las plantas de los pies y flexiona las rodillas.",
        freeExerciseDbId: "Dumbbell_Leg_Curl",
        instructionsStepByStep: [
          "Acuéstate boca abajo en un banco plano y sujeta firmemente una mancuerna entre los arcos de ambos pies.",
          "Flexiona las rodillas subiendo la mancuerna hasta formar 90° y controla el descenso en 3 segundos.",
        ],
      },
      {
        id: "curl-femoral-deslizante-casa",
        nombre: "Curl Femoral Deslizante con Toalla en Piso",
        equipo: "En Casa • Toalla en Suelo",
        esEnCasa: true,
        razonBiomecanica: "Deslizar los talones manteniendo la cadera elevada genera una contracción intensa en los isquiosurales sin máquinas.",
        comoHacerlo: "Acuéstate boca arriba sobre piso liso con los talones sobre una toalla o calcetines; eleva la cadera, desliza los pies lento y recoge.",
        freeExerciseDbId: "Russian_Leg_Curl",
        instructionsStepByStep: [
          "Acuéstate boca arriba apoyando los talones sobre una toalla en piso liso y eleva la pelvis en puente.",
          "Desliza los talones hacia adelante en 3 segundos sin que los glúteos toquen el suelo y jala de vuelta hacia ti.",
        ],
      },
    ],
  },
  {
    id: "extension-cuadriceps-maquina",
    nombre: "Extensión de Cuádriceps en Máquina",
    grupoMuscular: "Piernas",
    equipoNecesario: "Máquina",
    curvaResistencia: "Acortamiento (Contracción)",
    force: "push",
    mechanic: "isolation",
    level: "beginner",
    primaryMuscles: ["Cuádriceps (Recto Femoral y los 3 Vastos)"],
    secondaryMuscles: ["Tibial Anterior (Estabilizador)"],
    freeExerciseDbId: "Leg_Extensions",
    instructionsStepByStep: [
      "Ajusta el respaldo para que la parte posterior de tus rodillas descanse justo en el borde del asiento, alineada con el pivote de la máquina.",
      "Coloca el rodillo acolchado sobre la parte baja de las espinillas (empeine alto) y sujeta fuerte las asas laterales para fijar la cadera.",
      "Extiende ambas piernas hasta la horizontal contrayendo al máximo los cuádriceps durante 1.5 segundos arriba.",
      "Baja en 3 segundos controlados hasta que las piernas pasen ligeramente los 90° de flexión.",
    ],
    tipsEjecucion: "Alinea tu rodilla con el eje de giro de la máquina, sujeta fuerte los manerales laterales y extiende las piernas pausando 1s arriba.",
    descansoSugerido: 90,
    pesoAnteriorKg: 70,
    repsAnteriores: 12,
    sustitutos: [
      {
        id: "sentadilla-sissy-goblet",
        nombre: "Sentadilla Goblet con Talones Elevados",
        equipo: "Mancuernas",
        razonBiomecanica: "Elevar los talones sobre dos discos enfatiza el recto femoral y vastos del cuádriceps con una sola mancuerna.",
        comoHacerlo: "Sostén una mancuerna pegada al pecho, apoya los talones en dos discos pequeños y baja manteniendo el torso totalmente vertical.",
        freeExerciseDbId: "Goblet_Squat",
        instructionsStepByStep: [
          "Apoya los talones sobre una cuña o dos discos pequeños y sujeta una mancuerna en copa frente al pecho.",
          "Baja con el torso vertical llevando las rodillas hacia adelante para máxima flexión de cuádriceps.",
          "Sube empujando con el mediopié sin inclinarte hacia el frente.",
        ],
      },
      {
        id: "prensa-unilateral-cuadriceps",
        nombre: "Prensa a Una Pierna (Pie Bajo)",
        equipo: "Máquina",
        razonBiomecanica: "Colocar el pie en la parte baja de la plataforma maximiza la flexión de rodilla y el trabajo del cuádriceps.",
        comoHacerlo: "Realiza el movimiento con una pierna a la vez controlando la bajada y empujando sin bloquear brusco la rodilla.",
        freeExerciseDbId: "Single-Leg_Press",
        instructionsStepByStep: [
          "Apoya un solo pie en la zona media-baja de la plataforma de la prensa y deja la otra pierna firme en el suelo.",
          "Baja controlando la flexión de rodilla hasta el máximo rango cómodo y empuja firme.",
        ],
      },
      {
        id: "sentadilla-pared-isometrica-casa",
        nombre: "Sentadilla Sissy Asistida / Pared",
        equipo: "En Casa • Puerta o Pared",
        esEnCasa: true,
        razonBiomecanica: "Adelantar las rodillas sujetándote del marco de una puerta aísla el recto femoral igual que la máquina de extensión.",
        comoHacerlo: "Sujétate del marco de una puerta, ponte de puntillas y lleva las rodillas hacia adelante manteniendo cadera y torso rectos.",
        freeExerciseDbId: "Wall_Squat",
        instructionsStepByStep: [
          "Toma el marco de una puerta para equilibrarte y eleva los talones.",
          "Flexiona las rodillas llevándolas hacia adelante mientras tu cadera y torso bajan en bloque recto; luego extiende fuerte.",
        ],
      },
    ],
  },

  // ================= RUTINA DESCANSO ACTIVO Y MOVILIDAD =================
  {
    id: "movilidad-toracica-foam-roller",
    nombre: "Extensión Torácica sobre Foam Roller",
    grupoMuscular: "Espalda",
    equipoNecesario: "Peso Corporal",
    curvaResistencia: "Estiramiento (Longitudinal)",
    force: "static",
    mechanic: "isolation",
    level: "beginner",
    primaryMuscles: ["Columna Torácica", "Pectoral Menor (Estiramiento)"],
    secondaryMuscles: ["Trapecio Medio", "Serrato Anterior"],
    freeExerciseDbId: "Lower_Back_Curl",
    instructionsStepByStep: [
      "Coloca el rodillo de espuma (Foam Roller) transversalmente bajo tu espalda media (a la altura de los omóplatos) con los glúteos apoyados en el suelo.",
      "Entrelaza las manos detrás de tu nuca para sostener el cuello y mantén las costillas bajas.",
      "Inhala profundo y arquea suavemente la espalda alta sobre el rodillo abriendo el pecho hacia el techo durante 3 segundos.",
      "Exhala al volver y desplaza el rodillo 3 cm más arriba para movilizar el siguiente segmento vertebral.",
    ],
    tipsEjecucion: "Apoya la espalda media sobre el rodillo de espuma, sujeta tu nuca y abre el pecho hacia atrás inhalando profundo durante 3 segundos.",
    descansoSugerido: 60,
    pesoAnteriorKg: 0,
    repsAnteriores: 12,
    sustitutos: [
      {
        id: "estiramiento-gato-camello",
        nombre: "Movilidad Escapular y Columna (Cat-Cow)",
        equipo: "En Casa • Suelo o Alfombra",
        esEnCasa: true,
        razonBiomecanica: "Descomprime las vértebras torácicas y lumbares en casa sin necesidad de rodillo.",
        comoHacerlo: "En cuatro puntos sobre una alfombra, arquea la espalda hacia arriba empujando el suelo y luego abre el pecho suavemente.",
        freeExerciseDbId: "Cat_Stretch",
        instructionsStepByStep: [
          "Colócate en cuadrupedia sobre el suelo con manos bajo los hombros y rodillas bajo las caderas.",
          "Exhala redondeando toda la columna hacia el techo y luego inhala abriendo el pecho hacia adelante.",
        ],
      },
    ],
  },
  {
    id: "movilidad-cadera-90-90",
    nombre: "Movilidad de Cadera 90/90 y Psoas",
    grupoMuscular: "Piernas",
    equipoNecesario: "Peso Corporal",
    curvaResistencia: "Estiramiento (Longitudinal)",
    force: "static",
    mechanic: "isolation",
    level: "beginner",
    primaryMuscles: ["Rotadores Internos y Externos de Cadera", "Glúteo Medio"],
    secondaryMuscles: ["Psoas Ilíaco", "Aductores"],
    freeExerciseDbId: "Groin_and_Back_Stretch",
    instructionsStepByStep: [
      "Siéntate en el suelo flexionando la pierna delantera a 90° frente a ti y la pierna trasera a 90° hacia el costado.",
      "Mantén el pecho erguido e inclínate suavemente sobre la espinilla delantera durante 3 segundos para estirar el glúteo en rotación externa.",
      "Rota ambas rodillas de forma fluida hacia el lado opuesto sin despegar los talones del suelo.",
    ],
    tipsEjecucion: "Sentado en el suelo con ambas rodillas a 90 grados, rota suavemente de un lado al otro manteniendo el torso erguido.",
    descansoSugerido: 60,
    pesoAnteriorKg: 0,
    repsAnteriores: 10,
    sustitutos: [
      {
        id: "zancada-movilidad-psoas",
        nombre: "Estiramiento Dinámico de Flexores de Cadera",
        equipo: "En Casa • Suelo o Cojín",
        esEnCasa: true,
        razonBiomecanica: "Libera la tensión acumulada en cadera y zona lumbar tras días de sentadilla o estar sentado.",
        comoHacerlo: "Con una rodilla sobre un cojín, adelanta ligeramente la pelvis apretando el glúteo trasero durante 3 segundos.",
        freeExerciseDbId: "Kneeling_Hip_Flexor",
        instructionsStepByStep: [
          "Apoya una rodilla sobre un cojín y coloca el otro pie adelante a 90°.",
          "Realiza una retroversión pélvica apretando el glúteo trasero y desplaza la cadera 5 cm al frente durante 3 segundos.",
        ],
      },
    ],
  },

  // ================= BIBLIOTECA EXTENDIDA DE CLÁSICOS (FREE-EXERCISE-DB) =================
  {
    id: "press-banca-plano-barra",
    nombre: "Press de Banca Plano con Barra Olímpica",
    grupoMuscular: "Pecho",
    equipoNecesario: "Barra",
    curvaResistencia: "Estiramiento (Longitudinal)",
    force: "push",
    mechanic: "compound",
    level: "intermediate",
    primaryMuscles: ["Pectoral Mayor (Porción Esternal)"],
    secondaryMuscles: ["Tríceps Braquial", "Deltoides Anterior"],
    freeExerciseDbId: "Barbell_Bench_Press_-_Medium_Grip",
    instructionsStepByStep: [
      "Acuéstate en el banco plano con los ojos justo debajo de la barra; retrae y deprime las escápulas contra el tapiz y planta los pies firmes.",
      "Toma la barra con un agarre medio (1.5 veces el ancho de hombros), sácala del rack y estabilízala sobre los hombros.",
      "Baja la barra de forma controlada en una diagonal suave hacia la línea inferior del pecho (esternón) manteniendo los codos a 45-60°.",
      "Empuja con fuerza hacia arriba y ligeramente hacia atrás hasta extender los brazos.",
    ],
    tipsEjecucion: "Retrae las escápulas contra el banco, mantén los pies firmes en el piso y baja la barra de forma controlada hacia la línea media-baja del pecho.",
    descansoSugerido: 180,
    pesoAnteriorKg: 90,
    repsAnteriores: 8,
    sustitutos: [
      {
        id: "press-convergente-pecho",
        nombre: "Press Convergente en Máquina",
        equipo: "Máquina",
        razonBiomecanica: "Misma mecánica de empuje horizontal con estabilidad guiada para llegar al fallo seguro.",
        comoHacerlo: "Ajusta el asiento a la mitad del pecho y empuja los manerales manteniendo los omóplatos retraídos.",
        freeExerciseDbId: "Leverage_Chest_Press",
      },
      {
        id: "flexiones-clasicas-casa",
        nombre: "Flexiones de Pecho Controladas (Tempo 3-1-1)",
        equipo: "En Casa • Peso Corporal",
        esEnCasa: true,
        razonBiomecanica: "El patrón biomecánico exacto del press plano usando el peso de tu cuerpo y tempo lento.",
        comoHacerlo: "Manos al ancho de hombros, baja en 3 segundos con codos a 45°, pausa 1 segundo abajo y empuja firme.",
        freeExerciseDbId: "Pushups",
      },
    ],
  },
  {
    id: "fondos-paralelas-pecho-triceps",
    nombre: "Fondos en Barras Paralelas (Dips)",
    grupoMuscular: "Pecho",
    equipoNecesario: "Peso Corporal",
    curvaResistencia: "Estiramiento (Longitudinal)",
    force: "push",
    mechanic: "compound",
    level: "intermediate",
    primaryMuscles: ["Pectoral Inferior (Abdominal)", "Tríceps Braquial"],
    secondaryMuscles: ["Deltoides Anterior", "Pectoral Menor"],
    freeExerciseDbId: "Dips_-_Chest_Version",
    instructionsStepByStep: [
      "Sujeta las barras paralelas y elévate con los brazos extendidos y los hombros deprimidos (lejos de las orejas).",
      "Inclina el torso unos 20-30° hacia adelante flexionando las rodillas detrás de ti para enfatizar el pectoral.",
      "Desciende lentamente flexionando los codos hasta que tus hombros queden ligeramente por debajo del nivel de los codos.",
      "Empuja fuerte contra las barras hasta volver a la posición superior.",
    ],
    tipsEjecucion: "Inclina ligeramente el torso hacia adelante al bajar a 90° para enfatizar las fibras inferiores del pectoral y extiende firme.",
    descansoSugerido: 120,
    pesoAnteriorKg: 10,
    repsAnteriores: 10,
    sustitutos: [
      {
        id: "fondos-maquina-asistida",
        nombre: "Fondos en Máquina Asistida / Sentado",
        equipo: "Máquina",
        razonBiomecanica: "Permite ajustar la carga exacta cuidando la cápsula anterior del hombro.",
        comoHacerlo: "Empuja los manerales hacia abajo manteniendo el pecho alto y los codos alineados.",
        freeExerciseDbId: "Dip_Machine",
      },
      {
        id: "fondos-silla-triceps-casa",
        nombre: "Fondos Apoyado entre Sillas",
        equipo: "En Casa • Sillas",
        esEnCasa: true,
        razonBiomecanica: "Reproduce el empuje vertical usando dos sillas firmes o el borde de la cama.",
        comoHacerlo: "Apoya las manos en el borde de una silla firme y baja flexionando codos a 90°.",
        freeExerciseDbId: "Bench_Dips",
      },
    ],
  },
  {
    id: "dominadas-libres-prono",
    nombre: "Dominadas Pronas Libres / Lastradas (Pull-Ups)",
    grupoMuscular: "Espalda",
    equipoNecesario: "Peso Corporal",
    curvaResistencia: "Rango Medio",
    force: "pull",
    mechanic: "compound",
    level: "intermediate",
    primaryMuscles: ["Dorsal Ancho", "Redondo Mayor"],
    secondaryMuscles: ["Bíceps Braquial", "Trapecio Inferior", "Core"],
    freeExerciseDbId: "Pullups",
    instructionsStepByStep: [
      "Cuelga de la barra fija con agarre prono (palmas hacia adelante) un poco más ancho que tus hombros.",
      "Activa el abdomen y deprime las escápulas (baja los hombros) antes de iniciar la flexión de los brazos.",
      "Tracciona tu cuerpo hacia arriba buscando llevar la parte alta del pecho hacia la barra mientras diriges los codos al suelo.",
      "Baja en 3 segundos controlados hasta extender los brazos sin perder tensión escapular.",
    ],
    tipsEjecucion: "Inicia cada repetición deprimiendo las escápulas y sube buscando acercar la parte alta del pecho a la barra sin balancearte.",
    descansoSugerido: 120,
    pesoAnteriorKg: 10,
    repsAnteriores: 8,
    sustitutos: [
      {
        id: "jalon-al-pecho-neutro",
        nombre: "Jalón al Pecho en Polea Alta",
        equipo: "Polea",
        razonBiomecanica: "Permite modular el peso exacto con el mismo vector vertical de tracción.",
        comoHacerlo: "Asegura los muslos bajo el cojín y tracciona la barra hacia la clavícula.",
        freeExerciseDbId: "Wide-Grip_Lat_Pulldown",
      },
      {
        id: "remo-toalla-puerta-casa",
        nombre: "Remo Invertido Bajo Mesa Firme",
        equipo: "En Casa • Mesa Firme",
        esEnCasa: true,
        razonBiomecanica: "Tracción de peso corporal en casa cuando no cuentas con barra de dominadas.",
        comoHacerlo: "Sujeta el borde de una mesa resistente desde abajo y jala el pecho hacia arriba.",
        freeExerciseDbId: "Inverted_Row",
      },
    ],
  },
  {
    id: "sentadilla-libre-barra",
    nombre: "Sentadilla Libre con Barra (Back Squat)",
    grupoMuscular: "Piernas",
    equipoNecesario: "Barra",
    curvaResistencia: "Estiramiento (Longitudinal)",
    force: "push",
    mechanic: "compound",
    level: "intermediate",
    primaryMuscles: ["Cuádriceps", "Glúteo Mayor"],
    secondaryMuscles: ["Aductores", "Erectores Espinales", "Core"],
    freeExerciseDbId: "Barbell_Full_Squat",
    instructionsStepByStep: [
      "Apoya la barra sobre el trapecio superior (High Bar), sujétala firme cerrando los codos debajo de la barra y da un paso atrás.",
      "Coloca los pies al ancho de los hombros con las puntas abiertas 15-30°, inhala profundo en el abdomen (maniobra de Valsalva).",
      "Desciende flexionando simultáneamente rodillas y caderas con el torso firme hasta romper el paralelo (cadera bajo la rodilla).",
      "Empuja el piso con toda la planta del pie manteniendo las rodillas alineadas con los pies hasta volver a ponerte de pie.",
    ],
    tipsEjecucion: "Inhala profundo compactando el core, baja rompiendo el paralelo con las rodillas en dirección a las puntas de los pies y empuja firme.",
    descansoSugerido: 180,
    pesoAnteriorKg: 110,
    repsAnteriores: 7,
    sustitutos: [
      {
        id: "sentadilla-hack-pro",
        nombre: "Sentadilla Hack Profunda",
        equipo: "Máquina",
        razonBiomecanica: "Estabiliza la columna lumbar en el respaldo permitiendo enfocar toda la fatiga en los cuádriceps.",
        comoHacerlo: "Pega toda la espalda al respaldo y baja profundo flexionando las rodillas al máximo.",
        freeExerciseDbId: "Hack_Squat",
      },
      {
        id: "sentadilla-bulgara-casa",
        nombre: "Sentadilla Búlgara en Silla",
        equipo: "En Casa • Silla",
        esEnCasa: true,
        razonBiomecanica: "Trabaja una pierna a la vez multiplicando la intensidad sin barra.",
        comoHacerlo: "Apoya el empeine trasero en una silla y baja profundo con la pierna delantera.",
        freeExerciseDbId: "Split_Squat_with_Dumbbells",
      },
    ],
  },
  {
    id: "curl-martillo-mancuernas",
    nombre: "Curl Martillo Alterno con Mancuernas (Hammer Curl)",
    grupoMuscular: "Brazos",
    equipoNecesario: "Mancuernas",
    curvaResistencia: "Rango Medio",
    force: "pull",
    mechanic: "isolation",
    level: "beginner",
    primaryMuscles: ["Braquial Anterior", "Braquiorradial (Antebrazo)"],
    secondaryMuscles: ["Bíceps Braquial (Cabeza Larga)"],
    freeExerciseDbId: "Hammer_Curls",
    instructionsStepByStep: [
      "Párate erguido sosteniendo un par de mancuernas a los costados con agarre neutro (las palmas mirándose entre sí como tomando un martillo).",
      "Mantén los codos pegados a las costillas y sube las mancuernas flexionando el codo sin rotar la muñeca.",
      "Haz una pausa de 1 segundo arriba apretando el braquial y el antebrazo, y baja en 2-3 segundos controlados.",
    ],
    tipsEjecucion: "Mantén el agarre neutro (palmas mirándose) todo el recorrido con los codos fijos a los costados para dar grosor al brazo y antebrazo.",
    descansoSugerido: 90,
    pesoAnteriorKg: 18,
    repsAnteriores: 10,
    sustitutos: [
      {
        id: "curl-biceps-barra-z",
        nombre: "Curl con Barra Z",
        equipo: "Barra",
        razonBiomecanica: "Agarre semi-supino cómodo para las muñecas con carga bilateral.",
        comoHacerlo: "Sube la barra Z en arco limpio manteniendo los codos pegados al torso.",
        freeExerciseDbId: "EZ-Bar_Curl",
      },
      {
        id: "curl-biceps-mochila-casa",
        nombre: "Curl Martillo con Mochila y Toalla",
        equipo: "En Casa • Mochila + Toalla",
        esEnCasa: true,
        razonBiomecanica: "Sujetar los extremos de una toalla pasada por una mochila replica exactamente el agarre neutro del martillo.",
        comoHacerlo: "Pasa una toalla por el asa de tu mochila con libros y flexiona con las palmas mirándose.",
        freeExerciseDbId: "Hammer_Curls",
      },
    ],
  },
  {
    id: "crunch-polea-alta-abs",
    nombre: "Crunch Abdominal en Polea Alta con Cuerda",
    grupoMuscular: "Core",
    equipoNecesario: "Polea",
    curvaResistencia: "Acortamiento (Contracción)",
    force: "pull",
    mechanic: "isolation",
    level: "beginner",
    primaryMuscles: ["Recto Abdominal (Six-Pack)"],
    secondaryMuscles: ["Oblicuos Externos e Internos", "Serrato"],
    freeExerciseDbId: "Cable_Crunch",
    instructionsStepByStep: [
      "Arrodíllate frente a una polea alta con cuerda sujetando los extremos a los lados de tu cabeza o frente.",
      "Mantén la cadera fija e inmóvil; exhala mientras enrollas la columna dorsal acercando el esternón hacia la pelvis (flexión espinal real).",
      "Aprieta con fuerza el abdomen durante 1.5 segundos abajo e inhala al regresar vértebra por vértebra estirando el recto abdominal.",
    ],
    tipsEjecucion: "No bajes con la cadera; enrolla la columna acercando las costillas hacia la pelvis para trabajar realmente el recto abdominal con peso progresivo.",
    descansoSugerido: 60,
    pesoAnteriorKg: 35,
    repsAnteriores: 15,
    sustitutos: [
      {
        id: "plancha-abdominal-casa",
        nombre: "Plancha Abdominal RKC y Crunch en Suelo",
        equipo: "En Casa • Tapete o Suelo",
        esEnCasa: true,
        razonBiomecanica: "Tensión máxima en el recto abdominal y transverso sin necesitar polea.",
        comoHacerlo: "Acuéstate en el suelo y enrolla el torso exhalando todo el aire durante 2 segundos arriba.",
        freeExerciseDbId: "Plank",
      },
    ],
  },
];

// Base de Datos Nutricional Estandarizada (USDA FoodData Central Reference - por 100g cocido/listo)
export const STANDARDIZED_NUTRITION_DB: StandardizedFood[] = [
  {
    id: "pechuga-pollo-plancha",
    nombre: "Pechuga de Pollo a la Plancha",
    categoria: "Proteína",
    kcalPor100g: 165,
    proteinaPor100g: 31.0,
    carbsPor100g: 0.0,
    grasaPor100g: 3.6,
    porcionTipicaG: 160,
  },
  {
    id: "arroz-blanco-cocido",
    nombre: "Arroz Blanco Cocido",
    categoria: "Carbohidrato",
    kcalPor100g: 130,
    proteinaPor100g: 2.7,
    carbsPor100g: 28.2,
    grasaPor100g: 0.3,
    porcionTipicaG: 140,
  },
  {
    id: "brocoli-vapor",
    nombre: "Brócoli al Vapor",
    categoria: "Vegetal",
    kcalPor100g: 35,
    proteinaPor100g: 2.4,
    carbsPor100g: 7.2,
    grasaPor100g: 0.4,
    porcionTipicaG: 90,
  },
  {
    id: "salmon-plancha",
    nombre: "Filete de Salmón Atlántico",
    categoria: "Proteína",
    kcalPor100g: 208,
    proteinaPor100g: 20.4,
    carbsPor100g: 0.0,
    grasaPor100g: 13.4,
    porcionTipicaG: 150,
  },
  {
    id: "quinoa-cocida",
    nombre: "Quinoa Orgánica Cocida",
    categoria: "Carbohidrato",
    kcalPor100g: 120,
    proteinaPor100g: 4.4,
    carbsPor100g: 21.3,
    grasaPor100g: 1.9,
    porcionTipicaG: 130,
  },
  {
    id: "aguacate-hass",
    nombre: "Aguacate Hass Fresco",
    categoria: "Grasa Saludable",
    kcalPor100g: 160,
    proteinaPor100g: 2.0,
    carbsPor100g: 8.5,
    grasaPor100g: 14.7,
    porcionTipicaG: 65,
  },
  {
    id: "huevo-entero-cocido",
    nombre: "Huevo Entero a la Plancha / Cocido",
    categoria: "Proteína",
    kcalPor100g: 155,
    proteinaPor100g: 12.6,
    carbsPor100g: 1.1,
    grasaPor100g: 10.6,
    porcionTipicaG: 120,
  },
  {
    id: "avena-integral",
    nombre: "Copos de Avena Integral",
    categoria: "Carbohidrato",
    kcalPor100g: 379,
    proteinaPor100g: 13.2,
    carbsPor100g: 67.7,
    grasaPor100g: 6.5,
    porcionTipicaG: 70,
  },
  {
    id: "whey-isolate",
    nombre: "Proteína Whey Isolate",
    categoria: "Proteína",
    kcalPor100g: 370,
    proteinaPor100g: 85.0,
    carbsPor100g: 3.0,
    grasaPor100g: 1.5,
    porcionTipicaG: 35,
  },
  {
    id: "platano-maduro",
    nombre: "Plátano / Banana",
    categoria: "Carbohidrato",
    kcalPor100g: 89,
    proteinaPor100g: 1.1,
    carbsPor100g: 22.8,
    grasaPor100g: 0.3,
    porcionTipicaG: 110,
  },
  {
    id: "carne-magra-res",
    nombre: "Lomo de Res Magro a la Plancha",
    categoria: "Proteína",
    kcalPor100g: 192,
    proteinaPor100g: 28.5,
    carbsPor100g: 0.0,
    grasaPor100g: 8.2,
    porcionTipicaG: 170,
  },
  {
    id: "papa-horno",
    nombre: "Papa Blanca al Horno / Airfryer",
    categoria: "Carbohidrato",
    kcalPor100g: 93,
    proteinaPor100g: 2.5,
    carbsPor100g: 21.2,
    grasaPor100g: 0.1,
    porcionTipicaG: 180,
  },
];

export const VISION_PRESET_PLATES = [
  {
    id: "plato-pollo-arroz-brocoli",
    titulo: "Plato Post-Entreno: Pollo, Arroz y Brócoli",
    descripcionVision: "Pechuga de pollo a la plancha con marcas de grill, arroz blanco cocido al vapor y floretes de brócoli fresco.",
    modeloUsado: "llama3.2-vision + USDA FoodData SQL",
    ingredientes: [
      { foodId: "pechuga-pollo-plancha", gramos: 155, confianza: 0.96 },
      { foodId: "arroz-blanco-cocido", gramos: 130, confianza: 0.94 },
      { foodId: "brocoli-vapor", gramos: 85, confianza: 0.97 },
    ],
  },
  {
    id: "plato-salmon-quinoa-aguacate",
    titulo: "Bowl Omega-3: Salmón, Quinoa y Aguacate",
    descripcionVision: "Filete de salmón sellado, cama de quinoa cocida y láminas de aguacate Hass.",
    modeloUsado: "llama3.2-vision + USDA FoodData SQL",
    ingredientes: [
      { foodId: "salmon-plancha", gramos: 145, confianza: 0.95 },
      { foodId: "quinoa-cocida", gramos: 125, confianza: 0.92 },
      { foodId: "aguacate-hass", gramos: 60, confianza: 0.96 },
    ],
  },
  {
    id: "plato-lomo-papa-huevo",
    titulo: "Plato Fuerza: Lomo Magro, Papa Airfryer y Huevo",
    descripcionVision: "Corte de lomo de res magro, papas doradas en airfryer y dos huevos a la plancha.",
    modeloUsado: "minicpm-v + USDA FoodData SQL",
    ingredientes: [
      { foodId: "carne-magra-res", gramos: 170, confianza: 0.95 },
      { foodId: "papa-horno", gramos: 165, confianza: 0.93 },
      { foodId: "huevo-entero-cocido", gramos: 110, confianza: 0.98 },
    ],
  },
];

export const INITIAL_MEALS_TODAY: MealEntry[] = [
  {
    id: "meal-1",
    hora: "08:15",
    tipoComida: "Desayuno",
    nombrePlato: "Porridge Proteico Pre-Jornada",
    items: [
      { nombre: "Copos de Avena Integral", gramos: 70, kcal: 265, proteinas: 9.2, carbs: 47.4, grasas: 4.6 },
      { nombre: "Proteína Whey Isolate", gramos: 35, kcal: 130, proteinas: 29.8, carbs: 1.1, grasas: 0.5 },
      { nombre: "Plátano / Banana", gramos: 105, kcal: 93, proteinas: 1.2, carbs: 23.9, grasas: 0.3 },
    ],
  },
  {
    id: "meal-2",
    hora: "13:30",
    tipoComida: "Almuerzo",
    nombrePlato: "Pechuga a la Plancha con Arroz y Aguacate",
    items: [
      { nombre: "Pechuga de Pollo a la Plancha", gramos: 180, kcal: 297, proteinas: 55.8, carbs: 0, grasas: 6.5 },
      { nombre: "Arroz Blanco Cocido", gramos: 160, kcal: 208, proteinas: 4.3, carbs: 45.1, grasas: 0.5 },
      { nombre: "Aguacate Hass Fresco", gramos: 55, kcal: 88, proteinas: 1.1, carbs: 4.7, grasas: 8.1 },
    ],
  },
];

export const INITIAL_BODY_METRICS: BodyMetricEntry[] = [
  { fecha: "2026-10-10", etiqueta: "10 Oct", pesoKg: 79.4, grasaPct: 14.8, pechoCm: 106.0, brazoCm: 40.2, cinturaCm: 79.5, piernaCm: 60.5 },
  { fecha: "2026-10-11", etiqueta: "11 Oct", pesoKg: 79.1, grasaPct: 14.7, pechoCm: 106.0, brazoCm: 40.2, cinturaCm: 79.4, piernaCm: 60.5 },
  { fecha: "2026-10-12", etiqueta: "12 Oct", pesoKg: 79.6, grasaPct: 14.7, pechoCm: 106.1, brazoCm: 40.3, cinturaCm: 79.5, piernaCm: 60.6 },
  { fecha: "2026-10-13", etiqueta: "13 Oct", pesoKg: 79.0, grasaPct: 14.6, pechoCm: 106.2, brazoCm: 40.3, cinturaCm: 79.2, piernaCm: 60.6 },
  { fecha: "2026-10-14", etiqueta: "14 Oct", pesoKg: 78.8, grasaPct: 14.5, pechoCm: 106.2, brazoCm: 40.4, cinturaCm: 79.0, piernaCm: 60.7 },
  { fecha: "2026-10-15", etiqueta: "15 Oct", pesoKg: 79.2, grasaPct: 14.5, pechoCm: 106.3, brazoCm: 40.4, cinturaCm: 79.0, piernaCm: 60.8 },
  { fecha: "2026-10-16", etiqueta: "16 Oct", pesoKg: 78.7, grasaPct: 14.4, pechoCm: 106.4, brazoCm: 40.5, cinturaCm: 78.8, piernaCm: 60.8 },
  { fecha: "2026-10-17", etiqueta: "17 Oct", pesoKg: 78.5, grasaPct: 14.3, pechoCm: 106.5, brazoCm: 40.5, cinturaCm: 78.7, piernaCm: 60.9 },
  { fecha: "2026-10-18", etiqueta: "18 Oct", pesoKg: 78.9, grasaPct: 14.3, pechoCm: 106.5, brazoCm: 40.6, cinturaCm: 78.6, piernaCm: 61.0 },
  { fecha: "2026-10-19", etiqueta: "19 Oct", pesoKg: 78.4, grasaPct: 14.2, pechoCm: 106.6, brazoCm: 40.6, cinturaCm: 78.5, piernaCm: 61.1 },
  { fecha: "2026-10-20", etiqueta: "20 Oct", pesoKg: 78.2, grasaPct: 14.1, pechoCm: 106.8, brazoCm: 40.7, cinturaCm: 78.4, piernaCm: 61.1 },
  { fecha: "2026-10-21", etiqueta: "21 Oct", pesoKg: 78.6, grasaPct: 14.1, pechoCm: 106.8, brazoCm: 40.8, cinturaCm: 78.3, piernaCm: 61.2 },
  { fecha: "2026-10-22", etiqueta: "22 Oct", pesoKg: 78.1, grasaPct: 14.0, pechoCm: 107.0, brazoCm: 40.8, cinturaCm: 78.1, piernaCm: 61.3 },
  { fecha: "2026-10-23", etiqueta: "23 Oct", pesoKg: 77.9, grasaPct: 13.9, pechoCm: 107.2, brazoCm: 41.0, cinturaCm: 77.9, piernaCm: 61.5 },
];

export const STRENGTH_PROGRESSION_DATA: Record<
  string,
  {
    nombre: string;
    unidad: string;
    estancadoSemanas: number;
    sugerenciaIA: string;
    historial: { semana: string; pesoKg: number; reps: number; rmEstimado: number }[];
  }
> = {
  "press-banca-inclinado": {
    nombre: "Press Inclinado con Mancuernas (c/u)",
    unidad: "kg",
    estancadoSemanas: 0,
    sugerenciaIA: "Sobrecarga óptima (+13.2% en 6 semanas). Mantén 36 kg y busca llegar a 10 repeticiones en la primera serie antes de subir a 38 kg.",
    historial: [
      { semana: "Sem 1", pesoKg: 30, reps: 10, rmEstimado: 40.0 },
      { semana: "Sem 2", pesoKg: 32, reps: 9, rmEstimado: 41.6 },
      { semana: "Sem 3", pesoKg: 32, reps: 10, rmEstimado: 42.7 },
      { semana: "Sem 4", pesoKg: 34, reps: 8, rmEstimado: 43.1 },
      { semana: "Sem 5", pesoKg: 34, reps: 9, rmEstimado: 44.2 },
      { semana: "Sem 6", pesoKg: 36, reps: 8, rmEstimado: 45.6 },
    ],
  },
  "press-banca-barra": {
    nombre: "Press Banca Plano con Barra Olímpica",
    unidad: "kg",
    estancadoSemanas: 3,
    sugerenciaIA: "Alerta de meseta: Llevas 3 semanas con 90 kg × 8 reps (1RM est: 114 kg). En tu próxima sesión sube +2.5 kg (92.5 kg para 6-7 reps) o añade 1 serie back-off a RIR 1.",
    historial: [
      { semana: "Sem 1", pesoKg: 85, reps: 8, rmEstimado: 107.7 },
      { semana: "Sem 2", pesoKg: 87.5, reps: 8, rmEstimado: 110.8 },
      { semana: "Sem 3", pesoKg: 90, reps: 7, rmEstimado: 111.0 },
      { semana: "Sem 4", pesoKg: 90, reps: 8, rmEstimado: 114.0 },
      { semana: "Sem 5", pesoKg: 90, reps: 8, rmEstimado: 114.0 },
      { semana: "Sem 6", pesoKg: 90, reps: 8, rmEstimado: 114.0 },
    ],
  },
  "sentadilla-hack": {
    nombre: "Sentadilla Hack Profunda",
    unidad: "kg",
    estancadoSemanas: 0,
    sugerenciaIA: "Progreso constante en tren inferior. El 1RM estimado subió de 135 kg a 156 kg sin degradar el control excéntrico.",
    historial: [
      { semana: "Sem 1", pesoKg: 105, reps: 9, rmEstimado: 136.5 },
      { semana: "Sem 2", pesoKg: 110, reps: 8, rmEstimado: 139.3 },
      { semana: "Sem 3", pesoKg: 115, reps: 8, rmEstimado: 145.7 },
      { semana: "Sem 4", pesoKg: 115, reps: 9, rmEstimado: 149.5 },
      { semana: "Sem 5", pesoKg: 120, reps: 8, rmEstimado: 152.0 },
      { semana: "Sem 6", pesoKg: 120, reps: 9, rmEstimado: 156.0 },
    ],
  },
};

export const INITIAL_WEEK_SCHEDULE: CalendarDayPlan[] = [
  {
    id: "day-mon",
    diaSemana: "Lunes",
    fechaCorta: "19 Oct",
    tituloSplit: "Empuje — Pecho, Hombros y Tríceps",
    tipo: "PUSH",
    cargaNivel: "Alta",
    rpePromedio: 9.0,
    duracionMin: 68,
    completado: true,
    musculos: ["Pecho", "Hombro Anterior", "Tríceps"],
  },
  {
    id: "day-tue",
    diaSemana: "Martes",
    fechaCorta: "20 Oct",
    tituloSplit: "Tracción — Espalda y Bíceps",
    tipo: "PULL",
    cargaNivel: "Alta",
    rpePromedio: 9.2,
    duracionMin: 72,
    completado: true,
    musculos: ["Espalda", "Deltoides Posterior", "Bíceps"],
  },
  {
    id: "day-wed",
    diaSemana: "Miércoles",
    fechaCorta: "21 Oct",
    tituloSplit: "Pierna — Cuádriceps, Isquios y Glúteo",
    tipo: "LEGS",
    cargaNivel: "Alta",
    rpePromedio: 9.5,
    duracionMin: 75,
    completado: true,
    musculos: ["Cuádriceps", "Isquios", "Gemelos"],
  },
  {
    id: "day-thu",
    diaSemana: "Jueves",
    fechaCorta: "22 Oct",
    tituloSplit: "Torso Pesado — Pecho y Espalda",
    tipo: "UPPER",
    cargaNivel: "Alta",
    rpePromedio: 9.1,
    duracionMin: 65,
    completado: true,
    musculos: ["Pecho", "Espalda", "Hombros"],
  },
  {
    id: "day-fri",
    diaSemana: "Viernes",
    fechaCorta: "23 Oct (Hoy)",
    tituloSplit: "Empuje — Pecho, Hombros y Tríceps",
    tipo: "PUSH",
    cargaNivel: "Alta",
    rpePromedio: 8.8,
    duracionMin: 60,
    completado: false,
    esHoy: true,
    musculos: ["Pecho", "Hombros Lateral", "Tríceps"],
  },
  {
    id: "day-sat",
    diaSemana: "Sábado",
    fechaCorta: "24 Oct",
    tituloSplit: "Tracción + Cadena Posterior",
    tipo: "PULL",
    cargaNivel: "Media",
    rpePromedio: null,
    duracionMin: 60,
    completado: false,
    musculos: ["Espalda", "Isquiosurales", "Bíceps"],
  },
  {
    id: "day-sun",
    diaSemana: "Domingo",
    fechaCorta: "25 Oct",
    tituloSplit: "Descanso Total & Recuperación",
    tipo: "REST",
    cargaNivel: "Descanso",
    rpePromedio: null,
    duracionMin: 0,
    completado: false,
    musculos: ["Recuperación Sistémica"],
  },
];

export function calculateEstimated1RM(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1) return weightKg;
  return Number((weightKg * (1 + reps / 30)).toFixed(1));
}

export function calculateMovingAverage7Days(entries: BodyMetricEntry[]): {
  fecha: string;
  etiqueta: string;
  pesoDiario: number;
  promedioMovil7d: number;
  grasaPct: number;
}[] {
  return entries.map((entry, idx) => {
    const startIdx = Math.max(0, idx - 6);
    const windowSlice = entries.slice(startIdx, idx + 1);
    const sum = windowSlice.reduce((acc, item) => acc + item.pesoKg, 0);
    const avg = Number((sum / windowSlice.length).toFixed(2));
    return {
      fecha: entry.fecha,
      etiqueta: entry.etiqueta,
      pesoDiario: entry.pesoKg,
      promedioMovil7d: avg,
      grasaPct: entry.grasaPct,
    };
  });
}
