import { CONFIG } from './config.js';
import { wrapWithHardBreaks, escapeXML } from './wrap.js';
import { qrcode } from './qrcode.js';

/**
 * Utility per convertire date testuali italiane (es. "18 MAGGIO 2026") in formato numerico compatto (es. "18/05/2026")
 */
function formatCompressedDate(dateStr) {
  if (!dateStr) return "";
  const s = dateStr.trim().toLowerCase();
  if (/^\d+[\/\-\.]\d+[\/\-\.]\d+$/.test(s)) return dateStr;
  
  const months = {
    gennaio: '01', febbraio: '02', marzo: '03', aprile: '04', maggio: '05', giugno: '06',
    luglio: '07', agosto: '08', settembre: '09', ottobre: '10', novembre: '11', dicembre: '12',
    gen: '01', feb: '02', mar: '03', apr: '04', mag: '05', giu: '06',
    lug: '07', ago: '08', set: '09', ott: '10', nov: '11', dic: '12'
  };
  
  const parts = s.split(/\s+/);
  if (parts.length >= 2) {
    const day = parts[0].padStart(2, '0');
    const monthName = parts[1];
    const month = months[monthName] || '05';
    let year = parts[2] || new Date().getFullYear().toString();
    if (year.length === 2) year = '20' + year;
    return `${day}/${month}/${year}`;
  }
  return dateStr;
}

export function buildSVG(state, opts = {}) {
  const { 
    margins, 
    sizes, 
    spacings, 
    logoParams, 
    qrParams, 
    content, 
    textColor, 
    bgColor, 
    bgImage,
    watermarkType,
    watermarkPos,
    showLogo, 
    showQr,
    canvasW, 
    canvasH, 
    logoDataURL, 
    logoRatio,
    showDate,
    showTitle,
    showSubtitle,
    boldTitle,
    boldData,
    compressDate
  } = state;
  
  const showGuides = !!opts.showGuides;

  const W = canvasW, H = canvasH;
  const contentW = W - margins.left - margins.right;
  const contentH = H - margins.top - margins.bottom;
  const cx = W / 2;

  // Recupera i parametri di dimensione e spaziatura vincolati
  const curSizes = sizes || { data: "medium", titolo: "medium", sottotitolo: "medium" };
  const curSpacings = spacings || { betweenDateTitle: "medium", betweenTitleSubtitle: "medium" };

  const ratioTitle = CONFIG.typography.sizes.titolo[curSizes.titolo || 'medium'] || 0.08;
  const ratioSub = CONFIG.typography.sizes.sottotitolo[curSizes.sottotitolo || 'medium'] || 0.04;
  const ratioDate = CONFIG.typography.sizes.data[curSizes.data || 'medium'] || 0.03;

  const ratioSpaceDateTitle = CONFIG.typography.spacings.betweenDateTitle[curSpacings.betweenDateTitle || 'medium'] || 0.03;
  const ratioSpaceTitleSubtitle = CONFIG.typography.spacings.betweenTitleSubtitle[curSpacings.betweenTitleSubtitle || 'medium'] || 0.04;

  // Conversione delle dimensioni dei font in pixel reali
  const fsTitle = Math.round(W * ratioTitle);
  const fsSub   = Math.round(W * ratioSub);
  const fsDate  = Math.round(W * ratioDate);

  // Calcolo delle interlinee basate sui moltiplicatori armonici in CONFIG
  const lhTitle = Math.round(fsTitle * CONFIG.typography.lineHeightMult.titolo);
  const lhSub   = Math.round(fsSub   * CONFIG.typography.lineHeightMult.sottotitolo);
  const lhDate  = Math.round(fsDate  * CONFIG.typography.lineHeightMult.data);

  const parts = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`);
  
  // Stili CSS incorporati nell'SVG
  parts.push(`<style><![CDATA[
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,700;0,900;1,400;1,500;1,700;1,900&display=swap');
.t-title           { font-family:'Inter', sans-serif; font-style:${state.italicTitle ? 'italic' : 'normal'}; font-weight:${boldTitle !== false ? '900' : '400'}; fill:${textColor}; }
.t-editorial-title { font-family:'Inter', sans-serif; font-style:${state.italicTitle ? 'italic' : 'normal'}; font-weight:${boldTitle !== false ? '900' : '500'}; text-transform:uppercase; letter-spacing:0.04em; fill:${textColor}; }
.t-sub             { font-family:'Inter', sans-serif; font-style:${state.italicSubtitle ? 'italic' : 'normal'}; font-weight:${state.boldSubtitle === true ? '900' : '400'}; fill:${textColor}; }
.t-date            { font-family:'Inter', sans-serif; font-style:${state.italicData ? 'italic' : 'normal'}; font-weight:${boldData !== false ? '900' : '500'}; text-transform:uppercase; letter-spacing:0.08em; fill:${textColor}; }
.guide             { fill:none; stroke:#FF0055; stroke-width:2; stroke-dasharray:4 4; }
]]></style>`);

  // Sfondo
  parts.push(`<rect width="100%" height="100%" fill="${bgColor}"/>`);

  if (bgImage) {
    parts.push(`<image href="${bgImage}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" />`);
  }

  const contentRect = { left: margins.left, top: margins.top, width: contentW, height: contentH };
  const layout = state.layout || 'align_left';

  // Watermark Istituzionale Maddaloni (allineato manualmente tramite selettore, completamente svincolato da logiche di layout)
  let activeWatermarkRect = null;
  if (watermarkType && watermarkType !== 'none' && state.showWatermark !== false) {
    const wmFile = state.watermarkDataURL || (watermarkType === 'stemma' ? 'assets/maddaloni-complesso.png' : 'assets/maddaloni-esteso.png');
    const isStemma = watermarkType === 'stemma';
    
    const wmW = Math.round(W * (isStemma ? 0.14 : 0.26));
    const wmH = Math.round(wmW * (isStemma ? 1.0 : 0.25));
    
    let wmX = 0, wmY = 0;
    const pos = watermarkPos || 'bottom_right';
    
    if (pos === 'bottom_right') {
      wmX = W - margins.right - wmW;
      wmY = H - margins.bottom - wmH;
    } else if (pos === 'bottom_left') {
      wmX = margins.left;
      wmY = H - margins.bottom - wmH;
    } else if (pos === 'top_left') {
      wmX = margins.left;
      wmY = margins.top;
    } else if (pos === 'bottom_center') {
      wmX = (W - wmW) / 2;
      wmY = H - margins.bottom - wmH;
    }
    
    activeWatermarkRect = { pos, x: wmX, y: wmY, w: wmW, h: wmH };
    parts.push(`<image href="${wmFile}" x="${wmX}" y="${wmY}" width="${wmW}" height="${wmH}" opacity="0.45" preserveAspectRatio="xMidYMid meet" />`);
  }

  // Calcoli QR con Piccolo/Medio/Grande
  const curQrSize = qrParams.size || 'medium';
  const curQrSpacing = qrParams.spacing || 'medium';
  const ratioQrSize = CONFIG.qrcode.sizes[curQrSize] || 0.12;
  const ratioQrSpacing = CONFIG.qrcode.spacings[curQrSpacing] || 0.06;

  const qrSize = layout === 'qr_focus' ? Math.round(W * 0.22) : Math.round(W * ratioQrSize);
  const qrGapPx = Math.round(W * ratioQrSpacing);

  // Calcoli Logo
  const wantLogoBlock = showLogo;
  let logoBlockInfo = null;
  if (wantLogoBlock) {
    const curLogoSize = logoParams.size || 'medium';
    const ratioLogoSize = CONFIG.logo.sizes[curLogoSize] || 0.18;

    const pad = Math.round(W * (logoParams.paddingRatio || 0));
    const usableW = contentW - 2 * pad;
    const desiredW = Math.min(usableW, Math.round(W * ratioLogoSize));
    const activeLogoRatio = logoDataURL ? (logoRatio || 0.3) : 1.0;
    const desiredH = Math.round(desiredW * activeLogoRatio);
    logoBlockInfo = { 
      type: 'logo', 
      w: desiredW, 
      h: desiredH, 
      align: logoParams.align || 'right',
      paddingPx: pad,
      gapPx: Math.round(W * logoParams.gapRatio)
    };
  }

  // Calcoli QR (attivato forzatamente in layout qr_focus per dare risalto al QR)
  const activeQrUrl = qrParams.defaultUrl || CONFIG.qrcode.defaultUrl || 'https://www.comune.maddaloni.caserta.it';
  const wantQrBlock = (showQr && activeQrUrl) || (layout === 'qr_focus');
  let qrBlockInfo = null;
  if (wantQrBlock) {
    qrBlockInfo = {
      type: 'qr',
      matrix: qrcode.create(activeQrUrl, 'M'),
      size: qrSize,
      align: layout === 'qr_focus' ? 'center' : (qrParams.align || 'center'),
      gapPx: qrGapPx
    };
  }

  // Funzioni interne di disegno SVG
  const renderTextBlock = (lines, className, fontSize, lineHeight, topY, align = 'middle') => {
    if (!lines.length) return 0;
    const totalH = lines.length * lineHeight;

    const anchor = align === 'left' ? 'start' : (align === 'right' ? 'end' : 'middle');
    const xCoord = align === 'left' ? contentRect.left : (align === 'right' ? (contentRect.left + contentW) : cx);

    parts.push(`<text class="${className}" font-size="${fontSize}" text-anchor="${anchor}">`);
    for (let i = 0; i < lines.length; i++) {
      const baselineY = topY + (i + 0.5) * lineHeight + (fontSize * 0.32);
      const ln = lines[i];
      const lineContent = (ln === '') ? '&#160;' : escapeXML(ln);
      parts.push(`<tspan x="${xCoord}" y="${baselineY}">${lineContent}</tspan>`);
    }
    parts.push(`</text>`);
    return totalH;
  };

  const renderLogoBlock = (logoInfo, topY) => {
    const { w, h, align, paddingPx, gapPx } = logoInfo;
    const left = contentRect.left + paddingPx;
    const right = contentRect.left + contentRect.width - paddingPx;
    let x;
    
    // SISTEMA ANTI-COLLISIONE INTELLIGENTE (AUTO-GAP)
    // Se il logo si trova allo stesso margine del Watermark Maddaloni, lo affianca applicando un Auto-Gap per prevenire sovrapposizioni!
    let collisionOffset = 0;
    let isBottom = topY > H / 2;
    let isTop = topY < H / 2;
    
    if (activeWatermarkRect) {
      if (isBottom && activeWatermarkRect.pos === 'bottom_right' && align === 'right') {
        collisionOffset = -(activeWatermarkRect.w + gapPx);
      } else if (isBottom && activeWatermarkRect.pos === 'bottom_left' && align === 'left') {
        collisionOffset = (activeWatermarkRect.w + gapPx);
      } else if (isTop && activeWatermarkRect.pos === 'top_left' && align === 'left') {
        collisionOffset = (activeWatermarkRect.w + gapPx);
      } else if (isBottom && activeWatermarkRect.pos === 'bottom_center' && align === 'center') {
        // Se entrambi sono al centro in basso, li shiftiamo per distribuirli armoniosamente
        collisionOffset = -(activeWatermarkRect.w / 2 + gapPx);
      }
    }

    if (align === 'left') x = left + collisionOffset;
    else if (align === 'right') x = right - w + collisionOffset;
    else x = contentRect.left + (contentRect.width - w) / 2 + collisionOffset;

    if (logoDataURL) {
      parts.push(`<image href="${logoDataURL}" x="${x}" y="${topY}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" />`);
    } else {
      // Premium vector SVG placeholder logo matching the Maddaloni aesthetics
      const scale = w / 100;
      parts.push(`
        <g transform="translate(${x}, ${topY}) scale(${scale})" opacity="0.6">
          <circle cx="50" cy="40" r="32" fill="none" stroke="${textColor}" stroke-width="2.5" />
          <path d="M 50 15 L 75 27 L 75 53 L 50 65 L 25 53 L 25 27 Z" fill="none" stroke="${textColor}" stroke-width="2" />
          <path d="M 38 40 Q 50 28 62 40" fill="none" stroke="${textColor}" stroke-width="2.5" />
          <path d="M 50 23 L 50 57" fill="none" stroke="${textColor}" stroke-width="1.5" stroke-dasharray="2 2" />
          <text x="50" y="88" font-family="'Inter', sans-serif" font-size="10" font-weight="700" text-anchor="middle" letter-spacing="0.06em" fill="${textColor}">IL TUO LOGO</text>
        </g>
      `);
    }
    return h;
  };

  const renderQrBlock = (qrInfo, topY) => {
    const { matrix, size, align } = qrInfo;
    const modCount = matrix.length;
    const modSize = size / modCount;
    
    let left;
    if (align === 'left') left = contentRect.left;
    else if (align === 'right') left = contentRect.left + contentRect.width - size;
    else left = cx - size / 2;

    for (let r = 0; r < modCount; r++) {
      for (let c = 0; c < modCount; c++) {
        if (matrix[r][c]) {
          parts.push(`<rect x="${left + c * modSize}" y="${topY + r * modSize}" width="${modSize + 0.5}" height="${modSize + 0.5}" fill="${textColor}" />`);
        }
      }
    }
    return size;
  };

  // Impagina il flusso di testo verticale
  const renderFlowGroup = (blocks, spacingsPx) => {
    const heights = blocks.map(b => {
      if (b.type === 'text') return b.lines.length * b.lineHeight;
      if (b.type === 'qr') return b.size;
      if (b.type === 'logo') return b.h;
      return 0;
    });
    const totalSpacing = spacingsPx.reduce((a, b) => a + b, 0);
    const totalH = heights.reduce((a, b) => a + b, 0) + totalSpacing;
    
    let groupTop;
    if (state.textVAlign === 'top') {
      groupTop = contentRect.top;
    } else if (state.textVAlign === 'bottom') {
      groupTop = contentRect.top + contentRect.height - totalH;
    } else {
      // Default: Center
      groupTop = contentRect.top + (contentRect.height - totalH) / 2;
    }
    
    let y = groupTop;
    
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      let consumed = 0;
      if (b.type === 'text') consumed = renderTextBlock(b.lines, b.className, b.fontSize, b.lineHeight, y, b.align);
      else if (b.type === 'qr') consumed = renderQrBlock(b, y);
      else if (b.type === 'logo') consumed = renderLogoBlock(b, y);
      y += consumed;
      if (i < spacingsPx.length) y += spacingsPx[i];
    }
  };

  // 6. POSIZIONAMENTO ELEMENTI ACCESSORI ASSOLUTI IN ALTO (A MARGINE)
  if (layout !== 'qr_focus') {
    if (wantQrBlock && qrParams.vpos === 'top') {
      renderQrBlock(qrBlockInfo, contentRect.top);
    }
  }
  if (wantLogoBlock && logoParams.vpos === 'top') {
    renderLogoBlock(logoBlockInfo, contentRect.top);
  }

  // 7. COMPOSIZIONE DEI BLOCCHI DI TESTO DEI TEMPLATE DI ALLINEAMENTO
  const flowBlocks = [];
  const flowSpacings = [];

  const pushFlowBlock = (block) => {
    if (!block) return;
    flowBlocks.push(block);
  };

  const hasDate = showDate !== false && content.data;
  const hasTitle = showTitle !== false && content.titolo;
  const hasSub = showSubtitle !== false && content.sottotitolo;

  let align = 'left';
  if (layout === 'align_center' || layout === 'qr_focus') align = 'middle';
  else if (layout === 'align_right') align = 'right';

  if (hasDate) {
    const rawDate = compressDate ? formatCompressedDate(content.data) : content.data;
    const ld = wrapWithHardBreaks(rawDate, contentW, 'Inter', fsDate, null);
    pushFlowBlock({ id: 'date', type: 'text', lines: ld, className: 't-date', fontSize: fsDate, lineHeight: lhDate, align: align });
  }

  if (hasTitle) {
    const fontName = 'Inter';
    const className = 't-title';
    const lt = wrapWithHardBreaks(content.titolo, contentW, fontName, fsTitle, null);
    pushFlowBlock({ id: 'title', type: 'text', lines: lt, className: className, fontSize: fsTitle, lineHeight: lhTitle, align: align });
  }

  if (hasSub) {
    const ls = wrapWithHardBreaks(content.sottotitolo, contentW, 'Inter', fsSub, null);
    pushFlowBlock({ id: 'subtitle', type: 'text', lines: ls, className: 't-sub', fontSize: fsSub, lineHeight: lhSub, align: align });
  }

  // In qr_focus, forziamo il QR Code nel flusso al centro grande
  if (wantQrBlock && (qrParams.vpos === 'after-text' || layout === 'qr_focus')) {
    const activeQrInfo = {
      ...qrBlockInfo,
      size: layout === 'qr_focus' ? Math.round(W * 0.22) : qrBlockInfo.size,
      align: layout === 'qr_focus' ? 'center' : qrBlockInfo.align
    };
    pushFlowBlock({ id: 'qr', ...activeQrInfo });
  }

  // Calcolo preciso delle spaziazioni sequenziali in base agli ID adiacenti (senza separatore linea)
  for (let i = 0; i < flowBlocks.length - 1; i++) {
    const current = flowBlocks[i];
    const next = flowBlocks[i + 1];
    
    let gap = 0;
    
    // 1. Spaziatura tra DATA e TITOLO
    if (current.id === 'date' && next.id === 'title') {
      gap = Math.round(W * ratioSpaceDateTitle);
    }
    // 2. Spaziatura tra TITOLO e SOTTOTITOLO (layout coerente)
    else if (current.id === 'title' && next.id === 'subtitle') {
      gap = Math.round(W * ratioSpaceTitleSubtitle);
    }
    // 3. Spaziatura tra DATA e SOTTOTITOLO (se il titolo manca)
    else if (current.id === 'date' && next.id === 'subtitle') {
      gap = Math.round(W * ratioSpaceTitleSubtitle);
    }
    // 4. Spaziatura prima del QR code
    else if (next.id === 'qr') {
      gap = qrGapPx;
    }
    
    flowSpacings.push(gap);
  }

  renderFlowGroup(flowBlocks, flowSpacings);

  // 8. POSIZIONAMENTO ELEMENTI ACCESSORI ASSOLUTI IN BASSO (A MARGINE)
  if (wantLogoBlock && logoParams.vpos === 'bottom') {
    renderLogoBlock(logoBlockInfo, contentRect.top + contentRect.height - logoBlockInfo.h);
  }
  if (layout !== 'qr_focus') {
    if (wantQrBlock && qrParams.vpos === 'bottom') {
      renderQrBlock(qrBlockInfo, contentRect.top + contentRect.height - qrBlockInfo.size);
    }
  }

  if (showGuides) {
    parts.push(`<rect class="guide" x="${margins.left}" y="${margins.top}" width="${contentW}" height="${contentH}"/>`);
  }

  parts.push(`</svg>`);
  return parts.join('\n');
}
