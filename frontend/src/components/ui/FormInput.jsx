/**
 * Univerzalno polje forme sa labelom, porukom o grešci i pomoćnim tekstom.
 * Prop "as" bira tip polja: 'input' (podrazumevano), 'select' ili 'textarea'.
 */
export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  error,
  helper,
  name,
  required = false,
  as = 'input',
  options = [],
  ...props
}) {
  // Osnovne klase; ako polje ima grešku, uokvirujemo ga crvenom bojom.
  const base = `w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition
    focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
    ${error ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'}`

  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </span>
      )}

      {as === 'select' ? (
        <select name={name} value={value} onChange={onChange} className={base} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : as === 'textarea' ? (
        <textarea name={name} value={value} onChange={onChange} rows={3} className={base} {...props} />
      ) : (
        <input name={name} type={type} value={value} onChange={onChange} className={base} {...props} />
      )}

      {/* Pomoćni tekst se prikazuje samo ako nema greške. */}
      {helper && !error && <span className="mt-1 block text-xs text-slate-500">{helper}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  )
}
