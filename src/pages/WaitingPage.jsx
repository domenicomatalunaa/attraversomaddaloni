import { Link } from 'react-router-dom'
import LivingInkHeroBackground from '../components/generative/LivingInkHeroBackground'
import { SITE_CONFIG } from '../config'
import './WaitingPage.css'

export default function WaitingPage() {
  return (
    <div className="waiting-page">
      {/* Sfondo generativo Living Ink con reazione al cursore */}
      <div className="waiting-page__canvas-wrapper">
        <LivingInkHeroBackground
          macroWord="MADDALONI"
          microText="ATTRAVERSO MADDALONI STIAMO COSTRUENDO "
          color="#ffffff"
          baseOpacity={0.11}
          interactive={true}
        />
      </div>

      {/* Header con Monogramma */}
      <header className="waiting-page__header">
        <div className="waiting-page__logo-link">
          <img
            src="/images/monogramma.svg"
            alt="Monogramma Maddaloni"
            className="waiting-page__logo"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="waiting-page__content">
        <p className="waiting-page__tagline">
          {SITE_CONFIG.subtitle}
        </p>

        <h1 className="waiting-page__title">
          {SITE_CONFIG.title}
        </h1>

        <div className="waiting-page__bodytext">
          <p className="waiting-page__lead">
            Attraversare la città per riscoprirne il carattere.
          </p>
          <p className="waiting-page__desc">
            Uno spazio digitale aperto, generativo e condiviso per esplorare il patrimonio, gli eventi e i luoghi di Maddaloni.
          </p>
          <p className="waiting-page__closing">
            Stiamo preparando il viaggio. A presto.
          </p>
        </div>

        {/* Callout Volumi Tesi Sfogliabili */}
        <div className="waiting-page__publications">
          <span className="waiting-page__pub-label">Sfoglia i due volumi completi della tesi:</span>
          <div className="waiting-page__pub-links">
            <Link to="/tesi" className="waiting-page__pub-btn">
              <span className="waiting-page__pub-icon">📖</span>
              <span className="waiting-page__pub-btn-text">
                <strong>Vol. 1 · Tesi di Ricerca</strong>
                <small>17×24 cm · Adobe Publish Online</small>
              </span>
              <span className="waiting-page__pub-arrow">→</span>
            </Link>
            <Link to="/brandmanual" className="waiting-page__pub-btn">
              <span className="waiting-page__pub-icon">📕</span>
              <span className="waiting-page__pub-btn-text">
                <strong>Vol. 2 · Brand Manual</strong>
                <small>24×24 cm · Linee guida operative</small>
              </span>
              <span className="waiting-page__pub-arrow">→</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="waiting-page__footer">
        <div className="waiting-page__credits">
          <span className="waiting-page__author">{SITE_CONFIG.author}</span>
          <span>{SITE_CONFIG.degree}</span>
        </div>

        <div className="waiting-page__contact">
          <span>Info & Contatti:</span>
          <a href={`mailto:${SITE_CONFIG.email}`}>
            {SITE_CONFIG.email}
          </a>
        </div>
      </footer>
    </div>
  )
}
