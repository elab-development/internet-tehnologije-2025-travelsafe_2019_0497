import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { packageService } from '../services/packageService'
import { useAuth } from '../hooks/useAuth'
import { ROLES } from '../utils/constants'
import { formatCurrency } from '../utils/format'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import { AnimatedWords, Reveal } from '../components/ui/Motion'
import worldMap from '../assets/travel/world-map.jpg'
import documents from '../assets/travel/travel-documents.jpg'

const fallbackPackages = [
  {
    id: 'basic-preview',
    name: 'Basic',
    description: 'Osnovno pokrice za kratka putovanja i najvaznije neplanirane troskove.',
    base_price: 3,
    coverage_amount: 10000,
  },
  {
    id: 'standard-preview',
    name: 'Standard',
    description: 'Uravnotezen paket za porodice, duza putovanja i dodatnu sigurnost.',
    base_price: 6,
    coverage_amount: 30000,
  },
  {
    id: 'premium-preview',
    name: 'Premium',
    description: 'Najvisi nivo pokrica za putnike koji zele maksimalan komfor.',
    base_price: 10,
    coverage_amount: 75000,
  },
]

const featureSets = [
  ['Hitna medicinska pomoc', 'Digitalna evidencija puta', 'Status zahteva'],
  ['Sve iz Basic paketa', 'Prtljag i dokumenta', 'Prioritetan pregled'],
  ['Sve iz Standard paketa', 'Prosireno pokrice', 'Najbrza obrada'],
]

export default function PackagesPage() {
  const { user } = useAuth()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingPreview, setUsingPreview] = useState(false)

  useEffect(() => {
    packageService
      .list()
      .then((items) => {
        setPackages(items)
        setUsingPreview(false)
      })
      .catch(() => {
        setPackages(fallbackPackages)
        setUsingPreview(true)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <section className="relative -mx-4 -mt-8 overflow-hidden bg-navy-900 px-4 py-14 text-white sm:px-8 lg:rounded-b-[2rem]">
        <img src={worldMap} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.4]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,18,35,0.96),rgba(8,18,35,0.78)_58%,rgba(8,18,35,0.38))]" />
        <div className="relative mx-auto max-w-6xl py-10">
          <h1 className="max-w-3xl text-balance text-5xl font-black leading-[0.98] sm:text-6xl">
            <AnimatedWords text="Paketi osiguranja za razlicite vrste puta." />
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
            Uporedite cenu po danu, nivo pokrica i najvaznije stavke bez prenatrpanih tabela.
          </p>
          {usingPreview && (
            <p className="mt-4 max-w-xl text-sm text-slate-300">
              Prikazani su osnovni primeri paketa dok lokalni API nije dostupan.
            </p>
          )}
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-3">
        {packages.map((pkg, index) => {
          const isRecommended = index === 1
          const coveragePercent = Math.min(100, 34 + index * 26)

          return (
            <motion.article
              key={pkg.id}
              initial={{ opacity: 1, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.42, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={`flex min-h-[29rem] flex-col rounded-2xl p-6 shadow-card ${
                isRecommended ? 'bg-navy-900 text-white' : 'bg-white text-slate-950'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className={`text-sm font-black uppercase tracking-wide ${isRecommended ? 'text-brand-200' : 'text-brand-600'}`}>
                  {pkg.name}
                </p>
                {isRecommended && (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-navy-900">
                    Preporuceno
                  </span>
                )}
              </div>

              <p className={`mt-4 min-h-[4.5rem] text-sm leading-6 ${isRecommended ? 'text-slate-300' : 'text-slate-600'}`}>
                {pkg.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-black">{formatCurrency(pkg.base_price)}</span>
                <span className={`text-sm ${isRecommended ? 'text-slate-300' : 'text-slate-500'}`}>/ dan</span>
              </div>

              <div className={`mt-6 rounded-2xl p-4 ${isRecommended ? 'bg-white/[0.08]' : 'bg-slate-50'}`}>
                <div className="flex items-center justify-between text-sm">
                  <span className={isRecommended ? 'text-slate-300' : 'text-slate-600'}>Pokrice</span>
                  <span className="font-black">{formatCurrency(pkg.coverage_amount)}</span>
                </div>
                <div className={`mt-3 h-2 overflow-hidden rounded-full ${isRecommended ? 'bg-white/[0.14]' : 'bg-slate-200'}`}>
                  <motion.div
                    initial={{ width: '0%' }}
                    whileInView={{ width: `${coveragePercent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-brand-600"
                  />
                </div>
              </div>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {featureSets[index]?.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isRecommended ? 'bg-emerald-400 text-navy-900' : 'bg-emerald-50 text-emerald-700'}`}>
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className={isRecommended ? 'text-slate-200' : 'text-slate-600'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                {user?.role === ROLES.CLIENT ? (
                  <Link to="/travels/new">
                    <Button className="w-full">Osiguraj putovanje</Button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <Button variant={isRecommended ? 'primary' : 'secondary'} className="w-full">
                      Registrujte se za kupovinu
                    </Button>
                  </Link>
                )}
              </div>
            </motion.article>
          )
        })}
      </div>

      <Reveal as="section" className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
        <div className="grid items-stretch md:grid-cols-[0.82fr_1.18fr]">
          <img src={documents} alt="Pasos, kartice i ukrcajna karta" className="h-full min-h-[320px] w-full object-cover" />
          <div className="flex flex-col justify-center p-7 sm:p-10">
            <h2 className="text-balance text-3xl font-black text-slate-950 sm:text-4xl">
              Polisa treba da bude jasna pre nego sto krenete.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
              Zato svaki paket prikazuje ono sto korisnik prvo pita: cenu, pokrice i sta konkretno dobija.
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
