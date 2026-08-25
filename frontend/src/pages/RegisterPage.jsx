import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { extractErrorMessage, extractValidationErrors } from '../utils/format'
import { dashboardPath } from '../utils/navigation'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import FormInput from '../components/ui/FormInput'
import { Reveal } from '../components/ui/Motion'
import packing from '../assets/travel/packing-luggage.jpg'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setErrors({})
    setLoading(true)
    try {
      const user = await register(form)
      navigate(dashboardPath(user.role), { replace: true })
    } catch (err) {
      setErrors(extractValidationErrors(err))
      setError(extractErrorMessage(err, 'Registracija nije uspela.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Reveal className="mx-auto grid max-w-5xl overflow-hidden rounded-[1.5rem] bg-white shadow-soft lg:grid-cols-[1.05fr_0.95fr]">
      <div className="flex flex-col justify-center p-6 sm:p-10">
        <div className="mb-7">
          <h1 className="text-3xl font-black text-slate-950">Registracija</h1>
          <p className="mt-2 text-sm text-slate-600">Napravite nalog i osigurajte svoje putovanje.</p>
        </div>

        <Card className="p-0 shadow-none">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <FormInput
                label="Ime"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                error={errors.first_name}
                required
              />
              <FormInput
                label="Prezime"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                error={errors.last_name}
                required
              />
            </div>

            <FormInput
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <FormInput
              label="Lozinka"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              helper="Najmanje 8 karaktera."
              required
            />
            <FormInput
              label="Potvrda lozinke"
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              required
            />

            <Button type="submit" loading={loading} className="w-full">
              Kreiraj nalog
            </Button>
          </form>
        </Card>

        <p className="mt-5 text-sm text-slate-500">
          Već imate nalog?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Prijavite se
          </Link>
        </p>
      </div>

      <div className="relative hidden min-h-[640px] overflow-hidden lg:block">
        <img src={packing} alt="Kofer, pasoš i model aviona pre puta" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.68))]" />
        <div className="absolute bottom-0 p-8 text-white">
          <p className="text-3xl font-black leading-tight">Priprema puta, sređena unapred.</p>
          <p className="mt-3 text-sm leading-6 text-slate-100">
            Dodajte putnike, pošaljite zahtev i pratite polisu iz jednog naloga.
          </p>
        </div>
      </div>
    </Reveal>
  )
}
