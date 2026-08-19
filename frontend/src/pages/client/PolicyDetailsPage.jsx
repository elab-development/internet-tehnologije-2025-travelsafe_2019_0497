import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { policyService } from '../../services/policyService'
import { POLICY_STATUS, TRAVEL_PURPOSES } from '../../utils/constants'
import { formatCurrency, formatDate, extractErrorMessage } from '../../utils/format'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import DestinationInsight from '../../components/dashboard/DestinationInsight'
import { Timeline } from '../../components/dashboard/DashboardBlocks'

export default function PolicyDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [policy, setPolicy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [payOpen, setPayOpen] = useState(false)
  const [paying, setPaying] = useState(false)

  const load = () => {
    setLoading(true)
    policyService
      .get(id)
      .then(setPolicy)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  // Placanje je simulacija koja menja status polise u aktivnu.
  const handlePay = async () => {
    setPaying(true)
    try {
      const updated = await policyService.pay(id)
      setPolicy(updated)
      setPayOpen(false)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error || !policy) {
    return <Card className="text-center text-sm text-red-600">{error || 'Polisa nije pronadjena.'}</Card>
  }

  const purposeLabel =
    TRAVEL_PURPOSES.find((purpose) => purpose.value === policy.travel?.travel_purpose)?.label ??
    policy.travel?.travel_purpose
  const steps = [
    { title: 'Zahtev podnet', text: 'Podaci su sacuvani u sistemu.', done: true },
    { title: 'Agent obradio', text: 'Cena i status su potvrdjeni.', done: policy.status !== POLICY_STATUS.SUBMITTED },
    { title: 'Polisa aktivna', text: 'Dokument je spreman za put.', done: policy.status === POLICY_STATUS.ACTIVE },
  ]

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-4 text-sm font-semibold text-slate-500 hover:text-slate-800">
        Nazad
      </button>

      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-5">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-slate-950">
                  Polisa {policy.policy_number ?? 'jos nije dodeljena'}
                </h1>
                <p className="mt-1 text-sm text-slate-500">Paket: {policy.insurance_package?.name}</p>
              </div>
              <Badge status={policy.status} />
            </div>

            {policy.status === POLICY_STATUS.REJECTED && policy.rejection_reason && (
              <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                <span className="font-bold">Razlog odbijanja: </span>
                {policy.rejection_reason}
              </div>
            )}

            {policy.status === POLICY_STATUS.APPROVED && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
                <p className="text-sm text-amber-800">
                  Zahtev je odobren. Cena: <span className="font-black">{formatCurrency(policy.total_price)}</span>
                </p>
                <Button variant="success" onClick={() => setPayOpen(true)}>
                  Simuliraj placanje
                </Button>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-black text-slate-950">Putovanje</h2>
            <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-slate-400">Destinacija</dt>
                <dd className="font-bold text-slate-800">{policy.travel?.destination_country}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Svrha</dt>
                <dd className="font-bold text-slate-800">{purposeLabel}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Polazak</dt>
                <dd className="font-bold text-slate-800">{formatDate(policy.travel?.start_date)}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Povratak</dt>
                <dd className="font-bold text-slate-800">{formatDate(policy.travel?.end_date)}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h2 className="text-lg font-black text-slate-950">Tok polise</h2>
            <div className="mt-4">
              <Timeline steps={steps} />
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 text-lg font-black text-slate-950">
              Osigurane osobe ({policy.travel?.insured_persons?.length ?? 0})
            </h2>
            <div className="divide-y divide-slate-100">
              {policy.travel?.insured_persons?.map((person) => (
                <div key={person.id} className="flex flex-col justify-between gap-1 py-3 text-sm sm:flex-row">
                  <span className="font-bold text-slate-800">
                    {person.first_name} {person.last_name}
                  </span>
                  <span className="text-slate-500">Pasos: {person.passport_number}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <aside className="space-y-5">
          <DestinationInsight country={policy.travel?.destination_country} compact />
        </aside>
      </div>

      <Modal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        title="Potvrda placanja"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPayOpen(false)}>
              Otkazi
            </Button>
            <Button variant="success" loading={paying} onClick={handlePay}>
              Plati {formatCurrency(policy.total_price)}
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Ovo je simulacija placanja. Potvrdom polisa prelazi u status aktivne polise.
        </p>
      </Modal>
    </div>
  )
}
