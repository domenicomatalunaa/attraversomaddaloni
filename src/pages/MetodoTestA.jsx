import { Link } from 'react-router-dom'
import './Metodo.css'
import Stemmi from '../views/Stemmi'
import Sondaggio from '../views/Sondaggio'
import Lezioni from '../views/Lezioni'
import Brand from '../views/Brand'

export default function MetodoTestA() {
  return (
    <div className="metodo page-enter">
      {/* Test A Banner */}
      <div style={{ background: '#0D0D0D', color: '#fff', padding: '0.6rem 1rem', textAlign: 'center', fontSize: '0.85rem' }}>
        <strong>OPZIONE A: Storytelling Puro</strong> — Racconto immersivo continuo. Gli strumenti interattivi vivono in <Link to="/strumenti" style={{ color: '#2020FF', textDecoration: 'underline' }}>Strumenti</Link>.
        <span style={{ marginLeft: '1rem', opacity: 0.6 }}>· Confronta con: </span>
        <Link to="/test-b/progetto" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 'bold' }}>Vai all'Opzione B (Hub)</Link>
      </div>

      <section className="metodo__hero">
        <div className="container">
          <h1 className="metodo__hero-title display">
            Il metodo che ha portato<br />alla marca di Maddaloni
          </h1>
          <p className="metodo__hero-desc">
            Un percorso lineare in tre fasi: dalla stratificazione delle fonti storiche,
            all'ascolto della comunità locale, fino alla sintesi visiva finale.
          </p>
        </div>
      </section>

      {/* Storytelling continuo senza tab bar farraginosa */}
      <div className="container section--sm">
        <article className="progetto-story-block" style={{ marginBottom: '5rem', borderBottom: '1px solid var(--c-gray-200)', paddingBottom: '4rem' }}>
          <p className="section-label">FASE 1 · LUGLIO 2025 – OTTOBRE 2026</p>
          <Stemmi />
        </article>

        <article className="progetto-story-block" style={{ marginBottom: '5rem', borderBottom: '1px solid var(--c-gray-200)', paddingBottom: '4rem' }}>
          <p className="section-label">FASE 2 · OTTOBRE 2026 – FEBBRAIO 2026</p>
          <Sondaggio />
          <div style={{ marginTop: '3rem' }}>
            <Lezioni />
          </div>
        </article>

        <article className="progetto-story-block" style={{ marginBottom: '5rem' }}>
          <p className="section-label">FASE 3 · MARZO 2026 – OTTOBRE 2026</p>
          <Brand />
        </article>
      </div>
    </div>
  )
}
