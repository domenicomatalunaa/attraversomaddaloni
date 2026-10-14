import { Link } from 'react-router-dom'
import LivingInkHeroBackground from '../components/generative/LivingInkHeroBackground'
import './Home.css'

/* ── Placeholder image component ─────────────────────────── */
function ImgBlock({ ratio = '16/9', label = '', className = '' }) {
  return (
    <div
      className={`img-block ${className}`}
      style={{ aspectRatio: ratio }}
      aria-label={label || 'Immagine in arrivo'}
    >
      <div className="img-block__label">{label}</div>
    </div>
  )
}

/* ── Card Approfondimento ────────────────────────────────── */
function CardApprofondimento({ phase, date, title, desc, href = '#', imgSrc }) {
  return (
    <div className="card-approfondimento">
      <Link to={href} className="card-approfondimento__img-wrap">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={title}
            className="card-approfondimento__img"
          />
        ) : (
          <ImgBlock ratio="4/3" className="card-approfondimento__img" label={title} />
        )}
      </Link>
      <div className="card-approfondimento__body">
        <p className="phase-tag">{phase} · {date}</p>
        <h3 className="card-approfondimento__title">
          <Link to={href}>{title}</Link>
        </h3>
        <p className="card-approfondimento__desc">{desc}</p>
        <Link to={href} className="btn btn--ghost">
          ↗ Approfondisci
        </Link>
      </div>
    </div>
  )
}

/* ── Card Evento ─────────────────────────────────────────── */
function CardEvento({ date, luogo, tipo, title, desc, cta, href = '#', disabled = false }) {
  return (
    <div className="card-evento">
      <ImgBlock ratio="16/9" className="card-evento__img" label={title} />
      <div className="card-evento__body">
        <div className="card-evento__meta">
          <span className="badge">📅 {date}</span>
          <span className="badge">📍 {luogo}</span>
          <span className="badge badge--blue">🎟 {tipo}</span>
        </div>
        <h4 className="card-evento__title">{title}</h4>
        <p className="card-evento__desc">{desc}</p>
        {disabled ? (
          <button className="btn btn--outline" disabled aria-disabled="true">{cta}</button>
        ) : (
          <Link to={href} className="btn btn--outline">{cta}</Link>
        )}
      </div>
    </div>
  )
}

/* ── Card Asset ──────────────────────────────────────────── */
function CardAsset({ title, desc, cta, href = '#' }) {
  return (
    <div className="card-asset">
      <div className="card-asset__content">
        <h4 className="card-asset__title">{title}</h4>
        <p className="card-asset__desc">{desc}</p>
        <a href={href} className="btn btn--outline">↓ {cta}</a>
      </div>
    </div>
  )
}

/* ── HOME PAGE ───────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="home page-enter">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero" aria-labelledby="hero-title">
        <LivingInkHeroBackground macroWord="MADDALONI" microText="ATTRAVERSO MADDALONI " baseOpacity={0.14} />
        <div className="container">
          <div className="hero__content">
            <h1 className="hero__title display" id="hero-title">
              <span style={{ whiteSpace: 'nowrap' }}>Progettare un&rsquo;identità</span><br />
              <span style={{ whiteSpace: 'nowrap' }}>nativa: Maddaloni.</span>
            </h1>
            <p className="hero__desc">
              Un progetto di brand urbano nato dall&rsquo;incrocio tra la stratificazione storica e la percezione reale dei cittadini. Uno strumento metodologico pensato per restituire a Maddaloni un linguaggio visivo autentico, coerente e condiviso.
            </p>
          </div>
        </div>
      </section>

      {/* ── INTRO ────────────────────────────────────────── */}
      <section className="home-intro section" aria-label="Presentazione progetto">
        <div className="container">
          <p className="home-intro__text">
            Attraverso Maddaloni è lo studio pilota di un protocollo in tre fasi: analisi storico-visiva, percezione urbana e sistema adattivo.
          </p>
        </div>
      </section>

      {/* ── INTERVENTI IN EVIDENZA ───────────────────────── */}
      <section className="home-featured section--sm" aria-labelledby="featured-title">
        <div className="container">
          <div className="home-section-header">
            <h2 className="home-section-title" id="featured-title">Interventi in evidenza</h2>
            <p className="home-section-body">
              Superiamo il branding standardizzato: trasformiamo memoria e dati in un sistema visivo autentico. Attraverso Maddaloni è un ecosistema operativo che unisce ricerca, partecipazione e design per dotare il territorio di strumenti concreti, capaci di raccontare l&rsquo;identità cittadina con coerenza.
            </p>
          </div>

          <div className="grid-3" style={{ marginTop: 'var(--sp-48)' }}>
            <CardApprofondimento
              phase="FASE UNO"
              date="LUGLIO 2025 – OTTOBRE 2026"
              title="Analisi delle fonti calligrafiche"
              desc="Come può il segno grafico restituire l'identità stratificata di un territorio?"
              href="/progetto/stemmi"
              imgSrc="/images/home-fase1-calligrafia.jpg"
            />
            <CardApprofondimento
              phase="FASE DUE"
              date="OTTOBRE 2026 – FEBBRAIO 2026"
              title="Le lezioni con i ragazzi"
              desc="Come può il segno grafico restituire l'identità stratificata di un territorio?"
              href="/progetto/lezioni"
              imgSrc="/images/home-fase2-lezioni.jpg"
            />
            <CardApprofondimento
              phase="FASE TRE"
              date="MARZO 2026 – OTTOBRE 2026"
              title="La costruzione della Marca"
              desc="Come può un sistema visivo contemporaneo sintetizzare la complessità storica di un territorio?"
              href="/progetto/brand"
              imgSrc="/images/home-fase3-brand.jpg"
            />
          </div>
        </div>
      </section>

      {/* ── STRUMENTI, ASSET ─────────────────────────────── */}
      <section className="home-assets section--sm" aria-labelledby="assets-title">
        <div className="container">
          <div className="home-section-header">
            <h2 className="home-section-title" id="assets-title">Strumenti, asset</h2>
            <p className="home-section-body">
              In questa sezione sono raccolti i materiali tecnici, i dati di ricerca e gli strumenti operativi sviluppati durante il progetto Attraverso Maddaloni. Queste risorse sono messe a disposizione per giornalisti, progettisti e cittadini per approfondire la metodologia e applicare il sistema visivo in modo coerente.
            </p>
          </div>

          <div className="grid-2" style={{ marginTop: 'var(--sp-40)' }}>
            <CardAsset
              title="Usare l'identità"
              desc="Questo è un pacchetto dedicato ai progettisti che vogliono utilizzare la brand identity."
              cta="Scarica tutti gli asset"
              href="/risorse"
              accent="orange"
            />
            <CardAsset
              title="Press & Media Kit"
              desc="Foto ad alta risoluzione del progetto, ed un abstract con tutte le informazioni."
              cta="Scarica tutti gli asset"
              href="/risorse"
              accent="green"
            />
          </div>
        </div>
      </section>

    </div>
  )
}
