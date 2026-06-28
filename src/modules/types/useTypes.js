import { useState, useEffect } from 'react'
import { DEFAULT_TYPES } from '../../utils/accountTypes'
import { loadStorage, saveStorage } from '../../utils/storage'

const KEY = 'epon_types'

export function useTypes() {
  const [types, setTypes] = useState(() => loadStorage(KEY, DEFAULT_TYPES))

  useEffect(() => {
    saveStorage(KEY, types)
  }, [types])

  function addType(type) {
    setTypes(prev => [...prev, type])
  }

  function deleteType(value) {
    if (DEFAULT_TYPES.some(t => t.value === value)) return
    setTypes(prev => prev.filter(t => t.value !== value))
  }

  return { types, addType, deleteType }
}
