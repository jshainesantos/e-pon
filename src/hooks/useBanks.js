import { useState, useEffect } from 'react'

const STORAGE_KEY = 'epon_banks'
const now = () => new Date().toISOString()

function migrate(accounts) {
  return accounts.map(a => ({
    type: 'bank',
    updatedAt: now(),
    ...a,
  }))
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? migrate(JSON.parse(raw)) : []
  } catch {
    return DEFAULT_BANKS
  }
}

export function useBanks() {
  const [banks, setBanks] = useState(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(banks))
  }, [banks])

  function addBank(bank) {
    setBanks(prev => [...prev, { ...bank, id: crypto.randomUUID(), updatedAt: now() }])
  }

  function updateBank(id, updates) {
    setBanks(prev => prev.map(b =>
      b.id === id ? { ...b, ...updates, updatedAt: now() } : b
    ))
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
