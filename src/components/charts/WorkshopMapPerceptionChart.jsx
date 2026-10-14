import { useState } from 'react'

const shapesData = [
  { shape: 'Cerchio', pct: 47.1, count: 96, color: '#0F172A' },
  { shape: 'Quadrato', pct: 28.9, count: 59, color: '#64748B' },
  { shape: 'Triangolo', pct: 24.0, count: 49, color: '#94A3B8' },
]

const workshopSteps = [
  {
    num: 1,
    title: 'Socialità',
    desc: 'Gli esercizi commerciali di ristorazione informale e i locali di ritrovo giovanile del centro rappresentano le vere ancore affettive dei ragazzi, descritti come spazi che «ispirano felicità e voglia di parlare» e dove «ci si riunisce dopo le assemblee».'
  },
  {
    num: 2,
    title: 'Tensione',
    desc: 'L\'edificio pubblico del Convitto rivela una complessa dualità percettiva. Se da un lato viene riconosciuto come quadrato per il suo ruolo di «stabilità e regolarità», dall\'altro è saturato da triangoli che denotano «tensione, ansia e rigidezza burocratica», definendolo come una «fonte di esaurimento ma anche di ricordi indelebili».'
  },
  {
    num: 3,
    title: 'Pericolo e frizione urbana',
    desc: 'Alcuni spazi pubblici centrali, alcune aree verdi e snodi di passaggio registrano una concentrazione di triangoli legati a episodi di micro-criminalità e percezione di pericolo. Le trascrizioni dirette degli studenti restituiscono la geografia di una città vissuta con circospezione: si va dalla percezione di spazi pubblici «dove prima la sicurezza non era tanta e non ci si poteva rilassare»...'
  }
]

function HorizontalBarMinimal({ label, pct, count, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', minHeight: '28px', marginBottom: '8px' }}>
      {/* Etichetta con Geometria Visiva */}
      <div style={{ 
        width: '100px', 
        paddingRight: '16px', 
        display: 'flex', 
        alignItems: 'center', 
        borderRight: '1px solid #000'
      }}>
        <div style={{ width: '20px', display: 'flex', justifyContent: 'center', marginRight: '6px' }}>
          {label === 'Cerchio' && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color }} />}
          {label === 'Quadrato' && <div style={{ width: '12px', height: '12px', background: color }} />}
          {label === 'Triangolo' && <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: `12px solid ${color}` }} />}
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#000' }}>{label}</span>
      </div>
      {/* Barra */}
      <div style={{ flex: 1, paddingLeft: '2px', display: 'flex', alignItems: 'center' }}>
        <div style={{ 
          height: '24px', 
          width: `${pct}%`, 
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '8px',
          transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <span style={{ fontSize: '0.65rem', color: '#FFF' }}>{count} adesivi ({pct}%)</span>
        </div>
      </div>
    </div>
  )
}

export default function WorkshopMapPerceptionChart() {
  return (
    <div style={{ marginBlock: '4rem', fontFamily: 'var(--font-body)' }}>
      <div className="grid-2" style={{ gap: '4rem', alignItems: 'flex-start' }}>

        {/* Colonna Sinistra (Testo e Grafico) */}
        <div>
          <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#000' }}>
            Elaborazione delle mappe percettive
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#333', lineHeight: 1.5, marginBottom: '1rem' }}>
            Nel primo modulo del workshop, agli studenti del Liceo annesso al Convitto è
            stata fornita una mappa A2 della città e un kit di adesivi geometrici da posi-
            zionare sul territorio: il cerchio per indicare i luoghi di aggregazione spontanea
            e appartenenza, il quadrato per gli spazi istituzionali o della routine scolastica,
            e il triangolo per segnalare le aree percepite come degradate, ansiogene o in-
            sicure. Ogni partecipante ha poi motivato i singoli posizionamenti compilando
            una scheda analitica individuale.
          </p>
          <p style={{ fontSize: '0.85rem', color: '#333', lineHeight: 1.5, marginBottom: '2.5rem' }}>
            Dall'analisi dei 204 marker complessivi emerge una netta polarizzazione
            (Fig. 3.13): la mappa è ampiamente dominata dai luoghi della socialità informale,
            seguiti dalle infrastrutture del controllo istituzionale e dai punti di criticità ur-
            bana. 
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '3rem' }}>
            {shapesData.map(d => (
              <HorizontalBarMinimal key={d.shape} {...d} />
            ))}
          </div>

          {/* Steps 1 & 2 (Sinistra) */}
          <div style={{ position: 'relative', paddingLeft: '40px' }}>
            <div style={{ 
              position: 'absolute', 
              top: '12px', 
              bottom: '-30px', /* Extends down */
              left: '12px', 
              width: '1px', 
              borderLeft: '1px dashed #000',
              zIndex: 0
            }} />
            
            {workshopSteps.slice(0, 2).map(s => (
              <div key={s.num} style={{ position: 'relative', marginBottom: '2rem' }}>
                <div style={{
                  position: 'absolute',
                  left: '-40px',
                  top: '0',
                  width: '25px',
                  height: '25px',
                  borderRadius: '50%',
                  background: '#FFF',
                  border: '1px solid #000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#000',
                  zIndex: 1
                }}>
                  {s.num}
                </div>
                <div>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#000', marginBottom: '2px' }}>
                    {s.title}
                  </h5>
                  <p style={{ fontSize: '0.85rem', color: '#333', lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonna Destra (Testo continuo e Step 3) */}
        <div>
          {/* Step 3 (Destra in alto) */}
          <div style={{ position: 'relative', paddingLeft: '40px', marginBottom: '2.5rem', marginTop: '1rem' }}>
            <div style={{ 
              position: 'absolute', 
              top: '-30px', 
              bottom: '12px', 
              left: '12px', 
              width: '1px', 
              borderLeft: '1px dashed #000',
              zIndex: 0
            }} />
            
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '-40px',
                top: '0',
                width: '25px',
                height: '25px',
                borderRadius: '50%',
                background: '#FFF',
                border: '1px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#000',
                zIndex: 1
              }}>
                {workshopSteps[2].num}
              </div>
              <div>
                <p style={{ fontSize: '0.85rem', color: '#333', lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                  conferma la centralità del Convitto non come semplice luogo di studio, ma
                  come locus emotivo e formativo primario, dove la rigidità delle regole si fonde
                  con la costruzione di ricordi giovanili indelebili.
                </p>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#000', marginTop: '1rem', marginBottom: '2px' }}>
                  {workshopSteps[2].title}
                </h5>
                <p style={{ fontSize: '0.85rem', color: '#333', lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                  {workshopSteps[2].desc}
                </p>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#333', lineHeight: 1.5, marginBottom: '1rem' }}>
            La sperimentazione condotta attraverso il focus group ha fatto emergere un
            dato qualitativo cruciale: la presenza di una geografia diffusa di vulnerabilità
            e frizione urbana, fatta di snodi deserti o percepiti come insicuri. Replicato
            su scala più ampia all'interno delle politiche urbane, questo modello di map-
            patura partecipativa si potrebbe rivelare uno strumento prezioso.
          </p>
          <p style={{ fontSize: '0.85rem', color: '#333', lineHeight: 1.5 }}>
            Sul piano metodologico, le evidenze emerse da questo gruppo pilota (19
            studenti) non modificano né alterano la terna semantica del DOS, determi-
            nata a monte dall'indagine quantitativa sui 400 cittadini. Al contrario, questi
            dati qualitativi operano come una preziosa chiave interpretativa: incrociando
            il dato statistico della città «frammentata» con i racconti diretti dei ragaz-
            zi, gli aggettivi del brief smettono di essere formule astratte.
          </p>
        </div>

      </div>
    </div>
  )
}
