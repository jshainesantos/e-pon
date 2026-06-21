export const DEFAULT_TYPES = [
  { value: 'cash',       label: 'Cash',       color: '#16a34a', bgColor: '#dcfce7' },
  { value: 'ewallet',    label: 'E-Wallet',   color: '#2563eb', bgColor: '#dbeafe' },
  { value: 'bank',       label: 'Bank',       color: '#4f46e5', bgColor: '#e0e7ff' },
  { value: 'investment', label: 'Investment', color: '#7c3aed', bgColor: '#ede9fe' },
]

const CUSTOM_COLORS = [
  { color: '#0891b2', bgColor: '#cffafe' },
  { color: '#059669', bgColor: '#d1fae5' },
  { color: '#dc2626', bgColor: '#fee2e2' },
  { color: '#9333ea', bgColor: '#f3e8ff' },
  { color: '#ea580c', bgColor: '#ffedd5' },
  { color: '#475569', bgColor: '#f1f5f9' },
]

let _colorIdx = 0
export function nextCustomColors() {
  const c = CUSTOM_COLORS[_colorIdx % CUSTOM_COLORS.length]
  _colorIdx++
  return c
}

export function getType(value, allTypes) {
  const list = allTypes ?? DEFAULT_TYPES
  return list.find(t => t.value === value) ?? DEFAULT_TYPES[2]
}
