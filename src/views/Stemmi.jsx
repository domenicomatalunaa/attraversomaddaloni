import '../pages/Metodo.css'
import DragGallery from '../components/ui/DragGallery'

function SchedaStemmi({ title, desc, items }) {
  return (
    <div className="stemmi-block section--sm" style={{ borderBottom: '1px solid var(--c-gray-200)' }}>
      <div className="scheda-layout">
        <div className="scheda-layout__aside">
          <h3>{title}</h3>
          <p>{desc}</p>
        </div>
        {/* Galleria drag nella colonna destra */}
        <div>
          <DragGallery items={items} />
        </div>
      </div>
    </div>
  )
}

export default function Stemmi() {
  return (
    <div className="page-enter">
      <div className="container">
        <header className="view-header" style={{ textAlign: 'center' }}>
          <p className="view-header__eyebrow">
            ARALDICA <span>&nbsp;·&nbsp;</span> ANALISI <span>&nbsp;·&nbsp;</span> LUGLIO 2025 – OTTOBRE 2026
          </p>
          <h1 className="view-header__title">Stemmi e ricostruzioni</h1>
          <p className="view-header__lead">
            La ricerca si interroga sulla decostruzione degli elementi araldici locali per capire se sia possibile astrarre un codice visivo monumentale. In questa fase esploriamo il limite tra la rigidità del simbolo storico e la flessibilità del sistema visivo contemporaneo.
          </p>
        </header>

        <SchedaStemmi
          title="Una visione artistica"
          desc="L'opera grafica di Franco Imposimato costituisce una documentazione peculiare dell'immaginario urbano maddalonese. Nei suoi disegni, la città viene spogliata di ogni degenerazione contemporanea o degrado materico, restituendo un'estetica profondamente romantica e idealizzata."
          items={[
            { src: '/images/stemmi-imposimato-1.jpg', label: 'Disegno Imposimato 1 — veduta del Convitto', ratio: '3/4' },
            { src: '/images/stemmi-imposimato-2.jpg', label: 'Disegno Imposimato 2 — piazza storica', ratio: '3/4' },
            { src: '/images/home-fase1-stemmi.jpg', label: 'Disegno Imposimato 3 — architettura locale', ratio: '3/4' },
          ]}
        />

        <SchedaStemmi
          title="La ricostruzione dell'ingegnere Ignarra"
          desc="Nel settembre del 1939, a ridosso del secondo conflitto mondiale, l'Ingegnere F. Ignarra pubblica uno studio sistematico volto a riordinare l'iconografia araldica maddalonese. Il volume affronta una ricognizione storica dei vari stemmi attribuiti alla città nel corso dei secoli."
          items={[
            { src: '/images/stemmi-ignarra-1.jpg', label: 'Stemma storico — versione 1739', ratio: '3/4' },
            { src: '/images/home-fase1-calligrafia.jpg', label: 'Manoscritto Ignarra — tavola I', ratio: '3/4' },
          ]}
        />

        <SchedaStemmi
          title="Il De Sivo e la storia di Galazia"
          desc="La sezione dedicata alla storia di Galazia si articola come un'analisi critica delle stratificazioni documentali riguardanti l'origine e l'evoluzione delle insegne cittadine."
          items={[
            { src: '/images/home-fase1-stemmi.jpg', label: 'De Sivo — documento archivio 1', ratio: '3/4' },
            { src: '/images/stemmi-imposimato-2.jpg', label: 'De Sivo — documento archivio 2', ratio: '3/4' },
          ]}
        />

        <SchedaStemmi
          title="Analisi dei manoscritti del Convitto"
          desc="Lo studio dei manoscritti conservati al Convitto Nazionale 'Giordano Bruno' ha permesso di individuare lettere capitali e monogrammi che costituiscono la radice calligrafica del carattere Tifata."
          items={[
            { src: '/images/home-fase1-calligrafia.jpg', label: 'Manoscritto Convitto — 1847', ratio: '3/4' },
            { src: '/images/stemmi-ignarra-1.jpg', label: 'Monogramma archivio Convitto', ratio: '3/4' },
          ]}
        />
      </div>
    </div>
  )
}
