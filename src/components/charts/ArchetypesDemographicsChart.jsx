import { useState, useEffect } from 'react'

// ... (dati non modificati per brevità se non necessario, ma devo assicurarmi che il component renderizzi)
const archetipiData = [
  { name: 'Forrest Gump', sottotitolo: '(semplicità\ne resilienza)', pct: 42.8, color: '#0F172A' },
  { name: 'Indiana Jones', sottotitolo: '(ricerca storica)', pct: 29.5, color: '#64748B' },
  { name: 'Robin Hood', sottotitolo: '(giustizia sociale)', pct: 24.0, color: '#94A3B8' },
  { name: 'Mary Poppins', sottotitolo: '(rigore fantastico)', pct: 3.8, color: '#CBD5E1' },
]

const demografiaEta = [
  { fascia: '27 - 55 anni', risposte: 189, pct: 47.2 },
  { fascia: '14 - 18 anni', risposte: 74, pct: 18.5 },
  { fascia: '19 - 26 anni', risposte: 72, pct: 18.2 },
  { fascia: '55+ anni', risposte: 64, pct: 16.0 },
]

const demografiaRuolo = [
  { ruolo: 'Abitante\nstabile', risposte: 279, pct: 69.8 },
  { ruolo: 'Pendolare', risposte: 55, pct: 13.8 },
  { ruolo: 'Ex residente', risposte: 47, pct: 11.8 },
  { ruolo: 'Fruitore\nsaltuario', risposte: 19, pct: 4.8 },
]

// Componente per la riga del grafico a barre orizzontali stile editoriale
function EditorialBarRow({ label, sublabel, pct, valLabel, color = '#0F172A', isDarkText = false, mounted = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', minHeight: '36px', marginBottom: '8px' }}>
      {/* Etichetta Sinistra */}
      <div style={{ 
        width: '130px', 
        paddingRight: '16px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        textAlign: 'left',
        borderRight: '1px solid #000'
      }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#000', lineHeight: 1.1 }}>{label}</span>
        {sublabel && (
          <span style={{ fontSize: '0.65rem', color: '#666', lineHeight: 1.1, whiteSpace: 'pre-line', marginTop: '2px' }}>
            {sublabel}
          </span>
        )}
      </div>
      {/* Area Barra */}
      <div style={{ flex: 1, paddingLeft: '2px', display: 'flex', alignItems: 'center' }}>
        <div style={{ 
          height: '24px', 
          width: mounted ? `${pct}%` : '0%', 
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '8px',
          transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {pct > 8 && (
            <span style={{ 
              fontSize: '0.65rem', color: isDarkText ? '#000' : '#FFF', fontWeight: 600,
              opacity: mounted ? 1 : 0, transition: 'opacity 1s ease 0.5s'
            }}>
              {valLabel || `${pct}%`}
            </span>
          )}
        </div>
        {pct <= 8 && (
          <span style={{ 
            fontSize: '0.65rem', color: '#000', fontWeight: 600, marginLeft: '6px',
            opacity: mounted ? 1 : 0, transition: 'opacity 1s ease 0.5s'
          }}>
            {valLabel || `${pct}%`}
          </span>
        )}
      </div>
    </div>
  )
}

export default function ArchetypesDemographicsChart() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // Leggero delay per un effetto a cascata elegante
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ marginBlock: '4rem', fontFamily: 'var(--font-body)' }}>
      <div className="grid-2" style={{ gap: '4rem', alignItems: 'flex-start' }}>
        
        {/* Colonna Sinistra: Archetipi Narrativi */}
        <div>
          <div style={{ marginBottom: '2.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#000' }}>
              L'immaginario archetipico
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#333', lineHeight: 1.5, marginBottom: '2rem' }}>
              L'indagine sull'identità narrativa (Mark & Pearson, 2001) evidenzia una netta
              preferenza per profili antifragili e pragmatici. Il 42,8% dei cittadini identifica
              Maddaloni nella figura di Forrest Gump (l'Uomo Comune), riconoscendo nel
              tessuto locale una profonda resilienza quotidiana e un forte senso di appar-
              tenenza. A questo si affiancano Indiana Jones (29,5%, l'Esploratore), legato
              al desiderio di riscoperta del patrimonio archeologico sepolto, e Robin Hood
              (24,0%, il Ribelle), espressione di una domanda diffusa di riscatto territoriale. Il
              rigetto quasi unanime per Mary Poppins (3,8%) conferma il rifiuto dei residenti
              verso narrazioni rassicuranti in modo artificiale o fiabesche.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {archetipiData.map(item => (
              <EditorialBarRow 
                key={item.name}
                label={item.name}
                sublabel={item.sottotitolo}
                pct={item.pct}
                color={item.color}
                isDarkText={item.pct < 10}
                mounted={mounted}
              />
            ))}
          </div>
        </div>

        {/* Colonna Destra: Demografia */}
        <div>
          <div style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#333', lineHeight: 1.5, maxWidth: '90%' }}>
              Il percorso si conclude consentendo ai rispondenti di configurare diretta-
              mente il proprio scenario progettuale ideale (Design-Orienting Scenario, DOS;
              Manzini, 2015). Nello specifico, attraverso una griglia di selezione vincolata di
              tre aggettivi, lo strumento consente di generare un numero potenzialmen-
              te infinito di combinazioni semantiche. 
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '2rem' }}>
            {demografiaEta.map((d, i) => (
              <EditorialBarRow 
                key={d.fascia}
                label={d.fascia}
                pct={d.pct}
                valLabel={`${d.pct}%`}
                color={i === 0 ? '#0F172A' : '#94A3B8'}
                isDarkText={false}
                mounted={mounted}
              />
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {demografiaRuolo.map((d, i) => (
              <EditorialBarRow 
                key={d.ruolo}
                label={d.ruolo}
                pct={d.pct}
                valLabel={`${d.pct}%`}
                color={i === 0 ? '#0F172A' : '#94A3B8'}
                isDarkText={false}
                mounted={mounted}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
