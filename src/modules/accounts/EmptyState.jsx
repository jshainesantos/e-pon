import { Plus, PiggyBank } from 'lucide-react'

export function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
        <PiggyBank size={28} className="text-indigo-400" />
      </div>
      <p className="text-sm font-semibold text-slate-700">No accounts yet</p>
      <p className="mt-1 text-xs text-slate-400">Add your first account to get started.</p>
      <button
        onClick={onAdd}
        className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 active:scale-95"
      >
        <Plus size={15} />
        Add Account
      </button>
    </div>
  )
}
