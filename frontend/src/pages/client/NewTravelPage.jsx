import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { travelService } from '../../services/travelService'
import { insuredPersonService } from '../../services/insuredPersonService'
import { policyService } from '../../services/policyService'
import { packageService } from '../../services/packageService'
import { TRAVEL_PURPOSES } from '../../utils/constants'
import { formatCurrency, daysBetween, extractErrorMessage, extractValidationErrors } from '../../utils/format'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import FormInput from '../../components/ui/FormInput'
import DestinationInsight from '../../components/dashboard/DestinationInsight'
import { ErrorNotice, PageHeader, Timeline } from '../../components/dashboard/DashboardBlocks'

const emptyPassenger = { first_name: '', last_name: '', date_of_birth: '', passport_number: '' }

export default function NewTravelPage() {
  const navigate = useNavigate()
  const [travel, setTravel] = useState({
    destination_country: '',
    start_date: '',
    end_date: '',
    travel_purpose: 'TOURISM',
  })
  const [passengers, setPassengers] = useState([{ ...emptyPassenger }])
  const [packages, setPackages] = useState([])
  const [packageId, setPackageId] = useState(null)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    packageService
      .list()
      .then((list) => {
        setPackages(list)
        if (list.length) setPackageId(list[0].id)
      })
      .catch((err) => setError(extractErrorMessage(err)))
  }, [])

  const selectedPackage = packages.find((pkg) => pkg.id === packageId)
  const days = daysBetween(travel.start_date, travel.end_date)

  // Cena je procena: paket x broj dana x broj putnika.
  const totalPrice = useMemo(() => {
    if (!selectedPackage) return 0
    return Number(selectedPackage.base_price) * days * passengers.length
  }, [selectedPackage, days, passengers.length])

  const steps = [
    { title: 'Destinacija', text: travel.destination_country || 'Unesite zemlju putovanja.', done: Boolean(travel.destination_country) },
    { title: 'Putnici', text: `${passengers.length} osoba u zahtevu.`, done: passengers.every((person) => person.first_name && person.last_name) },
    { title: 'Paket', text: selectedPackage?.name ?? 'Izaberite paket osiguranja.', done: Boolean(selectedPackage) },
  ]

  const handleTravelChange = (event) => {
    setTravel((previous) => ({ ...previous, [event.target.name]: event.target.value }))
  }

  const addPassenger = () => setPassengers((list) => [...list, { ...emptyPassenger }])
  const removePassenger = (index) => setPassengers((list) => list.filter((_, i) => i !== index))
  const updatePassenger = (index, field, value) =>
    setPassengers((list) => list.map((person, i) => (i === index ? { ...person, [field]: value } : person)))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setErrors({})
    setSubmitting(true)

    try {
      const createdTravel = await travelService.create(travel)

      // Putnike dodajemo redom da backend validacija ostane jednostavna.
      for (const passenger of passengers) {
        await insuredPersonService.add(createdTravel.id, passenger)
      }

      await policyService.create({ travel_id: createdTravel.id, insurance_package_id: packageId })
      navigate('/my-policies')
    } catch (err) {
      setErrors(extractValidationErrors(err))
      setError(extractErrorMessage(err, 'Slanje zahteva nije uspelo.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Novo putovanje"
        description="Unesite rutu, putnike i paket. Mapa i vremenski kontekst se popunjavaju preko javnih servisa."
        meta="Zahtev za osiguranje"
      />

      <ErrorNotice message={error} />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 text-lg font-black text-slate-950">Podaci o putovanju</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="Zemlja destinacije"
                name="destination_country"
                value={travel.destination_country}
                onChange={handleTravelChange}
                error={errors.destination_country}
                required
              />
              <FormInput
                label="Svrha putovanja"
                as="select"
                name="travel_purpose"
                value={travel.travel_purpose}
                onChange={handleTravelChange}
                options={TRAVEL_PURPOSES}
              />
              <FormInput
                label="Datum polaska"
                type="date"
                name="start_date"
                value={travel.start_date}
                onChange={handleTravelChange}
                error={errors.start_date}
                required
              />
              <FormInput
                label="Datum povratka"
                type="date"
                name="end_date"
                value={travel.end_date}
                onChange={handleTravelChange}
                error={errors.end_date}
                required
              />
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-950">Osigurane osobe</h2>
              <Button variant="secondary" onClick={addPassenger}>
                Dodaj putnika
              </Button>
            </div>

            <div className="space-y-4">
              {passengers.map((passenger, index) => (
                <div key={index} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Putnik {index + 1}</span>
                    {passengers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePassenger(index)}
                        className="text-sm font-bold text-red-600 hover:text-red-700"
                      >
                        Ukloni
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <FormInput label="Ime" value={passenger.first_name} onChange={(event) => updatePassenger(index, 'first_name', event.target.value)} required />
                    <FormInput label="Prezime" value={passenger.last_name} onChange={(event) => updatePassenger(index, 'last_name', event.target.value)} required />
                    <FormInput label="Datum rodjenja" type="date" value={passenger.date_of_birth} onChange={(event) => updatePassenger(index, 'date_of_birth', event.target.value)} required />
                    <FormInput label="Broj pasosa" value={passenger.passport_number} onChange={(event) => updatePassenger(index, 'passport_number', event.target.value)} required />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-black text-slate-950">Izbor paketa</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {packages.map((pkg) => (
                <label
                  key={pkg.id}
                  className={`cursor-pointer rounded-2xl p-4 ring-1 transition ${
                    packageId === pkg.id ? 'bg-brand-50 ring-brand-400' : 'bg-white ring-slate-200 hover:ring-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="package"
                    className="sr-only"
                    checked={packageId === pkg.id}
                    onChange={() => setPackageId(pkg.id)}
                  />
                  <span className="block font-black text-slate-950">{pkg.name}</span>
                  <span className="mt-1 block text-sm text-slate-500">{formatCurrency(pkg.base_price)} / dan</span>
                  <span className="mt-3 block text-xs font-semibold text-slate-500">
                    Pokrice {formatCurrency(pkg.coverage_amount)}
                  </span>
                </label>
              ))}
            </div>
          </Card>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <DestinationInsight country={travel.destination_country} compact />

          <Card>
            <h2 className="text-lg font-black text-slate-950">Rezime zahteva</h2>
            <div className="mt-4">
              <Timeline steps={steps} />
            </div>
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Broj dana</dt>
                <dd className="font-bold text-slate-950">{days}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Putnici</dt>
                <dd className="font-bold text-slate-950">{passengers.length}</dd>
              </div>
            </dl>
            <div className="mt-5 border-t border-slate-200 pt-5">
              <p className="text-sm text-slate-500">Okvirna cena</p>
              <p className="text-3xl font-black text-brand-700">{formatCurrency(totalPrice)}</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">Konacnu cenu potvrdjuje agent tokom obrade.</p>
            </div>
            <Button type="submit" loading={submitting} className="mt-5 w-full">
              Podnesi zahtev
            </Button>
          </Card>
        </aside>
      </form>
    </div>
  )
}
