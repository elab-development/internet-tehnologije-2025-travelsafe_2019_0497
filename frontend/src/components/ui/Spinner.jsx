// Jednostavan indikator učitavanja (rotirajući krug).
export default function Spinner({ className = '' }) {
  return (
    <span
      className={`inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-brand-600 ${className}`}
      role="status"
      aria-label="Učitavanje"
    />
  )
}
