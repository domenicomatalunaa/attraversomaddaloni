import { useEffect, useRef, useState, useCallback } from 'react'
import { PageFlip } from 'page-flip'
import './NativeFlipbook.css'

export default function NativeFlipbook({ volume }) {
  const containerRef = useRef(null)
  const bookRef = useRef(null)
  const pageFlipInstance = useRef(null)

  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(volume.totalPages)
  const [isReady, setIsReady] = useState(false)
  const [sliderVal, setSliderVal] = useState(1)

  const pageUrls = useRef([])
  pageUrls.current = Array.from({ length: volume.totalPages }, (_, i) => {
    const num = String(i + 1).padStart(3, '0')
    return `${volume.basePath}/page_${num}.webp`
  })

  // Inizializza PageFlip
  const initPageFlip = useCallback(() => {
    if (!bookRef.current || !containerRef.current) return

    // Distruggi istanza precedente se presente
    if (pageFlipInstance.current) {
      try {
        pageFlipInstance.current.destroy()
      } catch (e) {
        console.error(e)
      }
      pageFlipInstance.current = null
    }

    setIsReady(false)

    const containerW = containerRef.current.clientWidth
    const containerH = containerRef.current.clientHeight

    // Calcolo dimensioni singola pagina rispettando l'aspect ratio
    const isMobile = window.innerWidth <= 768
    const bookAspect = volume.width / volume.height

    let pageW, pageH

    if (isMobile) {
      // Mobile: pagina singola
      const maxW = containerW * 0.94
      const maxH = containerH * 0.94
      if (maxW / maxH > bookAspect) {
        pageH = maxH
        pageW = pageH * bookAspect
      } else {
        pageW = maxW
        pageH = pageW / bookAspect
      }
    } else {
      // Desktop: doppia pagina (spread = 2 * pageW)
      const maxSpreadW = containerW * 0.92
      const maxSpreadH = containerH * 0.90

      // Uno spread è largo 2 * pageW
      const spreadAspect = (2 * volume.width) / volume.height

      if (maxSpreadW / maxSpreadH > spreadAspect) {
        pageH = maxSpreadH
        pageW = (pageH * spreadAspect) / 2
      } else {
        const spreadW = maxSpreadW
        pageW = spreadW / 2
        pageH = spreadW / spreadAspect
      }
    }

    pageW = Math.floor(pageW)
    pageH = Math.floor(pageH)

    const pf = new PageFlip(bookRef.current, {
      width: pageW,
      height: pageH,
      size: 'fixed',
      minWidth: Math.floor(pageW * 0.6),
      maxWidth: Math.floor(pageW * 1.5),
      minHeight: Math.floor(pageH * 0.6),
      maxHeight: Math.floor(pageH * 1.5),
      maxShadowOpacity: 0.35,
      showCover: true,
      mobileScrollSupport: false,
      usePortrait: isMobile,
      startPage: 0,
      drawShadow: true,
      flippingTime: 700,
      useMouseEvents: true,
      clickEventForward: false
    })

    pf.loadFromImages(pageUrls.current)

    pf.on('flip', (e) => {
      setCurrentPage(e.data)
      setSliderVal(e.data + 1)
    })

    pf.on('init', () => {
      setIsReady(true)
    })

    pageFlipInstance.current = pf
    setTotalPages(volume.totalPages)
    setCurrentPage(0)
    setSliderVal(1)
  }, [volume])

  useEffect(() => {
    initPageFlip()

    const handleResize = () => {
      // Re-init al cambio finestra per mantenere proporzioni perfette
      initPageFlip()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (pageFlipInstance.current) {
        try {
          pageFlipInstance.current.destroy()
        } catch (e) {}
        pageFlipInstance.current = null
      }
    }
  }, [initPageFlip])

  // Controlli tastiera
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!pageFlipInstance.current) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        pageFlipInstance.current.flipNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        pageFlipInstance.current.flipPrev()
      } else if (e.key === 'Home') {
        e.preventDefault()
        pageFlipInstance.current.flip(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        pageFlipInstance.current.flip(volume.totalPages - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [volume.totalPages])

  const flipPrev = () => {
    if (pageFlipInstance.current) pageFlipInstance.current.flipPrev()
  }

  const flipNext = () => {
    if (pageFlipInstance.current) pageFlipInstance.current.flipNext()
  }

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value, 10)
    setSliderVal(val)
    if (pageFlipInstance.current) {
      pageFlipInstance.current.flip(val - 1)
    }
  }

  // Prevenzione download / context menu
  const preventProtection = (e) => {
    e.preventDefault()
    return false
  }

  return (
    <div
      ref={containerRef}
      className="native-flipbook"
      onContextMenu={preventProtection}
      onDragStart={preventProtection}
    >
      {/* Loading state */}
      {!isReady && (
        <div className="native-flipbook__loader">
          <div className="native-flipbook__spinner" />
          <span>Caricamento {volume.number}...</span>
        </div>
      )}

      {/* Freccia Sinistra */}
      <button
        type="button"
        className="native-flipbook__nav-btn native-flipbook__nav-btn--prev"
        onClick={flipPrev}
        disabled={currentPage === 0}
        aria-label="Pagina precedente"
      >
        ‹
      </button>

      {/* Book Container */}
      <div className="native-flipbook__stage">
        <div ref={bookRef} className="native-flipbook__book" />
        
        {/* Layer trasparente di sicurezza anti-salvataggio sovrapposto */}
        <div
          className="native-flipbook__shield"
          onContextMenu={preventProtection}
          onDragStart={preventProtection}
        />
      </div>

      {/* Freccia Destra */}
      <button
        type="button"
        className="native-flipbook__nav-btn native-flipbook__nav-btn--next"
        onClick={flipNext}
        disabled={currentPage >= volume.totalPages - 1}
        aria-label="Pagina successiva"
      >
        ›
      </button>

      {/* Floating Bottom Bar con Slider e Contatore */}
      <div className="native-flipbook__controls" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => pageFlipInstance.current?.flip(0)}
          className="native-flipbook__ctrl-btn"
          title="Prima pagina"
          disabled={currentPage === 0}
        >
          ⇤
        </button>

        <button
          type="button"
          onClick={flipPrev}
          className="native-flipbook__ctrl-btn"
          title="Precedente"
          disabled={currentPage === 0}
        >
          ‹
        </button>

        <input
          type="range"
          min="1"
          max={volume.totalPages}
          value={sliderVal}
          onChange={handleSliderChange}
          className="native-flipbook__slider"
          aria-label="Naviga pagine"
        />

        <span className="native-flipbook__counter">
          Pag. <strong>{sliderVal}</strong> / {volume.totalPages}
        </span>

        <button
          type="button"
          onClick={flipNext}
          className="native-flipbook__ctrl-btn"
          title="Successiva"
          disabled={currentPage >= volume.totalPages - 1}
        >
          ›
        </button>

        <button
          type="button"
          onClick={() => pageFlipInstance.current?.flip(volume.totalPages - 1)}
          className="native-flipbook__ctrl-btn"
          title="Ultima pagina"
          disabled={currentPage >= volume.totalPages - 1}
        >
          ⇥
        </button>
      </div>
    </div>
  )
}
