// Zajednicke konstante aplikacije. Vrednosti moraju da se poklapaju sa backendom.

// Korisnicke uloge.
export const ROLES = {
  CLIENT: 'CLIENT',
  AGENT: 'AGENT',
  ADMIN: 'ADMIN',
}

// Statusi polise kroz ceo zivotni ciklus.
export const POLICY_STATUS = {
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
}

// Svrhe putovanja: vrednost za backend i labela za prikaz.
export const TRAVEL_PURPOSES = [
  { value: 'TOURISM', label: 'Turizam' },
  { value: 'BUSINESS', label: 'Poslovno' },
  { value: 'STUDY', label: 'Studije' },
]

// Vizuelne oznake statusa polise.
export const STATUS_META = {
  SUBMITTED: { label: 'Podnet', classes: 'bg-blue-50 text-blue-700 ring-blue-200' },
  UNDER_REVIEW: { label: 'U obradi', classes: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
  APPROVED: { label: 'Odobren - ceka placanje', classes: 'bg-amber-50 text-amber-700 ring-amber-200' },
  REJECTED: { label: 'Odbijen', classes: 'bg-red-50 text-red-700 ring-red-200' },
  PAYMENT_PENDING: { label: 'Ceka placanje', classes: 'bg-amber-50 text-amber-700 ring-amber-200' },
  ACTIVE: { label: 'Aktivna', classes: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  EXPIRED: { label: 'Istekla', classes: 'bg-slate-100 text-slate-600 ring-slate-200' },
}

// Filteri koje koriste klijent, agent i administrator.
export const POLICY_FILTERS = [
  { value: 'ALL', label: 'Sve' },
  { value: 'SUBMITTED', label: 'Podneti' },
  { value: 'APPROVED', label: 'Odobreni' },
  { value: 'REJECTED', label: 'Odbijeni' },
  { value: 'ACTIVE', label: 'Aktivne' },
  { value: 'EXPIRED', label: 'Istekle' },
]
