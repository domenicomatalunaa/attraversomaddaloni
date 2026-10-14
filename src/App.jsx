import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import { SITE_CONFIG } from './config'

export default function App() {
  // Se la modalità Waiting Page è attiva, mostra solo la Waiting Page
  if (SITE_CONFIG.comingSoonMode) {
    return (
      <BrowserRouter>
        <SEO title="Attraverso Maddaloni — In Costruzione" />
        <GrainOverlay />
        <WaitingPage />
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
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
