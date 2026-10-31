const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

function clamp(v, min = 0, max = 255) {
  return v < min ? min : v > max ? max : Math.round(v);
}

/**
 * Procesa un cuadrante (512x512) de sheet_XX.jpg para convertirlo al estilo
 * 3D Digital Dark Studio (idéntico a home_decline_pushups.jpg):
 * 1. Elimina el fondo blanco y las sombras grises de piso bajo máquinas/pies.
 * 2. Suaviza las estrías anatómicas de las zonas NO activas mediante un filtro bilateral
 *    para que el cuerpo luzca como un avatar digital 3D con traje de compresión mate oscuro (#1e2532).
 * 3. Conserva el 100% de las fibras anatómicas en los músculos objetivo iluminados en Verde Lima Neón (#A3E635).
 */
function processQuadrant(srcBuf, fullW, fullH, startX, startY, quadW, quadH, neonIntensity = 1.0) {
  const out = Buffer.alloc(quadW * quadH * 4);
  const glowMask = new Float32Array(quadW * quadH);
  const lumMap = new Float32Array(quadW * quadH);
  const redMap = new Float32Array(quadW * quadH);
  const satMap = new Float32Array(quadW * quadH);

  // 1. Primero calculamos lum, redness y sat para todo el cuadrante
  for (let y = 0; y < quadH; y++) {
    for (let x = 0; x < quadW; x++) {
      const idx = ((startY + y) * fullW + (startX + x)) * 3;
      const r = srcBuf[idx];
      const g = srcBuf[idx + 1];
      const b = srcBuf[idx + 2];
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const sat = maxC - minC;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const redness = r - (g * 0.62 + b * 0.38);

      const p = y * quadW + x;
      lumMap[p] = lum;
      redMap[p] = redness;
      satMap[p] = sat;
    }
  }

  // 2. Mapa de blancura + detección de sombras planas de piso (sin tocar piernas con borde oscuro)
  const whiteScore = new Float32Array(quadW * quadH);
  for (let y = 0; y < quadH; y++) {
    for (let x = 0; x < quadW; x++) {
      const p = y * quadW + x;
      const lum = lumMap[p];
      const sat = satMap[p];
      const redness = redMap[p];

      if (sat <= 10 && lum >= 236) {
        whiteScore[p] = (lum - 236) / 19;
      } else if (y > quadH * 0.68 && sat <= 12 && lum >= 190 && redness < 6) {
        // Verificar que sea una sombra de piso plana (sin líneas de contorno oscuras en radio de 3px)
        let minNeighborLum = 255;
        for (let dy = -3; dy <= 3; dy++) {
          const ny = y + dy;
          if (ny < 0 || ny >= quadH) continue;
          for (let dx = -3; dx <= 3; dx++) {
            const nx = x + dx;
            if (nx < 0 || nx >= quadW) continue;
            const nLum = lumMap[ny * quadW + nx];
            if (nLum < minNeighborLum) minNeighborLum = nLum;
          }
        }
        if (minNeighborLum >= 172) {
          whiteScore[p] = 0.85;
        }
      }
    }
  }

  // Flood-fill desde los bordes + huecos blancos interiores
  const isBg = new Uint8Array(quadW * quadH);
  const visited = new Uint8Array(quadW * quadH);
  const queue = new Int32Array(quadW * quadH);
  let qHead = 0, qTail = 0;

  for (let x = 0; x < quadW; x++) {
    if (whiteScore[x] > 0.01) { visited[x] = 1; queue[qTail++] = x; }
    const bot = (quadH - 1) * quadW + x;
    if (whiteScore[bot] > 0.01) { visited[bot] = 1; queue[qTail++] = bot; }
  }
  for (let y = 0; y < quadH; y++) {
    const l = y * quadW;
    if (!visited[l] && whiteScore[l] > 0.01) { visited[l] = 1; queue[qTail++] = l; }
    const r = y * quadW + (quadW - 1);
    if (!visited[r] && whiteScore[r] > 0.01) { visited[r] = 1; queue[qTail++] = r; }
  }

  // Huecos interiores de fondo blanco puro (bloque 9x9 >= 250) para jamás tocar rodillas ni tendones
  for (let y = 5; y < Math.floor(quadH * 0.66); y++) {
    for (let x = 5; x < quadW - 5; x++) {
      const p = y * quadW + x;
      if (!visited[p] && whiteScore[p] > 0.88) {
        let allPureWhite = true;
        for (let dy = -4; dy <= 4 && allPureWhite; dy++) {
          for (let dx = -4; dx <= 4; dx++) {
            if (whiteScore[(y + dy) * quadW + (x + dx)] < 0.82) {
              allPureWhite = false;
              break;
            }
          }
        }
        if (allPureWhite) {
          visited[p] = 1;
          queue[qTail++] = p;
        }
      }
    }
  }

  while (qHead < qTail) {
    const curr = queue[qHead++];
    isBg[curr] = 1;
    const cx = curr % quadW;
    const cy = (curr / quadW) | 0;

    if (cx > 0 && !visited[curr - 1] && whiteScore[curr - 1] > 0.15) {
      visited[curr - 1] = 1; queue[qTail++] = curr - 1;
    }
    if (cx < quadW - 1 && !visited[curr + 1] && whiteScore[curr + 1] > 0.15) {
      visited[curr + 1] = 1; queue[qTail++] = curr + 1;
    }
    if (cy > 0 && !visited[curr - quadW] && whiteScore[curr - quadW] > 0.15) {
      visited[curr - quadW] = 1; queue[qTail++] = curr - quadW;
    }
    if (cy < quadH - 1 && !visited[curr + quadW] && whiteScore[curr + quadW] > 0.15) {
      visited[curr + quadW] = 1; queue[qTail++] = curr + quadW;
    }
  }

  // 2. Suavizado bilateral del cuerpo no-activo para acabado 3D Digital Compression Suit
  const smoothLumMap = new Float32Array(quadW * quadH);
  const sRad = 4;
  for (let y = 0; y < quadH; y++) {
    for (let x = 0; x < quadW; x++) {
      const p = y * quadW + x;
      if (isBg[p]) continue;
      const cLum = lumMap[p];
      let sum = 0, wSum = 0;
      for (let dy = -sRad; dy <= sRad; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= quadH) continue;
        for (let dx = -sRad; dx <= sRad; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= quadW) continue;
          const np = ny * quadW + nx;
          if (isBg[np]) continue;
          const diff = Math.abs(lumMap[np] - cLum);
          if (diff < 75) {
            const w = 1.0 - diff / 75.0;
            sum += lumMap[np] * w;
            wSum += w;
          }
        }
      }
      smoothLumMap[p] = wSum > 0 ? sum / wSum : cLum;
    }
  }

  let minX = quadW, maxX = 0, minY = quadH, maxY = 0;
  let mSumX = 0, mSumY = 0, mWeight = 0;
  let mMinX = quadW, mMaxX = 0, mMinY = quadH, mMaxY = 0;

  for (let y = 0; y < quadH; y++) {
    for (let x = 0; x < quadW; x++) {
      const pIdx = y * quadW + x;
      if (isBg[pIdx]) {
        out[pIdx * 4 + 3] = 0;
        continue;
      }

      const srcIdx = ((startY + y) * fullW + (startX + x)) * 3;
      const r = srcBuf[srcIdx];
      const g = srcBuf[srcIdx + 1];
      const b = srcBuf[srcIdx + 2];

      const rawLum = lumMap[pIdx];
      const smoothLum = smoothLumMap[pIdx];
      const redness = redMap[pIdx];

      // Suavizado de bordes en contacto con el fondo
      let bgNeighbors = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < quadW && ny >= 0 && ny < quadH) {
            if (isBg[ny * quadW + nx]) bgNeighbors++;
          }
        }
      }

      let alpha = 255;
      if (bgNeighbors > 0 && redness < 14) {
        const edgeThresh = y > quadH * 0.66 ? 172 : 240;
        const edgeSoftness = clamp((edgeThresh - rawLum) / 48, 0.05, 1.0);
        alpha = clamp(255 * edgeSoftness * (1 - bgNeighbors * 0.08), 0, 255);
      }

      if (alpha > 35) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }

      // Superficie 3D mate antracita/pizarra para el traje de compresión y equipo
      const bodyLum = rawLum * 0.25 + smoothLum * 0.75;
      const norm = bodyLum / 255;
      let baseR, baseG, baseB;
      if (norm < 0.35) {
        const d = norm / 0.35;
        baseR = 14 + d * 24;
        baseG = 18 + d * 29;
        baseB = 26 + d * 38;
      } else {
        const t = (norm - 0.35) / 0.65;
        const curve = Math.pow(t, 1.35);
        const rim = Math.pow(t, 2.8);
        baseR = 38 + curve * 52 + rim * 28;
        baseG = 47 + curve * 60 + rim * 38;
        baseB = 64 + curve * 72 + rim * 48;
      }

      let outR, outG, outB;

      // Músculo objetivo activo en Verde Lima Neón (#A3E635) con fibras anatómicas nítidas
      if (redness > 11) {
        const muscleStrength = clamp((redness - 11) / 50, 0, 1);
        const fiberShade = Math.pow(clamp((r * 0.82 + g * 0.18) / 240, 0.25, 1.0), 1.12);

        const neonR = (48 + 138 * fiberShade) * neonIntensity + baseR * (1 - neonIntensity * 0.92);
        const neonG = (118 + 137 * fiberShade) * neonIntensity + baseG * (1 - neonIntensity * 0.92);
        const neonB = (14 + 46 * fiberShade) * neonIntensity + baseB * (1 - neonIntensity * 0.92);

        outR = clamp(baseR * (1 - muscleStrength) + neonR * muscleStrength);
        outG = clamp(baseG * (1 - muscleStrength) + neonG * muscleStrength);
        outB = clamp(baseB * (1 - muscleStrength) + neonB * muscleStrength);

        const glowW = muscleStrength * neonIntensity;
        glowMask[pIdx] = glowW;

        if (muscleStrength > 0.25) {
          mSumX += x * muscleStrength;
          mSumY += y * muscleStrength;
          mWeight += muscleStrength;
          if (x < mMinX) mMinX = x;
          if (x > mMaxX) mMaxX = x;
          if (y < mMinY) mMinY = y;
          if (y > mMaxY) mMaxY = y;
        }
      } else {
        outR = clamp(baseR);
        outG = clamp(baseG);
        outB = clamp(baseB);
      }

      // Rim light cian-lima sutil en el contorno superior/medio del avatar 3D
      if (y < quadH * 0.66 && bgNeighbors >= 2 && bgNeighbors <= 4 && rawLum > 115 && alpha > 140) {
        outR = clamp(outR * 0.78 + 115 * 0.22);
        outG = clamp(outG * 0.78 + 215 * 0.22);
        outB = clamp(outB * 0.78 + 240 * 0.22);
      }

      out[pIdx * 4 + 0] = outR;
      out[pIdx * 4 + 1] = outG;
      out[pIdx * 4 + 2] = outB;
      out[pIdx * 4 + 3] = alpha;
    }
  }

  // Halo de luz neón (Bloom) alrededor del músculo activo
  const radius = 14;
  const tempGlow = new Float32Array(quadW * quadH);
  const blurredGlow = new Float32Array(quadW * quadH);

  for (let y = 0; y < quadH; y++) {
    for (let x = 0; x < quadW; x++) {
      let sum = 0, cnt = 0;
      for (let k = -radius; k <= radius; k += 2) {
        const nx = x + k;
        if (nx >= 0 && nx < quadW) { sum += glowMask[y * quadW + nx]; cnt++; }
      }
      tempGlow[y * quadW + x] = sum / cnt;
    }
  }
  for (let y = 0; y < quadH; y++) {
    for (let x = 0; x < quadW; x++) {
      let sum = 0, cnt = 0;
      for (let k = -radius; k <= radius; k += 2) {
        const ny = y + k;
        if (ny >= 0 && ny < quadH) { sum += tempGlow[ny * quadW + x]; cnt++; }
      }
      blurredGlow[y * quadW + x] = sum / cnt;
    }
  }

  for (let i = 0; i < quadW * quadH; i++) {
    const gVal = blurredGlow[i];
    if (gVal > 0.015) {
      const a = out[i * 4 + 3];
      if (a > 0 && glowMask[i] < 0.3) {
        const boost = gVal * 0.58;
        out[i * 4 + 0] = clamp(out[i * 4 + 0] + 120 * boost);
        out[i * 4 + 1] = clamp(out[i * 4 + 1] + 220 * boost);
        out[i * 4 + 2] = clamp(out[i * 4 + 2] + 32 * boost);
      } else if (a === 0) {
        const haloAlpha = clamp(gVal * 115, 0, 95);
        out[i * 4 + 0] = 152;
        out[i * 4 + 1] = 238;
        out[i * 4 + 2] = 48;
        out[i * 4 + 3] = haloAlpha;
      }
    }
  }

  const mCenterX = mWeight > 0 ? mSumX / mWeight : (minX + maxX) / 2;
  const mCenterY = mWeight > 0 ? mSumY / mWeight : (minY + maxY) / 2;

  return {
    buffer: out,
    width: quadW,
    height: quadH,
    bounds: {
      minX: minX < maxX ? minX : 0,
      maxX: maxX > minX ? maxX : quadW - 1,
      minY: minY < maxY ? minY : 0,
      maxY: maxY > minY ? maxY : quadH - 1,
    },
    muscle: {
      centerX: mCenterX,
      centerY: mCenterY,
      minX: mWeight > 0 ? mMinX : minX,
      maxX: mWeight > 0 ? mMaxX : maxX,
      minY: mWeight > 0 ? mMinY : minY,
      maxY: mWeight > 0 ? mMaxY : maxY,
    },
  };
}

function createBackdropSvg(width, height, phaseIndex) {
  const glowOpacity = phaseIndex === 3 ? 0.24 : phaseIndex === 2 ? 0.17 : 0.11;

  let gridLines = "";
  for (let x = 36; x < width; x += 44) {
    gridLines += `<line x1="${x}" y1="0" x2="${x}" y2="${height * 0.73}" stroke="#1e293b" stroke-width="0.8" stroke-opacity="0.30" />`;
  }
  for (let y = 28; y < height * 0.73; y += 44) {
    gridLines += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#1e293b" stroke-width="0.8" stroke-opacity="0.30" />`;
  }
  gridLines += `<line x1="${width * 0.65}" y1="0" x2="${width}" y2="${height * 0.45}" stroke="#334155" stroke-width="0.8" stroke-opacity="0.22" />`;
  gridLines += `<line x1="${width * 0.78}" y1="0" x2="${width * 0.52}" y2="${height * 0.73}" stroke="#334155" stroke-width="0.8" stroke-opacity="0.18" />`;

  const horizonY = Math.round(height * 0.73);

  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="studioRoom" cx="50%" cy="48%" r="68%">
          <stop offset="0%" stop-color="#141c2b" />
          <stop offset="55%" stop-color="#0b0f17" />
          <stop offset="100%" stop-color="#05070b" />
        </radialGradient>
        <radialGradient id="floorSpot" cx="50%" cy="79%" r="36%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.16" />
          <stop offset="40%" stop-color="#a3e635" stop-opacity="${glowOpacity}" />
          <stop offset="100%" stop-color="#05070b" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0d131f" stop-opacity="0.9" />
          <stop offset="45%" stop-color="#111827" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#06080d" stop-opacity="1" />
        </linearGradient>
      </defs>

      <rect width="${width}" height="${height}" fill="url(#studioRoom)" />
      ${gridLines}
      <rect x="0" y="${horizonY}" width="${width}" height="${height - horizonY}" fill="url(#floorGrad)" />
      <line x1="0" y1="${horizonY}" x2="${width}" y2="${horizonY}" stroke="#1e293b" stroke-width="1" stroke-opacity="0.5" />
      <ellipse cx="${width / 2}" cy="${height * 0.80}" rx="${width * 0.34}" ry="${height * 0.13}" fill="url(#floorSpot)" />
    </svg>
  `);
}

function createMuscleVectorsOverlaySvg(width, height, mBox, phaseIndex) {
  const { left, right, top, bottom, cx, cy } = mBox;
  const pad = 18;
  const lx = clamp(left - pad, 60, width - 60);
  const rx = clamp(right + pad, 60, width - 60);
  const ty = clamp(top - pad, 35, height - 45);
  const by = clamp(bottom + pad, 45, height - 35);

  const opacity = phaseIndex === 1 ? 0.68 : phaseIndex === 2 ? 0.86 : 0.98;

  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="limeArc" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.2" />
          <stop offset="50%" stop-color="#a3e635" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#ecfccb" stop-opacity="1" />
        </linearGradient>
        <linearGradient id="cyanArc" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.1" />
          <stop offset="60%" stop-color="#7dd3fc" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#a3e635" stop-opacity="0.9" />
        </linearGradient>
        <filter id="vecGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g filter="url(#vecGlow)" opacity="${opacity}">
        <path d="M ${lx - 12} ${cy + 10} Q ${cx - 10} ${ty - 22} ${rx + 8} ${ty + 4}"
              fill="none" stroke="url(#limeArc)" stroke-width="1.8" stroke-linecap="round" />
        <polygon points="${rx + 12},${ty + 3} ${rx + 3},${ty - 1} ${rx + 5},${ty + 8}" fill="#d9f99d" />
        <circle cx="${cx - 12}" cy="${ty - 8}" r="2.2" fill="#bef264" />

        <path d="M ${lx - 8} ${by + 12} Q ${lx - 22} ${cy} ${lx - 6} ${ty + 12}"
              fill="none" stroke="url(#limeArc)" stroke-width="1.6" stroke-linecap="round" />
        <polygon points="${lx - 5},${ty + 7} ${lx - 11},${ty + 15} ${lx - 2},${ty + 15}" fill="#a3e635" />

        <path d="M ${rx + 8} ${by + 12} Q ${rx + 22} ${cy} ${rx + 6} ${ty + 12}"
              fill="none" stroke="url(#limeArc)" stroke-width="1.6" stroke-linecap="round" />
        <polygon points="${rx + 5},${ty + 7} ${rx + 2},${ty + 15} ${rx + 11},${ty + 15}" fill="#a3e635" />

        <path d="M ${lx - 24} ${by - 4} Q ${cx} ${by + 20} ${rx + 24} ${by - 4}"
              fill="none" stroke="url(#cyanArc)" stroke-width="1.3" stroke-dasharray="4,4" stroke-linecap="round" />
        <circle cx="${lx - 24}" cy="${by - 4}" r="2" fill="#7dd3fc" />
        <circle cx="${rx + 24}" cy="${by - 4}" r="2" fill="#a3e635" />
      </g>
    </svg>
  `);
}

async function renderExerciseThreePhases(sheetPath, row, outPrefix) {
  const { data: srcBuf, info } = await sharp(sheetPath)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const fullW = info.width;
  const fullH = info.height;
  const halfW = Math.floor(fullW / 2);
  const halfH = Math.floor(fullH / 2);
  const startY = row === "top" ? 0 : halfH;

  const poseStart = processQuadrant(srcBuf, fullW, fullH, 0, startY, halfW, halfH, 0.72);
  const poseMid = processQuadrant(srcBuf, fullW, fullH, halfW, startY, halfW, halfH, 0.88);
  const poseEnd = processQuadrant(srcBuf, fullW, fullH, halfW, startY, halfW, halfH, 1.05);

  const outW = 800;
  const outH = 450;

  const h1 = Math.max(64, poseStart.bounds.maxY - poseStart.bounds.minY + 24);
  const h2 = Math.max(64, poseEnd.bounds.maxY - poseEnd.bounds.minY + 24);
  const w1 = Math.max(64, poseStart.bounds.maxX - poseStart.bounds.minX + 24);
  const w2 = Math.max(64, poseEnd.bounds.maxX - poseEnd.bounds.minX + 24);
  const maxCropH = Math.max(h1, h2);
  const maxCropW = Math.max(w1, w2);
  const unifiedScale = Math.min((outH * 0.84) / maxCropH, (outW * 0.78) / maxCropW);

  async function composePoseOnCanvas(poseObj) {
    const { minX, maxX, minY, maxY } = poseObj.bounds;
    const cropW = clamp(maxX - minX + 24, 64, poseObj.width);
    const cropH = clamp(maxY - minY + 24, 64, poseObj.height);
    const cropLeft = clamp(minX - 12, 0, poseObj.width - cropW);
    const cropTop = clamp(minY - 12, 0, poseObj.height - cropH);

    const targetH = Math.round(cropH * unifiedScale);
    const targetW = Math.round(cropW * unifiedScale);

    const resizedPose = await sharp(poseObj.buffer, {
      raw: { width: poseObj.width, height: poseObj.height, channels: 4 },
    })
      .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
      .resize(targetW, targetH, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    const offsetLeft = Math.round((outW - targetW) / 2);
    const offsetTop = clamp(Math.round(outH * 0.91 - targetH), 12, outH - targetH - 8);

    const mBox = {
      left: offsetLeft + (poseObj.muscle.minX - cropLeft) * unifiedScale,
      right: offsetLeft + (poseObj.muscle.maxX - cropLeft) * unifiedScale,
      top: offsetTop + (poseObj.muscle.minY - cropTop) * unifiedScale,
      bottom: offsetTop + (poseObj.muscle.maxY - cropTop) * unifiedScale,
      cx: offsetLeft + (poseObj.muscle.centerX - cropLeft) * unifiedScale,
      cy: offsetTop + (poseObj.muscle.centerY - cropTop) * unifiedScale,
    };

    return { buf: resizedPose, w: targetW, h: targetH, offsetLeft, offsetTop, mBox };
  }

  const p1 = await composePoseOnCanvas(poseStart);
  const p2 = await composePoseOnCanvas(poseMid);
  const p3 = await composePoseOnCanvas(poseEnd);

  // Fase 1: Inicio
  const bg1 = createBackdropSvg(outW, outH, 1);
  const vec1 = createMuscleVectorsOverlaySvg(outW, outH, p1.mBox, 1);
  await sharp(bg1)
    .composite([
      { input: p1.buf, left: p1.offsetLeft, top: p1.offsetTop },
      { input: vec1, left: 0, top: 0 },
    ])
    .jpeg({ quality: 92 })
    .toFile(`${outPrefix}_1.jpg`);

  // Fase 2: Rango Dinámico (Transición cinemática equilibrada entre Pose 1 y Pose 2)
  const bg2 = createBackdropSvg(outW, outH, 2);
  const midMBox = {
    left: (p1.mBox.left + p3.mBox.left) / 2,
    right: (p1.mBox.right + p3.mBox.right) / 2,
    top: (p1.mBox.top + p3.mBox.top) / 2,
    bottom: (p1.mBox.bottom + p3.mBox.bottom) / 2,
    cx: (p1.mBox.cx + p3.mBox.cx) / 2,
    cy: (p1.mBox.cy + p3.mBox.cy) / 2,
  };
  const vec2 = createMuscleVectorsOverlaySvg(outW, outH, midMBox, 2);
  const ghostP1 = await sharp(p1.buf)
    .ensureAlpha()
    .linear([1, 1, 1, 0.55], [0, 0, 0, 0])
    .png()
    .toBuffer();
  const midP2 = await sharp(p2.buf)
    .ensureAlpha()
    .linear([1, 1, 1, 0.78], [0, 0, 0, 0])
    .png()
    .toBuffer();

  await sharp(bg2)
    .composite([
      { input: ghostP1, left: p1.offsetLeft, top: p1.offsetTop },
      { input: midP2, left: p2.offsetLeft, top: p2.offsetTop },
      { input: vec2, left: 0, top: 0 },
    ])
    .jpeg({ quality: 92 })
    .toFile(`${outPrefix}_2.jpg`);

  // Fase 3: Contracción Máxima
  const bg3 = createBackdropSvg(outW, outH, 3);
  const vec3 = createMuscleVectorsOverlaySvg(outW, outH, p3.mBox, 3);
  await sharp(bg3)
    .composite([
      { input: p3.buf, left: p3.offsetLeft, top: p3.offsetTop },
      { input: vec3, left: 0, top: 0 },
    ])
    .jpeg({ quality: 92 })
    .toFile(`${outPrefix}_3.jpg`);
}

async function main() {
  const exDir = path.join(__dirname, "../public/exercises");
  for (let i = 1; i <= 20; i++) {
    const num = String(i).padStart(2, "0");
    const sheetPath = path.join(exDir, `sheet_${num}.jpg`);
    if (!fs.existsSync(sheetPath)) continue;

    for (const row of ["top", "bottom"]) {
      const outPrefix = path.join(exDir, `neon_s${num}_${row}`);
      await renderExerciseThreePhases(sheetPath, row, outPrefix);
    }
    console.log(`Processed sheet_${num}.jpg (top & bottom -> 6 frames)`);
  }
  console.log("All 120 Dark Studio Neon 3D frames generated successfully!");
}

main().catch(console.error);
