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
