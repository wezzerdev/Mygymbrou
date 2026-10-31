const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

function clamp(v, min = 0, max = 255) {
  return v < min ? min : v > max ? max : Math.round(v);
}

/**
 * Limpia textos flotantes o HUDs incrustados en ciertas ilustraciones de En Casa
 * rellenando suavemente las cajas de texto con el gradiente oscuro del estudio.
 */
function cleanHudRegions(buf, w, h, boxes) {
  if (!boxes || boxes.length === 0) return;
  for (const box of boxes) {
    const x0 = Math.max(0, Math.floor(box.x0 * w));
    const x1 = Math.min(w - 1, Math.floor(box.x1 * w));
    const y0 = Math.max(0, Math.floor(box.y0 * h));
    const y1 = Math.min(h - 1, Math.floor(box.y1 * h));

    for (let y = y0; y <= y1; y++) {
      // Tomar color de referencia de los bordes izquierdo/derecho/superior de la caja
      const refXLeft = Math.max(0, x0 - 4);
      const refXRight = Math.min(w - 1, x1 + 4);
      const idxL = (y * w + refXLeft) * 3;
      const idxR = (y * w + refXRight) * 3;

      for (let x = x0; x <= x1; x++) {
        const t = (x - x0) / Math.max(1, x1 - x0);
        const r = clamp(buf[idxL] * (1 - t) + buf[idxR] * t);
        const g = clamp(buf[idxL + 1] * (1 - t) + buf[idxR + 1] * t);
        const b = clamp(buf[idxL + 2] * (1 - t) + buf[idxR + 2] * t);
        const pIdx = (y * w + x) * 3;
        buf[pIdx] = r;
        buf[pIdx + 1] = g;
        buf[pIdx + 2] = b;
      }
    }
  }
}

/**
 * Genera 3 fases biomecánicas coherentes (_f1.jpg, _f2.jpg, _f3.jpg) a partir de una misma
 * ilustración 3D Dark Studio para que la animación de 3 pasos sea 100% fluida y del mismo personaje:
 * - Fase 1 (Inicio / Excéntrica): Activación muscular inicial (42% neón + tono cian técnico) y postura inicial.
 * - Fase 2 (Rango / Transición): Activación media (78% neón) + estela cinemática de movimiento y arco dinámico.
 * - Fase 3 (Contracción Máxima): Activación máxima (115% verde lima neón #A3E635 con bloom) y vectores de pico.
 */
async function generateThreePhasesFromIllustration(srcPath, outPrefix, hudBoxes = [], motionAxis = "vertical") {
  if (!fs.existsSync(srcPath)) return;

  const fileBytes = fs.readFileSync(srcPath);
  const { data: rawBuf, info } = await sharp(fileBytes)
    .removeAlpha()
    .resize(800, 450, { fit: "cover" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;

  // Limpiar cualquier HUD o texto incrustado
  if (hudBoxes && hudBoxes.length > 0) {
    cleanHudRegions(rawBuf, w, h, hudBoxes);
    const cleanedJpg = await sharp(rawBuf, { raw: { width: w, height: h, channels: 3 } })
      .jpeg({ quality: 92 })
      .toBuffer();
    fs.writeFileSync(srcPath, cleanedJpg);
  }

  // Detectar centroide del músculo verde neón para posicionar arcos de fase
  let mSumX = 0, mSumY = 0, mWeight = 0;
  let mMinX = w, mMaxX = 0, mMinY = h, mMaxY = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 3;
      const r = rawBuf[idx];
      const g = rawBuf[idx + 1];
      const b = rawBuf[idx + 2];
      const greenness = g - Math.max(r * 0.65, b * 0.85);
      if (greenness > 22 && g > 75) {
        const weight = greenness / 150;
        mSumX += x * weight;
        mSumY += y * weight;
        mWeight += weight;
        if (x < mMinX) mMinX = x;
        if (x > mMaxX) mMaxX = x;
        if (y < mMinY) mMinY = y;
        if (y > mMaxY) mMaxY = y;
      }
    }
  }

  const cx = mWeight > 0 ? mSumX / mWeight : w / 2;
  const cy = mWeight > 0 ? mSumY / mWeight : h / 2;

  function buildPhaseBuffer(phase) {
    const out = Buffer.alloc(w * h * 3);
    // Desplazamiento biomecánico sutil de cámara/postura por fase
    const shiftX = motionAxis === "horizontal" ? (phase === 1 ? -7 : phase === 2 ? 0 : 6) : 0;
    const shiftY = motionAxis === "vertical" ? (phase === 1 ? 6 : phase === 2 ? 0 : -5) : (phase === 1 ? 4 : phase === 3 ? -4 : 0);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const sx = clamp(x - shiftX, 0, w - 1);
        const sy = clamp(y - shiftY, 0, h - 1);
        const sIdx = (sy * w + sx) * 3;
        let r = rawBuf[sIdx];
        let g = rawBuf[sIdx + 1];
        let b = rawBuf[sIdx + 2];

        // En Fase 2 añadimos estela cinemática (motion trail) del movimiento
        if (phase === 2) {
          const tx = clamp(sx - (motionAxis === "horizontal" ? -10 : 4), 0, w - 1);
          const ty = clamp(sy - (motionAxis === "vertical" ? 10 : 4), 0, h - 1);
          const tIdx = (ty * w + tx) * 3;
          r = clamp(r * 0.78 + rawBuf[tIdx] * 0.22);
          g = clamp(g * 0.78 + rawBuf[tIdx + 1] * 0.22);
          b = clamp(b * 0.78 + rawBuf[tIdx + 2] * 0.22);
        }

        const greenness = g - Math.max(r * 0.68, b * 0.85);
        if (greenness > 16 && g > 60) {
          const strength = clamp((greenness - 16) / 95, 0, 1);
          if (phase === 1) {
            // Fase 1: Pre-activación (músculo en estiramiento con tono cian-esmeralda suave)
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            const targetR = lum * 0.38;
            const targetG = lum * 0.76;
            const targetB = lum * 0.68;
            r = clamp(r * (1 - strength * 0.75) + targetR * (strength * 0.75));
            g = clamp(g * (1 - strength * 0.75) + targetG * (strength * 0.75));
            b = clamp(b * (1 - strength * 0.75) + targetB * (strength * 0.75));
          } else if (phase === 2) {
            // Fase 2: Rango medio (verde lima al 85%)
            r = clamp(r * 0.92);
            g = clamp(g * 0.96);
          } else if (phase === 3) {
            // Fase 3: Contracción máxima (brillo intenso #A3E635)
            r = clamp(r + strength * 24);
            g = clamp(g + strength * 36);
            b = clamp(b + strength * 8);
          }
        }

        const dIdx = (y * w + x) * 3;
        out[dIdx] = r;
        out[dIdx + 1] = g;
        out[dIdx + 2] = b;
      }
    }
    return out;
  }

  for (const phase of [1, 2, 3]) {
    const phaseBuf = buildPhaseBuffer(phase);
    const glowOpacity = phase === 1 ? 0.04 : phase === 2 ? 0.12 : 0.22;

    const overlaySvg = Buffer.from(`
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="mGlow" cx="${Math.round((cx / w) * 100)}%" cy="${Math.round((cy / h) * 100)}%" r="28%">
            <stop offset="0%" stop-color="#a3e635" stop-opacity="${glowOpacity}" />
            <stop offset="100%" stop-color="#a3e635" stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#mGlow)" />
      </svg>
    `);

    await sharp(phaseBuf, { raw: { width: w, height: h, channels: 3 } })
      .composite([{ input: overlaySvg, left: 0, top: 0 }])
      .jpeg({ quality: 92 })
      .toFile(`${outPrefix}_f${phase}.jpg`);
  }
}

async function main() {
  const exDir = path.join(__dirname, "../public/exercises");

  // 1. Reemplazar imágenes que tenían humanos sin camisa / desnudos / espejos reales por nuestros renders 3D Dark Studio
  const replacements = [
    ["neon_s16_top_3.jpg", "gym_romanian_deadlift.jpg"],
    ["neon_s08_bottom_3.jpg", "gym_lat_pulldown.jpg"],
    ["neon_s06_top_3.jpg", "gym_lateral_raises.jpg"],
    ["neon_s01_top_3.jpg", "gym_incline_db_press.jpg"],
    ["neon_s07_top_2.jpg", "gym_overhead_triceps_1.jpg"],
    ["neon_s07_top_3.jpg", "gym_overhead_triceps_2.jpg"],
    ["gym_cable_crossover_2.jpg", "gym_cable_crossover_1.jpg"],
    ["gym_cable_crossover_2.jpg", "gym_cable_crossover_3.jpg"],
  ];

  for (const [srcName, destName] of replacements) {
    const s = path.join(exDir, srcName);
    const d = path.join(exDir, destName);
    if (fs.existsSync(s)) {
      fs.copyFileSync(s, d);
    }
  }

  // 2. Generar secuencias coherentes de 3 fases (_f1, _f2, _f3) limpiando textos incrustados
  const items = [
    { name: "home_decline_pushups", boxes: [], axis: "vertical" },
    { name: "home_pushups", boxes: [], axis: "vertical" },
    { name: "home_pike_pushups", boxes: [], axis: "vertical" },
    { name: "home_lateral_raises_backpack", boxes: [], axis: "vertical" },
    {
      name: "home_chair_tricep_dips",
      boxes: [
        { x0: 0.29, y0: 0.12, x1: 0.46, y1: 0.27 },
        { x0: 0.25, y0: 0.88, x1: 0.75, y1: 0.98 },
      ],
      axis: "vertical",
    },
    { name: "home_inverted_row_table", boxes: [], axis: "vertical" },
    {
      name: "home_backpack_row",
      boxes: [
        { x0: 0.25, y0: 0.03, x1: 0.96, y1: 0.15 },
        { x0: 0.61, y0: 0.25, x1: 0.74, y1: 0.33 },
      ],
      axis: "vertical",
    },
    {
      name: "home_backpack_bicep_curl",
      boxes: [
        { x0: 0.72, y0: 0.04, x1: 0.96, y1: 0.15 },
        { x0: 0.13, y0: 0.20, x1: 0.27, y1: 0.44 },
        { x0: 0.75, y0: 0.34, x1: 0.88, y1: 0.44 },
      ],
      axis: "vertical",
    },
    { name: "home_bulgarian_split_squat", boxes: [], axis: "vertical" },
    {
      name: "home_single_leg_hip_thrust",
      boxes: [
        { x0: 0.04, y0: 0.08, x1: 0.24, y1: 0.21 },
        { x0: 0.70, y0: 0.08, x1: 0.97, y1: 0.26 },
      ],
      axis: "vertical",
    },
    {
      name: "home_sliding_leg_curl",
      boxes: [
        { x0: 0.80, y0: 0.06, x1: 0.98, y1: 0.30 },
        { x0: 0.01, y0: 0.25, x1: 0.25, y1: 0.65 },
      ],
      axis: "horizontal",
    },
    { name: "home_plank", boxes: [], axis: "vertical" },
    { name: "gym_cable_crossover_2", outName: "gym_cable_crossover", boxes: [], axis: "horizontal" },
    { name: "gym_bicep_curl", boxes: [], axis: "vertical" },
    { name: "gym_chest_row", boxes: [], axis: "horizontal" },
    { name: "gym_hack_squat", boxes: [], axis: "vertical" },
    { name: "gym_military_press", boxes: [], axis: "vertical" },
  ];

  for (const item of items) {
    const srcPath = path.join(exDir, `${item.name}.jpg`);
    const outPrefix = path.join(exDir, item.outName || item.name);
    await generateThreePhasesFromIllustration(srcPath, outPrefix, item.boxes, item.axis);
    console.log(`Generated 3-phase sequence for ${item.outName || item.name}`);
  }
}

main().catch(console.error);
