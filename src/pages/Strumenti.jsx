import './Strumenti.css'
import Carattere from '../views/Carattere'

function ImgBlock({ ratio = '4/3', label = '' }) {
  return (
    <div className="img-block" style={{ aspectRatio: ratio }}>
      <div className="img-block__label">{label}</div>
    </div>
  )
}

export default function Strumenti() {
  return (
    <div className="strumenti page-enter">

      {/* Hero */}
      <section className="strumenti__hero">
        <div className="container">
          <h1 className="strumenti__title display">Strumenti per<br />la comunità</h1>
        </div>
      </section>

      {/* Main section */}
      <div className="container section">

        {/* Blocco 1 */}
        <div className="strumenti__block">
          <div className="strumenti__block-text">
            <h2 className="strumenti__block-title">
              Condividi il tuo messaggio<br />in maniera semplice
            </h2>
            <p>
              Questo generatore intuitivo è stato progettato per democratizzare l'uso dell'identità visiva, mettendola direttamente a disposizione dei cittadini.
            </p>
            <p>
              Chiunque abbia la necessità di comunicare un'iniziativa sul territorio, dalla liceale che promuove un club del libro all'associazione locale che organizza un evento pubblico, può utilizzare l'editor per creare locandine fisiche o post per Instagram. Lo strumento permette di appropriarsi della nuova grammatica visiva di Maddaloni e di personalizzarla, integrando all'interno del layout flessibile i propri colori e il proprio logo, senza alterare la coerenza complessiva del brand urbano.
            </p>
          </div>
          <div className="strumenti__block-imgs">
            <ImgBlock ratio="4/3" label="Generatore locandine — screenshot 1" />
            <ImgBlock ratio="4/3" label="Generatore locandine — screenshot 2" />
          </div>
        </div>

        {/* Big claim */}
        <div className="strumenti__claim">
          <p>
            Il generatore di locandine si pone come strumento di sintesi finale: una piattaforma interattiva che permette a chiunque di manipolare il linguaggio visivo del brand urbano per produrre, in pochi passaggi, manifesti e post digitali pronti per la comunicazione pubblica.
          </p>
        </div>

        {/* Come funziona */}
        <div className="strumenti__how">
          <p className="section-label text-blue">Come funziona</p>
          <p>
            Il funzionamento dell'editor si basa su una serie di vincoli grafici pre-programmati che guidano l'utente nella composizione del layout. È sufficiente inserire i testi, caricare i propri asset e scegliere le combinazioni cromatiche: il sistema applicherà automaticamente il carattere tipografico e le griglie di impaginazione.
          </p>
          <p style={{ marginTop: '1rem' }}>
            Utilizzare questo strumento significa semplificare i tempi di produzione grafica e, al tempo stesso, contribuire a eliminare il degrado visivo e la frammentazione della comunicazione locale, parlando alla città con una voce istituzionale unica, colta e coordinata.
          </p>
        </div>

        {/* CTA */}
        <div className="strumenti__cta">
          <a
            href="/generatore/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary"
          >
            ↗ Inizia a creare ora
          </a>
          <p className="strumenti__cta-note">
            Il generatore si apre in una nuova finestra
          </p>
        </div>
      </div>

      {/* Type Tester Specimen Tool */}
      <div id="carattere" style={{ borderTop: '1px solid var(--c-gray-200)', paddingTop: '4rem' }}>
        <Carattere />
      </div>
    </div>
  )
}
