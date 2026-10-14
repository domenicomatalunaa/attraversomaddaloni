import { CONFIG } from "./config.js";

/**
 * Returns the default initial state for the application.
 */
export function getInitialState() {
  return {
    layout: "align_left",
    pageSize: "social_instagram",
    canvasW: 1080,
    canvasH: 1440,
    margins: { top: 100, right: 80, bottom: 100, left: 80 },
    
    content: {
      titolo: "TITOLO CARD",
      sottotitolo: "Questo è il sottotitolo della card",
      data: "18 MAGGIO 2026",
    },
    
    // Visibilità campi di testo e formattazione
    showDate: true,
    showTitle: true,
    showSubtitle: true,
    boldTitle: true,
    boldData: true,
    boldSubtitle: false,
    italicTitle: false,
    italicData: false,
    italicSubtitle: false,
    compressDate: false,

    // Misure tipografiche vincolate ("small" | "medium" | "large")
    sizes: {
      titolo: "medium",
      sottotitolo: "medium",
      data: "medium",
    },
    
    lineHeightRatio: {
      titolo: CONFIG.typography.lineHeightMult.titolo,
      sottotitolo: CONFIG.typography.lineHeightMult.sottotitolo,
      data: CONFIG.typography.lineHeightMult.data,
    },
    
    // Spaziature vincolate ("small" | "medium" | "large")
    spacings: {
      betweenDateTitle: "medium",
      betweenTitleSubtitle: "medium",
    },
    
    bgColor: "#FFFFFF",
    bgImage: "", // Nessuno sfondo PNG predefinito di base (tinta unita)
    textColor: "#1A1A1A",
    
    watermarkType: "stemma",
    watermarkPos: "bottom_right",
    watermarkOpacity: CONFIG.watermark.defaultOpacity,
    
    showLogo: false,
    logoParams: {
      size: "medium",
      align: "right",
      vpos: "bottom",
      gapRatio: 0.04,
      paddingRatio: 0,
      holdingRatio: 0,
    },
    logoDataURL: null,
    logoIsCustom: false,
    logoRatio: 0.3,
    
    showQr: false,
    qrParams: {
      defaultUrl: CONFIG.qrcode.defaultUrl,
      size: "medium",
      spacing: "medium",
      vpos: "after-text",
      align: "center",
    }
  };
}

/**
 * Loads the saved state from localStorage, or falls back to initial state.
 */
export function loadSavedState() {
  const saved = localStorage.getItem("social_generator_state_v2");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Migrazione difensiva per layout vecchi ed estensione stato
      if (!parsed.content) parsed.content = {};
      
      // Mappatura vecchi layout ai nuovi allineamenti puri
      if (parsed.layout === "brutalist_left" || parsed.layout === "frase" || parsed.layout === "frase_centrata") {
        parsed.layout = "align_left";
      }
      if (parsed.layout === "editorial_serif" || parsed.layout === "titolo_sotto") {
        parsed.layout = "align_center";
      }
      if (parsed.layout === "split_grid" || parsed.layout === "completo") {
        parsed.layout = "align_right";
      }
      
      if (parsed.showDate === undefined) parsed.showDate = true;
      if (parsed.showTitle === undefined) parsed.showTitle = true;
      if (parsed.showSubtitle === undefined) parsed.showSubtitle = true;
      if (parsed.boldTitle === undefined) parsed.boldTitle = true;
      if (parsed.boldData === undefined) parsed.boldData = true;
      if (parsed.boldSubtitle === undefined) parsed.boldSubtitle = false;
      if (parsed.italicTitle === undefined) parsed.italicTitle = false;
      if (parsed.italicData === undefined) parsed.italicData = false;
      if (parsed.italicSubtitle === undefined) parsed.italicSubtitle = false;
      if (parsed.compressDate === undefined) parsed.compressDate = false;

      // Inizializza i parametri di grandezza e spaziatura vincolati
      if (!parsed.sizes) {
        parsed.sizes = {
          titolo: "medium",
          sottotitolo: "medium",
          data: "medium",
        };
      }
      if (!parsed.spacings) {
        parsed.spacings = {
          betweenDateTitle: "medium",
          betweenTitleSubtitle: "medium",
        };
      }

      if (parsed.bgImage === undefined) parsed.bgImage = "";
      if (parsed.watermarkType === undefined || parsed.watermarkType === "none") parsed.watermarkType = "stemma";
      if (parsed.watermarkPos === undefined) parsed.watermarkPos = "bottom_right";
      if (parsed.watermarkPos === "center") parsed.watermarkPos = "bottom_center";
      parsed.watermarkOpacity = CONFIG.watermark.defaultOpacity; // opacità sempre forzata a 45%
      
      // Inizializza parametri logo
      if (!parsed.logoParams) {
        parsed.logoParams = {
          size: "medium",
          align: "right",
          vpos: "bottom",
          gapRatio: 0.04,
          paddingRatio: 0,
          holdingRatio: 0,
        };
      }
      if (parsed.logoParams.size === undefined) parsed.logoParams.size = "medium";
      if (parsed.logoParams.align === undefined) parsed.logoParams.align = "right";

      // Migrazione logoIsCustom per ripulire vecchi placeholder PNG salvati in localStorage
      if (parsed.logoIsCustom === undefined) {
        parsed.logoIsCustom = false;
        parsed.logoDataURL = null; // Forza la pulizia del vecchio logo di default PNG, mostrando l'SVG!
      }

      // Inizializza parametri QR
      if (!parsed.qrParams) {
        parsed.qrParams = {
          defaultUrl: CONFIG.qrcode.defaultUrl,
          size: "medium",
          spacing: "medium",
          vpos: "after-text",
          align: "center",
        };
      }
      if (parsed.qrParams.size === undefined) parsed.qrParams.size = "medium";
      if (parsed.qrParams.spacing === undefined) parsed.qrParams.spacing = "medium";
      if (parsed.qrParams.vpos === undefined) parsed.qrParams.vpos = "after-text";
      if (parsed.qrParams.align === undefined) parsed.qrParams.align = "center";

      return parsed;
    } catch (e) {
      console.error("Errore nel caricare lo stato salvato, uso i default:", e);
    }
  }
  return getInitialState();
}

/**
 * Saves the current state object to localStorage.
 */
export function saveState(state) {
  try {
    localStorage.setItem("social_generator_state_v2", JSON.stringify(state));
  } catch (e) {
    console.warn("Spazio localStorage esaurito per i dati del logo, salvo senza logoURL");
    const temp = { ...state, logoDataURL: null };
    localStorage.setItem("social_generator_state_v2", JSON.stringify(temp));
  }
}
