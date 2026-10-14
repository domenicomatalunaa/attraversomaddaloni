import '../pages/Metodo.css'
import './Brand.css'
import DragGallery from '../components/ui/DragGallery'

function ImgBlock({ ratio = '16/9', label = '', className = '' }) {
  return (
    <div className={`img-block ${className}`} style={{ aspectRatio: ratio }}>
      <div className="img-block__label">{label}</div>
    </div>
  )
}

export default function Brand() {
  return (
    <div className="brand-view page-enter">
      <div className="container">

        {/* Header */}
        <header className="view-header" style={{ textAlign: 'center' }}>
          <p className="view-header__eyebrow">
            LABORATORIO <span>·</span> CO-PROGETTAZIONE <span>·</span> MARZO 2026 – OTTOBRE 2026
          </p>
          <h1 className="view-header__title">La nuova identità della città</h1>
          <p className="view-header__lead">
            Come può un sistema visivo contemporaneo sintetizzare la complessità storica di un territorio senza cadere nella standardizzazione commerciale?
          </p>
        </header>

        <DragGallery items={[
          { src: '/images/brand-hero.jpg', label: 'Sistema visivo completo — vista d\'insieme', ratio: '16/9' },
          { src: '/images/brand-composizione.jpg', label: 'Logotipo Tifata su sfondo blu', ratio: '4/3' },
          { src: '/images/home-fase3-brand.jpg', label: 'Applicazione su poster istituzionale', ratio: '4/3' },
          { src: '/images/home-fase3-carattere.jpg', label: 'Carattere tipografico', ratio: '4/3' },
        ]} />

        {/* Hero image brand */}
        <div className="brand-hero-img">
          <img
            src="/images/brand-hero.jpg"
            alt="Sistema visivo Maddaloni"
            style={{ width: '100%', borderRadius: 'var(--r-lg)', objectFit: 'cover', aspectRatio: '21/9', display: 'block' }}
          />
        </div>

        {/* Il brand è tuo */}
        <div className="section--sm">
          <div className="scheda-layout">
            <div className="scheda-layout__aside">
              <h3>Il brand è tuo,<br />è quello che hai chiesto.</h3>
              <p>
                Questo sistema visivo non è il risultato di un'intuizione calata dall'alto o di una scelta estetica arbitraria. È la traduzione esatta delle risposte, dei dati e delle percezioni emersi durante la fase di indagine collettiva.
              </p>
            </div>
            <div>
              <img
                src="/images/brand-composizione.jpg"
                alt="Composizione brand"
                style={{ width: '100%', borderRadius: 'var(--r-md)', objectFit: 'cover', aspectRatio: '4/3', display: 'block' }}
              />
            </div>
          </div>
        </div>

        {/* Citazione display */}
        <div className="brand-quote">
          <blockquote>
            Ogni linea, spessore e dettaglio geometrico del carattere tipografico non è una decorazione, ma un indicatore di direzione. Il design agisce come una mappa visiva silenziosa, progettata per ricondurre chi lo guarda verso lo spirito autentico e la memoria storica del luogo.
          </blockquote>
        </div>

        {/* Progettare insieme */}
        <div className="section--sm" style={{ borderTop: '1px solid var(--c-gray-200)', paddingTop: 'var(--sp-64)' }}>
          <p className="section-label text-blue">Progettare insieme</p>
          <div className="brand-body">
            <p>
              La scelta di integrare texture e gradienti caratterizzati da una forte granulositàrisponde direttamente alla percezione collettiva emersa dai sondaggi, nei quali la città è stata ripetutamente descritta attraverso l'aggettivo "ruvida".
            </p>
            <p>
              Invece di eludere questa definizione, il progetto non opera un ribaltamento semantico: la ruvidità cessa di essere un attributo di degrado o trascuratezza per diventare un valore identitario, una cifra di autenticità che conferisce profondità e carattere all'intero impianto grafico.
            </p>
            <p>
              L'adozione di queste cromie non funge da semplice contrappunto estetico, ma agisce come elemento unificante, capace di infondere vitalità al rigore geometrico del carattere tipografico e di restituire alla comunità un'identità che, pur restando ancorata alla memoria storica del territorio, si proietta con decisione verso un nuovo, consapevole assetto visivo.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: 'var(--sp-48) 0', borderTop: '1px solid var(--c-gray-200)' }}>
          <a href="/risorse" className="btn btn--primary">
            ↓ Scarica tutto il brand
          </a>
        </div>

      </div>
    </div>
  )
}
