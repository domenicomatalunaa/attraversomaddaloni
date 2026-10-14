import React, { useEffect, useRef } from 'react';

const logoImageCache = new Map();

function getLoadedImage(src, onLoaded) {
  if (!src) return null;
  if (logoImageCache.has(src)) {
    const cached = logoImageCache.get(src);
    if (cached && cached.complete && cached.naturalWidth > 0) return cached;
  }
  if (typeof window === 'undefined') return null;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = src;
  img.onload = () => {
    logoImageCache.set(src, img);
    if (onLoaded) onLoaded();
  };
  logoImageCache.set(src, img);
  return img.complete && img.naturalWidth > 0 ? img : null;
}

/**
 * TypeInTypeAvatar
 * Motore Tipografico Generativo ad altissima precisione.
 * Supporta:
 * - Testo Epigrafico Positivo e Spazio Negativo (cut-out)
 * - Forme Geometriche Pure: Cerchio e Quadrato
 * - Rarefazione / Disgregazione Tipografica (0 - 100%)
 * - Reattività immediata in tempo reale
 */
export const TypeInTypeAvatar = ({
  macroText = 'MADDALONI',
  subText = '',
  microText = 'ATTRAVERSO MADDALONI',
  colorText = '#000000',
  textOpacity = 100,
  colorBg = 'transparent',
  maskShape = 'text',
  fillMode = 'solid',
  strokeWidth = 3,
  tessellate = false,
  avoidOtherNodes = false,
  otherNodes = [],
  nodePos = { x: 0, y: 0 },
  size,
  width = 300,
  height = 54,
  gridStep = 6.2,
  microFontSize = 6.2,
  macroWeight = 900,
  macroFontFamily = "'Tifata Display VF', 'Tifata Display', 'Cinzel', serif",
  microFontFamily = "'Tifata Display VF', 'Tifata Display', 'Cinzel', serif",
  align = 'left', // 'left' | 'center' | 'right'
  isNegative = false,
  shadeProgress = 100, // 0 - 100% (Rarefazione / Disgregazione tipografica)
  disableHoverScale = true,
  interactive = false,
  className = '',
  style = {},
  isThumbnail = false,
}) => {
  const canvasRef = useRef(null);
  const cachedPointsRef = useRef(null);
  const cacheKeyRef = useRef('');

  const parsedWidth = parseFloat(width || size) || 300;
  const parsedHeight = parseFloat(height || size) || 54;

  const displayWidth = Math.max(20, parsedWidth);
  const displayHeight = Math.max(20, parsedHeight);
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 2, 3) : 2;

  let w = Math.max(40, Math.round(displayWidth * dpr));
  let h = Math.max(40, Math.round(displayHeight * dpr));

  // Capping per evitare freeze del browser/hardware acceleration limits su formati giganti (es. 70x100)
  const MAX_DIM = 6000;
  let scaleDown = 1;
  if (w > MAX_DIM || h > MAX_DIM) {
    scaleDown = Math.min(MAX_DIM / w, MAX_DIM / h);
    w = Math.round(w * scaleDown);
    h = Math.round(h * scaleDown);
  }

  const safeGridStep = Math.max(2.5, Number(gridStep) || 6.2);
  const safeMicroFontSize = Math.max(2.0, Number(microFontSize) || safeGridStep);

  const step = Math.max(3.0, Math.round(safeGridStep * dpr * scaleDown));
  const fSize = Math.max(2.5, Math.round(safeMicroFontSize * dpr * scaleDown));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;

    const generateAndDraw = () => {
      if (!isMounted) return;

      const rawText = String(macroText || '').trim();
      const cx = w / 2;
      const cy = h / 2;
      const isOutline = fillMode === 'outline';
      const effectiveStrokeWidth = Math.max(1, (strokeWidth || 3) * dpr);
      const strokeInset = isOutline ? (effectiveStrokeWidth / 2) : 0;
      // Il raggio tiene conto dello spessore della traccia per non uscire mai dai bordi del nodo (niente taglio piatto)
      const radius = Math.max(4, (Math.min(w, h) / 2) - strokeInset - 2);
      
      const hasMicroText = microText && microText.trim().length > 0;

      // 4. Rendering statico nitido ad altissima definizione sul canvas principale
      ctx.clearRect(0, 0, w, h);

      if (colorBg && colorBg !== 'transparent') {
        ctx.fillStyle = colorBg;
        ctx.fillRect(0, 0, w, h);
      }

      ctx.fillStyle = colorText || '#000000';
      ctx.strokeStyle = colorText || '#000000';
      ctx.lineWidth = effectiveStrokeWidth;

      const baseAlpha = Math.max(0, Math.min(100, Number(textOpacity ?? 100))) / 100;
      ctx.globalAlpha = baseAlpha;

      if (!hasMicroText || isThumbnail) {
        if (isNegative) {
          // FAST PATH PER THUMBNAILS E NEGATIVI: Disegna sfondo solido e "buca" il testo
          ctx.fillStyle = colorText || '#000000';
          ctx.fillRect(0, 0, w, h);

          if (rawText) {
            ctx.fillStyle = colorBg === 'transparent' ? '#ffffff' : colorBg;
            ctx.textAlign = align === 'left' ? 'left' : align === 'right' ? 'right' : 'center';
            ctx.textBaseline = 'middle';

            const targetWidth = align === 'left' ? w * 0.96 : w * 0.92;
            const targetHeight = h * 0.85;

            let testSize = Math.max(10, Math.floor((targetWidth / rawText.length) * 1.5));
            ctx.font = `${macroWeight} ${testSize}px ${macroFontFamily}`;
            const metrics = ctx.measureText(rawText);
            let calculatedSize = testSize;
            if (metrics.width > 0) {
              calculatedSize = Math.max(10, Math.floor((targetWidth / metrics.width) * testSize));
            }
            if (calculatedSize > targetHeight) calculatedSize = Math.max(10, Math.floor(targetHeight));

            ctx.font = `${macroWeight} ${calculatedSize}px ${macroFontFamily}`;
            const startX = align === 'left' ? w * 0.02 : align === 'right' ? w * 0.98 : w / 2;
            const startY = h / 2;
            ctx.fillText(rawText, startX, startY);
          }
        } else {
          // MODALITÀ "SOLO FORMA/TRACCIA": Nessun micro-testo, disegna la forma pura
          if (maskShape === 'circle') {
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            if (isOutline) ctx.stroke(); else ctx.fill();
          } else if (maskShape === 'square') {
            if (isOutline) {
              ctx.strokeRect(strokeInset + 1, strokeInset + 1, w - effectiveStrokeWidth - 2, h - effectiveStrokeWidth - 2);
            } else {
              ctx.fillRect(0, 0, w, h);
            }
          }

          if (rawText) {
            ctx.fillStyle = (colorBg === 'transparent' && !isOutline) ? '#ffffff' : (colorText || '#000000');
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            let maxTextW = maskShape === 'circle' ? radius * 2 * 0.8 : w * 0.85;
            let testSize = Math.max(10, Math.floor(maskShape === 'circle' ? radius * 0.38 : h * 0.4));
            ctx.font = `${macroWeight} ${testSize}px ${macroFontFamily}`;
            const metrics = ctx.measureText(rawText);
            if (metrics.width > 0 && metrics.width > maxTextW) {
              testSize = Math.max(10, Math.floor((maxTextW / metrics.width) * testSize));
            }
            ctx.font = `${macroWeight} ${testSize}px ${macroFontFamily}`;
            ctx.fillText(rawText, cx, cy);
          }
        }
        ctx.globalAlpha = 1.0;
        return;
      }

      // MODALITÀ GENERATIVA (TYPE-IN-TYPE)
      const rawProgress = Number(shadeProgress);
      const isFull = isNaN(rawProgress) || rawProgress >= 100;
      const progressRatio = Math.max(0.05, Math.min(1.0, (Number(shadeProgress) || 100) / 100));

      let effectiveStep = step;
      let effectiveFSize = fSize;
      const estimatedCells = (w / step) * (h / step);
      if (estimatedCells > 85000) {
        const throttleFactor = Math.sqrt(estimatedCells / 65000);
        effectiveStep = Math.max(step, Math.ceil(step * throttleFactor));
        effectiveFSize = Math.max(fSize, Math.round(fSize * throttleFactor));
      }

      const otherNodesKey = avoidOtherNodes 
        ? (otherNodes || []).map(n => `${n.id}_${n.x}_${n.y}_${n.width}_${n.height}_${n.value || ''}_${n.fontSize || ''}`).join('|') 
        : 'none';
      const posKey = avoidOtherNodes ? `${nodePos?.x}_${nodePos?.y}` : 'none';
      const geomKey = `${w}_${h}_${maskShape}_${rawText}_${macroWeight}_${isOutline}_${strokeWidth}_${effectiveStep}_${effectiveFSize}_${shadeProgress}_${safeMicroFontSize}_${tessellate}_${avoidOtherNodes}_${otherNodesKey}_${posKey}_${isNegative}_${align}_${colorText}_${colorBg}`;

      let points = [];

      if (cachedPointsRef.current && cacheKeyRef.current === geomKey) {
        // CACHE HIT: Istantaneo (0 ms), riusa i punti già calcolati!
        points = cachedPointsRef.current;
      } else {
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = w;
        maskCanvas.height = h;
        const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
        if (!maskCtx) return;

      maskCtx.fillStyle = '#ffffff';
      maskCtx.fillRect(0, 0, w, h);

      if (maskShape === 'circle') {
        maskCtx.beginPath();
        maskCtx.arc(cx, cy, radius, 0, Math.PI * 2);
        maskCtx.fillStyle = '#000000';
        maskCtx.strokeStyle = '#000000';
        maskCtx.lineWidth = effectiveStrokeWidth;
        if (isOutline) maskCtx.stroke(); else maskCtx.fill();

        if (rawText) {
          maskCtx.fillStyle = '#ffffff';
          maskCtx.textAlign = 'center';
          maskCtx.textBaseline = 'middle';
          const maxTextW = radius * 2 * 0.8;
          let testSize = Math.max(10, Math.floor(radius * 0.38));
          maskCtx.font = `${macroWeight} ${testSize}px ${macroFontFamily}`;
          const metrics = maskCtx.measureText(rawText);
          if (metrics.width > 0 && metrics.width > maxTextW) {
            testSize = Math.max(10, Math.floor((maxTextW / metrics.width) * testSize));
          }
          maskCtx.font = `${macroWeight} ${testSize}px ${macroFontFamily}`;
          maskCtx.fillText(rawText, cx, cy);
        }
      } else if (maskShape === 'square') {
        maskCtx.fillStyle = '#000000';
        maskCtx.strokeStyle = '#000000';
        maskCtx.lineWidth = effectiveStrokeWidth;
        if (isOutline) {
          maskCtx.strokeRect(strokeInset + 1, strokeInset + 1, w - effectiveStrokeWidth - 2, h - effectiveStrokeWidth - 2);
        } else {
          maskCtx.fillRect(0, 0, w, h);
        }

        if (rawText) {
          maskCtx.fillStyle = '#ffffff';
          maskCtx.textAlign = 'center';
          maskCtx.textBaseline = 'middle';
          const maxTextW = w * 0.85;
          let testSize = Math.max(10, Math.floor(h * 0.4));
          maskCtx.font = `${macroWeight} ${testSize}px ${macroFontFamily}`;
          const metrics = maskCtx.measureText(rawText);
          if (metrics.width > 0 && metrics.width > maxTextW) {
            testSize = Math.max(10, Math.floor((maxTextW / metrics.width) * testSize));
          }
          maskCtx.font = `${macroWeight} ${testSize}px ${macroFontFamily}`;
          maskCtx.fillText(rawText, w / 2, cy);
        }
      } else {
        if (isNegative) {
          maskCtx.fillStyle = '#000000';
          maskCtx.fillRect(0, 0, w, h);

          if (rawText) {
            maskCtx.fillStyle = '#ffffff';
            maskCtx.textAlign = align === 'left' ? 'left' : align === 'right' ? 'right' : 'center';
            maskCtx.textBaseline = 'middle';

            const targetWidth = align === 'left' ? w * 0.96 : w * 0.92;
            const targetHeight = h * 0.85;

            let testSize = Math.max(10, Math.floor((targetWidth / rawText.length) * 1.5));
            maskCtx.font = `${macroWeight} ${testSize}px ${macroFontFamily}`;
            const metrics = maskCtx.measureText(rawText);
            let calculatedSize = testSize;
            if (metrics.width > 0) {
              calculatedSize = Math.max(10, Math.floor((targetWidth / metrics.width) * testSize));
            }
            if (calculatedSize > targetHeight) calculatedSize = Math.max(10, Math.floor(targetHeight));

            maskCtx.font = `${macroWeight} ${calculatedSize}px ${macroFontFamily}`;
            const startX = align === 'left' ? w * 0.02 : align === 'right' ? w * 0.98 : w / 2;
            const startY = h / 2;
            maskCtx.fillText(rawText, startX, startY);
          }
        } else {
          maskCtx.fillStyle = '#000000';
          maskCtx.textAlign = align === 'left' ? 'left' : align === 'right' ? 'right' : 'center';
          maskCtx.textBaseline = 'middle';

          const targetWidth = align === 'left' ? w * 0.98 : w * 0.94;
          const targetHeight = h * 0.88;

          let testSize = Math.max(10, Math.floor((targetWidth / rawText.length) * 1.6));
          maskCtx.font = `${macroWeight} ${testSize}px ${macroFontFamily}`;

          const metrics = maskCtx.measureText(rawText);
          let calculatedSize = testSize;
          if (metrics.width > 0) {
            calculatedSize = Math.max(10, Math.floor((targetWidth / metrics.width) * testSize));
          }
          if (calculatedSize > targetHeight) calculatedSize = Math.max(10, Math.floor(targetHeight));

          maskCtx.font = `${macroWeight} ${calculatedSize}px ${macroFontFamily}`;
          const startX = align === 'left' ? 0 : align === 'right' ? w : w / 2;
          const startY = h / 2;
          maskCtx.fillText(rawText, startX, startY);
        }
      }

      // RITAGLIO DINAMICO SULLE LETTERE E FORME DEGLI ALTRI NODI
      // Invece di usare un bounding box rettangolare grezzo, disegniamo le esatte lettere / forme
      // degli altri nodi in bianco con un respiro (halo) continuo direttamente sulla mask.
      if (avoidOtherNodes && otherNodes && otherNodes.length > 0) {
        maskCtx.save();
        for (let oi = 0; oi < otherNodes.length; oi++) {
          const on = otherNodes[oi];
          if (!on || on.id === nodePos?.id) continue;

          const relX = ((on.x || 0) - (nodePos?.x || 0)) * dpr;
          const relY = ((on.y || 0) - (nodePos?.y || 0)) * dpr;
          const relW = (on.width || 100) * dpr;
          const relH = (on.height || 100) * dpr;

          if (on.type === 'text') {
            const textVal = String(on.value || on.content || '').trim();
            if (textVal) {
              const fSize = (on.fontSize || 32) * dpr;
              const fWeight = on.fontWeight || (on.bold ? 'bold' : 700);
              const fFont = on.font || on.fontFamily || 'Basic Sans, sans-serif';
              const fStyle = on.fontStyle || (on.italic ? 'italic' : 'normal');

              maskCtx.save();
              maskCtx.font = `${fStyle} ${fWeight} ${fSize}px "${fFont}", sans-serif`;
              maskCtx.textBaseline = 'top';
              maskCtx.textAlign = on.align || 'left';
              maskCtx.fillStyle = '#ffffff';
              maskCtx.strokeStyle = '#ffffff';

              // Halo di clearance dinamico attorno a ogni lettera
              const halo = Math.max(8 * dpr, Math.round(fSize * 0.14));
              maskCtx.lineWidth = halo;
              maskCtx.lineJoin = 'round';
              maskCtx.lineCap = 'round';

              const lines = textVal.split('\n');
              const lineHeight = fSize * (on.lineHeight || 1.16);

              lines.forEach((line, lineIdx) => {
                let textX = relX;
                if (on.align === 'center') textX = relX + relW / 2;
                else if (on.align === 'right') textX = relX + relW;
                const textY = relY + lineIdx * lineHeight;

                maskCtx.strokeText(line, textX, textY);
                maskCtx.fillText(line, textX, textY);
              });
              maskCtx.restore();
            }
          } else if (on.type === 'logo' || on.type === 'institutional_logo' || on.type === 'maddaloni_logo') {
            // RITAGLIO VETTORIALE ESATTO SULLA FORMA DEL LOGO (Comune di Maddaloni, Attraverso Maddaloni, Monogrammi M / AM)
            const isComune = on.logoVariant === 'comune';
            const isMonogram = on.logoFormat === 'monogram';
            const defaultSrc = isComune 
              ? (isMonogram ? '/maddaloni/monogramma_m.svg' : '/logo_comune_maddaloni.svg')
              : (isMonogram ? '/maddaloni/monogramma_am.svg' : '/logo_attraverso_maddaloni.svg');
            const logoSrc = on.src || defaultSrc;

            const logoImg = getLoadedImage(logoSrc, () => {
              if (isMounted) {
                cachedPointsRef.current = null;
                generateAndDraw();
              }
            });

            if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
              maskCtx.save();
              // Converte l'SVG vettoriale in sagoma bianca solida (#FFFFFF)
              maskCtx.filter = 'brightness(0) invert(1)';
              // Raggio di clearance / respiro attorno alle linee vettoriali del logo
              const clearanceRadius = Math.max(3 * dpr, 6);
              const offsets = [
                [-clearanceRadius, 0], [clearanceRadius, 0], [0, -clearanceRadius], [0, clearanceRadius],
                [-clearanceRadius * 0.7, -clearanceRadius * 0.7], [clearanceRadius * 0.7, -clearanceRadius * 0.7],
                [-clearanceRadius * 0.7, clearanceRadius * 0.7], [clearanceRadius * 0.7, clearanceRadius * 0.7],
                [0, 0]
              ];
              offsets.forEach(([ox, oy]) => {
                maskCtx.drawImage(logoImg, relX + ox, relY + oy, relW, relH);
              });
              maskCtx.restore();
            } else {
              // Fallback mentre l'SVG è in caricamento iniziale
              const pad = 8 * dpr;
              maskCtx.fillStyle = '#ffffff';
              maskCtx.beginPath();
              if (typeof maskCtx.roundRect === 'function') {
                maskCtx.roundRect(relX - pad, relY - pad, relW + pad * 2, relH + pad * 2, 8 * dpr);
              } else {
                maskCtx.rect(relX - pad, relY - pad, relW + pad * 2, relH + pad * 2);
              }
              maskCtx.fill();
            }
          } else if (on.type === 'image' || on.type === 'qrcode') {
            const pad = 10 * dpr;
            maskCtx.fillStyle = '#ffffff';
            maskCtx.beginPath();
            if (typeof maskCtx.roundRect === 'function') {
              maskCtx.roundRect(relX - pad, relY - pad, relW + pad * 2, relH + pad * 2, 8 * dpr);
            } else {
              maskCtx.rect(relX - pad, relY - pad, relW + pad * 2, relH + pad * 2);
            }
            maskCtx.fill();
          } else if (on.type === 'vector') {
            const pad = 8 * dpr;
            maskCtx.fillStyle = '#ffffff';
            if (on.shape === 'circle') {
              maskCtx.beginPath();
              maskCtx.arc(relX + relW / 2, relY + relH / 2, Math.min(relW, relH) / 2 + pad, 0, Math.PI * 2);
              maskCtx.fill();
            } else {
              maskCtx.fillRect(relX - pad, relY - pad, relW + pad * 2, relH + pad * 2);
            }
          } else if (on.type === 'line') {
            const weight = ((on.weight || 4) + 12) * dpr;
            maskCtx.fillStyle = '#ffffff';
            maskCtx.fillRect(relX, relY - weight / 2, relW, weight);
          }
        }
        maskCtx.restore();
      }

      const imgData = maskCtx.getImageData(0, 0, w, h);
      const pixels = imgData.data;

      let rowIndex = 0;
      for (let y = effectiveStep / 2; y < h; y += effectiveStep, rowIndex++) {
        const rowOffset = (tessellate && (rowIndex % 2 === 1)) ? (effectiveStep * 0.5) : 0;
        let colIndex = 0;
        for (let x = effectiveStep / 2 + rowOffset; x < w; x += effectiveStep, colIndex++) {
          const px = Math.min(w - 1, Math.max(0, Math.floor(x)));
          const py = Math.min(h - 1, Math.max(0, Math.floor(y)));

          const idx = (py * w + px) * 4;

          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;

          if (lum < 130) {
            if (isFull) {
              points.push({ x, y, col: colIndex, row: rowIndex, alpha: 1.0 });
            } else {
              const nx = px / w;
              // Calcolo punto di zero perfettamente continuo.
              // Mantiene la promessa (es. a 0.5 si ferma a 0.5), ma a 1.0 va dolcemente all'infinito per essere tutto pieno.
              const zeroPoint = progressRatio >= 0.999 ? 1000 : progressRatio / (1.0 - Math.pow(progressRatio, 10));
              const localDensity = 1.0 - (nx / Math.max(0.01, zeroPoint));
              const hash = Math.abs(Math.sin(px * 12.9898 + py * 78.233) * 43758.5453) % 1;

              if (hash <= localDensity) {
                const localAlpha = Math.max(0.05, localDensity); // Sfuma l'opacità seguendo la densità
                points.push({ x, y, col: colIndex, row: rowIndex, alpha: localAlpha });
              }
            }
          }
        }
      }

      cachedPointsRef.current = points;
      cacheKeyRef.current = geomKey;
    }

      ctx.fillStyle = colorText || '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `800 ${effectiveFSize}px ${microFontFamily}`;

      const cleanMicro = microText.replace(/\s+/g, '•').toUpperCase();
      const chars = cleanMicro;

      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        const colIdx = pt.col !== undefined ? pt.col : i;
        const rowIdx = pt.row !== undefined ? pt.row : 0;

        // Distribuzione pseudo-randomica deterministica dei caratteri (matrice /type):
        // Elimina al 100% le righe diagonali, le colonne verticali e qualsiasi artefatto di moiré,
        // garantendo una texture tipografica perfettamente omogenea e organica su tutto il canvas.
        const hash = Math.abs(Math.sin(colIdx * 12.9898 + rowIdx * 78.233 + 37.1) * 43758.5453);
        const charIdx = Math.floor((hash % 1) * chars.length) % chars.length;
        const ch = chars[charIdx];

        const finalAlpha = baseAlpha * (pt.alpha !== undefined ? pt.alpha : 1.0);
        if (finalAlpha < 0.999) {
          ctx.globalAlpha = Math.max(0, Math.min(1.0, finalAlpha));
          ctx.fillText(ch, pt.x, pt.y);
          ctx.globalAlpha = 1.0;
        } else {
          ctx.fillText(ch, pt.x, pt.y);
        }
      }
    };

    // Immediato primo rendering
    generateAndDraw();

    // Trigger font load per rendering ad alta definizione se il font non è ancora pronto
    if (typeof document !== 'undefined' && document.fonts) {
      try {
        const primaryFont = (macroFontFamily || '').split(',')[0].replace(/['"]/g, '').trim() || 'Tifata Display';
        const fontSpec = `${macroWeight} 40px "${primaryFont}"`;
        if (!document.fonts.check(fontSpec)) {
          document.fonts.load(fontSpec)
            .then(() => isMounted && generateAndDraw())
            .catch(() => {});
        }
      } catch (e) {
        // Fallback tranquillo
      }
    }

    return () => {
      isMounted = false;
    };
  }, [
    macroText,
    subText,
    microText,
    colorText,
    colorBg,
    maskShape,
    fillMode,
    strokeWidth,
    w,
    h,
    step,
    fSize,
    macroWeight,
    macroFontFamily,
    microFontFamily,
    align,
    isNegative,
    shadeProgress,
    tessellate,
    avoidOtherNodes,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    avoidOtherNodes ? JSON.stringify(otherNodes?.map(n => ({ id: n.id, x: n.x, y: n.y, width: n.width, height: n.height }))) : 'none',
    avoidOtherNodes ? nodePos?.x : 0,
    avoidOtherNodes ? nodePos?.y : 0,
    nodePos?.id,
    textOpacity,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={w}
      height={h}
      className={`select-none cursor-default pointer-events-none ${className}`}
      style={{
        width: `${displayWidth}px`,
        height: `${displayHeight}px`,
        opacity: Math.max(0, Math.min(100, Number(textOpacity ?? 100))) / 100,
        ...style,
      }}
    />
  );
};

export default TypeInTypeAvatar;
