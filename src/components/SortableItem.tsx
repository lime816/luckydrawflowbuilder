import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

export function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex items-stretch gap-2 bg-slate-900/30 border border-slate-700/50 rounded-lg p-3 hover:border-whatsapp-500/30 transition-all"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="drag-handle flex items-center cursor-grab active:cursor-grabbing text-slate-500 hover:text-whatsapp-500 transition-colors"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}
