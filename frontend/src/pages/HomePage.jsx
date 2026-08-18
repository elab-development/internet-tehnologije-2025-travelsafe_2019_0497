import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'
import { AnimatedWords, Reveal, Stagger, StaggerItem } from '../components/ui/Motion'
import airportLounge from '../assets/travel/airport-lounge.jpg'
import bridge from '../assets/travel/brooklyn-bridge.jpg'
import cityWalk from '../assets/travel/city-walk.jpg'
import documents from '../assets/travel/travel-documents.jpg'
import mapPassport from '../assets/travel/map-passport.jpg'
import packing from '../assets/travel/packing-luggage.jpg'

const protections = [
  {
    title: 'Medicinska pomoc',
    text: 'Pokriće za hitne situacije tokom puta, jasno vezano za odabrani paket.',
    icon: 'M12 21s-7-4.4-7-10V5l7-3 7 3v6c0 5.6-7 10-7 10Z',
  },
  {
    title: 'Prtljag i dokumenta',
    text: 'Putnici, dokumenta i zahtev ostaju u istom toku, bez rasutih evidencija.',
    icon: 'M9 6V5a3 3 0 0 1 6 0v1m-9 0h12v13H6V6Z',
  },
  {
    title: 'Status polise',
    text: 'Korisnik vidi da li zahtev ceka pregled, placanje ili je polisa aktivna.',
    icon: 'M20 6 9 17l-5-5',
  },
]

const steps = [
  { title: 'Izbor paketa', text: 'Uporedite pokriće i cenu po danu.', image: mapPassport },
  { title: 'Podaci o putu', text: 'Unesite destinaciju, datume i putnike.', image: packing },
  { title: 'Pregled statusa', text: 'Pratite odobrenje i aktivaciju polise.', image: documents },
]

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="space-y-14">
      <section className="relative -mx-4 -mt-8 min-h-[680px] overflow-hidden bg-navy-900 px-4 py-8 text-white sm:px-8 lg:rounded-b-[2rem]">
        <img src={airportLounge} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.46]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,18,35,0.96),rgba(8,18,35,0.82)_48%,rgba(8,18,35,0.38))]" />

        <div className="relative mx-auto grid min-h-[620px] max-w-6xl items-center gap-10 lg:grid-cols-[0.98fr_0.82fr]">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 inline-flex rounded-full bg-white/[0.1] px-3 py-1.5 text-sm font-semibold text-slate-100 ring-1 ring-white/[0.16]"
            >
              Putno osiguranje, bez komplikovanja
            </motion.p>

            <h1 className="text-balance text-5xl font-black leading-[0.96] sm:text-6xl lg:text-[5.6rem]">
              <AnimatedWords text="TravelSafe za mirniji polazak." />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-xl text-lg leading-8 text-slate-200"
            >
              Izaberite paket, unesite putovanje i pratite polisu kroz jedan pregledan digitalni tok.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/packages">
                <Button className="px-6 py-3 text-base">Pogledaj pakete</Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/register">
                  <Button variant="secondary" className="px-6 py-3 text-base">
                    Kreiraj nalog
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.56, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl bg-white p-4 text-slate-950 shadow-2xl"
          >
            <img src={bridge} alt="Putnici na gradskom putovanju" className="h-64 w-full rounded-2xl object-cover" />
            <div className="p-2 pt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Primer polise</p>
                  <h2 className="mt-1 text-2xl font-black">Beograd - Lisabon</h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  Aktivna
                </span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {['4 putnika', '8 dana', 'Premium'].map((item) => (
                  <div key={item} className="rounded-xl bg-slate-50 px-3 py-3 text-center text-sm font-semibold">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: '20%' }}
                  animate={{ width: '84%' }}
                  transition={{ duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-brand-600"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Reveal as="section" className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="flex flex-col justify-center">
          <h2 className="text-balance text-4xl font-black text-slate-950 sm:text-5xl">
            Sve sto putnik treba da zna, bez suvisnog sloja.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            Fokus je na jasnom statusu, dokumentima i sledecem koraku. Slike daju kontekst putovanja, a UI ostaje
            miran i upotrebljiv.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {protections.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 1, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.36, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl bg-white p-5 shadow-card"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </Reveal>

      <section className="overflow-hidden rounded-[2rem] bg-white p-5 shadow-soft sm:p-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-4xl font-black text-slate-950">Od plana do polise</h2>
            <p className="mt-2 max-w-2xl text-slate-600">Kratak tok koji prati realnu pripremu puta.</p>
          </div>
          <Link to={isAuthenticated ? '/travels/new' : '/register'}>
            <Button variant="secondary">{isAuthenticated ? 'Osiguraj putovanje' : 'Započni sada'}</Button>
          </Link>
        </div>

        <Stagger className="grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <StaggerItem key={step.title} as="article" className="overflow-hidden rounded-2xl bg-white shadow-card">
              <img src={step.image} alt="" className="h-48 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-black text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Reveal as="section" className="overflow-hidden rounded-[2rem] bg-navy-900 text-white shadow-soft">
        <div className="grid items-stretch lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex min-h-[360px] flex-col justify-center p-7 sm:p-10">
            <h2 className="text-balance text-4xl font-black">Spremni za polazak?</h2>
            <p className="mt-4 max-w-xl text-slate-200">
              Napravite nalog, dodajte putovanje i pratite status polise bez nepotrebnih koraka.
            </p>
            <div className="mt-7">
              <Link to={isAuthenticated ? '/travels/new' : '/register'}>
                <Button className="px-6 py-3 text-base">
                  {isAuthenticated ? 'Osiguraj putovanje' : 'Kreiraj nalog'}
                </Button>
              </Link>
            </div>
          </div>
          <img src={cityWalk} alt="Grupa putnika u gradu" className="h-full min-h-[360px] w-full object-cover" />
        </div>
      </Reveal>

    </div>
  )
}
