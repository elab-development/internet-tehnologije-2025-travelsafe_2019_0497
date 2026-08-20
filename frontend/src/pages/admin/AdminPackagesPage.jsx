import { useEffect, useState } from 'react'
import { packageService } from '../../services/packageService'
import { formatCurrency, extractErrorMessage, extractValidationErrors } from '../../utils/format'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import FormInput from '../../components/ui/FormInput'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import { EmptyState, ErrorNotice, MetricCard, PageHeader } from '../../components/dashboard/DashboardBlocks'

const emptyForm = { name: '', description: '', base_price: '', coverage_amount: '', is_active: true }

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = () => {
    setLoading(true)
    packageService
      .list()
      .then(setPackages)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormErrors({})
    setFormOpen(true)
  }

  const openEdit = (pkg) => {
    setEditing(pkg)
    setForm({
      name: pkg.name,
      description: pkg.description ?? '',
      base_price: pkg.base_price,
      coverage_amount: pkg.coverage_amount,
      is_active: pkg.is_active,
    })
    setFormErrors({})
    setFormOpen(true)
  }

  const handleChange = (event) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFormErrors({})

    try {
      const payload = {
        ...form,
        base_price: Number(form.base_price),
        coverage_amount: Number(form.coverage_amount),
        is_active: Boolean(form.is_active),
      }

      if (editing) {
        await packageService.update(editing.id, payload)
      } else {
        await packageService.create(payload)
      }

      setFormOpen(false)
      load()
    } catch (err) {
      setFormErrors(extractValidationErrors(err))
      setError(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    try {
      await packageService.remove(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } catch (err) {
      setError(extractErrorMessage(err))
      setDeleteTarget(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  const activePackages = packages.filter((pkg) => pkg.is_active).length
  const averagePrice =
    packages.length > 0
      ? packages.reduce((sum, pkg) => sum + Number(pkg.base_price ?? 0), 0) / packages.length
      : 0

  return (
    <div>
      <PageHeader
        title="Paketi osiguranja"
        description="Uredite ponudu koju klijent bira prilikom kreiranja zahteva."
        meta="Admin"
      />

      <div className="-mt-3 mb-6">
        <Button onClick={openCreate}>Novi paket</Button>
      </div>

      <ErrorNotice message={error} />

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <MetricCard label="Ukupno paketa" value={packages.length} />
        <MetricCard label="Aktivni" value={activePackages} tone="emerald" />
        <MetricCard label="Prosecna cena" value={formatCurrency(averagePrice)} tone="amber" />
      </div>

      {packages.length === 0 ? (
        <EmptyState title="Nema paketa" text="Dodajte prvi paket osiguranja da bi klijenti mogli da podnesu zahtev." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card key={pkg.id} hover>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-black text-slate-950">{pkg.name}</h3>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${
                    pkg.is_active
                      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                      : 'bg-slate-100 text-slate-500 ring-slate-200'
                  }`}
                >
                  {pkg.is_active ? 'Aktivan' : 'Neaktivan'}
                </span>
              </div>
              <p className="mt-3 min-h-[3rem] text-sm leading-6 text-slate-500">{pkg.description}</p>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="text-sm text-slate-500">Cena po danu</p>
                <p className="text-xl font-black text-slate-950">{formatCurrency(pkg.base_price)}</p>
                <p className="mt-2 text-xs font-semibold text-slate-500">Pokrice {formatCurrency(pkg.coverage_amount)}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={() => openEdit(pkg)}>
                  Izmeni
                </Button>
                <Button variant="danger" onClick={() => setDeleteTarget(pkg)}>
                  Obrisi
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Izmena paketa' : 'Novi paket'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>
              Otkazi
            </Button>
            <Button loading={saving} onClick={handleSave}>
              Sacuvaj
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <FormInput label="Naziv" name="name" value={form.name} onChange={handleChange} error={formErrors.name} required />
          <FormInput label="Opis" as="textarea" name="description" value={form.description} onChange={handleChange} error={formErrors.description} />
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="Osnovna cena (RSD/dan)" type="number" min="0" step="0.01" name="base_price" value={form.base_price} onChange={handleChange} error={formErrors.base_price} required />
            <FormInput label="Iznos pokrica (RSD)" type="number" min="0" step="0.01" name="coverage_amount" value={form.coverage_amount} onChange={handleChange} error={formErrors.coverage_amount} required />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={Boolean(form.is_active)}
              onChange={(event) => setForm((previous) => ({ ...previous, is_active: event.target.checked }))}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Paket je aktivan i vidljiv klijentima
          </label>
        </form>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Brisanje paketa"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Otkazi
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Obrisi
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Da li ste sigurni da zelite da obrisete paket <span className="font-semibold">{deleteTarget?.name}</span>?
        </p>
      </Modal>
    </div>
  )
}
