import { useState, useEffect, useRef } from 'react'
import { X, Plus, Check } from 'lucide-react'
import { parsePHP } from '../../utils/format'
import { ColorPicker } from './ColorPicker'
import { FormField } from './FormField'
import { TypePicker } from '../types/TypePicker'

const EMPTY = { name: '', accountName: '', balance: '', color: '#6366f1', type: 'bank' }

function toForm(data) {
  if (!data) return EMPTY
  return {
    name: data.name ?? '',
    accountName: data.accountName ?? '',
    balance: data.balance?.toString() ?? '',
    color: data.color ?? '#6366f1',
    type: data.type ?? 'bank',
  }
}

function inputCls(error) {
  return `w-full rounded-xl border px-3 py-2.5 text-base focus:outline-none focus:ring-2 ${
    error ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-100'
  }`
}

export function AccountModal({ open, onClose, onAdd, onUpdate, editingAccount, types, onAddType, onDeleteType }) {
  const isEdit = !!editingAccount
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const nameRef = useRef(null)

  useEffect(() => {
    if (open) {
      setForm(toForm(editingAccount))
      setErrors({})
      setTimeout(() => nameRef.current?.focus(), 50)
    }
  }, [open, editingAccount])

  useEffect(() => {
    function onKeyDown(e) { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  function setField(key, value) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  function validate() {
    const errs = {}
    const name = form.name.trim()
    const accountName = form.accountName.trim()
    if (!name) errs.name = 'Name is required.'
    else if (name.length < 2) errs.name = 'Name must be at least 2 characters.'
    else if (name.length > 30) errs.name = 'Name must be 30 characters or less.'
    if (accountName.length > 50) errs.accountName = 'Account name must be 50 characters or less.'
    if (!form.balance.toString().trim()) {
      errs.balance = 'Balance is required.'
    } else {
      const val = parseFloat(form.balance)
      if (isNaN(val)) errs.balance = 'Balance must be a valid number.'
      else if (val < 0) errs.balance = 'Balance cannot be negative.'
      else if (val > 999_999_999) errs.balance = 'Balance seems too large. Please double-check.'
    }
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const data = {
      name: form.name.trim(),
      accountName: form.accountName.trim() || form.name.trim(),
      balance: parsePHP(form.balance),
      color: form.color,
      type: form.type,
    }
    if (isEdit) onUpdate(editingAccount.id, data)
    else onAdd(data)
    onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-0 pb-0 sm:items-center sm:px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? 'Edit account' : 'Add a new account'}
    >
      <div className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            {isEdit ? 'Edit Account' : 'Add Account'}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <ColorPicker value={form.color} onChange={c => setField('color', c)} />

          <FormField id="acct-name" label="Name" required error={errors.name}>
            <input
              ref={nameRef}
              id="acct-name"
              value={form.name}
              onChange={e => setField('name', e.target.value)}
              className={inputCls(errors.name)}
              placeholder="e.g. BDO, GCash, Cash"
              autoComplete="off"
            />
          </FormField>

          <FormField id="acct-label" label="Account Name" error={errors.accountName}>
            <input
              id="acct-label"
              value={form.accountName}
              onChange={e => setField('accountName', e.target.value)}
              className={inputCls(errors.accountName)}
              placeholder="e.g. Savings Account, E-Wallet"
              autoComplete="off"
            />
          </FormField>

          <div className="mb-3">
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Type</label>
            <TypePicker
              value={form.type}
              types={types}
              onSelect={v => setField('type', v)}
              onAddType={t => { onAddType(t); setField('type', t.value) }}
              onDeleteType={onDeleteType}
            />
          </div>

          <FormField id="acct-balance" label="Balance (₱)" required error={errors.balance}>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">₱</span>
              <input
                id="acct-balance"
                type="number"
                value={form.balance}
                onChange={e => setField('balance', e.target.value)}
                className={`w-full rounded-xl border py-2.5 pl-7 pr-3 font-mono text-base focus:outline-none focus:ring-2 ${errors.balance ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-100'}`}
                placeholder="0.00"
                inputMode="decimal"
                step="0.01"
                min="0"
              />
            </div>
          </FormField>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 active:scale-[0.98]"
          >
            {isEdit ? <><Check size={16} /> Save Changes</> : <><Plus size={16} /> Add Account</>}
          </button>
        </form>
      </div>
    </div>
  )
}
