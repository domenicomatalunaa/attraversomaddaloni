import { Link } from 'react-router-dom'
import './Metodo.css'
import Stemmi from '../views/Stemmi'
import Sondaggio from '../views/Sondaggio'
import Lezioni from '../views/Lezioni'
import Brand from '../views/Brand'

export default function Metodo() {
  return (
    <div className="metodo page-enter">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="metodo__hero">
        <div className="container">
          <h1 className="metodo__hero-title display">
            Il metodo che ha portato<br />alla marca di Maddaloni
          </h1>
          <p className="metodo__hero-desc">
            Un percorso lineare in tre fasi: dall&rsquo;analisi delle fonti epigrafiche e archivistiche,
            all&rsquo;ascolto partecipativo della comunità, fino alla sintesi visiva del brand urbano.
          </p>
        </div>
      </section>

      {/* ── Storytelling Continuo ────────────────────────── */}
      <div className="container section--sm">
        {/* FASE 1 */}
        <article className="progetto-story-block" style={{ marginBottom: '6rem', borderBottom: '1px solid var(--c-gray-200)', paddingBottom: '5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <span className="phase-tag" style={{ margin: 0, fontSize: '0.85rem' }}>FASE 01 · LA STORIA ED IL DNA</span>
            <span className="text-micro" style={{ color: 'var(--c-gray-400)' }}>LUGLIO 2025 – OTTOBRE 2026</span>
          </div>
          <Stemmi />
        </article>

        {/* FASE 2 */}
        <article className="progetto-story-block" style={{ marginBottom: '6rem', borderBottom: '1px solid var(--c-gray-200)', paddingBottom: '5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <span className="phase-tag" style={{ margin: 0, fontSize: '0.85rem' }}>FASE 02 · PROGETTAZIONE PARTECIPATA</span>
            <span className="text-micro" style={{ color: 'var(--c-gray-400)' }}>OTTOBRE 2026 – FEBBRAIO 2026</span>
          </div>
          <Sondaggio />
          <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px dashed var(--c-gray-200)' }}>
            <Lezioni />
          </div>
        </article>

        {/* FASE 3 */}
        <article className="progetto-story-block" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <span className="phase-tag" style={{ margin: 0, fontSize: '0.85rem' }}>FASE 03 · SINTESI VISIVA E APPLICAZIONI</span>
            <span className="text-micro" style={{ color: 'var(--c-gray-400)' }}>MARZO 2026 – OTTOBRE 2026</span>
          </div>
          <Brand />
        </article>

        {/* Callout agli Strumenti Interattivi */}
        <div style={{
          background: 'var(--c-gray-100)',
          borderRadius: 'var(--r-lg)',
          padding: 'clamp(2rem, 5vw, 3.5rem)',
          border: '1px solid var(--c-gray-200)',
          marginTop: '4rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          alignItems: 'flex-start'
        }}>
          <span className="badge badge--blue">Area Operativa</span>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 900, textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
            Esplora gli strumenti interattivi
          </h3>
          <p style={{ color: 'var(--c-gray-600)', maxWidth: '640px', lineHeight: 1.6 }}>
            Per provare dal vivo il carattere tipografico nativo <em>Tifata Display</em>, esplorare i dati analitici del sondaggio o accedere al generatore di poster, visita la sezione dedicata.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <Link to="/strumenti" className="btn btn--primary">
              ↗ Vai agli Strumenti
            </Link>
            <Link to="/strumenti#carattere" className="btn btn--outline">
              Provalo nel Type Specimen
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
