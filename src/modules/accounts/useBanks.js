import { useState, useEffect } from 'react'
import { loadStorage, saveStorage } from '../../utils/storage'

const KEY = 'epon_banks'
const now = () => new Date().toISOString()

function migrate(accounts) {
  return accounts.map(a => ({ type: 'bank', updatedAt: now(), ...a }))
}

export function useBanks() {
  const [banks, setBanks] = useState(() => {
    const raw = loadStorage(KEY, [])
    return Array.isArray(raw) ? migrate(raw) : []
  })

  useEffect(() => {
    saveStorage(KEY, banks)
  }, [banks])

  function addBank(bank) {
    setBanks(prev => [...prev, { ...bank, id: crypto.randomUUID(), updatedAt: now() }])
  }

  function updateBank(id, updates) {
    setBanks(prev => prev.map(b => b.id === id ? { ...b, ...updates, updatedAt: now() } : b))
  }

  function deleteBank(id) {
    setBanks(prev => prev.filter(b => b.id !== id))
  }

  function reorderBanks(orderedIds) {
    setBanks(prev => {
      const map = Object.fromEntries(prev.map(b => [b.id, b]))
      return orderedIds.map(id => map[id]).filter(Boolean)
    })
  }

  const total = banks.reduce((sum, b) => sum + b.balance, 0)

  return { banks, total, addBank, updateBank, deleteBank, reorderBanks }
}
