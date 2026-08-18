import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

// Stranica za nepostojeće rute (404).
export default function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <span className="text-6xl font-bold text-brand-600">404</span>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Stranica nije pronađena</h1>
      <p className="mt-2 text-slate-500">Tražena stranica ne postoji ili je premeštena.</p>
      <Link to="/" className="mt-6">
        <Button>Nazad na početnu</Button>
      </Link>
    </div>
  )
}
