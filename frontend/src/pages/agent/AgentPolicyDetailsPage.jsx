import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { policyService } from '../../services/policyService'
import { POLICY_STATUS, TRAVEL_PURPOSES } from '../../utils/constants'
import { formatCurrency, formatDate, daysBetween, extractErrorMessage } from '../../utils/format'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import FormInput from '../../components/ui/FormInput'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import DestinationInsight from '../../components/dashboard/DestinationInsight'
import { Timeline } from '../../components/dashboard/DashboardBlocks'

export default function AgentPolicyDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [policy, setPolicy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [price, setPrice] = useState('')
  const [reason, setReason] = useState('')
  const [processing, setProcessing] = useState(false)

  const load = () => {
    setLoading(true)
    policyService
      .get(id)
      .then(setPolicy)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  // Predlog cene je isti obracun koji klijent vidi u formi.
  const suggestedPrice = useMemo(() => {
    if (!policy) return 0
    const days = daysBetween(policy.travel?.start_date, policy.travel?.end_date)
    const people = policy.travel?.insured_persons?.length ?? 0
    return Number(policy.insurance_package?.base_price ?? 0) * days * people
  }, [policy])

  const openApprove = () => {
    setPrice(String(suggestedPrice))
    setApproveOpen(true)
  }

  const handleApprove = async () => {
    setProcessing(true)
    try {
      const updated = await policyService.approve(id, Number(price))
      setPolicy(updated)
      setApproveOpen(false)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    setProcessing(true)
    try {
      const updated = await policyService.reject(id, reason)
      setPolicy(updated)
      setRejectOpen(false)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!policy) {
    return <Card className="text-center text-sm text-red-600">{error || 'Zahtev nije pronadjen.'}</Card>
  }

  const purposeLabel =
    TRAVEL_PURPOSES.find((purpose) => purpose.value === policy.travel?.travel_purpose)?.label ??
    policy.travel?.travel_purpose
  const canProcess = policy.status === POLICY_STATUS.SUBMITTED
  const steps = [
    { title: 'Zahtev primljen', text: 'Klijent je poslao podatke.', done: true },
    { title: 'Agent odluka', text: canProcess ? 'Ceka se obrada.' : 'Zahtev je obradjen.', done: !canProcess },
    { title: 'Placanje/aktivacija', text: 'Klijent zavrsava placanje ako je zahtev odobren.', done: policy.status === POLICY_STATUS.ACTIVE },
  ]

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-4 text-sm font-semibold text-slate-500 hover:text-slate-800">
        Nazad na zahteve
      </button>

      {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}

      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-5">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-slate-950">
                  Zahtev - {policy.client?.first_name} {policy.client?.last_name}
                </h1>
                <p className="mt-1 text-sm text-slate-500">Paket: {policy.insurance_package?.name}</p>
              </div>
              <Badge status={policy.status} />
            </div>

            {canProcess ? (
              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="success" onClick={openApprove}>
                  Odobri zahtev
                </Button>
                <Button variant="danger" onClick={() => setRejectOpen(true)}>
                  Odbij zahtev
                </Button>
              </div>
            ) : (
              <p className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500 ring-1 ring-slate-200">
                Zahtev je vec obradjen{policy.total_price ? ` - cena: ${formatCurrency(policy.total_price)}` : ''}.
              </p>
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
            <h2 className="text-lg font-black text-slate-950">Tok obrade</h2>
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
                  <span className="text-slate-500">
                    {formatDate(person.date_of_birth)} / Pasos: {person.passport_number}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <aside className="space-y-5">
          <DestinationInsight country={policy.travel?.destination_country} compact />
          <Card>
            <h2 className="text-lg font-black text-slate-950">Procena agenta</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">Predlozena cena na osnovu trajanja i broja putnika.</p>
            <p className="mt-4 text-3xl font-black text-brand-700">{formatCurrency(suggestedPrice)}</p>
          </Card>
        </aside>
      </div>

      <Modal
        open={approveOpen}
        onClose={() => setApproveOpen(false)}
        title="Odobravanje zahteva"
        footer={
          <>
            <Button variant="secondary" onClick={() => setApproveOpen(false)}>
              Otkazi
            </Button>
            <Button variant="success" loading={processing} onClick={handleApprove}>
              Odobri
            </Button>
          </>
        }
      >
        <p className="mb-4 text-sm text-slate-600">
          Unesite konacnu cenu. Predlog na osnovu paketa, broja dana i putnika je{' '}
          <span className="font-bold">{formatCurrency(suggestedPrice)}</span>.
        </p>
        <FormInput label="Konacna cena (RSD)" type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} />
      </Modal>

      <Modal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Odbijanje zahteva"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRejectOpen(false)}>
              Otkazi
            </Button>
            <Button variant="danger" loading={processing} onClick={handleReject} disabled={!reason.trim()}>
              Odbij
            </Button>
          </>
        }
      >
        <FormInput
          label="Razlog odbijanja"
          as="textarea"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Npr. nepotpuni podaci o putniku."
        />
      </Modal>
    </div>
  )
}
