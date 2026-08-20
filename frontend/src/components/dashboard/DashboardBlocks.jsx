import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../ui/Card'
import Button from '../ui/Button'

export function PageHeader({ title, description, action, meta }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl bg-white p-5 shadow-card sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {meta && <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 ring-1 ring-brand-100">{meta}</span>}
        {action && (
          <Link to={action.to}>
            <Button>{action.label}</Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export function MetricCard({ label, value, note, tone = 'brand' }) {
  const tones = {
    brand: 'from-brand-50 text-brand-700',
    emerald: 'from-emerald-50 text-emerald-700',
    amber: 'from-amber-50 text-amber-700',
    red: 'from-red-50 text-red-700',
    slate: 'from-slate-50 text-slate-700',
  }

  return (
    <Card className={`h-full bg-gradient-to-br ${tones[tone]} to-white`}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
      {note && <p className={`mt-2 text-xs font-semibold ${tones[tone].split(' ')[1]}`}>{note}</p>}
    </Card>
  )
}

export function FilterTabs({ options, value, onChange }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2 rounded-2xl bg-white p-2 shadow-card">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
            value === option.value
              ? 'bg-navy-900 text-white'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export function EmptyState({ title, text, action }) {
  return (
    <Card className="text-center">
      <p className="text-lg font-bold text-slate-950">{title}</p>
      {text && <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{text}</p>}
      {action && (
        <Link to={action.to} className="mt-5 inline-block">
          <Button>{action.label}</Button>
        </Link>
      )}
    </Card>
  )
}

export function ErrorNotice({ message }) {
  if (!message) return null

  return (
    <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
      {message}
    </div>
  )
}

export function Timeline({ steps }) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.06 }}
          className="flex gap-3"
        >
          <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${step.done ? 'bg-brand-600' : 'bg-slate-300'}`} />
          <div>
            <p className="text-sm font-semibold text-slate-900">{step.title}</p>
            <p className="text-xs leading-5 text-slate-500">{step.text}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
