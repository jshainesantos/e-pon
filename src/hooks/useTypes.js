import { useState, useEffect } from 'react'
import { DEFAULT_TYPES } from '../utils/accountTypes'

const STORAGE_KEY = 'epon_types'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : DEFAULT_TYPES
  } catch {
    return DEFAULT_TYPES
  }
}

export function useTypes() {
  const [types, setTypes] = useState(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(types))
  }, [types])

  function addType(type) {
    setTypes(prev => [...prev, type])
  }

  function deleteType(value) {
    const isDefault = DEFAULT_TYPES.some(t => t.value === value)
    if (isDefault) return
    setTypes(prev => prev.filter(t => t.value !== value))
  }

  return { types, addType, deleteType }
}
