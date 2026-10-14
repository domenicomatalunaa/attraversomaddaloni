import '../pages/Metodo.css'
import DashboardLezioni from './DashboardLezioni'
import DragGallery from '../components/ui/DragGallery'
import WorkshopMapPerceptionChart from '../components/charts/WorkshopMapPerceptionChart'

function ImgBlock({ ratio = '16/9', label = '' }) {
  return (
    <div className="img-block" style={{ aspectRatio: ratio }}>
      <div className="img-block__label">{label}</div>
    </div>
  )
}

export default function Lezioni() {
  return (
    <div className="page-enter">
      <div className="container">
        <header className="view-header" style={{ textAlign: 'center' }}>
          <p className="view-header__eyebrow">
            FASE DUE <span>·</span> OTTOBRE 2026 – FEBBRAIO 2026
          </p>
          <h1 className="view-header__title">Le lezioni con i ragazzi</h1>
          <p className="view-header__lead">
            19 studenti tra 14 e 18 anni hanno associato forme geometriche e sensazioni ai luoghi di Maddaloni. I dati rivelano che il cuore pulsante della socialità è il Convitto Nazionale, mentre zone come Piazza Matteotti evocano tensioni differenti.
          </p>
        </header>

        <DragGallery items={[
          { src: '/images/lezioni-workshop-1.jpg', label: 'Workshop al Convitto — sessione 1', ratio: '4/3' },
          { src: '/images/lezioni-workshop-2.jpg', label: 'Lavagna collettiva — sessione 2', ratio: '4/3' },
          { src: '/images/lezioni-mappa.jpg', label: 'Mappa cognitiva dei luoghi — studenti', ratio: '4/3' },
          { src: '/images/home-fase2-lezioni.jpg', label: 'Presentazione risultati agli studenti', ratio: '4/3' },
        ]} />

        {/* Intro */}
        <div className="section--sm" style={{ borderBottom: '1px solid var(--c-gray-200)' }}>
          <p className="section-label">VISIONE D'INSIEME</p>
          <p style={{ fontSize: 'var(--text-lead)', lineHeight: 'var(--lh-relaxed)', color: 'var(--c-gray-600)', maxWidth: '720px' }}>
            I principali poli positivi dell'identità urbana sono Brevi Rimedi, Da Gerardo, Drink House. Al contrario, le dinamiche di tensione si concentrano soprattutto nel cuore del centro storico e in alcuni punti di aggregazione della periferia, dove i giovani avvertono un minor senso di sicurezza.
          </p>
        </div>

        {/* Sezione mappe */}
        <div className="section--sm">
          <div className="scheda-layout">
            <div className="scheda-layout__aside">
              <h3>Mappa delle percezioni</h3>
              <p>22 luoghi · 51 associazioni · 19 studenti</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                {[
                  { color: '#2020FF', label: 'Socialità', count: '16 luoghi' },
                  { color: '#CC3300', label: 'Tensione', count: '2 luoghi' },
                  { color: '#0044CC', label: 'Dovere', count: '4 luoghi' },
                ].map(({ color, label, count }) => (
                  <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--text-small)' }}>
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: color, display: 'inline-block' }} />
                    {label} · {count}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <img
                src="/images/lezioni-mappa.jpg"
                alt="Bubble map — luoghi per emozione"
                style={{ width: '100%', borderRadius: 'var(--r-md)', objectFit: 'cover', aspectRatio: '4/3', display: 'block' }}
              />
            </div>
          </div>
        </div>

        {/* Mappatura Adesivi Workshop Stile Tesi */}
        <WorkshopMapPerceptionChart />

        {/* Conclusioni */}
        <div className="section--sm">
          <p className="section-label text-blue">I Risultati</p>
          <p style={{ fontSize: 'var(--text-lead)', maxWidth: 720, color: 'var(--c-gray-600)', lineHeight: 'var(--lh-relaxed)' }}>
            I risultati di questo percorso aprono una finestra inedita sulla città: un universo in cui la quotidianità cambia significato a seconda della sensibilità individuale, oscillando tra il bisogno di sicurezza e il peso delle tensioni urbane.
          </p>
        </div>
      </div>
    </div>
  )
}
