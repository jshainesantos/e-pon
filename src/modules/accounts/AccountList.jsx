import { useMemo } from 'react'
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
import { AccountCard } from './AccountCard'

export function AccountList({ banks, types, hidden, sort, onSortChange, onReorder, onEdit, onDelete }) {
  const sorted = useMemo(() => {
    if (sort === 'balance') return [...banks].sort((a, b) => b.balance - a.balance)
    if (sort === 'name') return [...banks].sort((a, b) => a.name.localeCompare(b.name))
    return banks
  }, [banks, sort])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return
    onSortChange('manual')
    const oldIdx = sorted.findIndex(b => b.id === active.id)
    const newIdx = sorted.findIndex(b => b.id === over.id)
    onReorder(arrayMove(sorted, oldIdx, newIdx).map(b => b.id))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sorted.map(b => b.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3">
          {sorted.map(bank => (
            <AccountCard
              key={bank.id}
              bank={bank}
              types={types}
              hidden={hidden}
              dragEnabled={sort === 'manual'}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
