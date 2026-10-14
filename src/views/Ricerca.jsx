import { Link } from 'react-router-dom'
import '../pages/Metodo.css'

function ImgBlock({ ratio = '4/3', label = '' }) {
  return (
    <div className="img-block" style={{ aspectRatio: ratio }}>
      <div className="img-block__label">{label}</div>
    </div>
  )
}

export default function Ricerca() {
  return (
    <div className="page-enter">
      <div className="container">
        <header className="view-header" style={{ textAlign: 'center' }}>
          <p className="view-header__eyebrow">
            RILIEVO STORICO <span>&nbsp;·&nbsp;</span> LUGLIO 2025 – OTTOBRE 2026
          </p>
          <h1 className="view-header__title">Il rilievo storico</h1>
          <p className="view-header__lead">
            Non si può progettare il futuro senza conoscere le tracce del passato. Abbiamo analizzato la stratificazione storico-visiva di Maddaloni, dalle simbologie del Convitto Nazionale alle testimonianze epigrafiche, per individuare i criteri estetici radicati nella memoria della città.
          </p>
        </header>

        {/* Phase 1 */}
        <div className="scheda-layout section--sm">
          <div className="scheda-layout__aside">
            <h3>Prima fase,<br />la storia ed il DNA</h3>
            <p>
              Non si può progettare il futuro senza conoscere le tracce del passato. Abbiamo analizzato la stratificazione storico-visiva di Maddaloni, dalle simbologie del Convitto Nazionale alle testimonianze epigrafiche, per individuare i criteri estetici radicati nella memoria della città.
            </p>
          </div>
          <div className="grid-2" style={{ gap: '1rem' }}>
            <div>
              <ImgBlock ratio="4/3" label="Fonti calligrafiche" />
              <p className="phase-tag" style={{ marginTop: '0.75rem' }}>FASE UNO, LUGLIO 2025 – OTTOBRE 2026</p>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Analisi delle fonti calligrafiche</h4>
              <p style={{ fontSize: 'var(--text-small)', color: 'var(--c-gray-600)' }}>
                Come può il segno grafico restituire l'identità stratificata di un territorio?
              </p>
              <Link to="/progetto/stemmi" className="btn btn--ghost" style={{ marginTop: '0.75rem' }}>
                ↗ Approfondisci
              </Link>
            </div>
            <div>
              <ImgBlock ratio="4/3" label="Stemmi e ricostruzioni" />
              <p className="phase-tag" style={{ marginTop: '0.75rem' }}>FASE UNO, LUGLIO 2025 – OTTOBRE 2026</p>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Stemmi e ricostruzioni</h4>
              <p style={{ fontSize: 'var(--text-small)', color: 'var(--c-gray-600)' }}>
                Come può un simbolo del passato evolversi senza perdere la sua sacralità istituzionale?
              </p>
              <Link to="/progetto/stemmi" className="btn btn--ghost" style={{ marginTop: '0.75rem' }}>
                ↗ Approfondisci
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
