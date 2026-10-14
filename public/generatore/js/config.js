// Centralized application configuration
export const CONFIG = {
  pagePresets: {
    social_landscape: {
      name: "Monitor 16:9 (1920x1080)",
      width: 1920,
      height: 1080,
      margins: { top: 120, right: 150, bottom: 120, left: 150 },
    },
    social_instagram: {
      name: "Social Instagram (1080x1440)",
      width: 1080,
      height: 1440,
      margins: { top: 100, right: 80, bottom: 100, left: 80 },
    },
    social_square: {
      name: "Social Quadrato (1080x1080)",
      width: 1080,
      height: 1080,
      margins: { top: 80, right: 80, bottom: 80, left: 80 },
    },
    A4: {
      name: "A4 Poster (2480x3508)",
      width: 2480,
      height: 3508,
      margins: { top: 250, right: 200, bottom: 250, left: 200 },
    },
  },
  layouts: {
    align_left: {
      name: "Allineamento a sinistra",
      fields: ["data", "titolo", "sottotitolo"],
    },
    align_center: {
      name: "Allineamento al centro",
      fields: ["data", "titolo", "sottotitolo"],
    },
    align_right: {
      name: "Allineamento a destra",
      fields: ["data", "titolo", "sottotitolo"],
    },
    qr_focus: {
      name: "Focus QR Code (Grande al centro)",
      fields: ["data", "titolo", "sottotitolo"],
    }
  },
  typography: {
    // Proporzioni tipografiche fisse (piccolo, medio, grande) relative alla larghezza del canvas
    sizes: {
      titolo: {
        small: 0.06,
        medium: 0.08,
        large: 0.11,
      },
      sottotitolo: {
        small: 0.03,
        medium: 0.04,
        large: 0.05,
      },
      data: {
        small: 0.022,
        medium: 0.03,
        large: 0.038,
      }
    },
    lineHeightMult: {
      titolo: 1.15,
      sottotitolo: 1.2,
      data: 1.2,
    },
    // Spaziature fisse (piccolo, medio, grande) relative alla larghezza del canvas
    spacings: {
      betweenDateTitle: {
        small: 0.015,
        medium: 0.030,
        large: 0.050,
      },
      betweenTitleSubtitle: {
        small: 0.020,
        medium: 0.040,
        large: 0.065,
      }
    }
  },
  background: {
    defaultColor: "#FFFFFF",
    presets: [
      /* ====================================================================
         GALLERIA SFONDI E TEXTURE
         Per aggiungere nuovi sfondi:
         1. Inserisci la tua foto nella cartella (es. assets/backgrounds/)
         2. Aggiungi una riga qui sotto seguendo lo stesso formato.
         Esempio: { name: "Sfondo Natale", path: "assets/backgrounds/natale.jpg" }
         ==================================================================== */
      { name: "Bianco", color: "#FFFFFF" },
      { name: "Nero", color: "#1A1A1A" },
      { name: "Verde", color: "#2E7D32" },
      { name: "Blu", color: "#1A365D" },
      { name: "Sfondo 1", path: "assets/backgrounds/bg_1.png" },
      { name: "Sfondo 2", path: "assets/backgrounds/bg_2.png" },
      { name: "Sfondo 3", path: "assets/backgrounds/bg_3.png" }
    ]
  },
  watermark: {
    types: [
      { id: "stemma", name: "Logotipo Complesso (Stemma)" },
      { id: "scritta", name: "Logotipo Esteso (Scritta)" }
    ],
    positions: [
      { id: "bottom_right", name: "In basso a destra" },
      { id: "bottom_left", name: "In basso a sinistra" },
      { id: "top_left", name: "In alto a sinistra" },
      { id: "bottom_center", name: "In basso al centro" }
    ],
    defaultOpacity: 0.45
  },
  text: {
    defaultColor: "#1A1A1A",
  },
  logo: {
    enabledByDefault: false,
    sizes: {
      small: 0.12,
      medium: 0.18,
      large: 0.25,
    },
    vpos: "bottom",
    gapRatio: 0.02,
  },
  export: {
    defaultScale: 1,
    maxScale: 5,
  },
  qrcode: {
    enabledByDefault: false,
    defaultUrl: "https://www.comune.maddaloni.caserta.it",
    sizes: {
      small: 0.08,
      medium: 0.12,
      large: 0.18,
    },
    spacings: {
      small: 0.03,
      medium: 0.06,
      large: 0.10,
    },
    vpos: "after-text",
    align: "center",
  },
  palette: [
    { name: "Bianco", hex: "#FFFFFF" },
    { name: "Nero", hex: "#1A1A1A" },
    { name: "Verde", hex: "#2E7D32" },
    { name: "Blu", hex: "#1A365D" }
  ],
};
