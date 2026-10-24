import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { VOLUMI_DATA } from '../data/volumiData'
import NativeFlipbook from '../components/flipbook/NativeFlipbook'
import SEO from '../components/common/SEO'
import './Pubblicazioni.css'

export default function Pubblicazioni({ initialVolume = '1' }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeVolumeId, setActiveVolumeId] = useState(() => {
    if (location.pathname === '/brandmanual' || location.pathname === '/manuale') {
      return '2'
    }
    if (location.pathname === '/tesi' || location.pathname === '/ricerca') {
      return '1'
    }
    return initialVolume || '1'
  })

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const viewerRef = useRef(null)

  // Sincronizza lo stato se la rotta cambia
  useEffect(() => {
    if (location.pathname === '/brandmanual' || location.pathname === '/manuale') {
      setActiveVolumeId('2')
    } else if (location.pathname === '/tesi' || location.pathname === '/ricerca') {
      setActiveVolumeId('1')
    }
  }, [location.pathname])

  const activeVolume = VOLUMI_DATA[activeVolumeId] || VOLUMI_DATA['1']

  const handleSelectVolume = (id) => {
    setActiveVolumeId(id)
    const targetPath = id === '2' ? '/brandmanual' : '/tesi'
    if (location.pathname !== targetPath) {
      navigate(targetPath, { replace: true })
    }
  }

  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      if (viewerRef.current && viewerRef.current.requestFullscreen) {
        viewerRef.current.requestFullscreen().catch(() => {
          setIsFullscreen(true)
        })
      } else {
        setIsFullscreen(true)
      }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
      }
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  const handleShare = () => {
    const shareUrl = window.location.origin + (activeVolumeId === '2' ? '/brandmanual' : '/tesi')
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setToastMessage('Link copiato negli appunti!')
        setTimeout(() => setToastMessage(null), 2200)
      })
    }
  }

  // Prevenzione download / salvataggio con tasto destro a livello di pagina
  const handleContextMenu = (e) => {
    e.preventDefault()
    return false
  }

  return (
    <div className="pubblicazioni" onContextMenu={handleContextMenu}>
      <SEO
        title={`${activeVolume.number}: ${activeVolume.title} — Attraverso Maddaloni`}
        description={activeVolume.description}
      />

      {toastMessage && (
        <div className="pubblicazioni__toast">
          ✓ {toastMessage}
        </div>
      )}

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <header className="pubblicazioni__topbar">
        <Link to="/" className="pubblicazioni__brand" title="Torna alla Home">
          <img
            src="/images/monogramma.svg"
            alt="Monogramma Maddaloni"
            className="pubblicazioni__logo"
          />
          <div className="pubblicazioni__brand-text">
            <span className="pubblicazioni__brand-title">Attraverso Maddaloni</span>
            <span className="pubblicazioni__brand-sub">Pubblicazioni di Tesi</span>
          </div>
        </Link>

        {/* Segmented Control / Tab Switcher */}
        <nav className="pubblicazioni__tabs" aria-label="Seleziona volume tesi">
          <button
            type="button"
            onClick={() => handleSelectVolume('1')}
            className={`pubblicazioni__tab ${activeVolumeId === '1' ? 'pubblicazioni__tab--active' : ''}`}
            aria-selected={activeVolumeId === '1'}
          >
            <span>Vol. 1 · Tesi di Ricerca</span>
            <span className="pubblicazioni__tab-badge">17×24</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectVolume('2')}
            className={`pubblicazioni__tab ${activeVolumeId === '2' ? 'pubblicazioni__tab--active' : ''}`}
            aria-selected={activeVolumeId === '2'}
          >
            <span>Vol. 2 · Brand Manual</span>
            <span className="pubblicazioni__tab-badge">24×24</span>
          </button>
        </nav>

        {/* Quick Action Buttons */}
        <div className="pubblicazioni__actions">
          <button
            type="button"
            onClick={handleShare}
            className="pubblicazioni__btn"
            title="Copia link della pubblicazione"
          >
            <span>🔗</span>
            <span>Condividi</span>
          </button>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="pubblicazioni__btn"
            title="Visualizza a schermo intero"
          >
            <span>{isFullscreen ? '⤦' : '⛶'}</span>
            <span>{isFullscreen ? 'Esci' : 'Schermo intero'}</span>
          </button>
        </div>
      </header>

      {/* ── Main Native Flipbook Viewer ─────────────────────── */}
      <div
        ref={viewerRef}
        className={`pubblicazioni__viewer-wrap ${isFullscreen ? 'pubblicazioni__viewer-wrap--fullscreen' : ''}`}
      >
        {isFullscreen && (
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="pubblicazioni__fs-exit-btn"
          >
            ✕ Esci dallo schermo intero
          </button>
        )}

        <NativeFlipbook key={activeVolume.id} volume={activeVolume} />
      </div>

      {/* ── Bottom Bar / Metadati Singola Riga ──────────────── */}
      <footer className="pubblicazioni__meta">
        <div className="pubblicazioni__meta-inner">
          <div className="pubblicazioni__meta-left">
            <h2 className="pubblicazioni__meta-title">
              {activeVolume.number} — {activeVolume.title} ({activeVolume.format})
            </h2>
          </div>

          <div className="pubblicazioni__meta-right">
            <span>Domenico Mataluna</span>
            <span className="pubblicazioni__meta-sep">·</span>
            <span>Tesi di Laurea in Design della Comunicazione</span>
            <span className="pubblicazioni__meta-sep">·</span>
            <a
              href={activeVolume.viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pubblicazioni__adobe-link"
            >
              Link originale Adobe ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
