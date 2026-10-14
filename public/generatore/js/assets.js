// Preloads image assets and converts them to safe DataURLs to avoid canvas taint errors

/**
 * Loads an image from a URL and converts it to a Base64 data URL.
 * @param {string} url 
 * @returns {Promise<{dataURL: string, ratio: number}>}
 */
export function preloadLogo(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        
        const dataURL = canvas.toDataURL("image/png");
        const ratio = img.naturalHeight / img.naturalWidth;
        resolve({ dataURL, ratio });
      } catch (err) {
        reject(new Error("Errore nel convertire il logo in Base64: " + err.message));
      }
    };
    img.onerror = () => {
      reject(new Error(`Impossibile caricare l'immagine del logo da: ${url}`));
    };
    img.src = url;
  });
}

/**
 * Reads a local file from a file input as a Base64 Data URL.
 * @param {File} file 
 * @returns {Promise<{dataURL: string, ratio: number}>}
 */
export function loadUploadedLogo(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataURL = e.target.result;
      const img = new Image();
      img.onload = () => {
        const ratio = img.naturalHeight / img.naturalWidth;
        
        // Auto-downscaling per ottimizzare la memoria (Max 400px larghezza)
        const maxW = 400;
        let finalDataURL = dataURL;
        
        if (img.naturalWidth > maxW) {
          const canvas = document.createElement("canvas");
          canvas.width = maxW;
          canvas.height = Math.round(maxW * ratio);
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          finalDataURL = canvas.toDataURL("image/png");
        }
        
        resolve({ dataURL: finalDataURL, ratio });
      };
      img.onerror = () => reject(new Error("Errore nel caricare l'immagine caricata"));
      img.src = dataURL;
    };
    reader.onerror = () => reject(new Error("Errore nella lettura del file"));
    reader.readAsDataURL(file);
  });
}
