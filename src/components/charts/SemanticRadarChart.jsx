import { useState } from 'react'

const axes = [
  { label: 'Realistico',   key: 'realistico',   oggi: 68.9, domani: 72.0 },
  { label: 'Tagliente',    key: 'tagliente',    oggi: 71.5, domani: 18.2 },
  { label: 'Pesante',      key: 'pesante',      oggi: 78.4, domani: 22.0 },
  { label: 'Opaco',        key: 'opaco',        oggi: 81.2, domani: 15.4 },
  { label: 'Selvaggio',    key: 'selvaggio',    oggi: 52.3, domani: 32.1 },
  { label: 'Antica',       key: 'antica',       oggi: 84.6, domani: 42.0 },
  { label: 'Popolare',     key: 'popolare',     oggi: 88.2, domani: 58.5 },
  { label: 'Impetuosa',    key: 'impetuosa',    oggi: 64.0, domani: 35.0 },
  { label: 'Notturno',     key: 'notturno',     oggi: 59.1, domani: 40.5 },
  { label: 'Statica',      key: 'statica',      oggi: 76.8, domani: 19.3 },
  { label: 'Freddo',       key: 'freddo',       oggi: 49.4, domani: 21.0 },
  { label: 'Frammentata',  key: 'frammentata',  oggi: 81.7, domani: 26.5 },
]

export default function SemanticRadarChart({ width = 400, height = 400 }) {
  const [activeView, setActiveView] = useState('both') // 'oggi' | 'domani' | 'both'
  const [hoveredAxis, setHoveredAxis] = useState(null)

  const cx = width / 2
  const cy = height / 2
  const radius = Math.min(width, height) * 0.38
  const total = axes.length

  const getCoordinates = (index, value) => {
    // Offset di rotazione per allineare le punte in base allo screenshot
    const angle = (Math.PI * 2 / total) * index - (Math.PI / 2) + (Math.PI / 12)
    const r = (value / 100) * radius
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    }
  }

  const getLabelCoordinates = (index, offset = 22) => {
    const angle = (Math.PI * 2 / total) * index - (Math.PI / 2) + (Math.PI / 12)
    const r = radius + offset
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      angle,
    }
  }

  const pathOggi = axes
    .map((axis, i) => {
      const { x, y } = getCoordinates(i, axis.oggi)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ') + ' Z'

  const pathDomani = axes
    .map((axis, i) => {
      const { x, y } = getCoordinates(i, axis.domani)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ') + ' Z'

  return (
    <div style={{ marginBlock: '4rem', fontFamily: 'var(--font-body)' }}>
      <div className="grid-2" style={{ gap: '4rem', alignItems: 'center' }}>
        
        {/* Colonna Sinistra (Testo e Analisi) */}
        <div>
          <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#000' }}>
            Analisi statistica dei dati e mappatura della polarizzazione semantica
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#333', lineHeight: 1.5, marginBottom: '1rem' }}>
            La somministrazione del questionario quantitativo «Maddaloni attraverso i
            tuoi occhi» ha permesso di raccogliere un corpus di 400 risposte complete e
            validate (Fig. 3.2). Per garantire la massima eterogeneità del campione, la ri-
            cerca è stata impostata a monte secondo un modello di campionamento non
            probabilistico per quote ragionate, parametrato sulla piramide dell'età cittadi-
            na (dati censuari ISTAT).
          </p>
          <p style={{ fontSize: '0.85rem', color: '#333', lineHeight: 1.5, marginBottom: '1rem' }}>
            Dal confronto con la popolazione reale è emersa una fisiologica contrazione
            della fascia senior (55+ anni, attestatasi al 16,0% a fronte del 38,8% teorico)
            e una maggior presenza giovanile (14-18 anni, 18,5%), favorita dal coinvolgi-
            mento delle scuole. Questo divario è stato attivamente bilanciato attraverso
            un protocollo mixed-mode.
          </p>
          
          <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#000', marginTop: '2rem', marginBottom: '0.5rem' }}>
            Il profilo percettivo e sensoriale
          </h5>
          <p style={{ fontSize: '0.85rem', color: '#333', lineHeight: 1.5 }}>
            L'analisi delle scale semantiche (Fig. 3.3) restituisce un'immagine urbana ca-
            ratterizzata da una forte carica materica: l'87,3% dei rispondenti associa alla 
            città l'attributo ruvido, riflettendo la presenza tangibile del tufo.
          </p>

          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #000', paddingBottom: '4px', marginTop: '2rem', maxWidth: 'max-content' }}>
            {['oggi', 'domani', 'both'].map(v => (
              <button 
                key={v}
                onClick={() => setActiveView(v)}
                style={{ 
                  background: 'none', border: 'none', padding: '0 4px', 
                  fontSize: '0.65rem', 
                  fontWeight: activeView === v ? 700 : 400, 
                  cursor: 'pointer', color: '#000',
                  textTransform: 'uppercase'
                }}
              >
                {v === 'oggi' ? 'Maddaloni Attuale' : v === 'domani' ? 'Desiderata' : 'Confronto'}
              </button>
            ))}
          </div>
        </div>

        {/* Colonna Destra (Radar Chart) */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          
          {/* Label fluttuante RIMOSSA come richiesto */}

          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', maxWidth: '440px', height: 'auto', overflow: 'visible', marginTop: '2rem' }}>
            {/* Ragnatela esterna (12 lati base) */}
            <polygon 
              points={axes.map((_, i) => {
                const { x, y } = getCoordinates(i, 100)
                return `${x},${y}`
              }).join(' ')}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="1"
            />
            {/* Ragnatela media (50%) */}
            <polygon 
              points={axes.map((_, i) => {
                const { x, y } = getCoordinates(i, 50)
                return `${x},${y}`
              }).join(' ')}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="0.5"
            />
            {/* Assi radiali */}
            {axes.map((axis, i) => {
              const { x, y } = getCoordinates(i, 100)
              return (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={x}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeWidth="0.5"
                />
              )
            })}

            {/* Poligono OGGI */}
            <path
              d={pathOggi}
              fill="rgba(15, 23, 42, 0.15)"
              stroke="#0F172A"
              strokeWidth="1.5"
              style={{ 
                opacity: (activeView === 'oggi' || activeView === 'both') ? 1 : 0,
                transformOrigin: '50% 50%',
                transform: (activeView === 'oggi' || activeView === 'both') ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' 
              }}
            />

            {/* Poligono DOMANI */}
            <path
              d={pathDomani}
              fill="none"
              stroke="#64748B"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              style={{ 
                opacity: (activeView === 'domani' || activeView === 'both') ? 1 : 0,
                transformOrigin: '50% 50%',
                transform: (activeView === 'domani' || activeView === 'both') ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' 
              }}
            />

            {/* Etichette tipografiche */}
            {axes.map((axis, i) => {
              const { x, y } = getLabelCoordinates(i, 20)
              const isHover = hoveredAxis === i

              let textAnchor = 'middle'
              if (x < cx - 15) textAnchor = 'end'
              else if (x > cx + 15) textAnchor = 'start'

              // Leggera correzione y per allineamento ottico
              let dy = 3
              if (y < cy - 10) dy = 0
              if (y > cy + 10) dy = 6

              return (
                <text
                  key={i}
                  x={x}
                  y={y + dy}
                  textAnchor={textAnchor}
                  fontFamily="Basic Sans, sans-serif"
                  fontSize="9.5"
                  fontWeight={isHover ? '600' : '400'}
                  fill={isHover ? '#0F172A' : '#000'}
                  onMouseEnter={() => setHoveredAxis(i)}
                  onMouseLeave={() => setHoveredAxis(null)}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease', fontStyle: 'italic' }}
                >
                  {axis.label}
                </text>
              )
            })}
          </svg>
        </div>

      </div>
    </div>
  )
}
