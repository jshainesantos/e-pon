import { useState, useMemo } from 'react'
import { Plus, Eye, EyeOff, ArrowUpDown, PiggyBank } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'

import { useBanks } from './hooks/useBanks'
import { useTypes } from './hooks/useTypes'
import { TotalBalance } from './components/TotalBalance'
import { BankCard } from './components/BankCard'
import { AccountModal } from './components/AddBankModal'

const SORT_OPTIONS = [
  { value: 'manual',  label: 'Manual' },
  { value: 'balance', label: 'Balance ↓' },
  { value: 'name',    label: 'Name A–Z' },
]

export default function App() {
  const { banks, total, addBank, updateBank, deleteBank, reorderBanks } = useBanks()
  const { types, addType, deleteType } = useTypes()

  const [modalOpen, setModalOpen]         = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [hidden, setHidden]               = useState(false)
  const [sort, setSort]                   = useState('manual')
  const [sortOpen, setSortOpen]           = useState(false)

  const sorted = useMemo(() => {
    if (sort === 'balance') return [...banks].sort((a, b) => b.balance - a.balance)
    if (sort === 'name')    return [...banks].sort((a, b) => a.name.localeCompare(b.name))
    return banks
  }, [banks, sort])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return
    setSort('manual')
    const oldIdx = sorted.findIndex(b => b.id === active.id)
    const newIdx = sorted.findIndex(b => b.id === over.id)
    reorderBanks(arrayMove(sorted, oldIdx, newIdx).map(b => b.id))
  }

  function handleEdit(bank) {
    setEditingAccount(bank)
    setModalOpen(true)
  }

  function handleModalClose() {
    setModalOpen(false)
    setEditingAccount(null)
  }

  return (
    <div className="min-h-dvh bg-slate-50">
      <div className="mx-auto max-w-md px-4 pb-24 pt-8">

        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
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
            {/* Sort + Hide grouped pill */}
            <div className="flex items-center divide-x divide-slate-200 rounded-xl border border-slate-200 bg-white">
              {/* Sort */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(o => !o)}
                  className={`flex h-9 items-center gap-1.5 px-3 text-sm font-medium transition-colors hover:bg-slate-50 active:scale-95 ${sort !== 'manual' ? 'text-indigo-600' : 'text-slate-500'}`}
                  aria-label="Sort accounts"
                >
                  <ArrowUpDown size={14} />
                </button>
                {sortOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                    <div className="absolute right-0 top-10 z-20 w-36 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg">
                      {SORT_OPTIONS.map(o => (
                        <button
                          key={o.value}
                          onClick={() => { setSort(o.value); setSortOpen(false) }}
                          className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50 ${sort === o.value ? 'font-semibold text-indigo-600' : 'text-slate-700'}`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Hide balances */}
              <button
                onClick={() => setHidden(h => !h)}
                className={`flex h-9 w-9 items-center justify-center transition-colors hover:bg-slate-50 active:scale-95 ${hidden ? 'text-indigo-600' : 'text-slate-500'}`}
                aria-label={hidden ? 'Show balances' : 'Hide balances'}
              >
                {hidden ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Add */}
            <button
              onClick={() => { setEditingAccount(null); setModalOpen(true) }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 active:scale-95"
              aria-label="Add a new account"
            >
              <Plus size={16} />
            </button>
          </div>
        </header>

        {/* Total balance */}
        <TotalBalance total={total} accounts={banks} types={types} hidden={hidden} />

        {/* Account list */}
        <section className="mt-6" aria-label="Accounts list">
          {banks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
              <PiggyBank size={36} className="mb-3 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">No accounts added yet.</p>
              <p className="mt-1 text-xs text-slate-400">Tap "Add" to get started.</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={sorted.map(b => b.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-3">
                  {sorted.map(bank => (
                    <BankCard
                      key={bank.id}
                      bank={bank}
                      types={types}
                      hidden={hidden}
                      dragEnabled={sort === 'manual'}
                      onEdit={handleEdit}
                      onDelete={deleteBank}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </section>
      </div>

      <AccountModal
        open={modalOpen}
        onClose={handleModalClose}
        onAdd={addBank}
        onUpdate={updateBank}
        editingAccount={editingAccount}
        types={types}
        onAddType={addType}
        onDeleteType={deleteType}
      />
    </div>
  )
}
