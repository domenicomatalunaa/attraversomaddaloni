import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import './Header.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <div className="header__inner container">
          <Link to="/" className="header__logo" aria-label="Attraverso Maddaloni — Home">
            {/* Monogramma Ufficiale Maddaloni SVG */}
            <img src="/images/monogramma.svg" alt="Monogramma Maddaloni" className="header__logo-img" />
          </Link>

          <nav className="header__nav" aria-label="Navigazione principale">
            <NavLink
              to="/progetto"
              className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
            >
              Progetto
            </NavLink>
            <NavLink
              to="/risorse"
              className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
            >
              Risorse
            </NavLink>
            <NavLink
              to="/strumenti"
              className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
            >
              Strumenti
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Floating Pill Overlay Navigation for Mobile Screens */}
      <nav className="mobile-pill-nav" aria-label="Navigazione mobile">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `mobile-pill-link ${isActive ? 'mobile-pill-link--active' : ''}`}
        >
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/progetto"
          className={({ isActive }) => `mobile-pill-link ${isActive ? 'mobile-pill-link--active' : ''}`}
        >
          <span>Progetto</span>
        </NavLink>
        <NavLink
          to="/risorse"
          className={({ isActive }) => `mobile-pill-link ${isActive ? 'mobile-pill-link--active' : ''}`}
        >
          <span>Risorse</span>
        </NavLink>
        <NavLink
          to="/strumenti"
          className={({ isActive }) => `mobile-pill-link ${isActive ? 'mobile-pill-link--active' : ''}`}
        >
          <span>Strumenti</span>
        </NavLink>
      </nav>
    </>
  )
}
