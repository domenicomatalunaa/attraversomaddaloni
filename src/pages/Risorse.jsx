import { Link } from 'react-router-dom'
import './Risorse.css'

function CardRisorsa({ title, desc, cta, href = '#', tag }) {
  return (
    <div className="risorsa-card">
      {tag && <span className="badge badge--blue" style={{ marginBottom: '1rem', alignSelf: 'flex-start' }}>{tag}</span>}
      <h3 className="risorsa-card__title">{title}</h3>
      <p className="risorsa-card__desc">{desc}</p>
      <a href={href} className="btn btn--outline" style={{ alignSelf: 'flex-start', marginTop: 'auto' }} download>
        ↓ {cta}
      </a>
    </div>
  )
}

export default function Risorse() {
  return (
    <div className="risorse page-enter">
      <section className="risorse__hero">
        <div className="container">
          <h1 className="risorse__title display">Risorse</h1>
          <p className="risorse__lead">
            In questa sezione sono raccolti i materiali tecnici, i dati di ricerca e gli strumenti operativi sviluppati durante il progetto Attraverso Maddaloni. Queste risorse sono messe a disposizione per giornalisti, progettisti e cittadini.
          </p>
        </div>
      </section>

      <div className="container section">
        {/* Banner Pubblicazioni Tesi */}
        <div style={{
          background: 'var(--c-blue, #2020FF)',
          color: '#ffffff',
          borderRadius: 'var(--r-lg)',
          padding: 'clamp(2rem, 4vw, 3rem)',
          marginBottom: '3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div style={{ maxWidth: '640px' }}>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', marginBottom: '0.75rem' }}>
              PUBBLICAZIONI UFFICIALI
            </span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 900, fontFamily: 'var(--font-display)', margin: '0.5rem 0 0.75rem 0', textTransform: 'uppercase' }}>
              I due volumi completi della tesi
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, margin: 0 }}>
              Sfoglia online il Volume 1 (la ricerca teorica e metodologica, 17×24 cm) e il Volume 2 (il Brand Manual operativo con tutte le linee guida del sistema d'identità, 24×24 cm).
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <Link to="/tesi" className="btn" style={{ background: '#ffffff', color: 'var(--c-blue, #2020FF)', fontWeight: 700 }}>
              📖 Sfoglia Volume 1 (Tesi)
            </Link>
            <Link to="/brandmanual" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.4)', fontWeight: 700 }}>
              📕 Sfoglia Volume 2 (Brand Manual)
            </Link>
          </div>
        </div>

        <div className="risorse__grid">
          <CardRisorsa
            tag="BRAND KIT"
            title="Usare l'identità"
            desc="Questo è un pacchetto dedicato ai progettisti che vogliono utilizzare la brand identity di Maddaloni nei loro lavori. Troverai: font variabile Tifata, palette cromatica, logotipi in tutti i formati, manuale d'uso."
            cta="Scarica tutti gli asset"
            href="#"
          />
          <CardRisorsa
            tag="PRESS KIT"
            title="Press & Media Kit"
            desc="Foto ad alta risoluzione del progetto, un abstract con tutte le informazioni necessarie per articoli e presentazioni, la bio del progettista e i contatti stampa."
            cta="Scarica il Media Kit"
            href="#"
          />
          <CardRisorsa
            tag="RICERCA"
            title="Dati del sondaggio"
            desc="Il dataset completo in formato CSV con le risposte al sondaggio percettivo 'Maddaloni attraverso i tuoi occhi'. 383 rispondenti, 14 domande, analisi completa."
            cta="Scarica i dati CSV"
            href="#"
          />
          <CardRisorsa
            tag="TIPOGRAFIA"
            title="Font Tifata — specimen PDF"
            desc="Lo specimen tipografico completo di Tifata: tutte le varianti di peso, il set di glifi, gli esempi d'uso e le note calligrafiche sul processo progettuale."
            cta="Scarica lo specimen"
            href="#"
          />
        </div>

        {/* Nota legale */}
        <div className="risorse__legal">
          <p>
            Tutti i contenuti sono rilasciati sotto licenza Creative Commons BY-NC-ND 4.0, salvo diversa indicazione. Ogni uso commerciale deve essere preventivamente autorizzato. Per informazioni: <a href="mailto:info@attraversomaddaloni.it" className="link-animated">info@attraversomaddaloni.it</a>
          </p>
        </div>
      </div>
    </div>
  )
}
