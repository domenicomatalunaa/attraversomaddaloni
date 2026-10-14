/*!
 * =========================================================================
 * ATTRAVERSO MADDALONI - EDITOR DI LAYOUT NATIVO
 * =========================================================================
 * Questo software è un prodotto digitale originale sviluppato nell'ambito
 * della tesi di laurea triennale in Design della Comunicazione Visiva
 * presso l'Accademia di Belle Arti di Napoli (ABANA).
 * 
 * Progetto, Ricerca e Sviluppo: Domenico Mataluna (Tesista)
 * Relatrice: Prof.ssa Paola Tuccillo
 * Co-relatore: Alessandro Tartaglia
 * Anno Accademico / Data di Rilascio: 2026
 * 
 * =========================================================================
 * TUTELA LEGALE E DIRITTO D'AUTORE
 * =========================================================================
 * © 2026 Domenico Mataluna. Tutti i diritti riservati.
 * 
 * Tutti gli asset, i vincoli logici di layout, i motori di generazione,
 * il codice sorgente (HTML, CSS, JS) e le integrazioni del carattere 
 * tipografico "Mataluna" sono di proprietà esclusiva dell'autore e sono
 * tutelati dalla normativa internazionale sul Diritto d'Autore.
 * 
 * È SEVERAMENTE VIETATO:
 * - Copiare, clonare, riprodurre o ridistribuire questo codice (o parti di esso).
 * - Utilizzare il software per scopi commerciali o per l'alimentazione di modelli IA.
 * - Rivendere, modificare senza autorizzazione o rimuovere la presente nota.
 * 
 * Qualsiasi utilizzo non espressamente autorizzato per iscritto dall'autore 
 * sarà perseguibile a norma di legge.
 * =========================================================================
 */
import { loadSavedState, saveState } from './preset.js';
import { initUI } from './ui.js?v=9';
import { buildSVG } from './render.js?v=9';
import { loadUploadedLogo } from './assets.js';

// Stato globale dell'applicazione
let state;

// Cache per precaricamento asset in Base64 (evita CORS e canvas taint)
const cachedAssets = {};

/**
 * Precarica tutti gli asset statici (sfondi e watermark) in Base64
 */
async function preloadAppAssets() {
  const assetsToLoad = {
    'assets/backgrounds/bg_nero.png': 'assets/backgrounds/bg_nero.png',
    'assets/backgrounds/bg_verde.png': 'assets/backgrounds/bg_verde.png',
    'assets/backgrounds/bg_crema.png': 'assets/backgrounds/bg_crema.png',
    'assets/backgrounds/bg_rosso.png': 'assets/backgrounds/bg_rosso.png',
    'assets/maddaloni-complesso.png': 'assets/maddaloni-complesso.png',
    'assets/maddaloni-esteso.png': 'assets/maddaloni-esteso.png',
  };

  const promises = Object.keys(assetsToLoad).map(async (key) => {
    try {
      const response = await fetch(assetsToLoad[key]);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const blob = await response.blob();
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      cachedAssets[key] = base64;
    } catch (err) {
      console.warn("Impossibile precaricare l'asset in Base64:", key, err);
      cachedAssets[key] = key; // Fallback al percorso relativo
    }
  });

  await Promise.all(promises);
}

// Parametri di zoom e navigazione (Figma-style)
let zoomScale = 1.0;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startX, startY;

// Elementi DOM chiave
const artboard = document.getElementById('artboard');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('mainArtboardContainer');
const btnExport = document.getElementById('exportPngBtn');

const zoomRange = document.getElementById('zoomRange');
const zoomValLabel = document.getElementById('zoomVal');
const btnResetZoom = document.getElementById('resetZoom');

/**
 * Initializes the entire application
 */
async function init() {
  // 1. Carica lo stato (precedente o di default)
  state = loadSavedState();

  // Precarica gli sfondi e watermark in Base64 prima dell'UI
  await preloadAppAssets();

  // 2. Inizializza i controlli dell'interfaccia utente (Sidebar)
  initUI(state, () => {
    // Callback di aggiornamento: salva lo stato e ridisegna
    saveState(state);
    draw();
  });

  // 3. Imposta le dimensioni iniziali del canvas di anteprima
  updateCanvasSize();

  // 4. Configura i controlli di zoom e pan
  initNavigation();

  // 5. Primo disegno dell'anteprima
  draw();
  
  // 6. Imposta lo zoom iniziale fisso (15% per A4 su mobile, 25% altrimenti)
  setTimeout(() => {
    let initialZoom = 25;
    if (state.pageSize === 'A4' && window.innerWidth <= 768) {
      initialZoom = 15;
    }
    
    zoomScale = initialZoom / 100;
    zoomScale = initialZoom / 100;
    translateX = 0;
    translateY = 0;
    zoomRange.value = initialZoom;
    zoomValLabel.textContent = `${initialZoom}%`;
    updateArtboardTransform();
  }, 100);
}

/**
 * Updates the preview canvas dimensions according to current state.
 */
function updateCanvasSize() {
  canvas.width = state.canvasW;
  canvas.height = state.canvasH;
  
  artboard.style.width = `${state.canvasW}px`;
  artboard.style.height = `${state.canvasH}px`;
  
  // Imposta lo zoom intelligente ad ogni cambio formato
  let targetZoom = 25;
  if (state.pageSize === 'A4' && window.innerWidth <= 768) {
    targetZoom = 15;
  }
  
  zoomScale = targetZoom / 100;
  translateX = 0;
  translateY = 0;
  zoomRange.value = targetZoom;
  zoomValLabel.textContent = `${targetZoom}%`;
  updateArtboardTransform();
}

/**
 * Renders the current state into the SVG preview and updates the Canvas.
 */
function draw() {
  // Garantisce che il canvas abbia sempre la dimensione corretta del preset
  if (canvas.width !== state.canvasW || canvas.height !== state.canvasH) {
    updateCanvasSize();
  }

  // Clona lo stato per iniettare i Base64 senza sporcare localStorage
  const drawState = { ...state };
  if (drawState.bgImage && cachedAssets[drawState.bgImage]) {
    drawState.bgImage = cachedAssets[drawState.bgImage];
  }
  if (drawState.watermarkType && drawState.watermarkType !== 'none') {
    const wmPath = drawState.watermarkType === 'stemma' ? 'assets/maddaloni-complesso.png' : 'assets/maddaloni-esteso.png';
    if (cachedAssets[wmPath]) {
      drawState.watermarkDataURL = cachedAssets[wmPath];
    }
  }

  // Genera l'SVG vettoriale dallo stato corrente con i Base64 inlined
  const svgString = buildSVG(drawState);
  
  // Converte l'SVG in Blob e lo carica in un'immagine per disegnare sul Canvas
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  const img = new Image();
  img.onload = () => {
    URL.revokeObjectURL(url);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
  img.onerror = (e) => {
    console.error("Errore nel caricamento del render SVG:", e);
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

/**
 * High-resolution JPEG export pipeline
 */
function exportJPEG() {
  const inputName = document.getElementById('exportFilename');
  const baseName = inputName ? (inputName.value.trim() || 'Locandina_Maddaloni') : 'Locandina_Maddaloni';
  
  // Mostra un feedback visivo sul bottone
  const originalText = btnExport.innerHTML;
  btnExport.disabled = true;
  btnExport.style.opacity = '0.7';
  btnExport.innerHTML = `
    <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
    </svg>
    Generazione...
  `;

  setTimeout(() => {
    // Clona lo stato per iniettare i Base64 per l'esportazione pulita
    const drawState = { ...state };
    if (drawState.bgImage && cachedAssets[drawState.bgImage]) {
      drawState.bgImage = cachedAssets[drawState.bgImage];
    }
    if (drawState.watermarkType && drawState.watermarkType !== 'none') {
      const wmPath = drawState.watermarkType === 'stemma' ? 'assets/maddaloni-complesso.png' : 'assets/maddaloni-esteso.png';
      if (cachedAssets[wmPath]) {
        drawState.watermarkDataURL = cachedAssets[wmPath];
      }
    }

    // Genera l'SVG
    const svgString = buildSVG(drawState);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      // La risoluzione del preset contiene già il PPI perfetto (es. A4 = 2480x3508 per 300 PPI tipografici)
      const scale = 1;
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = state.canvasW * scale;
      exportCanvas.height = state.canvasH * scale;
      
      const exportCtx = exportCanvas.getContext('2d');
      // Riempiamo lo sfondo di bianco prima di incollare l'SVG, per evitare sfondi neri in caso di trasparenze residue nel JPEG
      exportCtx.fillStyle = '#FFFFFF';
      exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      
      exportCtx.scale(scale, scale);
      exportCtx.drawImage(img, 0, 0);
      
      // Crea il link di download come JPEG Altissima Qualità (95%)
      const dataURL = exportCanvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.download = `${baseName}.jpg`;
      link.href = dataURL;
      link.click();
      
      // Ripristina lo stato del bottone
      btnExport.disabled = false;
      btnExport.style.opacity = '1';
      btnExport.innerHTML = originalText;
    };
    img.onerror = () => {
      alert("Si è verificato un errore durante l'esportazione.");
      URL.revokeObjectURL(url);
      btnExport.disabled = false;
      btnExport.style.opacity = '1';
      btnExport.innerHTML = originalText;
    };
    img.src = url;
  }, 100);
}

// Binda il pulsante di esportazione
btnExport.addEventListener('click', exportJPEG);

// ==========================================================================
// SISTEMA DI NAVIGAZIONE, DRAG & ZOOM (FIGMA STYLE)
// ==========================================================================

function updateArtboardTransform() {
  artboard.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomScale})`;
}

function initNavigation() {
  // Zoom tramite slider
  zoomRange.addEventListener('input', () => {
    zoomScale = parseFloat(zoomRange.value) / 100;
    zoomValLabel.textContent = `${Math.round(zoomScale * 100)}%`;
    updateArtboardTransform();
  });

  // Tasto reset zoom (adatta)
  btnResetZoom.addEventListener('click', () => {
    fitToScreen();
  });

  // Drag to pan (Trascina per spostare) - MOUSE
  container.addEventListener('mousedown', (e) => {
    // Inizia il drag solo se si clicca sullo sfondo o sull'artboard direttamente
    if (e.target === container || e.target === artboard || e.target === canvas) {
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      container.style.cursor = 'grabbing';
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      updateArtboardTransform();
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    container.style.cursor = 'grab';
  });

  // Drag to pan (Trascina per spostare) - TOUCH MOBILE
  container.addEventListener('touchstart', (e) => {
    if (e.target === container || e.target === artboard || e.target === canvas) {
      isDragging = true;
      const touch = e.touches[0];
      startX = touch.clientX - translateX;
      startY = touch.clientY - translateY;
    }
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (isDragging) {
      if (e.cancelable) e.preventDefault(); // BLOCCO SCROLLING NATIVO
      const touch = e.touches[0];
      translateX = touch.clientX - startX;
      translateY = touch.clientY - startY;
      updateArtboardTransform();
    }
  }, { passive: false });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Zoom tramite scroll della rotella del mouse (con tasto Ctrl/Cmd premuto)
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    if (e.deltaY < 0) {
      // Zoom In
      zoomScale = Math.min(2.0, zoomScale * zoomFactor);
    } else {
      // Zoom Out
      zoomScale = Math.max(0.05, zoomScale / zoomFactor);
    }
    
    // Aggiorna lo slider e la label
    zoomRange.value = Math.round(zoomScale * 100);
    zoomValLabel.textContent = `${Math.round(zoomScale * 100)}%`;
    updateArtboardTransform();
  }, { passive: false });
}

/**
 * Automatically fits the artboard within the visible area of the preview pane.
 */
function fitToScreen() {
  const containerW = container.clientWidth;
  const containerH = container.clientHeight;
  
  // Margine di respiro attorno all'artboard
  const padding = 40;
  const targetW = containerW - padding;
  const targetH = containerH - padding;
  
  const scaleW = targetW / state.canvasW;
  const scaleH = targetH / state.canvasH;
  
  // Prendi la scala minima per garantire che l'artboard sia interamente visibile
  zoomScale = Math.min(scaleW, scaleH);
  
  // Limita lo zoom tra 5% e 200%
  zoomScale = Math.max(0.05, Math.min(2.0, zoomScale));
  
  // Centra l'artboard
  translateX = 0;
  translateY = 0;
  
  // Aggiorna slider e label
  zoomRange.value = Math.round(zoomScale * 100);
  zoomValLabel.textContent = `${Math.round(zoomScale * 100)}%`;
  
  updateArtboardTransform();
}

// Ridimensionamento della finestra
window.addEventListener('resize', () => {
  fitToScreen();
});

// Boot dell'app all'avvio
document.addEventListener('DOMContentLoaded', init);
