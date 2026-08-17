import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { ROLES } from '../../utils/constants'
import Button from '../ui/Button'

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const linksByRole = {
    [ROLES.CLIENT]: [
      { to: '/client/dashboard', label: 'Kontrolna tabla' },
      { to: '/packages', label: 'Paketi' },
      { to: '/my-travels', label: 'Moja putovanja' },
      { to: '/my-policies', label: 'Moje polise' },
    ],
    [ROLES.AGENT]: [
      { to: '/agent/dashboard', label: 'Kontrolna tabla' },
      { to: '/agent/requests', label: 'Zahtevi' },
    ],
    [ROLES.ADMIN]: [
      { to: '/admin/dashboard', label: 'Kontrolna tabla' },
      { to: '/admin/users', label: 'Korisnici' },
      { to: '/admin/packages', label: 'Paketi' },
      { to: '/admin/policies', label: 'Polise' },
    ],
  }

  const links = isAuthenticated
    ? linksByRole[user.role] ?? []
    : [
        { to: '/', label: 'Početna' },
        { to: '/packages', label: 'Paketi' },
      ]

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-white text-brand-700 shadow-soft' : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900 text-white shadow-soft">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-lg font-bold text-slate-900">
            Travel<span className="text-brand-600">Safe</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-xl bg-white/45 p-1 ring-1 ring-white/70 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-slate-600 sm:block">
                {user.first_name} · <span className="font-medium text-brand-700">{user.role}</span>
              </span>
              <Button variant="secondary" onClick={handleLogout}>
                Odjava
              </Button>
            </>
          ) : (
            <div className="hidden gap-2 sm:flex">
              <Link to="/login">
                <Button variant="secondary">Prijava</Button>
              </Link>
              <Link to="/register">
                <Button>Registracija</Button>
              </Link>
            </div>
          )}

          <button
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-white md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Meni"
            aria-expanded={menuOpen}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
            exit={{ opacity: 0, height: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-slate-200/70 px-4 py-3 md:hidden"
          >
            <div className="space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                  end
                >
                  <span className="block">{link.label}</span>
                </NavLink>
              ))}
              {!isAuthenticated && (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">
                      Prijava
                    </Button>
                  </Link>
                  <Link to="/register" className="flex-1" onClick={() => setMenuOpen(false)}>
                    <Button className="w-full">Registracija</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
