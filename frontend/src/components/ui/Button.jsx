import { motion, useReducedMotion } from 'framer-motion'

const VARIANTS = {
  primary: 'bg-brand-600 text-white shadow-button hover:bg-brand-700 focus-visible:ring-brand-500',
  secondary: 'bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 focus-visible:ring-brand-500',
  success: 'bg-emerald-600 text-white shadow-button hover:bg-emerald-700 focus-visible:ring-emerald-500',
  danger: 'bg-red-600 text-white shadow-button hover:bg-red-700 focus-visible:ring-red-500',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400',
}

export default function Button({
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5
        text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2
        focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60
        ${VARIANTS[variant]} ${className}`}
      whileHover={disabled || loading || reduceMotion ? undefined : { y: -1 }}
      whileTap={disabled || loading || reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.16 }}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden="true"
        />
      )}
      {children}
    </motion.button>
  )
}
