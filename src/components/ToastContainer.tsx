import React from 'react'
import { AnimatePresence } from 'framer-motion'
import Toast, { ToastData } from './Toast'

interface ToastContainerProps {
  toasts: ToastData[]
  onClose: (id: string) => void
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  console.log('🍞 TOAST CONTAINER RECEIVED:', toasts.length, 'toasts')
  toasts.forEach(toast => console.log('🍞 Toast:', toast.type, toast.title))
  
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {/* Debug indicator */}
      {toasts.length > 0 && (
        <div className="text-xs text-red-500 bg-yellow-200 p-1 rounded">
          DEBUG: {toasts.length} toasts
        </div>
      )}
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ToastContainer
