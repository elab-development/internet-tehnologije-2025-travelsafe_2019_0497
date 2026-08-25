import { useContext } from 'react'
import { AuthContext } from '../context/authContext.js'

// Hook za lak pristup auth kontekstu iz bilo koje komponente.
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth mora biti koriscen unutar <AuthProvider>')
  }

  return context
}
