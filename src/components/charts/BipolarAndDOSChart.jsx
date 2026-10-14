import { useState } from 'react'

const bipolarPairs = [
  { left: 'Freddo', right: 'Caldo', leftPct: 49.4, rightPct: 50.6 },
  { left: 'Selvaggio', right: 'Urbano', leftPct: 52.3, rightPct: 47.7 },
]

const dosSteps = [
  {
    num: 1,
    title: 'Prospettica',
    desc: 'Proietta il sistema verso griglie dinamiche\ne composizioni asimmetriche aperte al futuro.',
    bars: [38.0, 49.0, 33.2],
    color: '#0F172A'
  },
  {
    num: 2,
    title: 'Vibrante',
    desc: 'Richiede un\'identità visiva reattiva,\nvitale e ad alto contrasto.',
    bars: [21.2, 28.5, 28.5],
    color: '#64748B'
  },
  {
    num: 3,
    title: 'Autentica',
    desc: 'Vincola il progetto al rispetto delle radici identitarie e della\nmemoria materica locale. Questa convergenza, ancorata',
    bars: [20.5, 26.0, 24.2],
    color: '#94A3B8'
  },
  {
    num: null,
    bars: [20.3, 16.0, 15.3],
    color: '#E2E8F0'
  }
]

function SplitBarRow({ left, right, leftPct, rightPct }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '24px', marginBottom: '24px' }}>
      <div style={{ width: '80px', textAlign: 'left', paddingRight: '12px', borderRight: '1px solid #000', height: '100%', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: '#000' }}>{left}</span>
      </div>
      
      <div style={{ flex: 1, display: 'flex', padding: '0 2px' }}>
        <div style={{ 
          width: `${leftPct}%`, 
          background: '#94A3B8', 
          height: '24px',
          display: 'flex', alignItems: 'center', paddingLeft: '8px'
        }}>
          <span style={{ fontSize: '0.65rem', color: '#FFF' }}>{leftPct}%</span>
        </div>
        <div style={{ 
          width: `${rightPct}%`, 
          background: '#0F172A', 
          height: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px'
        }}>
          <span style={{ fontSize: '0.65rem', color: '#FFF' }}>{rightPct}%</span>
        </div>
      </div>

      <div style={{ width: '80px', textAlign: 'right', paddingLeft: '12px', borderLeft: '1px solid #000', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '0.75rem', color: '#000' }}>{right}</span>
      </div>
    </div>
  )
}

export default function BipolarAndDOSChart() {
  const [activeStep, setActiveStep] = useState(null)

  return (
    <div style={{ marginBlock: '4rem', fontFamily: 'var(--font-body)' }}>
      <div className="grid-2" style={{ gap: '4rem', alignItems: 'flex-start' }}>

        {/* Sinistra: Coppie semantiche bipolari (Fig. 3.7) */}
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#333', lineHeight: 1.5 }}>
              L'indagine evidenzia come la città sia percepita con l'attributo <em>ruvido</em>,
              riflettendo la presenza tangibile del tufo e delle architetture collinari,
              mentre per consistenza lo spazio è giudicato come <em>pesante</em> e <em>opaco</em> dal 77,7%.
              Sul piano spaziale, l'81,7% descrive la città come <em>frammentata</em>: a questa 
              condizione il progetto risponde non con un marchio monolitico calato dall'alto, 
              ma attraverso una griglia modulare dinamica capace di ricomporre la complessità locale.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {bipolarPairs.map(p => (
              <SplitBarRow key={p.left} {...p} />
            ))}
          </div>
        </div>

        {/* Destra: DOS (Fig. 3.9) */}
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#000' }}>
              La sintesi nel Design-Orienting Scenario (DOS)
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#333', lineHeight: 1.5 }}>
              Dall'incrocio tra l'analisi della percezione attuale e la visione prospettica della
              comunità prende forma il Design-Orienting Scenario (DOS; Manzini, 2015), il
              brief strategico che indirizza la direzione artistica del sistema visivo.
            </p>
          </div>

          {/* Stepper Numerato Interattivo */}
          <div style={{ position: 'relative', paddingLeft: '40px', marginBottom: '3rem' }}>
            {/* Linea tratteggiata verticale */}
            <div style={{ 
              position: 'absolute', 
              top: '12px', 
              bottom: '12px', 
              left: '12px', 
              width: '1px', 
              borderLeft: '1px dashed #000',
              zIndex: 0
            }} />

            {dosSteps.filter(s => s.num).map((s, index) => {
              const isActive = activeStep === index
              const isFaded = activeStep !== null && activeStep !== index
              
              return (
                <div 
                  key={s.num} 
                  onMouseEnter={() => setActiveStep(index)}
                  onMouseLeave={() => setActiveStep(null)}
                  style={{ 
                    position: 'relative', 
                    marginBottom: '2rem', 
                    cursor: 'pointer',
                    opacity: isFaded ? 0.4 : 1,
                    transform: isActive ? 'translateX(8px)' : 'translateX(0)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    left: '-40px',
                    top: '0',
                    width: '25px',
                    height: '25px',
                    borderRadius: '50%',
                    background: isActive ? '#0F172A' : '#FFF',
                    border: '1px solid #000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: isActive ? '#FFF' : '#000',
                    zIndex: 1,
                    transition: 'all 0.3s ease'
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
              )
            })}
          </div>

          {/* Stacked Bar Chart Interattivo */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '0 2rem' }}>
            {['Aggettivo 1\n(Estetica)', 'Aggettivo 2\n(Prospettiva)', 'Aggettivo 3\n(Natura)'].map((agg, idx) => (
              <div key={agg} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '180px' }}>
                  
                  {/* Top segment */}
                  <div style={{ 
                    flex: dosSteps[3].bars[idx], 
                    background: dosSteps[3].color, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: activeStep !== null ? 0.2 : 1,
                    transition: 'opacity 0.3s ease'
                  }}>
                    <span style={{ fontSize: '0.65rem', color: '#000' }}>{dosSteps[3].bars[idx]}%</span>
                  </div>
                  
                  {/* Mid-light (Step 3) */}
                  <div style={{ 
                    flex: dosSteps[2].bars[idx], 
                    background: dosSteps[2].color, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: activeStep === null || activeStep === 2 ? 1 : 0.2,
                    transform: activeStep === 2 ? 'scaleX(1.05)' : 'scaleX(1)',
                    transition: 'all 0.3s ease'
                  }}>
                    <span style={{ fontSize: '0.65rem', color: activeStep === 2 ? '#FFF' : '#000' }}>{dosSteps[2].bars[idx]}%</span>
                  </div>
                  
                  {/* Mid-dark (Step 2) */}
                  <div style={{ 
                    flex: dosSteps[1].bars[idx], 
                    background: dosSteps[1].color, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: activeStep === null || activeStep === 1 ? 1 : 0.2,
                    transform: activeStep === 1 ? 'scaleX(1.05)' : 'scaleX(1)',
                    transition: 'all 0.3s ease'
                  }}>
                    <span style={{ fontSize: '0.65rem', color: '#FFF' }}>{dosSteps[1].bars[idx]}%</span>
                  </div>
                  
                  {/* Bottom darkest (Step 1) */}
                  <div style={{ 
                    flex: dosSteps[0].bars[idx], 
                    background: dosSteps[0].color, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: activeStep === null || activeStep === 0 ? 1 : 0.2,
                    transform: activeStep === 0 ? 'scaleX(1.05)' : 'scaleX(1)',
                    transition: 'all 0.3s ease'
                  }}>
                    <span style={{ fontSize: '0.65rem', color: '#FFF' }}>{dosSteps[0].bars[idx]}%</span>
                  </div>
                </div>
                
                <div style={{ borderTop: '1px solid #000', marginTop: '4px', paddingTop: '4px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.6rem', color: '#666', whiteSpace: 'pre-line' }}>{agg}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '4px', background: '#0F172A' }}></span>
              <span style={{ fontSize: '0.6rem', color: '#333', fontStyle: 'italic' }}>Vibrante / prospettico / autentico</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '4px', background: '#64748B' }}></span>
              <span style={{ fontSize: '0.6rem', color: '#333', fontStyle: 'italic' }}>Essenziale / spontaneo / coraggioso</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
