import { CONFIG } from './config.js';
import { loadUploadedLogo, preloadLogo } from './assets.js';

export function initUI(state, onChange) {
  const selectPageSize = document.getElementById('pageSize');
  const selectLayout = document.getElementById('layout');
  const bgGallery = document.getElementById('bgGallery');
  
  const checkboxLogo = document.getElementById('toggleLogo');
  const panelLogo = document.getElementById('logoControls');
  const fileLogoInput = document.getElementById('logoImageInput');
  const logoStatus = document.getElementById('logoStatus');
  
  const checkboxQr = document.getElementById('toggleQr');
  const panelQr = document.getElementById('qrControls');
  const inputQrUrl = document.getElementById('qrUrlInput');
  
  const bgPicker = document.getElementById('bgPicker');
  const textPicker = document.getElementById('textPicker');

  const selectWatermarkType = document.getElementById('watermarkType');
  const selectWatermarkPos = document.getElementById('watermarkPos');

  // Elementi Statici di Input e Controlli (Fase 2 + 3)
  const inputData = document.getElementById('inputData');
  const chkShowDate = document.getElementById('showData');
  const chkBoldData = document.getElementById('boldData');
  const chkItalicData = document.getElementById('italicData');
  const chkCompressDate = document.getElementById('compressDate');

  const inputTitle = document.getElementById('inputTitle');
  const chkShowTitle = document.getElementById('showTitle');
  const chkBoldTitle = document.getElementById('boldTitle');
  const chkItalicTitle = document.getElementById('italicTitle');

  const inputSubtitle = document.getElementById('inputSubtitle');
  const chkShowSubtitle = document.getElementById('showSubtitle');
  const chkBoldSubtitle = document.getElementById('boldSubtitle');
  const chkItalicSubtitle = document.getElementById('italicSubtitle');

  // ==========================================================================
  // 0. LOGICA ACCORDION (TENDINE) PER LE SEZIONI
  // ==========================================================================
  const sectionTitles = document.querySelectorAll('.section-title');
  sectionTitles.forEach(title => {
    title.style.cursor = 'pointer';
    title.style.display = 'flex';
    title.style.justifyContent = 'space-between';
    title.style.alignItems = 'center';
    title.innerHTML += ` <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transition: transform 0.2s ease-in-out;"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>`;
    
    // Il titolo si trova dentro .modal-header, quindi dobbiamo prendere i fratelli del .modal-header!
    const headerWrapper = title.closest('.modal-header');
    const contentNodes = [];
    
    if (headerWrapper) {
      let sibling = headerWrapper.nextElementSibling;
      while (sibling) {
        contentNodes.push(sibling);
        sibling = sibling.nextElementSibling;
      }
    }
    
    title.addEventListener('click', () => {
      // SE SIAMO SU MOBILE, IL TITOLO È PARTE DELL'INTESTAZIONE DELLA MODALE. NON DEVE COLLASSARE.
      if (window.innerWidth <= 768) {
        return; 
      }

      // LOGICA ACCORDION DESKTOP
      const isCollapsed = title.classList.toggle('collapsed');
      const chevron = title.querySelector('.chevron');
      if (isCollapsed) {
        chevron.style.transform = 'rotate(-90deg)';
        contentNodes.forEach(el => {
          if (el.style) el.style.display = 'none';
        });
      } else {
        chevron.style.transform = 'rotate(0deg)';
        contentNodes.forEach(el => {
          if (el.style) el.style.display = '';
        });
      }
    });
  });

  // ==========================================================================
  // 0.5 LOGICA MODALI MOBILE (BOTTOM SHEETS E NAVBAR)
  // ==========================================================================
  const mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');
  const modalOverlay = document.getElementById('mobileModalOverlay');
  const closeBtns = document.querySelectorAll('.modal-close-btn');

  function closeAllModals() {
    document.querySelectorAll('.section-group').forEach(sec => sec.classList.remove('modal-open'));
    if (modalOverlay) modalOverlay.classList.remove('active');
    mobileNavBtns.forEach(b => b.classList.remove('active'));
  }

  mobileNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);
      
      // Se è già aperto, lo chiudiamo
      if (targetSection.classList.contains('modal-open')) {
        closeAllModals();
        return;
      }
      
      closeAllModals();
      btn.classList.add('active');
      targetSection.classList.add('modal-open');
      if (modalOverlay) modalOverlay.classList.add('active');
      
      // Espande l'accordion interno in automatico su mobile per non far fare un doppio tap all'utente
      if (targetSection.classList.contains('collapsed')) {
        targetSection.querySelector('.section-title').click();
      }
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeAllModals);
  }

  // ==========================================================================
  // 1. POPOLAMENTO DRAPDOWN DI BASE
  // ==========================================================================
  
  // Popola formati pagina
  selectPageSize.innerHTML = '';
  Object.keys(CONFIG.pagePresets).forEach(key => {
    const preset = CONFIG.pagePresets[key];
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = preset.name;
    if (state.pageSize === key) opt.selected = true;
    selectPageSize.appendChild(opt);
  });

  // Popola layout template
  selectLayout.innerHTML = '';
  Object.keys(CONFIG.layouts).forEach(key => {
    const layout = CONFIG.layouts[key];
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = layout.name;
    if (state.layout === key) opt.selected = true;
    selectLayout.appendChild(opt);
  });


  // ==========================================================================
  // 2. GENERAZIONE DELLE CARTELLE DEI COLORI E CONTRAST CHECKER
  // ==========================================================================
  
  function getLuminance(hex) {
    const hexVal = hex.replace('#', '');
    const r = parseInt(hexVal.substr(0, 2), 16) / 255;
    const g = parseInt(hexVal.substr(2, 2), 16) / 255;
    const b = parseInt(hexVal.substr(4, 2), 16) / 255;
    const a = [r, g, b].map(v => {
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function updateContrastBadge() {
    const warningDiv = document.getElementById('contrastWarning');
    if (!warningDiv) return;
    
    const l1 = getLuminance(state.bgColor);
    const l2 = getLuminance(state.textColor);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    
    if (ratio >= 4.5) {
      warningDiv.innerHTML = `
        <div class="contrast-badge success">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span><strong>Leggibilità Alta (${ratio.toFixed(1)}:1)</strong>. Il contrasto rispetta le linee guida WCAG AA.</span>
        </div>
      `;
    } else {
      warningDiv.innerHTML = `
        <div class="contrast-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span><strong>Contrasto Basso (${ratio.toFixed(1)}:1)</strong>. WCAG AA richiede un rapporto ≥ 4.5:1. Valuta una combinazione di colori più leggibile.</span>
        </div>
      `;
    }
  }

  function renderColorPicker(container, selectedColor, onSelect) {
    container.innerHTML = '';
    CONFIG.palette.forEach(color => {
      const card = document.createElement('div');
      card.className = `color-swatch-card ${selectedColor.toLowerCase() === color.hex.toLowerCase() ? 'selected' : ''}`;
      
      card.innerHTML = `
        <div class="swatch-left">
          <div class="swatch-color-box" style="background-color: ${color.hex}"></div>
          <span class="swatch-name">${color.name}</span>
        </div>
        <div class="swatch-checkmark"></div>
      `;
      
      card.addEventListener('click', () => {
        container.querySelectorAll('.color-swatch-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        onSelect(color.hex);
        updateContrastBadge();
      });
      
      container.appendChild(card);
    });
  }

  renderColorPicker(textPicker, state.textColor, (hex) => {
    state.textColor = hex;
    onChange();
  });

  // Renderizza la Galleria Sfondi Unificata (Colori + Foto)
  function renderBgGallery(container, currentState, onSelect) {
    if(!container) return;
    container.innerHTML = '';
    CONFIG.background.presets.forEach(bg => {
      const card = document.createElement('div');
      
      const isSelected = bg.path 
        ? currentState.bgPath === bg.path 
        : (!currentState.bgPath && currentState.bgColor === bg.color);
        
      card.className = `color-swatch-card ${isSelected ? 'selected' : ''}`;
      
      const thumbStyle = bg.path 
        ? `background-image: url('${bg.path}'); background-size: cover; background-position: center;` 
        : `background-color: ${bg.color}; border: 1px solid #E5E5E5;`;
      
      card.innerHTML = `
        <div class="swatch-left">
          <div class="swatch-color-box" style="${thumbStyle}"></div>
          <span class="swatch-name">${bg.name}</span>
        </div>
        <div class="swatch-checkmark"></div>
      `;
      
      card.addEventListener('click', () => {
        container.querySelectorAll('.color-swatch-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        onSelect(bg);
      });
      container.appendChild(card);
    });
  }

  if(bgGallery) {
    renderBgGallery(bgGallery, state, async (bg) => {
      if (bg.path) {
        state.bgPath = bg.path;
        state.bgColor = '#FFFFFF'; // Sfondo base neutro sotto l'immagine
        // Il bottone UI mostra un loading (opzionale, essendo locale sarà rapido)
        try {
          const { dataURL } = await preloadLogo(bg.path);
          state.bgImage = dataURL;
          onChange();
        } catch(err) {
          console.error("Errore durante il caricamento dello sfondo:", err);
          alert("Si è verificato un errore nel caricamento di questo sfondo.");
        }
      } else {
        state.bgPath = null;
        state.bgImage = null;
        state.bgColor = bg.color;
        onChange();
      }
    });
  }

  // ==========================================================================
  // 3. LISTENERS DI CAMBIO FORMATO E TEMPLATE
  // ==========================================================================
  
  selectPageSize.addEventListener('change', () => {
    const key = selectPageSize.value;
    const preset = CONFIG.pagePresets[key];
    state.pageSize = key;
    state.canvasW = preset.width;
    state.canvasH = preset.height;
    state.margins = { ...preset.margins };
    
    onChange();
  });

  function updateQrControlsState() {
    const isQrFocus = state.layout === 'qr_focus';
    const qrContainers = [
      document.getElementById('selectorSizeQr'),
      document.getElementById('posQrTop'),
      document.getElementById('posQrFlow')
    ];
    qrContainers.forEach(container => {
      if (!container) return;
      const btns = container.querySelectorAll('.size-btn');
      btns.forEach(btn => {
        btn.disabled = isQrFocus;
        if (isQrFocus) {
          btn.style.opacity = '0.3';
          btn.style.cursor = 'not-allowed';
        } else {
          btn.style.opacity = '';
          btn.style.cursor = 'pointer';
        }
      });
    });
  }

  selectLayout.addEventListener('change', () => {
    state.layout = selectLayout.value;
    updateQrControlsState();
    onChange();
  });
  
  // Inizializza lo stato dei bottoni QR all'avvio
  updateQrControlsState();

  // ==========================================================================
  // 4. BINDING VALORI INIZIALI DEI CAMPI TESTO E CHECKBOX NERI
  // ==========================================================================
  
  // Testi
  inputData.value = state.content.data || '';
  inputTitle.value = state.content.titolo || '';
  inputSubtitle.value = state.content.sottotitolo || '';

  // Checkboxes
  chkShowDate.checked = state.showDate;
  chkBoldData.checked = state.boldData;
  if(chkItalicData) chkItalicData.checked = !!state.italicData;
  chkCompressDate.checked = state.compressDate;

  chkShowTitle.checked = state.showTitle;
  chkBoldTitle.checked = state.boldTitle;
  if(chkItalicTitle) chkItalicTitle.checked = !!state.italicTitle;

  chkShowSubtitle.checked = state.showSubtitle;
  chkBoldSubtitle.checked = state.boldSubtitle !== undefined ? state.boldSubtitle : false;
  if(chkItalicSubtitle) chkItalicSubtitle.checked = !!state.italicSubtitle;

  // Listeners Testi
  inputData.addEventListener('input', () => { state.content.data = inputData.value; onChange(); });
  inputTitle.addEventListener('input', () => { state.content.titolo = inputTitle.value; onChange(); });
  inputSubtitle.addEventListener('input', () => { state.content.sottotitolo = inputSubtitle.value; onChange(); });

  // Listeners Checkboxes
  chkShowDate.addEventListener('change', () => { state.showDate = chkShowDate.checked; onChange(); });
  chkBoldData.addEventListener('change', () => { state.boldData = chkBoldData.checked; onChange(); });
  if(chkItalicData) chkItalicData.addEventListener('change', () => { state.italicData = chkItalicData.checked; onChange(); });
  chkCompressDate.addEventListener('change', () => { state.compressDate = chkCompressDate.checked; onChange(); });

  chkShowTitle.addEventListener('change', () => { state.showTitle = chkShowTitle.checked; onChange(); });
  chkBoldTitle.addEventListener('change', () => { state.boldTitle = chkBoldTitle.checked; onChange(); });
  if(chkItalicTitle) chkItalicTitle.addEventListener('change', () => { state.italicTitle = chkItalicTitle.checked; onChange(); });

  chkShowSubtitle.addEventListener('change', () => { state.showSubtitle = chkShowSubtitle.checked; onChange(); });
  chkBoldSubtitle.addEventListener('change', () => { state.boldSubtitle = chkBoldSubtitle.checked; onChange(); });
  if(chkItalicSubtitle) chkItalicSubtitle.addEventListener('change', () => { state.italicSubtitle = chkItalicSubtitle.checked; onChange(); });

  // ==========================================================================
  // 5. REGOLAZIONI DI DIMENSIONE E SPAZIATURA VINCOLATE (PICCOLO/MEDIO/GRANDE)
  // ==========================================================================
  
  function bindSizeSelector(containerId, stateKey) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const buttons = container.querySelectorAll('.size-btn');
    
    // Recupera valore iniziale
    const currentVal = state.sizes[stateKey] || 'medium';
    buttons.forEach(btn => {
      if (btn.getAttribute('data-size') === currentVal) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
      
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.sizes[stateKey] = btn.getAttribute('data-size');
        onChange();
      });
    });
  }

  function bindSpacingSelector(containerId, stateKey) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const buttons = container.querySelectorAll('.size-btn');
    
    const currentVal = state.spacings[stateKey] || 'medium';
    buttons.forEach(btn => {
      if (btn.getAttribute('data-spacing') === currentVal) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
      
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.spacings[stateKey] = btn.getAttribute('data-spacing');
        onChange();
      });
    });
  }

  // Aggancia selettori statici
  bindSizeSelector('selectorSizeData', 'data');
  bindSizeSelector('selectorSizeTitle', 'titolo');
  bindSizeSelector('selectorSizeSubtitle', 'sottotitolo');

  bindSpacingSelector('selectorSpacingDateTitle', 'betweenDateTitle');
  bindSpacingSelector('selectorSpacingTitleSubtitle', 'betweenTitleSubtitle');

  if (!state.textVAlign) state.textVAlign = 'center';
  function bindTextVAlign() {
    const container = document.getElementById('selectorTextVAlign');
    if (!container) return;
    const buttons = container.querySelectorAll('.size-btn');
    
    buttons.forEach(btn => {
      if (btn.getAttribute('data-valign') === state.textVAlign) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
      
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.textVAlign = btn.getAttribute('data-valign');
        onChange();
      });
    });
  }
  bindTextVAlign();

  // ==========================================================================
  // 6. GESTIONE LOGO E QR CODE CON CONTROLLI DI POSIZIONE
  // ==========================================================================
  
  checkboxLogo.checked = state.showLogo;
  if (state.showLogo) panelLogo.classList.remove('hidden');
  
  checkboxLogo.addEventListener('change', () => {
    state.showLogo = checkboxLogo.checked;
    if (state.showLogo) {
      panelLogo.classList.remove('hidden');
    } else {
      panelLogo.classList.add('hidden');
    }
    onChange();
  });

  function bindLogoSizeSelector(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const buttons = container.querySelectorAll('.size-btn');
    const currentVal = state.logoParams.size || 'medium';
    
    buttons.forEach(btn => {
      if (btn.getAttribute('data-size') === currentVal) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
      
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.logoParams.size = btn.getAttribute('data-size');
        onChange();
      });
    });
  }

  bindLogoSizeSelector('selectorSizeLogo');

  function bindLogoPosition() {
    const btnGroups = [
      document.getElementById('posLogoTop'),
      document.getElementById('posLogoBottom')
    ];
    let allButtons = [];
    btnGroups.forEach(g => { if(g) allButtons.push(...g.querySelectorAll('.size-btn')); });
    
    allButtons.forEach(btn => {
      const v = btn.getAttribute('data-v');
      const h = btn.getAttribute('data-h');
      if (state.logoParams.vpos === v && state.logoParams.align === h) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
      
      btn.addEventListener('click', () => {
        allButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.logoParams.vpos = v;
        state.logoParams.align = h;
        onChange();
      });
    });
  }
  bindLogoPosition();

  function bindLogoGapSelector() {
    const container = document.getElementById('selectorGapLogo');
    if (!container) return;
    const buttons = container.querySelectorAll('.size-btn');
    const currentVal = state.logoParams.gapRatio ? state.logoParams.gapRatio.toString() : '0.04';
    
    buttons.forEach(btn => {
      if (btn.getAttribute('data-gap') === currentVal) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
      
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.logoParams.gapRatio = parseFloat(btn.getAttribute('data-gap'));
        onChange();
      });
    });
  }
  bindLogoGapSelector();

  fileLogoInput.addEventListener('change', async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      logoStatus.textContent = file.name;
      try {
        const { dataURL, ratio } = await loadUploadedLogo(file);
        state.logoDataURL = dataURL;
        state.logoRatio = ratio;
        state.logoIsCustom = true; // Imposta esplicitamente che si tratta di un logo dell'utente!
        onChange();
      } catch (err) {
        alert("Errore nel caricamento del logo: " + err.message);
        logoStatus.textContent = "Errore";
      }
    }
  });

  // QR Code
  checkboxQr.checked = state.showQr;
  if (state.showQr) panelQr.classList.remove('hidden');
  
  checkboxQr.addEventListener('change', () => {
    state.showQr = checkboxQr.checked;
    if (state.showQr) {
      panelQr.classList.remove('hidden');
    } else {
      panelQr.classList.add('hidden');
    }
    onChange();
  });

  inputQrUrl.value = state.qrParams.defaultUrl;
  inputQrUrl.addEventListener('input', () => {
    state.qrParams.defaultUrl = inputQrUrl.value;
    onChange();
  });

  function bindQrSizeSelector(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const buttons = container.querySelectorAll('.size-btn');
    const currentVal = state.qrParams.size || 'medium';
    
    buttons.forEach(btn => {
      if (btn.getAttribute('data-size') === currentVal) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
      
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.qrParams.size = btn.getAttribute('data-size');
        onChange();
      });
    });
  }

  function bindQrSpacingSelector(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const buttons = container.querySelectorAll('.size-btn');
    const currentVal = state.qrParams.spacing || 'medium';
    
    buttons.forEach(btn => {
      if (btn.getAttribute('data-spacing') === currentVal) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
      
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.qrParams.spacing = btn.getAttribute('data-spacing');
        onChange();
      });
    });
  }

  bindQrSizeSelector('selectorSizeQr');
  bindQrSpacingSelector('selectorSpacingQr');

  function bindQrPosition() {
    const btnGroups = [
      document.getElementById('posQrTop'),
      document.getElementById('posQrFlow')
    ];
    let allButtons = [];
    btnGroups.forEach(g => { if(g) allButtons.push(...g.querySelectorAll('.size-btn')); });
    
    allButtons.forEach(btn => {
      const v = btn.getAttribute('data-v');
      const h = btn.getAttribute('data-h');
      if (state.qrParams.vpos === v && state.qrParams.align === h) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
      
      btn.addEventListener('click', () => {
        allButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.qrParams.vpos = v;
        state.qrParams.align = h;
        onChange();
      });
    });
  }
  bindQrPosition();

  // ==========================================================================
  // 7. GESTIONE CONTROLLI WATERMARK MADDALONI E SBLOCCO
  // ==========================================================================
  
  const unlockWatermarkBtn = document.getElementById('unlockWatermarkBtn');
  const unlockModalOverlay = document.getElementById('unlockModalOverlay');
  const unlockPwdInput = document.getElementById('unlockPwdInput');
  const confirmUnlockBtn = document.getElementById('confirmUnlockBtn');
  const cancelUnlockBtn = document.getElementById('cancelUnlockBtn');
  const unlockErrorMsg = document.getElementById('unlockErrorMsg');
  const watermarkToggleContainer = document.getElementById('watermarkToggleContainer');
  const toggleWatermark = document.getElementById('toggleWatermark');

  if (toggleWatermark) {
    toggleWatermark.checked = state.showWatermark !== false;
    toggleWatermark.addEventListener('change', () => {
      state.showWatermark = toggleWatermark.checked;
      onChange();
    });
  }

  if (unlockWatermarkBtn && unlockModalOverlay) {
    if (state.watermarkUnlocked) {
      unlockWatermarkBtn.style.color = '#2E7D32';
      unlockWatermarkBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5"></path></svg> Sbloccato';
      if (watermarkToggleContainer) watermarkToggleContainer.style.display = 'block';
    }

    unlockWatermarkBtn.addEventListener('click', () => {
      if (state.watermarkUnlocked) return;
      unlockModalOverlay.style.display = 'flex';
      unlockPwdInput.value = '';
      unlockErrorMsg.style.display = 'none';
      setTimeout(() => unlockPwdInput.focus(), 100);
    });

    cancelUnlockBtn.addEventListener('click', () => {
      unlockModalOverlay.style.display = 'none';
    });

    confirmUnlockBtn.addEventListener('click', () => {
      if (unlockPwdInput.value === "associazione2026") {
        state.watermarkUnlocked = true;
        unlockModalOverlay.style.display = 'none';
        unlockWatermarkBtn.style.color = '#2E7D32';
        unlockWatermarkBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5"></path></svg> Sbloccato';
        if (watermarkToggleContainer) watermarkToggleContainer.style.display = 'block';
        // Non occorre chiamare onChange, lo sblocco ha solo rivelato il pulsante per spegnere il watermark.
      } else {
        unlockErrorMsg.style.display = 'block';
      }
    });

    unlockPwdInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') confirmUnlockBtn.click();
    });
  }

  selectWatermarkType.innerHTML = '';
  CONFIG.watermark.types.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = t.name;
    if (state.watermarkType === t.id) opt.selected = true;
    selectWatermarkType.appendChild(opt);
  });

  selectWatermarkType.addEventListener('change', () => {
    state.watermarkType = selectWatermarkType.value;
    onChange();
  });

  selectWatermarkPos.innerHTML = '';
  CONFIG.watermark.positions.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    if (state.watermarkPos === p.id) opt.selected = true;
    selectWatermarkPos.appendChild(opt);
  });

  selectWatermarkPos.addEventListener('change', () => {
    state.watermarkPos = selectWatermarkPos.value;
    onChange();
  });

  // Prima valutazione del contrasto all'avvio
  updateContrastBadge();
}
