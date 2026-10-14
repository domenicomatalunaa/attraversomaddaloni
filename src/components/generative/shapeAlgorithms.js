/**
 * shapeAlgorithms.js
 * Motore Tipografico, Mosaico Generativo & Motion Studio Engine - "Attraverso Maddaloni"
 * Integrato direttamente dal motore di rheastudio.it/type per Rhea Studio.
 *
 * Funzionalità:
 * - Macro Stencil Vettoriale di Maddaloni (Path SVG ufficiali ad alta risoluzione)
 * - Micro Typography Matrix (micro-caratteri con Variable Font Weight Halftoning 100-900)
 * - Modalità Geometriche: Cerchi (Uniformi & Halftone), Triangoli (Equilateri & Scaleni), Quadrati, Mixed
 * - Risoluzione e griglia ultra-densa calibrata (90-150 colonne per massima leggibilità e fedeltà)
 * - Motore di Micro-Animazione (Telegram Shimmer, Matrix Scramble, Weight Morph, Continuous Jitter, Living Slant)
 * - Proiezione spaziale multidirezionale (Diagonale, Orizzontale, Verticale, Radiale)
 */

// Path SVG ufficiale "MADDALONI" (dal watermark vettoriale)
export const MADDALONI_SVG_PATHS = [
  // M
  "M58.32,15.6c0,8.48-2.1,14.72-6.3,18.72-3.49,3.32-8.44,4.96-14.82,4.97V5.4h-9.24v10.56c0,8.48-2.16,14.74-6.48,18.78-3.05,2.86-7.15,4.48-12.24,4.91V5.4H0v84h9.24v-40.13c4.16-.38,7.95-1.14,11.34-2.29,2.88-.98,5.33-2.2,7.38-3.65v46.07h9.24v-40.79c4.86.16,9.28-.33,13.26-1.51,3.01-.89,5.62-2.17,7.86-3.83v46.13h9.24V5.4h-9.24v10.2Z",
  // A
  "M124.04,51.72c0-7.76-1.98-13.74-5.94-17.94-3.96-4.2-9.46-6.3-16.5-6.3-5.2,0-10.24,1.16-15.12,3.48l3.48,7.08c3.28-1.44,6.68-2.16,10.2-2.16,4.4,0,7.74,1.28,10.02,3.84,2.28,2.56,3.42,6.16,3.42,10.8v2.07c-8.22-1.29-14.71-1.5-19.44-.63-4,.72-7.34,2.2-10.02,4.44-2.68,2.24-4.56,4.9-5.64,7.98-1.08,3.08-1.42,6.26-1.02,9.54.64,4.64,2.7,8.56,6.18,11.76,3.48,3.2,8.06,4.84,13.74,4.92,6.4.08,11.16-1.84,14.28-5.76.7-.88,1.33-1.81,1.92-2.79v7.35h10.44v-26.29c1.36.32,2.69.64,3.96.98l1.68-8.16c-1.91-.51-3.79-.96-5.64-1.37v-2.83ZM109.28,78.72c-2.88,2.32-6.12,3.48-9.72,3.48s-6.68-.92-9-2.76c-2.32-1.84-3.72-4.12-4.2-6.84-.48-2.8.04-5.38,1.56-7.74,1.52-2.36,4-3.94,7.44-4.74,3.76-.89,9.85-.61,18.24.82v12.22c-.99,2.18-2.43,4.04-4.32,5.56Z",
  // D 1
  "M184.26,6.72c-1.48,2.96-2.18,6.92-2.1,11.88l.12,17.76h-.6c-1.68-2.16-4.2-4.16-7.56-6-3.36-1.84-6.52-2.76-9.48-2.76-5.44,0-10.16,1.22-14.16,3.66-4,2.44-7.1,6.04-9.3,10.8-2.2,4.76-3.3,10.5-3.3,17.22s1.32,12.12,3.96,16.92c2.64,4.8,6.02,8.46,10.14,10.98,4.12,2.52,8.34,3.78,12.66,3.78,5.36,0,9.68-.76,12.96-2.28,1.61-.75,3.25-1.65,4.9-2.71l.5,3.67h9.36V17.4c0-2.16.08-3.7.24-4.62.16-.92.5-1.74,1.02-2.46.52-.72,1.5-1.68,2.94-2.88l-5.76-7.44c-2.88,1.52-5.06,3.76-6.54,6.72ZM174.24,79.68c-2.8,1.36-6,2.04-9.6,2.04-2.08,0-4.38-.92-6.9-2.76-2.52-1.84-4.66-4.46-6.42-7.86-1.76-3.4-2.64-7.34-2.64-11.82,0-4.72.68-8.76,2.04-12.12,1.36-3.36,3.24-5.92,5.64-7.68,2.4-1.76,5.16-2.64,8.28-2.64,3.36,0,6.58,1.32,9.66,3.96,3.08,2.64,5.66,5.48,7.74,8.52v25.7c-2.9,1.98-5.5,3.54-7.8,4.66Z",
  // D 2
  "M248.3,6.72c-1.48,2.96-2.18,6.92-2.1,11.88l.12,17.76h-.6c-1.68-2.16-4.2-4.16-7.56-6-3.36-1.84-6.52-2.76-9.48-2.76-5.44,0-10.16,1.22-14.16,3.66-4,2.44-7.1,6.04-9.3,10.8-2.2,4.76-3.3,10.5-3.3,17.22s1.32,12.12,3.96,16.92c2.64,4.8,6.02,8.46,10.14,10.98,4.12,2.52,8.34,3.78,12.66,3.78,5.36,0,9.68-.76,12.96-2.28,1.61-.75,3.25-1.65,4.9-2.71l.5,3.67h9.36V17.4c0-2.16.08-3.7.24-4.62.16-.92.5-1.74,1.02-2.46.52-.72,1.5-1.68,2.94-2.88l-5.76-7.44c-2.88,1.52-5.06,3.76-6.54,6.72ZM238.28,79.68c-2.8,1.36-6,2.04-9.6,2.04-2.08,0-4.38-.92-6.9-2.76-2.52-1.84-4.66-4.46-6.42-7.86-1.76-3.4-2.64-7.34-2.64-11.82,0-4.72.68-8.76,2.04-12.12,1.36-3.36,3.24-5.92,5.64-7.68,2.4-1.76,5.16-2.64,8.28-2.64,3.36,0,6.58,1.32,9.66,3.96,3.08,2.64,5.66,5.48,7.74,8.52v25.7c-2.9,1.98-5.5,3.54-7.8,4.66Z",
  // A 2
  "M312.04,51.72c0-7.76-1.98-13.74-5.94-17.94-3.96-4.2-9.46-6.3-16.5-6.3-5.2,0-10.24,1.16-15.12,3.48l3.48,7.08c3.28-1.44,6.68-2.16,10.2-2.16,4.4,0,7.74,1.28,10.02,3.84,2.28,2.56,3.42,6.16,3.42,10.8v2.07c-8.22-1.29-14.71-1.5-19.44-.63-4,.72-7.34,2.2-10.02,4.44-2.68,2.24-4.56,4.9-5.64,7.98-1.08,3.08-1.42,6.26-1.02,9.54.64,4.64,2.7,8.56,6.18,11.76,3.48,3.2,8.06,4.84,13.74,4.92,6.4.08,11.16-1.84,14.28-5.76.7-.88,1.33-1.81,1.92-2.79v7.35h10.44v-26.29c1.36.32,2.69.64,3.96.98l1.68-8.16c-1.91-.51-3.79-.96-5.64-1.37v-2.83ZM297.28,78.72c-2.88,2.32-6.12,3.48-9.72,3.48s-6.68-.92-9-2.76c-2.32-1.84-3.72-4.12-4.2-6.84-.48-2.8.04-5.38,1.56-7.74,1.52-2.36,4-3.94,7.44-4.74,3.76-.89,9.85-.61,18.24.82v12.22c-.99,2.18-2.43,4.04-4.32,5.56Z",
  // L
  "M339.28,82.68c-.48-.96-.76-2.56-.84-4.8V4.44h-9.84v70.8c0,3.36.32,6.24.96,8.64.64,2.4,1.6,4.42,2.88,6.06,1.28,1.64,2.88,2.94,4.8,3.9l5.52-7.44c-1.84-1.52-3-2.76-3.48-3.72Z",
  // O
  "M390.8,31.32c-4.16-2.56-8.96-3.84-14.4-3.84s-10.24,1.28-14.4,3.84c-4.16,2.56-7.38,6.22-9.66,10.98-2.28,4.76-3.42,10.34-3.42,16.74s1.14,12,3.42,16.8c2.28,4.8,5.5,8.48,9.66,11.04,4.16,2.56,8.96,3.84,14.4,3.84s10.24-1.28,14.4-3.84c4.16-2.56,7.4-6.24,9.72-11.04,2.32-4.8,3.48-10.4,3.48-16.8s-1.16-11.98-3.48-16.74c-2.32-4.76-5.56-8.42-9.72-10.98ZM392.12,71.28c-1.52,3.36-3.64,5.9-6.36,7.62-2.72,1.72-5.84,2.58-9.36,2.58s-6.62-.86-9.3-2.58c-2.68-1.72-4.78-4.26-6.3-7.62-1.52-3.36-2.28-7.44-2.28-12.24s.76-8.76,2.28-12.12c1.52-3.36,3.64-5.92,6.36-7.68,2.72-1.76,5.8-2.64,9.24-2.64s6.64.88,9.36,2.64c2.72,1.76,4.84,4.32,6.36,7.68,1.52,3.36,2.28,7.4,2.28,12.12s-.76,8.88-2.28,12.24Z",
  // N
  "M452.26,29.52c-2.44-1.12-5.02-1.68-7.74-1.68-3.76,0-7.26.72-10.5,2.16s-6.26,3.8-9.06,7.08h-.6c-.56-2.72-1.48-4.86-2.76-6.42-1.28-1.56-3.2-3.22-5.76-4.98l-6.12,7.44c1.36,1.12,2.32,2.06,2.88,2.82.56.76.9,1.56,1.02,2.4s.26,2.42.42,4.74v46.32h10.56v-42.6c2.8-3.04,5.5-5.32,8.1-6.84,2.6-1.52,5.22-2.28,7.86-2.28,2.16,0,3.96.46,5.4,1.38,1.44.92,2.54,2.28,3.3,4.08.76,1.8,1.14,4.02,1.14,6.66v39.6h10.56v-42.6c-.08-4.72-.94-8.5-2.58-11.34-1.64-2.84-3.68-4.82-6.12-5.94Z",
  // I (Puntino e asta)
  "M478.28,21.48c1.84,0,3.4-.66,4.68-1.98,1.28-1.32,1.92-2.86,1.92-4.62s-.64-3.4-1.92-4.68c-1.28-1.28-2.84-1.92-4.68-1.92s-3.3.64-4.62,1.92c-1.32,1.28-1.98,2.84-1.98,4.68s.66,3.3,1.98,4.62c1.32,1.32,2.86,1.98,4.62,1.98Z",
  "M473.24,29.4h10.2v60h-10.2Z"
];

export const SVG_VIEWBOX_WIDTH = 484.88;
export const SVG_VIEWBOX_HEIGHT = 93.84;

export const ASCII_DENSITY_RAMP = " .',:;!~+-x*=7?LIV)(T}JcC123FXY5P4E698U$OAK0GZ&HMNQB#R@W";
export const MATRIX_SCRAMBLE_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&@$*+<>/?~';

/**
 * Calcola la proiezione spaziale normalizzata (da 0.0 a 1.0) lungo la direzione del fronte d'onda
 */
export function getSpatialProjection(x, y, w, h, direction = 'diag') {
  const nx = w > 0 ? x / w : 0;
  const ny = h > 0 ? y / h : 0;
  switch (direction) {
    case 'ttb': return ny; // Dall'alto verso il basso
    case 'btt': return 1.0 - ny; // Dal basso verso l'alto
    case 'rtl': return 1.0 - nx; // Da destra a sinistra
    case 'ltr': return nx; // Da sinistra a destra
    case 'radial': { // Dal centro verso l'esterno
      const dx = (x - w * 0.5) / (w * 0.5);
      const dy = (y - h * 0.5) / (h * 0.5);
      return Math.min(1.0, Math.sqrt(dx * dx + dy * dy) * 0.7071);
    }
    case 'diag': // Diagonale (Alto-Sinistra -> Basso-Destra)
    default:
      return (nx + ny) * 0.5;
  }
}

/**
 * Disegna il logo vettoriale classico istituzionale "Attraverso Maddaloni"
 */
export function drawClassicVectorLogo(ctx, width, height, color = '#000000', slant = 0) {
  ctx.save();
  
  if (slant !== 0) {
    const rad = (slant * Math.PI) / 180;
    ctx.transform(1, 0, Math.tan(rad), 1, 0, 0);
  }

  const scaleX = width / SVG_VIEWBOX_WIDTH;
  const scaleY = height / SVG_VIEWBOX_HEIGHT;
  const scale = Math.min(scaleX, scaleY) * 0.95;

  const offsetX = (width - SVG_VIEWBOX_WIDTH * scale) / 2;
  const offsetY = (height - SVG_VIEWBOX_HEIGHT * scale) / 2;

  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  ctx.fillStyle = color;
  for (const pathStr of MADDALONI_SVG_PATHS) {
    try {
      const path2d = new Path2D(pathStr);
      ctx.fill(path2d);
    } catch {
      // Fallback
    }
  }

  ctx.restore();
}

/**
 * Genera la maschera bitmap raster per il sampling della matrice generativa
 * Supporta sia il tracciato araldico "MADDALONI" sia macroText personalizzato
 */
export function createLogoMask(width, height, {
  macroText = 'MADDALONI',
  macroFontFamily = "'Tifata Display VF', 'Tifata Display', system-ui, sans-serif",
  macroWeight = 900,
  macroSlant = 0
} = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(10, width);
  canvas.height = Math.max(10, height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  // Sfondo bianco puro (neutro, non attivo)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  if (macroSlant !== 0) {
    const rad = (macroSlant * Math.PI) / 180;
    ctx.translate(width / 2, height / 2);
    ctx.transform(1, 0, -Math.tan(rad), 1, 0, 0);
    ctx.translate(-width / 2, -height / 2);
  }

  const isOfficialStencil = !macroText || macroText.trim().toUpperCase() === 'MADDALONI';

  if (isOfficialStencil) {
    // Disegna il logo vettoriale esatto di Maddaloni
    const scaleX = width / SVG_VIEWBOX_WIDTH;
    const scaleY = height / SVG_VIEWBOX_HEIGHT;
    const scale = Math.min(scaleX, scaleY) * 0.94;
    const offsetX = (width - SVG_VIEWBOX_WIDTH * scale) / 2;
    const offsetY = (height - SVG_VIEWBOX_HEIGHT * scale) / 2;

    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    ctx.fillStyle = '#000000';
    for (const pathStr of MADDALONI_SVG_PATHS) {
      try {
        const path2d = new Path2D(pathStr);
        ctx.fill(path2d);
      } catch {
        // Fallback
      }
    }
  } else {
    // Macro Text personalizzato (es. 'TIFATA', 'MUSEO', 'FESTIVAL')
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let fontSize = Math.floor(height * 0.85);
    ctx.font = `${macroWeight} ${fontSize}px ${macroFontFamily}`;
    const measuredW = ctx.measureText(macroText).width;
    if (measuredW > width * 0.95 && measuredW > 0) {
      fontSize = Math.floor(fontSize * (width * 0.95 / measuredW));
      ctx.font = `${macroWeight} ${fontSize}px ${macroFontFamily}`;
    }

    ctx.fillText(macroText, width / 2, height / 2);
  }

  ctx.restore();
  return ctx.getImageData(0, 0, width, height);
}

/**
 * Disegna un triangolo geometrico (equilatero o scaleno asimmetrico)
 */
export function drawTriangle(ctx, cx, cy, size, isScalene = false, row = 0, col = 0, slant = 0) {
  if (size <= 0.2) return;
  ctx.save();
  ctx.translate(cx, cy);

  if (slant !== 0) {
    const rad = (slant * Math.PI) / 180;
    ctx.transform(1, 0, Math.tan(rad), 1, 0, 0);
  }

  const h = size * 0.866;
  const halfW = size / 2;
  const inverted = (row + col) % 2 === 1;
  const dir = inverted ? -1 : 1;

  ctx.beginPath();
  if (!isScalene) {
    // Triangolo Equilatero perfetto
    ctx.moveTo(0, -dir * (h * 0.58));
    ctx.lineTo(-halfW, dir * (h * 0.42));
    ctx.lineTo(halfW, dir * (h * 0.42));
  } else {
    // Triangolo Scaleno dinamico con asimmetria organica
    const jitterX = ((col * 17 + row * 23) % 11 - 5) * 0.12 * size;
    ctx.moveTo(jitterX, -dir * (h * 0.65));
    ctx.lineTo(-halfW * 0.75, dir * (h * 0.35));
    ctx.lineTo(halfW * 1.15, dir * (h * 0.45));
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Disegna un cerchio (uniforme o a raggio halftone dinamico)
 */
export function drawCircle(ctx, cx, cy, radius, slant = 0) {
  if (radius <= 0.2) return;
  ctx.save();
  ctx.translate(cx, cy);

  if (slant !== 0) {
    const rad = (slant * Math.PI) / 180;
    ctx.transform(1, 0, Math.tan(rad), 1, 0, 0);
  }

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Disegna un quadrato geometrico modulare
 */
export function drawSquare(ctx, cx, cy, size, slant = 0) {
  if (size <= 0.2) return;
  ctx.save();
  ctx.translate(cx, cy);

  if (slant !== 0) {
    const rad = (slant * Math.PI) / 180;
    ctx.transform(1, 0, Math.tan(rad), 1, 0, 0);
  }

  const half = size / 2;
  ctx.fillRect(-half, -half, size, size);
  ctx.restore();
}

/**
 * Renderizza il logo generativo con l'esatto motore di Rhea Studio Type Studio Matrix & Motion Engine
 */
export function renderGenerativeLogo(ctx, {
  width,
  height,
  shape = 'triangle_equilateral', // 'classic_vector' | 'type' | 'circle_uniform' | 'circle_halftone' | 'triangle_equilateral' | 'triangle_scalene' | 'square' | 'mixed'
  color = '#000000',
  bgColor = 'transparent',
  gridDensity = 4, // Passo griglia in pixel CSS (Default 4px per altissima definizione ~95 colonne)
  slant = 0,
  dpr = 1,
  microChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  charPickMode = 'sequential', // 'sequential' | 'density' | 'random'
  fontFamily = "'Tifata Display VF', 'Tifata Display', system-ui, sans-serif",
  macroText = 'MADDALONI',
  rowShift = 13,
  staggerGrid = false,
  variableWeightHalftone = true,
  maskThreshold = 200,
  // --- Parametri Motion & Micro-Animazione ---
  animProgress = 1.0, // 0.0 to 1.0 (1.0 = completamente rivelato)
  animStyle = 'telegram', // 'telegram' | 'matrix' | 'dissolve' | 'weight_morph'
  animDirection = 'diag', // 'diag' | 'ltr' | 'ttb' | 'radial' | 'btt'
  animNoise = 50, // 0 to 100
  continuousJitter = false,
  jitterIntensity = 1.5,
  livingSlant = 0,
  nextShape = null,
  morphProgress = 0
}) {
  const w = Math.round(width * dpr);
  const h = Math.round(height * dpr);

  ctx.clearRect(0, 0, w, h);

  if (bgColor && bgColor !== 'transparent') {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);
  }

  const effectiveSlant = slant + (livingSlant || 0);
  const isAnimated = animProgress < 1.0;
  const noiseFactor = (animNoise || 50) / 100;
  const waveSpread = 0.08 + noiseFactor * 0.22;
  const sweep = animProgress * (1.0 + waveSpread + 0.35) - 0.15;

  // 1. CASO ISTITUZIONALE COMUNE: Vettore Normale Fisso
  if (shape === 'classic_vector') {
    ctx.save();
    if (isAnimated) {
      ctx.beginPath();
      if (animDirection === 'ltr') {
        ctx.rect(0, 0, w * animProgress, h);
      } else if (animDirection === 'ttb') {
        ctx.rect(0, 0, w, h * animProgress);
      } else if (animDirection === 'btt') {
        ctx.rect(0, h * (1 - animProgress), w, h * animProgress);
      } else if (animDirection === 'diag') {
        const diagDist = (w + h) * animProgress;
        ctx.moveTo(0, 0);
        ctx.lineTo(diagDist, 0);
        ctx.lineTo(0, diagDist);
        ctx.closePath();
      } else {
        const maxR = Math.sqrt(w * w + h * h) * 0.5 * animProgress;
        ctx.arc(w / 2, h / 2, maxR, 0, Math.PI * 2);
      }
      ctx.clip();
    }
    drawClassicVectorLogo(ctx, w, h, color, effectiveSlant);
    ctx.restore();
    return;
  }

  // 2. MOTORE GENERATIVO MATRIX (Type Studio Engine)
  const maskData = createLogoMask(w, h, {
    macroText,
    macroFontFamily: fontFamily,
    macroWeight: 900,
    macroSlant: 0
  });

  if (!maskData) return;

  const pixels = maskData.data;

  const safeDensity = Math.max(2, Number(gridDensity) || 4);
  const step = Math.max(2, Math.round(safeDensity * dpr));

  const totalCols = Math.ceil(w / step);
  const totalRows = Math.ceil(h / step);

  const chars = (microChars && microChars.length > 0) ? microChars : 'MADDALONI';
  const isTypeMode = shape === 'type';
  const isMixed = shape === 'mixed';
  const isSquare = shape === 'square' || shape === 'squares';
  const isCircleUniform = shape === 'circle_uniform';
  const isCircleHalftone = shape === 'circle_halftone' || shape === 'circles';
  const isTriangleEquilateral = shape === 'triangle_equilateral' || shape === 'triangles';
  const isTriangleScalene = shape === 'triangle_scalene';

  const microTanSlant = effectiveSlant !== 0 ? Math.tan((effectiveSlant * Math.PI) / 180) : 0;
  const fontSize = Math.max(2, Math.round(step * 1.08));

  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let currentWeight = 700;
  if (isTypeMode) {
    ctx.font = `${currentWeight} ${fontSize}px ${fontFamily}`;
  }

  for (let rowIdx = 0; rowIdx < totalRows; rowIdx++) {
    const y = (rowIdx + 0.5) * step;
    if (y >= h) break;
    const xOffset = (staggerGrid && (rowIdx % 2 === 1)) ? step * 0.5 : 0;

    for (let colIdx = 0; colIdx < totalCols; colIdx++) {
      const x = (colIdx + 0.5) * step + xOffset;
      if (x >= w) break;

      const px = Math.min(w - 1, Math.max(0, Math.floor(x)));
      const py = Math.min(h - 1, Math.max(0, Math.floor(y)));
      const idx = (py * w + px) * 4;

      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b; // 0 = nero (pieno), 255 = bianco (vuoto)

      if (lum < maskThreshold) {
        // Calcolo dell'animazione wave / comparsa temporale
        let animDelta = 1.0;
        if (isAnimated) {
          const proj = getSpatialProjection(x, y, w, h, animDirection);
          const hash = Math.abs(Math.sin(px * 12.9898 + py * 78.233) * 43758.5453);
          const noiseVal = hash - Math.floor(hash);

          const activationThreshold = proj + (noiseVal - 0.5) * noiseFactor * 0.32;
          const delta = (sweep - activationThreshold) / waveSpread;

          if (delta <= 0) {
            continue; // Elemento non ancora rivelato
          }
          animDelta = Math.min(1.0, delta);
        }

        // Calcolo Living Ink Jitter (respiro organico continuo)
        let jx = 0, jy = 0;
        if (continuousJitter) {
          jx = (Math.random() - 0.5) * (jitterIntensity || 1.5) * dpr;
          jy = (Math.random() - 0.5) * (jitterIntensity || 1.5) * dpr;
        }

        const cellX = x + jx;
        const cellY = y + jy;

        // Luminanza normalizzata da 0 (fondo nero massimo) a 1 (vuoto)
        const normDarkness = Math.max(0, Math.min(1, (maskThreshold - lum) / maskThreshold));


        const isGeo1 = shape !== 'type' && shape !== 'mixed';
        const isGeo2 = nextShape && nextShape !== 'type' && nextShape !== 'mixed';

        const drawCellShape = (targetShape, popScale = 1.0) => {
          const isType = targetShape === 'type';
          const isMix = targetShape === 'mixed';
          const isSq = targetShape === 'square' || targetShape === 'squares';
          const isCircU = targetShape === 'circle_uniform';
          const isCircH = targetShape === 'circle_halftone' || targetShape === 'circles';
          const isTriE = targetShape === 'triangle_equilateral' || targetShape === 'triangles';
          const isTriS = targetShape === 'triangle_scalene';
          
          let actualShape = targetShape;
          if (isMix) {
            actualShape = ((rowIdx + colIdx) % 2 === 0) ? 'square' : 'circle_uniform';
          }
          
          if (actualShape === 'type') {
            const rowBaseWeight = calculateRowWeight(rowIdx, totalRows, baseWeight, rowWeightMode);
            let effectiveWeight = rowBaseWeight;
            if (isAnimated && animDelta < 1.0 && animStyle === 'weight_morph') {
              effectiveWeight = Math.round(100 + animDelta * (rowBaseWeight - 100));
            }

            if (effectiveWeight !== currentWeight) {
              currentWeight = effectiveWeight;
              ctx.font = `${currentWeight} ${fontSize * popScale}px ${fontFamily}`;
            }

            let ch = ' ';
            if (isAnimated && animDelta < 1.0) {
              if (animStyle === 'telegram' && Math.random() > animDelta * 0.75) {
                ch = chars[Math.floor(Math.random() * chars.length)];
                jx += (Math.random() - 0.5) * 2 * dpr;
                jy += (Math.random() - 0.5) * 2 * dpr;
              } else if (animStyle === 'matrix' && animDelta < 0.85) {
                ch = MATRIX_SCRAMBLE_CHARS[Math.floor(Math.random() * MATRIX_SCRAMBLE_CHARS.length)];
              } else {
                const cellIndex = rowIdx * totalCols + colIdx + (rowIdx * (rowShift || 13));
                ch = chars[cellIndex % chars.length];
              }
            } else if (charPickMode === 'density') {
              const charIdx = Math.min(ASCII_DENSITY_RAMP.length - 1, Math.max(0, Math.floor(normDarkness * ASCII_DENSITY_RAMP.length)));
              ch = ASCII_DENSITY_RAMP[charIdx];
            } else if (charPickMode === 'random') {
              ch = chars[Math.floor(Math.random() * chars.length)];
            } else {
              const cellIndex = rowIdx * totalCols + colIdx + (rowIdx * (rowShift || 13));
              ch = chars[cellIndex % chars.length];
            }

            if (effectiveSlant !== 0) {
              ctx.save();
              ctx.translate(cellX, cellY);
              ctx.transform(1, 0, microTanSlant, 1, 0, 0);
              ctx.fillText(ch, 0, 0);
              ctx.restore();
            } else {
              ctx.fillText(ch, cellX, cellY);
            }
          } 
          else if (actualShape === 'circle_uniform' || actualShape === 'circle_halftone' || actualShape === 'circles') {
            const animScale = isAnimated ? (0.2 + animDelta * 0.8) : 1;
            const radius = (step * 0.44 * safeShapeScale) * animScale * popScale;
            drawCircle(ctx, cellX, cellY, radius, effectiveSlant);
          }
          else if (actualShape === 'triangle_equilateral' || actualShape === 'triangles') {
            const animScale = isAnimated ? (0.2 + animDelta * 0.8) : 1;
            const size = step * 0.98 * safeShapeScale * animScale * popScale;
            drawTriangle(ctx, cellX, cellY, size, false, rowIdx, colIdx, effectiveSlant);
          }
          else if (actualShape === 'triangle_scalene') {
            const animScale = isAnimated ? (0.2 + animDelta * 0.8) : 1;
            const size = step * 0.98 * safeShapeScale * animScale * popScale;
            drawTriangle(ctx, cellX, cellY, size, true, rowIdx, colIdx, effectiveSlant);
          }
          else {
            // square
            const animScale = isAnimated ? (0.2 + animDelta * 0.8) : 1;
            let size = step * 0.88 * safeShapeScale * animScale * popScale;
            drawSquare(ctx, cellX, cellY, size, effectiveSlant);
          }
        };

        if (morphProgress > 0 && nextShape && nextShape !== shape) {
          if (isGeo1 && isGeo2) {
            // Geometric Morphing
            const animScale = isAnimated ? (0.2 + animDelta * 0.8) : 1;
            const size = step * 0.98 * safeShapeScale * animScale;
            drawMorphedGeometry(ctx, cellX, cellY, size, shape, nextShape, morphProgress, false, rowIdx, colIdx, effectiveSlant);
          } else {
            // Text <-> Geo or Mixed (Scale Pop Wave)
            const proj = getSpatialProjection(x, y, w, h, animDirection);
            const waveSpread = 0.4;
            const start = proj * waveSpread;
            const end = start + (1 - waveSpread);
            const localT = Math.max(0, Math.min(1, (morphProgress - start) / (end - start)));
            
            if (localT < 0.5) {
              const popScale = Math.max(0, 1.0 - (localT * 2.0));
              drawCellShape(shape, popScale);
            } else {
              const popScale = Math.max(0, (localT - 0.5) * 2.0);
              drawCellShape(nextShape, popScale);
            }
          }
        } else {
          // Standard Draw
          drawCellShape(shape, 1.0);
        }
      }
    }
  }
}


export function getMorphPoints(shapeType, isScalene = false, row = 0, col = 0) {
  if (shapeType.includes('circle')) {
    return Array.from({length: 12}).map((_, i) => {
      const a = (i/12)*Math.PI*2 - Math.PI/2;
      return {x: Math.cos(a)*0.5, y: Math.sin(a)*0.5};
    });
  }
  if (shapeType.includes('square')) {
    const pTC = {x: 0, y: -0.5}, pTR = {x: 0.5, y: -0.5}, pBR = {x: 0.5, y: 0.5}, pBL = {x: -0.5, y: 0.5}, pTL = {x: -0.5, y: -0.5};
    const lerp = (p1, p2, t) => ({x: p1.x + (p2.x-p1.x)*t, y: p1.y + (p2.y-p1.y)*t});
    return [
      pTC, lerp(pTC, pTR, 0.5),
      pTR, lerp(pTR, pBR, 0.333), lerp(pTR, pBR, 0.666),
      pBR, lerp(pBR, pBL, 0.333), lerp(pBR, pBL, 0.666),
      pBL, lerp(pBL, pTL, 0.333), lerp(pBL, pTL, 0.666),
      pTL
    ];
  }
  if (shapeType.includes('triangle')) {
    const h = 0.866;
    const inverted = (row + col) % 2 === 1;
    const dir = inverted ? -1 : 1;
    let pTop = {x: 0, y: -dir*(h*0.58)};
    let pBR = {x: 0.5, y: dir*(h*0.42)};
    let pBL = {x: -0.5, y: dir*(h*0.42)};
    if (isScalene) {
      const jitterX = ((col * 17 + row * 23) % 11 - 5) * 0.12;
      pTop = {x: jitterX, y: -dir*(h*0.65)};
      pBL = {x: -0.5 * 0.75, y: dir*(h*0.35)};
      pBR = {x: 0.5 * 1.15, y: dir*(h*0.45)};
    }
    const lerp = (p1, p2, t) => ({x: p1.x + (p2.x-p1.x)*t, y: p1.y + (p2.y-p1.y)*t});
    return [
      pTop, lerp(pTop, pBR, 0.25), lerp(pTop, pBR, 0.5), lerp(pTop, pBR, 0.75),
      pBR, lerp(pBR, pBL, 0.333), lerp(pBR, pBL, 0.666),
      pBL, lerp(pBL, pTop, 0.25), lerp(pBL, pTop, 0.5), lerp(pBL, pTop, 0.75),
      lerp(pBL, pTop, 0.88)
    ];
  }
  return null;
}

export function drawMorphedGeometry(ctx, cx, cy, size, fromShape, toShape, progress, isScalene = false, row = 0, col = 0, slant = 0) {
  const ptsA = getMorphPoints(fromShape, isScalene, row, col);
  const ptsB = getMorphPoints(toShape, isScalene, row, col);
  if (!ptsA || !ptsB) return;
  
  ctx.save();
  ctx.translate(cx, cy);
  if (slant !== 0) {
    ctx.transform(1, 0, Math.tan((slant * Math.PI) / 180), 1, 0, 0);
  }
  
  ctx.beginPath();
  for (let i = 0; i < 12; i++) {
    const x = (ptsA[i].x + (ptsB[i].x - ptsA[i].x) * progress) * size;
    const y = (ptsA[i].y + (ptsB[i].y - ptsA[i].y) * progress) * size;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
