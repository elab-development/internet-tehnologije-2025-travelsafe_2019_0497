import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { extractErrorMessage } from '../utils/format'
import { dashboardPath } from '../utils/navigation'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import FormInput from '../components/ui/FormInput'
import { Reveal } from '../components/ui/Motion'
import airportLounge from '../assets/travel/airport-lounge.jpg'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form)
      navigate(dashboardPath(user.role), { replace: true })
    } catch (err) {
      setError(extractErrorMessage(err, 'Neuspešna prijava.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Reveal className="mx-auto grid max-w-5xl overflow-hidden rounded-[1.5rem] bg-white shadow-soft lg:grid-cols-[0.95fr_1.05fr]">
      <div className="relative hidden min-h-[560px] overflow-hidden lg:block">
        <img src={airportLounge} alt="Putnik u aerodromskom salonu" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.72))]" />
        <div className="absolute bottom-0 p-8 text-white">
          <p className="text-3xl font-black leading-tight">Nastavite tamo gde put počinje.</p>
          <p className="mt-3 text-sm leading-6 text-slate-100">
            Prijavite se i proverite putovanja, zahteve i aktivne polise bez čekanja.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-10">
        <div className="mb-7">
          <h1 className="text-3xl font-black text-slate-950">Prijava</h1>
          <p className="mt-2 text-sm text-slate-600">Dobro došli nazad u TravelSafe.</p>
        </div>

        <Card className="p-0 shadow-none">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </div>
            )}

            <FormInput
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="vas@email.com"
            />
            <FormInput
              label="Lozinka"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />

            <Button type="submit" loading={loading} className="w-full">
              Prijavi se
            </Button>
          </form>
        </Card>

        <p className="mt-5 text-sm text-slate-500">
          Nemate nalog?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Registrujte se
          </Link>
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-500">
          <p className="font-semibold text-slate-700">Demo nalozi (lozinka: password):</p>
          <p>admin@travelsafe.test · agent@travelsafe.test · ana@travelsafe.test</p>
        </div>
      </div>
    </Reveal>
  )
}
