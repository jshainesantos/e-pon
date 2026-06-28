import { useState } from 'react'
import { ArrowUpDown } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'manual',  label: 'Manual' },
  { value: 'balance', label: 'Balance ↓' },
  { value: 'name',    label: 'Name A–Z' },
]

export function SortDropdown({ sort, onChange }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex h-9 items-center gap-1.5 px-3 text-sm font-medium transition-colors hover:bg-slate-50 active:scale-95 ${sort !== 'manual' ? 'text-indigo-600' : 'text-slate-500'}`}
        aria-label="Sort accounts"
      >
        <ArrowUpDown size={14} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-20 w-36 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg">
            {SORT_OPTIONS.map(o => (
              <button
                key={o.value}
                onClick={() => { onChange(o.value); setOpen(false) }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50 ${sort === o.value ? 'font-semibold text-indigo-600' : 'text-slate-700'}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
