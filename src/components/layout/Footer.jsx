import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <span className="footer__logo-mark">Attraverso Maddaloni</span>
          </Link>
          <p className="footer__tagline">
            Laboratorio permanente di innovazione urbana e rigenerazione del patrimonio storico.
          </p>
        </div>

        <div className="footer__col">
          <p className="footer__col-title">Legal</p>
          <ul>
            <li><Link to="/privacy" className="footer__link">Privacy Policy</Link></li>
            <li><Link to="/cookie" className="footer__link">Cookie Policy</Link></li>
          </ul>
          <p className="footer__col-title" style={{ marginTop: 'var(--sp-24)' }}>Contatti</p>
          <ul>
            <li><a href="mailto:info@attraversomaddaloni.it" className="footer__link">info@attraversomaddaloni.it</a></li>
            <li><a href="tel:+390823123456" className="footer__link">+39 0823 123456</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <p className="footer__col-title">Prodotto di Tesi Triennale</p>
          <p className="footer__body">
            Attraverso Maddaloni è un progetto di brand territoriale nato come tesi di laurea triennale in Design della Comunicazione presso l'Accademia di Belle Arti di Napoli. Progetto e ricerca: Domenico Mataluna. Relatrice: Prof.ssa Paola Tuccillo. Co-relatore: Alessandro Tartaglia © 2026 Domenico Mataluna.
          </p>
          <p className="footer__body" style={{ marginTop: 'var(--sp-12)' }}>
            Tutti i diritti riservati. Tutti gli asset visivi, i caratteri tipografici, i codici e i contenuti multimediali presenti su questo sito sono stati prodotti dal tesista e sono tutelati dalla normativa vigente sul diritto d'autore.
          </p>
        </div>
      </div>
    </footer>
  )
}
