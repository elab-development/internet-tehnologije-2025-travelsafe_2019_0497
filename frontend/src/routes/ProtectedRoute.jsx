import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Spinner from '../components/ui/Spinner'

/**
 * Štiti rute: proverava da li je korisnik prijavljen i (opciono) da li ima dozvoljenu ulogu.
 * Koristi se kao "wrapper" ruta u App.jsx: <Route element={<ProtectedRoute allowedRoles={['CLIENT']} />}>
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  // Dok proveravamo token, prikazujemo loader (da izbegnemo "treptaj" ka login stranici).
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  // Ako korisnik nije prijavljen — vodimo ga na login (pamtimo odakle je došao).
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // Ako ruta zahteva određenu ulogu koju korisnik nema — vraćamo ga na početnu.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  // Sve provere prošle — prikazujemo ugnježdene rute.
  return <Outlet />
}
