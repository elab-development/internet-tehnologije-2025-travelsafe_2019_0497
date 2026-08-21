import { useEffect, useState } from 'react'
import { AuthContext } from './authContext'
import { authService } from '../services/authService'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // True dok proveravamo postojeci token.

  // Pri prvom ucitavanju dovlacimo korisnika ako token vec postoji.
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setLoading(false)
      return
    }

    authService
      .me()
      .then((currentUser) => setUser(currentUser))
      .catch(() => localStorage.removeItem('token')) // Token nije validan, pa ga brisemo.
      .finally(() => setLoading(false))
  }, [])

  // Prijava cuva token i korisnika.
  const login = async (credentials) => {
    const data = await authService.login(credentials)
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  // Registracija odmah prijavljuje korisnika jer backend vraca token.
  const register = async (payload) => {
    const data = await authService.register(payload)
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  // Odjava ponistava token na serveru i cisti lokalno stanje.
  const logout = async () => {
    try {
      await authService.logout()
    } catch {
      // Ako mreza pukne pri odjavi, lokalno stanje ipak mora da bude ocisceno.
    }

    localStorage.removeItem('token')
    setUser(null)
  }

  const value = { user, loading, login, register, logout, isAuthenticated: !!user }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
