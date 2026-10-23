import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import GrainOverlay from './components/layout/GrainOverlay'
import SEO from './components/common/SEO'
import ScrollProgress from './components/common/ScrollProgress'
import ScrollToTop from './components/common/ScrollToTop'
import Home from './pages/Home'
import Metodo from './pages/Metodo'
import MetodoTestA from './pages/MetodoTestA'
import MetodoTestB from './pages/MetodoTestB'
import Risorse from './pages/Risorse'
import Strumenti from './pages/Strumenti'
import WaitingPage from './pages/WaitingPage'
import Pubblicazioni from './pages/Pubblicazioni'
import { SITE_CONFIG } from './config'

export default function App() {
  // Se la modalità Waiting Page è attiva:
  // Le rotte dei volumi (/tesi, /brandmanual, /pubblicazioni) rimangono attive e consultabili direttamente.
  // Tutte le altre rotte conducono alla Waiting Page.
  if (SITE_CONFIG.comingSoonMode) {
    return (
      <BrowserRouter>
        <GrainOverlay />
        <Routes>
          {/* Rotte Pubblicazioni Tesi */}
          <Route path="/tesi" element={<Pubblicazioni initialVolume="1" />} />
          <Route path="/ricerca" element={<Navigate to="/tesi" replace />} />
          <Route path="/brandmanual" element={<Pubblicazioni initialVolume="2" />} />
          <Route path="/manuale" element={<Navigate to="/brandmanual" replace />} />
          <Route path="/pubblicazioni" element={<Pubblicazioni />} />
          <Route path="/volumi" element={<Navigate to="/pubblicazioni" replace />} />

          {/* Tutte le altre rotte mostrano la Waiting Page */}
          <Route
            path="*"
            element={
              <>
                <SEO title="Attraverso Maddaloni — In Costruzione" />
                <WaitingPage />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    )
  }

  // Sito completo
  return (
    <BrowserRouter>
      <SEO />
      <ScrollProgress />
      <ScrollToTop />
      <GrainOverlay />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/progetto/*" element={<Metodo />} />
          <Route path="/test-a/progetto" element={<MetodoTestA />} />
          <Route path="/test-b/progetto" element={<MetodoTestB />} />
          <Route path="/risorse" element={<Risorse />} />
          <Route path="/strumenti" element={<Strumenti />} />

          {/* Rotte Pubblicazioni Tesi */}
          <Route path="/tesi" element={<Pubblicazioni initialVolume="1" />} />
          <Route path="/ricerca" element={<Navigate to="/tesi" replace />} />
          <Route path="/brandmanual" element={<Pubblicazioni initialVolume="2" />} />
          <Route path="/manuale" element={<Navigate to="/brandmanual" replace />} />
          <Route path="/pubblicazioni" element={<Pubblicazioni />} />
          <Route path="/volumi" element={<Navigate to="/pubblicazioni" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
