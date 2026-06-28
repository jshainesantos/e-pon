const PRESET_COLORS = [
  '#003087',
  '#007DFF',
  '#CC0000',
  '#00843D',
  '#FF6B00',
  '#6366f1',
  '#0ea5e9',
  '#8b5cf6',
]

export function ColorPicker({ value, onChange }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-medium text-slate-600">Color</label>
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map(c => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className="h-8 w-8 rounded-full border-2 transition-transform active:scale-90"
            style={{
              backgroundColor: c,
              borderColor: value === c ? '#1e293b' : 'transparent',
              transform: value === c ? 'scale(1.15)' : undefined,
            }}
            aria-label={`Select color ${c}`}
            aria-pressed={value === c}
          />
        ))}
        <label
          className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-slate-300 transition-colors hover:border-slate-400"
          aria-label="Custom color"
          title="Custom color"
        >
          <span className="h-4 w-4 rounded-full" style={{ backgroundColor: value }} />
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            tabIndex={-1}
          />
        </label>
      </div>
    </div>
  )
}
