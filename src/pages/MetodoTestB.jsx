import { Link } from 'react-router-dom'
import './Metodo.css'

const hubFasi = [
  {
    phase: 'FASE 01',
    date: 'LUGLIO 2025 – OTTOBRE 2026',
    title: 'La storia ed il DNA visivo',
    desc: 'Analisi delle fonti epigrafiche, stemmi e radici storiche della città presso il Convitto Nazionale.',
    href: '/progetto/stemmi',
    imgSrc: '/images/home-fase1-stemmi.jpg',
    toolBadge: 'Archivio Vettoriale Stemmi'
  },
  {
    phase: 'FASE 02',
    date: 'OTTOBRE 2026 – FEBBRAIO 2026',
    title: 'Progettazione Partecipata & Dati',
    desc: 'Il sondaggio su oltre 200 residenti e i laboratori visivi svolti con gli studenti maddalonesi.',
    href: '/progetto/sondaggio',
    imgSrc: '/images/home-fase2-sondaggio.jpg',
    toolBadge: 'Dashboard Sondaggio Live'
  },
  {
    phase: 'FASE 03',
    date: 'MARZO 2026 – OTTOBRE 2026',
    title: 'Sintesi Visiva & Carattere Tipografico',
    desc: 'Creazione del font Tifata Display e del sistema di identità visiva scalabile e contemporaneo.',
    href: '/progetto/carattere',
    imgSrc: '/images/home-fase3-carattere.jpg',
    toolBadge: 'Type Specimen Interattivo'
  }
]

export default function MetodoTestB() {
  return (
    <div className="metodo page-enter">
      {/* Test B Banner */}
      <div style={{ background: '#0D0D0D', color: '#fff', padding: '0.6rem 1rem', textAlign: 'center', fontSize: '0.85rem' }}>
        <strong>OPZIONE B: Hub & Spoke</strong> — Indice leggero delle Fasi a card interattive. Ogni modulo apre la sua scheda dedicata.
        <span style={{ marginLeft: '1rem', opacity: 0.6 }}>· Confronta con: </span>
        <Link to="/test-a/progetto" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 'bold' }}>Vai all'Opzione A (Storytelling)</Link>
      </div>

      <section className="metodo__hero">
        <div className="container">
          <h1 className="metodo__hero-title display">
            L'Indice del Metodo
          </h1>
          <p className="metodo__hero-desc">
            Seleziona una delle tre fasi di ricerca e progettazione per esplorarne il percorso,
            i dati raccolti e gli strumenti applicativi dedicati.
          </p>
        </div>
      </section>

      <div className="container section--sm">
        <div className="grid-3" style={{ gap: '2rem' }}>
          {hubFasi.map((item, idx) => (
            <div key={idx} className="card-approfondimento" style={{
              border: '1px solid var(--c-gray-200)',
              borderRadius: 'var(--r-lg)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'var(--c-white)'
            }}>
              <div>
                <Link to={item.href} className="card-approfondimento__img-wrap" style={{ marginBottom: '1.25rem' }}>
                  <img src={item.imgSrc} alt={item.title} className="card-approfondimento__img" />
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="phase-tag" style={{ margin: 0 }}>{item.phase}</span>
                  <span className="badge badge--blue" style={{ fontSize: '0.7rem' }}>{item.toolBadge}</span>
                </div>
                <h3 className="card-approfondimento__title" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                  <Link to={item.href}>{item.title}</Link>
                </h3>
                <p className="card-approfondimento__desc" style={{ marginBottom: '1.5rem' }}>
                  {item.desc}
                </p>
              </div>

              <div>
                <p className="text-micro" style={{ color: 'var(--c-gray-400)', marginBottom: '0.75rem' }}>{item.date}</p>
                <Link to={item.href} className="btn btn--outline" style={{ width: '100%', justifyContent: 'center' }}>
                  Esplora questa Fase →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
