import { useState } from 'react'
import { Pencil, Trash2, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PHPAmount } from './PesoSign'
import { getType } from '../utils/accountTypes'
import { relativeTime } from '../utils/relativeTime'

export function BankCard({ bank, types, hidden, dragEnabled = true, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const typeInfo = getType(bank.type, types)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: bank.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...(dragEnabled ? listeners : {})}
            className={`touch-none transition-colors ${dragEnabled ? 'cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500' : 'cursor-default text-slate-200'}`}
            aria-label="Drag to reorder"
            tabIndex={-1}
            disabled={!dragEnabled}
          >
            <GripVertical size={16} />
          </button>

          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: bank.color }}
            aria-hidden="true"
          >
            {bank.name.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">{bank.name}</p>
            <p className="text-xs text-slate-400">{bank.accountName}</p>
          </div>
        </div>

        <div className="flex gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
          <button
            onClick={() => onEdit(bank)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label={`Edit ${bank.name}`}
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
            aria-label={`Delete ${bank.name}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <PHPAmount amount={bank.balance} className={`font-mono text-xl font-bold tabular-nums text-slate-900 transition-all select-none ${hidden ? 'blur-sm' : ''}`} />
          {bank.updatedAt && (
            <p className="mt-0.5 text-xs text-slate-400">Updated {relativeTime(bank.updatedAt)}</p>
          )}
        </div>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium"
          style={{ backgroundColor: typeInfo.bgColor, color: typeInfo.color }}
        >
          {typeInfo.label}
        </span>
      </div>

      {confirmDelete && (
        <div className="mt-3 rounded-xl bg-red-50 p-3">
          <p className="mb-2 text-xs font-medium text-red-700">
            Remove {bank.name}? This can't be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onDelete(bank.id)}
              className="flex-1 rounded-lg bg-red-600 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700 active:scale-95"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 rounded-lg bg-white py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
