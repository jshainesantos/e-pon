import { useState } from 'react'
import { useBanks } from './modules/accounts/useBanks'
import { useTypes } from './modules/types/useTypes'
import { AppHeader } from './modules/header/AppHeader'
import { TotalBalance } from './modules/balance/TotalBalance'
import { AccountList } from './modules/accounts/AccountList'
import { EmptyState } from './modules/accounts/EmptyState'
import { AccountModal } from './modules/modal/AccountModal'
import { loadStorage, saveStorage } from './utils/storage'

export default function App() {
  const { banks, total, addBank, updateBank, deleteBank, reorderBanks } = useBanks()
  const { types, addType, deleteType } = useTypes()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [hidden, setHidden] = useState(() => loadStorage('epon_hidden', false))
  const [sort, setSort] = useState('manual')

  function handleToggleHidden() {
    setHidden(h => {
      const next = !h
      saveStorage('epon_hidden', next)
      return next
    })
  }

  function handleEdit(bank) {
    setEditingAccount(bank)
    setModalOpen(true)
  }

  function handleAdd() {
    setEditingAccount(null)
    setModalOpen(true)
  }

  function handleModalClose() {
    setModalOpen(false)
    setEditingAccount(null)
  }

  return (
    <div className="min-h-dvh bg-slate-50">
      <div className="mx-auto max-w-md px-5 pb-24 pt-6">
        <AppHeader
          sort={sort}
          hidden={hidden}
          onSortChange={setSort}
          onToggleHidden={handleToggleHidden}
          onAdd={handleAdd}
        />

        <TotalBalance total={total} accounts={banks} types={types} hidden={hidden} />

        <section className="mt-6" aria-label="Accounts list">
          {banks.length === 0 ? (
            <EmptyState onAdd={handleAdd} />
          ) : (
            <AccountList
              banks={banks}
              types={types}
              hidden={hidden}
              sort={sort}
              onSortChange={setSort}
              onReorder={reorderBanks}
              onEdit={handleEdit}
              onDelete={deleteBank}
            />
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
