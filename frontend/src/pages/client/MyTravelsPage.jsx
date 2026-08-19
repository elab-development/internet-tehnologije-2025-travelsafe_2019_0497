import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { travelService } from '../../services/travelService'
import { TRAVEL_PURPOSES } from '../../utils/constants'
import { formatDate, extractErrorMessage } from '../../utils/format'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import DestinationInsight from '../../components/dashboard/DestinationInsight'
import { EmptyState, ErrorNotice, PageHeader } from '../../components/dashboard/DashboardBlocks'

export default function MyTravelsPage() {
  const [travels, setTravels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toDelete, setToDelete] = useState(null)

  const load = () => {
    setLoading(true)
    travelService
      .list()
      .then(setTravels)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const featuredTravel = useMemo(() => travels[0], [travels])
  const purposeLabel = (value) => TRAVEL_PURPOSES.find((purpose) => purpose.value === value)?.label ?? value

  // Brisanje putovanja brise i povezane putnike i polisu na backendu.
  const confirmDelete = async () => {
    try {
      await travelService.remove(toDelete.id)
      setToDelete(null)
      load()
    } catch (err) {
      setError(extractErrorMessage(err))
      setToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Moja putovanja"
        description="Pregled destinacija, datuma, putnika i povezanih polisa."
        action={{ to: '/travels/new', label: 'Novo putovanje' }}
      />

      <ErrorNotice message={error} />

      {travels.length === 0 ? (
        <EmptyState
          title="Jos nemate prijavljenih putovanja"
          text="Dodajte destinaciju, putnike i paket osiguranja kroz jedan kratak zahtev."
          action={{ to: '/travels/new', label: 'Prijavi prvo putovanje' }}
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <DestinationInsight country={featuredTravel?.destination_country} compact />

          <div className="space-y-3">
            {travels.map((travel) => (
              <Card key={travel.id} hover>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <h3 className="text-lg font-black text-slate-950">{travel.destination_country}</h3>
                    <p className="text-sm text-slate-500">{purposeLabel(travel.travel_purpose)}</p>
                  </div>
                  {travel.policy && <Badge status={travel.policy.status} />}
                </div>

                <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <dt className="text-slate-400">Polazak</dt>
                    <dd className="font-semibold text-slate-800">{formatDate(travel.start_date)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Povratak</dt>
                    <dd className="font-semibold text-slate-800">{formatDate(travel.end_date)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Putnici</dt>
                    <dd className="font-semibold text-slate-800">{travel.insured_persons?.length ?? 0}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap gap-2">
                  {travel.policy && (
                    <Link to={`/policies/${travel.policy.id}`}>
                      <Button variant="secondary">Detalji polise</Button>
                    </Link>
                  )}
                  <Button variant="danger" onClick={() => setToDelete(travel)}>
                    Obrisi
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Brisanje putovanja"
        footer={
          <>
            <Button variant="secondary" onClick={() => setToDelete(null)}>
              Otkazi
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Obrisi
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Da li ste sigurni da zelite da obrisete putovanje ka{' '}
          <span className="font-semibold">{toDelete?.destination_country}</span>? Ova radnja brise i sve povezane
          podatke za to putovanje.
        </p>
      </Modal>
    </div>
  )
}
