import { Link } from 'react-router-dom'
import '../pages/Metodo.css'
import DashboardSondaggio from './DashboardSondaggio'
import DragGallery from '../components/ui/DragGallery'
import SemanticRadarChart from '../components/charts/SemanticRadarChart'
import ArchetypesDemographicsChart from '../components/charts/ArchetypesDemographicsChart'
import BipolarAndDOSChart from '../components/charts/BipolarAndDOSChart'
import EditorialLexiconChart from '../components/charts/EditorialLexiconChart'

function StatPill({ label, values }) {
  return (
    <div className="stat-pill">
      <span className="stat-pill__label">{label}</span>
      <div className="stat-pill__values">
        {values.map((v, i) => (
          <span key={i} className="badge">{v}</span>
        ))}
      </div>
    </div>
  )
}

export default function Sondaggio() {
  return (
    <div className="page-enter">
      <div className="container">
        <header className="view-header" style={{ textAlign: 'center' }}>
          <h1 className="view-header__title">
            Maddaloni si sente:<br />opaca, frammentata, ruvida
          </h1>
          <p className="view-header__lead">
            Abbiamo chiesto ai cittadini di descrivere l'anima della città. Oggi, Maddaloni viene percepita in modo molto netto: è avvertita come prevalentemente antica, fortemente popolare e senza dubbio ruvida, ma con un'anima anche piuttosto pesante.
          </p>
        </header>

        <DragGallery items={[
          { src: '/images/sondaggio-hero.jpg', label: 'Indagine percettiva — campione 383 rispondenti', ratio: '16/9' },
          { src: '/images/sondaggio-questionario.jpg', label: 'Modulo questionario — Maddaloni attraverso i tuoi occhi', ratio: '4/3' },
          { src: '/images/home-fase2-sondaggio.jpg', label: 'Fase di analisi dati percettivi', ratio: '4/3' },
        ]} />

        {/* Grafici Scientifici Interattivi dal layout di Tesi */}
        <div style={{ marginBlock: '4rem' }}>
          <SemanticRadarChart />
          <div style={{ height: '2rem' }}></div>
          <ArchetypesDemographicsChart />
          <div style={{ height: '2rem' }}></div>
          <EditorialLexiconChart />
          <div style={{ height: '2rem' }}></div>
          <BipolarAndDOSChart />
        </div>



        {/* Reflections */}
        <div className="section--sm">
          <h2 className="h3" style={{ marginBottom: 'var(--sp-24)' }}>L'indagine</h2>
          <div className="sondaggio-body">
            <p>
              Attraverso questa indagine, 383 sguardi si sono incrociati per restituirci un ritratto di Maddaloni attraverso questa lente non significa fermarsi a una fotografia statica, ma accettarne la materia complessa.
            </p>
            <p>
              I contrasti emersi non sono contraddizioni da nascondere, ma le fondamenta reali su cui costruire. Questa indagine ci restituisce l'immagine di una comunità che non cerca risposte rassicuranti o finzioni patinate: chiede visione.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
