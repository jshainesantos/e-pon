import { useState, useRef, useEffect } from 'react'
import { Plus, Check, X, Pencil } from 'lucide-react'
import { nextCustomColors, DEFAULT_TYPES } from '../utils/accountTypes'

const DEFAULT_VALUES = new Set(DEFAULT_TYPES.map(t => t.value))

export function TypePicker({ value, types, onSelect, onAddType, onDeleteType }) {
  const [editing, setEditing] = useState(false)
  const [adding, setAdding] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (adding) inputRef.current?.focus()
  }, [adding])

  function handleAdd() {
    const label = newLabel.trim()
    if (!label) { setAdding(false); return }
    const slug = label.toLowerCase().replace(/\s+/g, '-')
    const already = types.find(t => t.value === slug || t.label.toLowerCase() === label.toLowerCase())
    if (already) { onSelect(already.value); setAdding(false); setNewLabel(''); return }
    const { color, bgColor } = nextCustomColors()
    const newType = { value: slug, label, color, bgColor }
    onAddType(newType)
    onSelect(slug)
    setAdding(false)
    setNewLabel('')
  }

  function stopEditing() {
    setEditing(false)
    setAdding(false)
    setNewLabel('')
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {types.map(t => {
        const isCustom = !DEFAULT_VALUES.has(t.value)
        const isSelected = value === t.value
        return (
          <div key={t.value} className="relative flex items-center">
            <button
              type="button"
              onClick={() => onSelect(t.value)}
              className={`h-8 rounded-xl border-2 text-xs font-medium transition-all active:scale-95 ${editing && isCustom ? 'pl-3 pr-7' : 'px-3'}`}
              style={
                isSelected
                  ? { borderColor: t.color, backgroundColor: t.bgColor, color: t.color }
                  : { borderColor: '#e2e8f0', backgroundColor: 'white', color: '#64748b' }
              }
            >
              {t.label}
            </button>
            {editing && isCustom && onDeleteType && (
              <button
                type="button"
                onClick={() => {
                  if (isSelected) onSelect('bank')
                  onDeleteType(t.value)
                }}
                className="absolute right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-100 hover:text-red-500"
                aria-label={`Delete ${t.label} type`}
              >
                <X size={9} />
              </button>
            )}
          </div>
        )
      })}

      {editing && (
        adding ? (
          <div className="flex items-center gap-1.5">
            <input
              ref={inputRef}
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); handleAdd() }
                if (e.key === 'Escape') { setAdding(false); setNewLabel('') }
              }}
              className="h-8 w-28 rounded-xl border border-indigo-300 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="Type name..."
              maxLength={20}
            />
            <button
              type="button"
              onClick={handleAdd}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white transition-colors hover:bg-indigo-700"
              aria-label="Confirm new type"
            >
              <Check size={13} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex h-8 items-center gap-1 rounded-xl border-2 border-dashed border-slate-200 px-3 text-xs font-medium text-slate-400 transition-colors hover:border-indigo-300 hover:text-indigo-500"
          >
            <Plus size={11} />
            New type
          </button>
        )
      )}

      {!adding && (
        <button
          type="button"
          onClick={() => editing ? stopEditing() : setEditing(true)}
          className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-colors ${editing ? 'border-indigo-300 bg-indigo-50 text-indigo-600' : 'border-slate-200 bg-white text-slate-400 hover:text-slate-600'}`}
          aria-label={editing ? 'Done editing types' : 'Edit types'}
        >
          {editing ? <Check size={13} /> : <Pencil size={12} />}
        </button>
      )}
    </div>
  )
}
