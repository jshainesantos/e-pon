import { PHPAmount } from './PesoSign'

export function TotalBalance({ total, accounts, types, hidden }) {
  const breakdown = types
    .map(t => ({
      ...t,
      sum: accounts.filter(a => a.type === t.value).reduce((s, a) => s + a.balance, 0),
      count: accounts.filter(a => a.type === t.value).length,
    }))
    .filter(t => t.count > 0)

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-10 -right-4 h-32 w-32 rounded-full bg-white/5" />

      <p className="text-sm font-medium text-indigo-200">Total Balance</p>
      <PHPAmount amount={total} className={`mt-1 font-mono text-3xl font-bold tabular-nums tracking-tight transition-all select-none ${hidden ? 'blur-md' : ''}`} />
      <p className="mt-1 text-xs text-indigo-200">
        {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'} linked
      </p>

      {breakdown.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {breakdown.map(t => (
            <div key={t.value} className="rounded-xl bg-white/10 px-3 py-2">
              <span className="block truncate text-xs font-medium text-indigo-200">{t.label}</span>
              <PHPAmount amount={t.sum} className={`mt-0.5 block font-mono text-sm font-semibold tabular-nums text-white transition-all select-none ${hidden ? 'blur-sm' : ''}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
