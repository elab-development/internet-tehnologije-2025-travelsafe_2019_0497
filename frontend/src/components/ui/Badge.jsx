import { STATUS_META } from '../../utils/constants'

// Bedz za prikaz statusa polise.
export default function Badge({ status }) {
  const meta = STATUS_META[status] ?? {
    label: status,
    classes: 'bg-slate-100 text-slate-600 ring-slate-200',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${meta.classes}`}
    >
      {meta.label}
    </span>
  )
}
