import { useState, useRef } from 'react'
import '../pages/Metodo.css'
import './Carattere.css'
import DragGallery from '../components/ui/DragGallery'

const pesiPreset = [
  { label: 'Thin',    wght: 100 },
  { label: 'Light',   wght: 300 },
  { label: 'Regular', wght: 400 },
  { label: 'Medium',  wght: 500 },
  { label: 'Bold',    wght: 700 },
  { label: 'Black',   wght: 900 },
]

const glyphSets = {
  Maiuscole: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  Minuscole: 'abcdefghijklmnopqrstuvwxyz',
  Numeri:    '0123456789',
  Accenti:   'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ',
  Simboli:   '.,;:!?&@#%*()[]{}<>€$£¥¢©®™°/\\|_+-=~^`\'"“”‘’',
}

const allineamenti = ['left', 'center', 'right']
const allineamentiIcon = ['≡', '☰', '≡'] // sinistro, centrato, destro

export default function Carattere() {
  const [peso, setPeso]                 = useState(700)
  const [pesoPreset, setPesoPreset]     = useState('Bold')
  const [size, setSize]                 = useState(180)
  const [spacing, setSpacing]           = useState(0)
  const [lineHeight, setLineHeight]     = useState(1.0)
  const [align, setAlign]               = useState('center')
  const [glyphTab, setGlyphTab]         = useState('Minuscole')
  const [hoverGlyph, setHoverGlyph]     = useState(null)
  const [resetCount, setResetCount]     = useState(0)
  const testoRef                        = useRef(null)

  function handlePreset(preset) {
    setPesoPreset(preset.label)
    setPeso(preset.wght)
  }

  function handleReset() {
    setPeso(700)
    setPesoPreset('Bold')
    setSize(180)
    setSpacing(0)
    setLineHeight(1.0)
    setAlign('center')
    setResetCount(c => c + 1)
  }

  const fontVariationSettings = `"wght" ${peso}`

  const pesoLabel = pesiPreset.find(p => p.wght === peso)?.label || `${peso}`

  return (
    <div className="carattere page-enter">
      <div className="container">

        {/* ── Header ────────────────────────────────────── */}
        <header className="view-header" style={{ textAlign: 'center' }}>
          <p className="view-header__eyebrow">
            TIPOGRAFIA <span>&nbsp;·&nbsp;</span> MARZO 2026 – OTTOBRE 2026
          </p>
          <h1 className="view-header__title">Il carattere tipografico</h1>
          <p className="view-header__lead">
            Come può la tipografia farsi carico dell'intera voce di una città?
          </p>
        </header>

        <DragGallery items={[
          { label: 'Sketch lettera A — ispirazione osca', ratio: '4/3' },
          { label: 'Foglio di studio calligrafico', ratio: '4/3' },
          { label: 'Prova di stampa — peso Regular', ratio: '4/3' },
          { label: 'Confronto alfabeti storici', ratio: '4/3' },
          { label: 'Sistema lettere — versione finale', ratio: '4/3' },
        ]} />

        {/* ── Font Info ─────────────────────────────────── */}
        <div className="font-info section--sm">
          <div className="font-info__grid">
            <div>
              <p className="font-info__key">Font info</p>
              <p className="font-info__value">
                Tifata è un carattere tipografico sans-serif umanistico ad alto impatto visivo.
              </p>
              <p className="font-info__value" style={{ marginTop: '1rem' }}>
                La sua struttura fonde le geometrie e le forme arcaiche dell'alfabeto Osco con elementi calligrafici ed epigrafici emersi dallo studio delle fonti d'archivio del Convitto Nazionale Statale "Giordano Bruno".
              </p>
            </div>
            <div>
              <p className="font-info__key">Linguaggi supportati</p>
              <p className="font-info__value">
                Italiano, Inglese, Spagnolo, Francese, Tedesco, Portoghese, Olandese, Albanese, Basco, Bretone, Catalano, Danese, Gaelico, Galiziano, Islandese, Norvegese, Svedese.
              </p>
            </div>
            <div>
              <p className="font-info__key">Designer</p>
              <p className="font-info__value">Domenico Mataluna</p>
            </div>
            <div>
              <p className="font-info__key">Specimen</p>
              <a href="#" className="btn btn--outline" style={{ marginTop: '0.5rem' }}>
                ↓ Scarica lo specimen PDF
              </a>
            </div>
          </div>
        </div>

        {/* ── Type Tester ───────────────────────────────── */}
        <section className="type-tester" aria-labelledby="tester-title">
          <div className="type-tester__intro">
            <div>
              <p className="section-label">SPECIMEN</p>
              <h2 className="h3" id="tester-title">Provalo dal vivo</h2>
            </div>
            <p className="type-tester__hint">
              Modifica testo, peso, dimensione e spaziatura per esplorare<br />
              il comportamento del carattere in ogni configurazione.
            </p>
          </div>

          {/* Preview Area */}
          <div className="type-tester__preview">
            <div className="type-tester__preview-header">
              <span className="type-tester__dot" aria-hidden="true" />
              <span className="type-tester__meta">SPECIMEN INTERATTIVO</span>
              <span className="type-tester__meta type-tester__meta--right">
                {pesoLabel.toUpperCase()} · {size}PX
              </span>
            </div>

            <div
              className="type-tester__canvas"
              aria-label="Area anteprima testo"
              onClick={() => testoRef.current?.focus()}
            >
              <div
                key={resetCount}
                ref={testoRef}
                contentEditable
                suppressContentEditableWarning
                role="textbox"
                aria-multiline="true"
                aria-label="Testo del specimen — clicca per modificare"
                className="type-tester__text"
                style={{
                  fontFamily: "'Tifata Display VF', 'Basic Sans', sans-serif",
                  fontVariationSettings,
                  fontSize: `${Math.min(size, 220)}px`,
                  letterSpacing: `${spacing / 100}em`,
                  lineHeight,
                  textAlign: align,
                  whiteSpace: 'pre-wrap'
                }}
              >
                Contro il male,{"\n"}San Michele
              </div>
            </div>

            {/* Controls */}
            <div className="type-tester__controls">
              {/* Spessore */}
              <div className="control-group">
                <label className="control-label">SPESSORE</label>
                <div className="control-presets">
                  {pesiPreset.map(p => (
                    <button
                      key={p.label}
                      className={`weight-pill ${pesoPreset === p.label ? 'weight-pill--active' : ''}`}
                      onClick={() => handlePreset(p)}
                      style={pesoPreset === p.label ? { fontWeight: p.wght } : {}}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grandezza */}
              <div className="control-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label className="control-label" htmlFor="slider-size">GRANDEZZA</label>
                  <span className="control-value">{size}px</span>
                </div>
                <input
                  id="slider-size"
                  type="range"
                  min="24"
                  max="300"
                  value={size}
                  onChange={e => setSize(Number(e.target.value))}
                  className="slider"
                />
              </div>

              {/* Spaziatura */}
              <div className="control-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label className="control-label" htmlFor="slider-spacing">SPAZIATURA</label>
                  <span className="control-value">{spacing}</span>
                </div>
                <input
                  id="slider-spacing"
                  type="range"
                  min="-10"
                  max="30"
                  value={spacing}
                  onChange={e => setSpacing(Number(e.target.value))}
                  className="slider"
                />
              </div>

              {/* Interlinea */}
              <div className="control-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label className="control-label" htmlFor="slider-lh">INTERLINEA</label>
                  <span className="control-value">{lineHeight.toFixed(2)}</span>
                </div>
                <input
                  id="slider-lh"
                  type="range"
                  min="70"
                  max="200"
                  value={lineHeight * 100}
                  onChange={e => setLineHeight(Number(e.target.value) / 100)}
                  className="slider"
                />
              </div>

              {/* Allineamento & Reset */}
              <div className="control-footer">
                <div className="control-group" style={{ flex: 0 }}>
                  <label className="control-label">ALLINEAMENTO</label>
                  <div className="align-pills">
                    {allineamenti.map((a, i) => (
                      <button
                        key={a}
                        className={`align-pill ${align === a ? 'align-pill--active' : ''}`}
                        onClick={() => setAlign(a)}
                        aria-label={`Allinea a ${a}`}
                        aria-pressed={align === a}
                      >
                        {i === 0 ? '⬅' : i === 1 ? '⬛' : '➡'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="control-footer__right">
                  <span className="control-hint">Clicca sul testo per modificarlo</span>
                  <button className="btn btn--ghost" onClick={handleReset}>
                    ↺ Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Set di Caratteri ──────────────────────────── */}
        <section className="glyph-section section--sm" aria-labelledby="glyph-title">
          <div className="glyph-section__header">
            <div>
              <p className="section-label">GLIFI</p>
              <h2 className="h3" id="glyph-title">Set di caratteri</h2>
            </div>
            <div className="glyph-tabs">
              {Object.keys(glyphSets).map(tab => (
                <button
                  key={tab}
                  className={`glyph-tab ${glyphTab === tab ? 'glyph-tab--active' : ''}`}
                  onClick={() => setGlyphTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="glyph-grid" role="grid" aria-label={`Glifi: ${glyphTab}`}>
            {glyphSets[glyphTab].split('').map((ch, i) => (
              <div
                key={i}
                className={`glyph-cell ${hoverGlyph === i ? 'glyph-cell--hover' : ''}`}
                role="gridcell"
                aria-label={`Carattere ${ch}`}
                onMouseEnter={() => setHoverGlyph(i)}
                onMouseLeave={() => setHoverGlyph(null)}
              >
                <span
                  className="glyph-char"
                  style={{ fontFamily: "'Tifata Display VF', 'Basic Sans', sans-serif", fontVariationSettings }}
                >
                  {ch}
                </span>
              </div>
            ))}
          </div>
          <p className="glyph-hint">
            Passa il mouse sui glifi per evidenziarli · {glyphSets[glyphTab].length} caratteri in {glyphTab.toLowerCase()}
          </p>
        </section>

      </div>
    </div>
  )
}
