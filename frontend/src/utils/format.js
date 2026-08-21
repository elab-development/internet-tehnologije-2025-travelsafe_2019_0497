// Pomocne funkcije za formatiranje vrednosti u prikazu.

// Formatiranje novca u dinarima.
export function formatCurrency(value) {
  const number = Number(value ?? 0)
  return new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency: 'RSD',
    maximumFractionDigits: 2,
  }).format(number)
}

// Formatiranje datuma u lokalni srpski format.
export function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('sr-RS')
}

// Broj dana izmedju dva datuma, ukljucujuci pocetni i krajnji dan.
export function daysBetween(start, end) {
  if (!start || !end) return 0
  const diff = new Date(end) - new Date(start)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
  return days > 0 ? days : 0
}

// Izvlaci citljivu poruku o gresci iz Axios odgovora.
export function extractErrorMessage(error, fallback = 'Doslo je do greske. Pokusajte ponovo.') {
  return error?.response?.data?.message ?? fallback
}

// Izvlaci greske validacije iz Laravel 422 odgovora.
export function extractValidationErrors(error) {
  const errors = error?.response?.data?.errors
  if (!errors) return {}

  return Object.fromEntries(Object.entries(errors).map(([key, messages]) => [key, messages[0]]))
}
