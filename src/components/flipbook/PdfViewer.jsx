import { useEffect, useRef, useState, useCallback } from 'react'
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs'
import './PdfViewer.css'

// Imposta il worker locale da /public
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

export default function PdfViewer({ volume }) {
  const containerRef = useRef(null)
  const leftCanvasRef = useRef(null)
  const rightCanvasRef = useRef(null)

  const [pdfDoc, setPdfDoc] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(volume.totalPages)
  const [isLoading, setIsLoading] = useState(true)
  const [isSpread, setIsSpread] = useState(() => window.innerWidth > 800)
  const [scaleMultiplier, setScaleMultiplier] = useState(1)
  const [sliderVal, setSliderVal] = useState(1)

  const renderTaskLeft = useRef(null)
  const renderTaskRight = useRef(null)

  // 1. Carica il documento PDF
  useEffect(() => {
    let active = true
    setIsLoading(true)
    setCurrentPage(1)
    setSliderVal(1)

    const loadingTask = pdfjsLib.getDocument({
      url: volume.pdfUrl,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/cmaps/',
      cMapPacked: true,
    })

    loadingTask.promise
      .then((doc) => {
        if (!active) return
        setPdfDoc(doc)
        setTotalPages(doc.numPages)
        setIsLoading(false)
      })
      .catch((err) => {
        if (!active) return
        console.error('Errore caricamento PDF:', err)
        setIsLoading(false)
      })

    return () => {
      active = false
      loadingTask.destroy()
    }
  }, [volume.pdfUrl])

  // Rileva modalità singola / doppia pagina al resize
  useEffect(() => {
    const handleResize = () => {
      setIsSpread(window.innerWidth > 800)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 2. Render delle pagine sui canvas ad altissima risoluzione vettoriale
  const renderPages = useCallback(async () => {
    if (!pdfDoc || !containerRef.current) return

    const containerW = containerRef.current.clientWidth
    const containerH = containerRef.current.clientHeight

    // Determina se mostrare doppia pagina (spread)
    // Regola editoriale: la pagina 1 (copertina) è singola. Dalla pagina 2 in poi sono coppie pari/dispari (2-3, 4-5...)
    const showTwoPages = isSpread && currentPage > 1

    const pageNumLeft = showTwoPages ? (currentPage % 2 === 0 ? currentPage : currentPage - 1) : currentPage
    const pageNumRight = showTwoPages ? pageNumLeft + 1 : null

    // Cancella eventuali render precedenti in corso
    if (renderTaskLeft.current) {
      renderTaskLeft.current.cancel()
      renderTaskLeft.current = null
    }
    if (renderTaskRight.current) {
      renderTaskRight.current.cancel()
      renderTaskRight.current = null
    }

    try {
      const pageLeft = await pdfDoc.getPage(pageNumLeft)
      const viewportUnscaled = pageLeft.getViewport({ scale: 1 })

      // Calcolo scala ottimale per riempire la vista
      const maxW = showTwoPages ? containerW * 0.90 : containerW * 0.88
      const maxH = containerH * 0.88

      let baseScale = 1
      if (showTwoPages) {
        const spreadW = viewportUnscaled.width * 2
        const spreadH = viewportUnscaled.height
        baseScale = Math.min(maxW / spreadW, maxH / spreadH)
      } else {
        baseScale = Math.min(maxW / viewportUnscaled.width, maxH / viewportUnscaled.height)
      }

      const finalScale = baseScale * scaleMultiplier
      // Moltiplicatore retina/display pixel ratio per nitidezza chirurgica
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      // Render pagina sinistra
      const viewportLeft = pageLeft.getViewport({ scale: finalScale * dpr })
      const canvasLeft = leftCanvasRef.current

      if (canvasLeft) {
        canvasLeft.width = viewportLeft.width
        canvasLeft.height = viewportLeft.height
        canvasLeft.style.width = `${Math.floor(viewportLeft.width / dpr)}px`
        canvasLeft.style.height = `${Math.floor(viewportLeft.height / dpr)}px`

        const ctxLeft = canvasLeft.getContext('2d')
        ctxLeft.imageSmoothingEnabled = true
        ctxLeft.imageSmoothingQuality = 'high'

        renderTaskLeft.current = pageLeft.render({
          canvasContext: ctxLeft,
          viewport: viewportLeft,
        })
        await renderTaskLeft.current.promise
      }

      // Render pagina destra (se in modalità doppia pagina)
      const canvasRight = rightCanvasRef.current
      if (showTwoPages && pageNumRight <= pdfDoc.numPages && canvasRight) {
        const pageRight = await pdfDoc.getPage(pageNumRight)
        const viewportRight = pageRight.getViewport({ scale: finalScale * dpr })

        canvasRight.width = viewportRight.width
        canvasRight.height = viewportRight.height
        canvasRight.style.width = `${Math.floor(viewportRight.width / dpr)}px`
        canvasRight.style.height = `${Math.floor(viewportRight.height / dpr)}px`

        const ctxRight = canvasRight.getContext('2d')
        ctxRight.imageSmoothingEnabled = true
        ctxRight.imageSmoothingQuality = 'high'

        renderTaskRight.current = pageRight.render({
          canvasContext: ctxRight,
          viewport: viewportRight,
        })
        await renderTaskRight.current.promise
      }
    } catch (e) {
      if (e?.name !== 'RenderingCancelledException') {
        console.error('Render error:', e)
      }
    }
  }, [pdfDoc, currentPage, isSpread, scaleMultiplier])

  useEffect(() => {
    renderPages()
  }, [renderPages])

  // Navigazione
  const goToPrev = () => {
    const step = isSpread && currentPage > 2 ? 2 : 1
    const target = Math.max(1, currentPage - step)
    setCurrentPage(target)
    setSliderVal(target)
  }

  const goToNext = () => {
    if (currentPage >= totalPages) return
    const step = isSpread && currentPage > 1 ? 2 : 1
    const target = Math.min(totalPages, currentPage + step)
    setCurrentPage(target)
    setSliderVal(target)
  }

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value, 10)
    setSliderVal(val)
    setCurrentPage(val)
  }

  // Scorciatoie da tastiera
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        goToNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        goToPrev()
      } else if (e.key === 'Home') {
        e.preventDefault()
        setCurrentPage(1)
        setSliderVal(1)
      } else if (e.key === 'End') {
        e.preventDefault()
        setCurrentPage(totalPages)
        setSliderVal(totalPages)
      } else if (e.key === '+' || e.key === '=') {
        setScaleMultiplier((s) => Math.min(s + 0.15, 2))
      } else if (e.key === '-') {
        setScaleMultiplier((s) => Math.max(s - 0.15, 0.75))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, totalPages, isSpread])

  const showTwoPages = isSpread && currentPage > 1
  const pageNumLeft = showTwoPages ? (currentPage % 2 === 0 ? currentPage : currentPage - 1) : currentPage
  const pageNumRight = showTwoPages && pageNumLeft + 1 <= totalPages ? pageNumLeft + 1 : null

  return (
    <div
      ref={containerRef}
      className="pdf-viewer"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="pdf-viewer__loader">
          <div className="pdf-viewer__spinner" />
          <span>Caricamento vettoriale {volume.number}...</span>
        </div>
      )}

      {/* Freccia Nav Sinistra */}
      <button
        type="button"
        className="pdf-viewer__nav-btn pdf-viewer__nav-btn--prev"
        onClick={goToPrev}
        disabled={currentPage <= 1}
        aria-label="Pagina precedente"
      >
        ‹
      </button>

      {/* Stage Pagine Vettoriali */}
      <div className="pdf-viewer__stage">
        <div className={`pdf-viewer__spread ${showTwoPages ? 'pdf-viewer__spread--double' : 'pdf-viewer__spread--single'}`}>
          <div className="pdf-viewer__page-wrap">
            <canvas ref={leftCanvasRef} className="pdf-viewer__canvas" />
            <div className="pdf-viewer__shield" />
          </div>

          {showTwoPages && pageNumRight && (
            <div className="pdf-viewer__page-wrap">
              <canvas ref={rightCanvasRef} className="pdf-viewer__canvas" />
              <div className="pdf-viewer__shield" />
            </div>
          )}
        </div>
      </div>

      {/* Freccia Nav Destra */}
      <button
        type="button"
        className="pdf-viewer__nav-btn pdf-viewer__nav-btn--next"
        onClick={goToNext}
        disabled={currentPage >= totalPages}
        aria-label="Pagina successiva"
      >
        ›
      </button>

      {/* Floating Bottom Bar: Controlli, Zoom, Slider */}
      <div className="pdf-viewer__controls" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => { setCurrentPage(1); setSliderVal(1) }}
          className="pdf-viewer__ctrl-btn"
          title="Prima pagina"
          disabled={currentPage <= 1}
        >
          ⇤
        </button>

        <button
          type="button"
          onClick={goToPrev}
          className="pdf-viewer__ctrl-btn"
          title="Precedente"
          disabled={currentPage <= 1}
        >
          ‹
        </button>

        <input
          type="range"
          min="1"
          max={totalPages}
          value={sliderVal}
          onChange={handleSliderChange}
          className="pdf-viewer__slider"
          aria-label="Scorri pagine"
        />

        <span className="pdf-viewer__counter">
          {showTwoPages && pageNumRight ? (
            <>Pagg. <strong>{pageNumLeft}–{pageNumRight}</strong> / {totalPages}</>
          ) : (
            <>Pag. <strong>{currentPage}</strong> / {totalPages}</>
          )}
        </span>

        <button
          type="button"
          onClick={goToNext}
          className="pdf-viewer__ctrl-btn"
          title="Successiva"
          disabled={currentPage >= totalPages}
        >
          ›
        </button>

        <button
          type="button"
          onClick={() => { setCurrentPage(totalPages); setSliderVal(totalPages) }}
          className="pdf-viewer__ctrl-btn"
          title="Ultima pagina"
          disabled={currentPage >= totalPages}
        >
          ⇥
        </button>

        {/* Separatore */}
        <span className="pdf-viewer__ctrl-sep">|</span>

        {/* Zoom */}
        <button
          type="button"
          onClick={() => setScaleMultiplier((s) => Math.max(s - 0.15, 0.75))}
          className="pdf-viewer__ctrl-btn"
          title="Riduci zoom (-)"
          disabled={scaleMultiplier <= 0.75}
        >
          −
        </button>

        <span className="pdf-viewer__zoom-pct">
          {Math.round(scaleMultiplier * 100)}%
        </span>

        <button
          type="button"
          onClick={() => setScaleMultiplier((s) => Math.min(s + 0.15, 2))}
          className="pdf-viewer__ctrl-btn"
          title="Aumenta zoom (+)"
          disabled={scaleMultiplier >= 2}
        >
          +
        </button>

        {scaleMultiplier !== 1 && (
          <button
            type="button"
            onClick={() => setScaleMultiplier(1)}
            className="pdf-viewer__ctrl-btn-reset"
            title="Reimposta zoom a 100%"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
