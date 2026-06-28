export function FormField({ id, label, required, error, children }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-slate-600">
        {label}
        {required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500" role="alert">{error}</p>}
    </div>
  )
}
