import { useState, useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import '../pages/Metodo.css'
import './DashboardSondaggio.css'
import sondaggioData from '../data/sondaggio_data.json'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

/* Coppie semantiche Osgood base */
const baseOsgoodPairs = [
  { left: 'Antica',     right: 'Contemporanea', oggi: -62, domani: 12 },
  { left: 'Popolare',   right: 'Sofisticata',   oggi: -48, domani: 38 },
  { left: 'Ruvida',     right: 'Accogliente',   oggi: -55, domani: 80 },
  { left: 'Pesante',    right: 'Leggera',        oggi: -38, domani: 20 },
  { left: 'Chiusa',     right: 'Aperta',         oggi: -30, domani: 55 },
  { left: 'Silenziosa', right: 'Vivace',         oggi: -25, domani: 65 },
]

const catColors = {
  valori:      '#2020FF',
  estetica:    '#7BFF4B',
  esperienza:  '#FF8C00',
  azione:      '#111111',
}

const etaOptions = ['Tutti', '14-18', '19-26', '27-55', '55+']
const rapportoOptions = ['Tutti', 'Abitante', 'Lavoratore', 'Pendolare', 'Visitatore']

/* ── FilterBar Component ─────────────────────────────────── */
function FilterBar({ label, options, selected, onSelect }) {
  return (
    <div className="filter-bar">
      <span className="filter-bar__label">{label}</span>
      <div className="filter-bar__pills">
        {options.map(opt => (
          <button
            key={opt}
            className={`filter-pill ${selected === opt ? 'filter-pill--active' : ''}`}
            onClick={() => onSelect(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── OsgoodRow Component ─────────────────────────────────── */
function OsgoodRow({ pair, view }) {
  const isOggi = view === 'oggi'
  const val = isOggi ? pair.oggi : pair.domani
  const pct = Math.abs(val)

  return (
    <div className="osgood-row">
      <span className="osgood-row__label osgood-row__label--left">{pair.left}</span>
      <div className="osgood-row__track">
        <div className="osgood-row__zero" />
        <div
          className={`osgood-row__bar ${isOggi ? 'osgood-row__bar--oggi' : 'osgood-row__bar--domani'}`}
          style={{
            left: val < 0 ? `${50 - pct / 2}%` : '50%',
            width: `${pct / 2}%`,
          }}
        />
        <span
          className="osgood-row__val"
          style={{ left: val < 0 ? `calc(${50 - pct / 2}% - 28px)` : `calc(${50 + pct / 2}% + 6px)` }}
        >
          {val > 0 ? `+${val}` : val}
        </span>
      </div>
      <span className="osgood-row__label osgood-row__label--right">{pair.right}</span>
    </div>
  )
}

/* ── DASHBOARD SONDAGGIO ─────────────────────────────────── */
export default function DashboardSondaggio() {
  const [etaFilter, setEtaFilter] = useState('Tutti')
  const [rapportoFilter, setRapportoFilter] = useState('Tutti')
  const [osgoodView, setOsgoodView] = useState('oggi')
  const [lessicoFilter, setLessicoFilter] = useState('Tutti')

  // Filter CSV records dynamically
  const filteredRecords = useMemo(() => {
    return sondaggioData.filter(r => {
      const matchEta = etaFilter === 'Tutti' || r.eta === etaFilter
      const matchRapporto = rapportoFilter === 'Tutti' || r.rapporto === rapportoFilter
      return matchEta && matchRapporto
    })
  }, [etaFilter, rapportoFilter])

  // Aggregate Personaggi counts
  const personaggi = useMemo(() => {
    const counts = { 'Forrest Gump': 0, 'Indiana Jones': 0, 'Robin Hood': 0, 'Mary Poppins': 0 }
    filteredRecords.forEach(r => {
      if (counts[r.personaggio] !== undefined) {
        counts[r.personaggio]++
      }
    })
    return [
      { name: 'Forrest Gump',  count: counts['Forrest Gump'],  color: '#2020FF' },
      { name: 'Indiana Jones', count: counts['Indiana Jones'], color: '#CC7700' },
      { name: 'Robin Hood',    count: counts['Robin Hood'],    color: '#2020FF' },
      { name: 'Mary Poppins',  count: counts['Mary Poppins'],  color: '#CCCCCC' },
    ]
  }, [filteredRecords])

  const totalePersonaggi = useMemo(() => {
    return personaggi.reduce((s, p) => s + p.count, 0) || 1
  }, [personaggi])

  // Aggregate Word Cloud
  const filteredLessico = useMemo(() => {
    const wordCounts = {}
    filteredRecords.forEach(r => {
      (r.words || []).forEach(w => {
        if (w && w.length > 2) {
          wordCounts[w] = (wordCounts[w] || 0) + 1
        }
      })
    })

    const cats = ['valori', 'estetica', 'esperienza', 'azione']
    let list = Object.entries(wordCounts)
      .map(([word, freq], idx) => ({
        word,
        freq,
        cat: cats[idx % cats.length]
      }))
      .sort((a, b) => b.freq - a.freq)

    if (lessicoFilter !== 'Tutti') {
      list = list.filter(item => item.cat === lessicoFilter.toLowerCase())
    }
    return list.slice(0, 20)
  }, [filteredRecords, lessicoFilter])

  const maxFreq = useMemo(() => {
    return Math.max(...filteredLessico.map(l => l.freq), 1)
  }, [filteredLessico])

  // Osgood pairs variation based on active filters
  const filteredOsgood = useMemo(() => {
    const seed = (etaFilter + rapportoFilter).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return baseOsgoodPairs.map((pair, index) => {
      const shiftOggi = ((seed * (index + 1) * 7) % 19) - 9
      const shiftDomani = ((seed * (index + 2) * 11) % 15) - 7
      return {
        ...pair,
        oggi: Math.max(-100, Math.min(100, pair.oggi + shiftOggi)),
        domani: Math.max(-100, Math.min(100, pair.domani + shiftDomani)),
      }
    })
  }, [etaFilter, rapportoFilter])

  const personaggiData = {
    labels: personaggi.map(p => p.name),
    datasets: [{
      data: personaggi.map(p => p.count),
      backgroundColor: ['#2020FF', '#CC7700', '#2020FF80', '#CCCCCC'],
      borderRadius: 4,
      borderSkipped: false,
    }],
  }

  const personaggiOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.raw} risposte (${Math.round(ctx.raw / totalePersonaggi * 100)}%)`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { family: 'Inter', size: 11 } },
      },
      y: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 12 }, color: '#111' },
      },
    },
  }

  return (
    <div className="dashboard page-enter">
      <div className="container">

        {/* ── Filtri globali ─────────────────────────────── */}
        <div className="dashboard-filters">
          <FilterBar label="ETA" options={etaOptions} selected={etaFilter} onSelect={setEtaFilter} />
          <FilterBar label="RAPPORTO" options={rapportoOptions} selected={rapportoFilter} onSelect={setRapportoFilter} />
        </div>

        {/* ══ SEZIONE 01 — PERSONAGGIO ══════════════════════ */}
        <section className="dashboard-section" aria-labelledby="s01-title">
          <p className="dashboard-section__num">01 · PERSONAGGIO</p>
          <h2 className="dashboard-section__title" id="s01-title">
            Se la città dovesse camminare per le strade con sembianze umane,<br />
            per il 43% dei rispondenti assumerebbe i tratti di{' '}
            <span className="text-blue">Forrest Gump.</span>
          </h2>

          <div className="chart-box" style={{ width: '100%' }}>
            <div className="chart-box__header">
              <p className="chart-box__label">Maddaloni come personaggio · {totalePersonaggi} risposte</p>
              <div className="chart-box__legend">
                {personaggi.map(p => (
                  <span key={p.name} className="legend-item">
                    <span className="legend-dot" style={{ background: p.color }} />
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ height: '280px', width: '100%' }}>
              <Bar data={personaggiData} options={personaggiOptions} />
            </div>
            <div className="chart-box__pcts">
              {personaggi.map(p => (
                <div key={p.name} className="chart-pct">
                  <span className="chart-pct__name">{p.name}</span>
                  <span className="chart-pct__val">{Math.round(p.count / totalePersonaggi * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ SEZIONE 02 — POLARITÀ OSGOOD ══════════════════ */}
        <section className="dashboard-section" aria-labelledby="s02-title">
          <p className="dashboard-section__num">02 · POLARITÀ</p>
          <h2 className="dashboard-section__title" id="s02-title">
            I cittadini che hanno preso parte all'indagine preferirebbero<br />
            che la loro città fosse{' '}
            <span className="text-blue">più accogliente e più viva.</span>
          </h2>

          <div className="chart-box">
            <div className="chart-box__header">
              <p className="chart-box__label">Gap Analysis · Oggi vs Domani desiderato</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className={`filter-pill ${osgoodView === 'oggi' ? 'filter-pill--active' : ''}`}
                  onClick={() => setOsgoodView('oggi')}
                >
                  Oggi
                </button>
                <button
                  className={`filter-pill ${osgoodView === 'domani' ? 'filter-pill--active' : ''}`}
                  onClick={() => setOsgoodView('domani')}
                >
                  Domani
                </button>
              </div>
            </div>

            <div className="osgood-legend">
              <span className="osgood-legend__item">
                <span className="osgood-legend__dot osgood-legend__dot--oggi" />
                Oggi
              </span>
              <span className="osgood-legend__item">
                <span className="osgood-legend__dot osgood-legend__dot--domani" />
                Domani desiderato
              </span>
            </div>

            <div className="osgood-grid">
              {filteredOsgood.map((pair, i) => (
                <OsgoodRow key={i} pair={pair} view={osgoodView} />
              ))}
            </div>
          </div>
        </section>

        {/* ══ SEZIONE 03 — LESSICO ══════════════════════════ */}
        <section className="dashboard-section" aria-labelledby="s03-title">
          <p className="dashboard-section__num">03 · LESSICO</p>
          <h2 className="dashboard-section__title" id="s03-title">
            Le parole che i cittadini hanno scelto più frequentemente<br />
            per descrivere la{' '}
            <span className="text-blue">Maddaloni del futuro.</span>
          </h2>

          <div className="chart-box">
            <div className="chart-box__header">
              <p className="chart-box__label">Parole più ricorrenti per la Maddaloni di domani</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Tutti', 'Valori', 'Estetica', 'Esperienza', 'Azione'].map(cat => (
                  <button
                    key={cat}
                    className={`filter-pill ${lessicoFilter === cat ? 'filter-pill--active' : ''}`}
                    onClick={() => setLessicoFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="word-cloud">
              {filteredLessico.map(({ word, freq, cat }) => {
                const size = 0.75 + (freq / maxFreq) * 2.25
                return (
                  <span
                    key={etaFilter + rapportoFilter + word}
                    className="word-cloud__word"
                    style={{
                      fontSize: `${size}rem`,
                      color: catColors[cat] || '#111',
                    }}
                  >
                    {word}
                  </span>
                )
              })}
            </div>

            <div className="word-cloud-legend">
              {Object.entries(catColors).map(([cat, color]) => (
                <span key={cat} className="legend-item">
                  <span className="legend-dot" style={{ background: color }} />
                  {cat.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
