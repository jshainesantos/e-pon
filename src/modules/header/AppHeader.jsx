import { Plus, Eye, EyeOff, PiggyBank } from 'lucide-react'
import { SortDropdown } from './SortDropdown'

export function AppHeader({ sort, hidden, onSortChange, onToggleHidden, onAdd }) {
  return (
    <header className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200">
          <PiggyBank size={22} className="text-white" aria-hidden="true" />
        </div>
        <div>
          <h1 className="flex items-baseline gap-0.5 leading-none">
            <span className="text-xl font-black text-indigo-600 tracking-tight">E</span>
            <span className="text-xl font-bold text-slate-800 tracking-tight">-pon</span>
          </h1>
          <p className="mt-0.5 text-[10px] font-medium tracking-widest text-slate-400 uppercase">Savings Tracker</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center divide-x divide-slate-200 rounded-xl border border-slate-200 bg-white">
          <SortDropdown sort={sort} onChange={onSortChange} />
          <button
            onClick={onToggleHidden}
            className={`flex h-9 w-9 items-center justify-center transition-colors hover:bg-slate-50 active:scale-95 ${hidden ? 'text-indigo-600' : 'text-slate-500'}`}
            aria-label={hidden ? 'Show balances' : 'Hide balances'}
          >
            {hidden ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <button
          onClick={onAdd}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 active:scale-95"
          aria-label="Add a new account"
        >
          <Plus size={16} />
        </button>
      </div>
    </header>
  )
}
