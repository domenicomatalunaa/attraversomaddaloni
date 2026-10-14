import { useState } from 'react'

const wordsData = [
  { text: 'Prospettica', category: 'valori', weight: 800, size: '2.5rem' },
  { text: 'Vibrante', category: 'estetica', weight: 800, size: '2.5rem' },
  { text: 'Autentica', category: 'valori', weight: 800, size: '2.5rem' },
  { text: 'Spontanea', category: 'azione', weight: 600, size: '1.75rem' },
  { text: 'Aperta', category: 'esperienza', weight: 600, size: '1.75rem' },
  { text: 'Coraggiosa', category: 'valori', weight: 600, size: '1.75rem' },
  { text: 'Essenziale', category: 'estetica', weight: 600, size: '1.75rem' },
  { text: 'Elegante', category: 'estetica', weight: 600, size: '1.75rem' },
  { text: 'Naturale', category: 'esperienza', weight: 400, size: '1.25rem' },
  { text: 'Radicata', category: 'valori', weight: 400, size: '1.25rem' },
  { text: 'Empatica', category: 'esperienza', weight: 400, size: '1.25rem' },
  { text: 'Sintetica', category: 'azione', weight: 400, size: '1.25rem' },
]

export default function EditorialLexiconChart() {
  const [filter, setFilter] = useState('tutti')

  const categories = [
    { id: 'tutti', label: 'Tutti i lemmi' },
    { id: 'valori', label: 'Valori' },
    { id: 'estetica', label: 'Estetica' },
    { id: 'esperienza', label: 'Esperienza' },
    { id: 'azione', label: 'Azione' }
  ]

  return (
    <div style={{ marginBlock: '4rem', fontFamily: 'var(--font-body)' }}>
      <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid #000', paddingBottom: '1.5rem' }}>
        <span className="text-micro" style={{ color: 'var(--c-gray-400)' }}>[Fig. 3.10] Frequenza lessicale</span>
        <h4 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem', color: '#000' }}>
          Le parole che i cittadini hanno scelto più frequentemente per descrivere la Maddaloni del futuro.
        </h4>
        
        {/* Filtri testuali sottili */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: '0.75rem',
                fontWeight: filter === c.id ? 700 : 400,
                color: filter === c.id ? '#0F172A' : '#64748B',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'all 0.2s ease',
                borderBottom: filter === c.id ? '1px solid #0F172A' : '1px solid transparent'
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '1.5rem 2rem', 
        alignItems: 'baseline',
        justifyContent: 'center',
        padding: '2rem 1rem'
      }}>
        {wordsData.map(w => {
          const isVisible = filter === 'tutti' || filter === w.category
          return (
            <span
              key={w.text}
              style={{
                fontSize: w.size,
                fontWeight: w.weight,
                color: '#0F172A',
                opacity: isVisible ? 1 : 0.15,
                transition: 'opacity 0.4s ease',
                letterSpacing: '-0.02em',
                lineHeight: 1.1
              }}
            >
              {w.text}
            </span>
          )
        })}
      </div>
    </div>
  )
}
