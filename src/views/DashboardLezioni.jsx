import { useState } from 'react'
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
import './DashboardLezioni.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

/* ── Dati Workshop ───────────────────────────────────────── */
const luoghi = [
  { name: 'Convitto Nazionale',          socialita: 79, tensione: 14, dovere: 7,  studenti: 11 },
  { name: 'Drink House',                 socialita: 75, tensione: 12, dovere: 13, studenti: 8  },
  { name: 'Brevi Rimedi',                socialita: 82, tensione: 5,  dovere: 13, studenti: 5  },
  { name: 'Da Gerardo',                  socialita: 70, tensione: 10, dovere: 20, studenti: 4  },
  { name: 'Villa Comunale',              socialita: 52, tensione: 28, dovere: 20, studenti: 4  },
  { name: 'Polo di rinvio centrale',     socialita: 50, tensione: 50, dovere: 0,  studenti: 4  },
  { name: 'Piazza Matteotti',            socialita: 44, tensione: 33, dovere: 23, studenti: 3  },
  { name: 'Lombardi Pasticcieri',        socialita: 67, tensione: 17, dovere: 16, studenti: 3  },
  { name: 'Centro di aggregazione urbano', socialita: 60, tensione: 20, dovere: 20, studenti: 3 },
  { name: 'Burger King',                 socialita: 75, tensione: 0,  dovere: 25, studenti: 2  },
]

const studenti = Array.from({ length: 19 }, (_, i) => ({
  id: i + 1,
  emotion: i < 16 ? 'Socialità' : i < 18 ? 'Tensione' : 'Dovere',
  socialita: Math.round(Math.random() * 60 + 30),
  tensione: Math.round(Math.random() * 30),
  dovere: 0,
})).map(s => ({ ...s, dovere: 100 - s.socialita - s.tensione }))

const emotionColors = {
  Socialità: '#2020FF',
  Tensione:  '#CC3300',
  Dovere:    '#0044CC',
}

const emozioni = ['Tutte le emozioni', 'Socialità', 'Tensione', 'Dovere']

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

function BubbleChart({ data, filtroEmozione }) {
  const filtered = filtroEmozione === 'Tutte le emozioni'
    ? data
    : data.filter(l => {
        const max = Math.max(l.socialita, l.tensione, l.dovere)
        if (filtroEmozione === 'Socialità') return l.socialita === max
        if (filtroEmozione === 'Tensione') return l.tensione === max
        return l.dovere === max
      })

  const colorOf = (l) => {
    const max = Math.max(l.socialita, l.tensione, l.dovere)
    if (l.socialita === max) return '#2020FF'
    if (l.tensione === max) return '#CC3300'
    return '#0044CC'
  }

  // Posizioni fisse distribuite su 5 colonne x 2 righe
  const cols = 5
  const W = 600, H = 280
  const cellW = W / cols
  
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxHeight: '320px' }}>
        {filtered.map((l, i) => {
          const r = Math.max(20, Math.min(60, l.studenti * 8 + 15))
          const col = i % cols
          const row = Math.floor(i / cols)
          const cx = cellW * col + cellW / 2
          const cy = row === 0 ? H * 0.35 : H * 0.75
          const color = colorOf(l)
          return (
            <g key={l.name}>
              <circle
                cx={cx} cy={cy} r={r}
                fill={color}
                opacity={0.85}
                style={{ transition: 'r 0.4s ease, opacity 0.3s ease' }}
              >
                <title>{l.name} · {l.studenti} studenti</title>
              </circle>
              <text
                x={cx} y={cy}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={Math.max(8, Math.min(11, r * 0.32))}
                fill="white"
                fontWeight="700"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {l.name.split(' ').slice(0, 2).join(' ')}
              </text>
            </g>
          )
        })}
      </svg>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
        {[['#2020FF','Socialità'],['#CC3300','Tensione'],['#0044CC','Dovere']].map(([c,l]) => (
          <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#666' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}

function StudentCard({ student }) {
  const mainColor = emotionColors[student.emotion]
  const total = student.socialita + student.tensione + student.dovere

  return (
    <div className="student-card">
      <div className="student-card__header">
        <span className="student-card__id">S{String(student.id).padStart(2, '0')}</span>
        <span className="student-card__emotion" style={{ color: mainColor }}>
          {student.emotion}
        </span>
      </div>
      <div className="student-card__donut">
        <svg viewBox="0 0 40 40" className="donut-svg">
          <circle cx="20" cy="20" r="16" fill="none" stroke="var(--c-gray-100)" strokeWidth="4" />
          <circle
            cx="20" cy="20" r="16"
            fill="none"
            stroke={mainColor}
            strokeWidth="4"
            strokeDasharray={`${(student.socialita / total) * 100.53} 100.53`}
            strokeLinecap="round"
            transform="rotate(-90 20 20)"
          />
        </svg>
      </div>
      <div className="student-card__bars">
        {[
          { label: 'S', value: student.socialita, color: '#2020FF' },
          { label: 'T', value: student.tensione,  color: '#CC3300' },
          { label: 'D', value: student.dovere,    color: '#0044CC' },
        ].map(({ label, value, color }) => (
          <div key={label} className="student-bar">
            <span className="student-bar__label" style={{ color }}>{label}</span>
            <div className="student-bar__track">
              <div
                className="student-bar__fill"
                style={{ width: `${value}%`, background: color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardLezioni() {
  const [emoFilter, setEmoFilter] = useState('Tutte le emozioni')
  const [viewMode, setViewMode] = useState('Tutte')

  const filteredStudenti = emoFilter === 'Tutte le emozioni'
    ? studenti
    : studenti.filter(s => s.emotion === emoFilter)

  const barData = {
    labels: luoghi.map(l => l.name),
    datasets: [
      {
        label: 'Socialità',
        data: luoghi.map(l => l.socialita),
        backgroundColor: '#2020FF',
        stack: 'emotion',
      },
      {
        label: 'Tensione',
        data: luoghi.map(l => l.tensione),
        backgroundColor: '#CC3300',
        stack: 'emotion',
      },
      {
        label: 'Dovere',
        data: luoghi.map(l => l.dovere),
        backgroundColor: '#0044CC',
        stack: 'emotion',
      },
    ],
  }

  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { font: { family: 'Inter', size: 11 }, boxWidth: 12, boxHeight: 12 },
      },
    },
    scales: {
      x: {
        stacked: true,
        max: 100,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { family: 'Inter', size: 10 }, callback: v => `${v}%` },
      },
      y: {
        stacked: true,
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 11 }, color: '#111' },
      },
    },
  }

  return (
    <div className="dashboard page-enter">
      <div className="container">

        {/* Header */}
        <header className="view-header" style={{ textAlign: 'center' }}>
          <h1 className="view-header__title">
            Come i ragazzi<br />sentono la loro città
          </h1>
          <p className="view-header__lead">
            19 studenti tra 14 e 18 anni hanno associato forme geometriche e sensazioni ai luoghi di Maddaloni.
          </p>
        </header>

        {/* Filtro emozioni */}
        <div className="dashboard-filters">
          <FilterBar
            label="EMOZIONE"
            options={emozioni}
            selected={emoFilter}
            onSelect={setEmoFilter}
          />
        </div>

        {/* ══ SEZIONE 01 — MAPPA ════════════════════════════ */}
        <section className="dashboard-section" aria-labelledby="s01-l-title">
          <p className="dashboard-section__num">01 · VISIONE D'INSIEME</p>
          <h2 className="dashboard-section__title" id="s01-l-title">
            I principali poli positivi dell'identità urbana sono Brevi Rimedi, Da Gerardo, Drink House.
          </h2>
          <div className="chart-box">
            <BubbleChart data={luoghi} filtroEmozione={emoFilter} />
          </div>
        </section>

        {/* ══ SEZIONE 02 — PER LUOGO ════════════════════════ */}
        <section className="dashboard-section" aria-labelledby="s02-l-title">
          <p className="dashboard-section__num">02 · LUOGHI</p>
          <h2 className="dashboard-section__title" id="s02-l-title">
            Per ogni luogo, la barra mostra la distribuzione percentuale delle tre emozioni associate dagli studenti.
          </h2>
          <div className="chart-box">
            <div className="chart-box__header">
              <p className="chart-box__label">Come sono vissuti prima delle vacanze</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['Tutte', 'Socialità', 'Tensione', 'Dovere'].map(v => (
                  <button
                    key={v}
                    className={`filter-pill ${viewMode === v ? 'filter-pill--active' : ''}`}
                    onClick={() => setViewMode(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ height: Math.max(400, luoghi.length * 42) + 'px', width: '100%' }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </section>

        {/* ══ SEZIONE 03 — STUDENTI ═════════════════════════ */}
        <section className="dashboard-section" aria-labelledby="s03-l-title">
          <p className="dashboard-section__num">03 · STUDENTI</p>
          <h2 className="dashboard-section__title" id="s03-l-title">
            L'emozione prevalente per ciascun partecipante
          </h2>
          <div className="chart-box">
            <div className="chart-box__header">
              <p className="chart-box__label">{filteredStudenti.length} studenti</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {emozioni.map(e => (
                  <button
                    key={e}
                    className={`filter-pill ${emoFilter === e ? 'filter-pill--active' : ''}`}
                    onClick={() => setEmoFilter(e)}
                  >
                    {e.replace('Tutte le ', '')}
                  </button>
                ))}
              </div>
            </div>
            <div className="student-grid">
              {filteredStudenti.map(s => (
                <StudentCard key={s.id} student={s} />
              ))}
            </div>
          </div>
        </section>

        {/* Conclusioni */}
        <section className="dashboard-conclusion section--sm">
          <p className="section-label text-blue">I Risultati</p>
          <div className="dashboard-conclusion__body">
            <p>I risultati di questo percorso aprono una finestra inedita sulla città: un universo in cui la quotidianità cambia significato a seconda della sensibilità individuale, oscillando tra il bisogno di sicurezza e il peso delle tensioni urbane.</p>
            <p>Il nostro compito, ora, è raccogliere queste geometrie emotive e trasformarle in punti verso una città più sicura, vibrante e, soprattutto, a loro misura.</p>
          </div>
        </section>

      </div>
    </div>
  )
}
