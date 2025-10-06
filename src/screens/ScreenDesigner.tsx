import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, X } from 'lucide-react'
import Palette from '../components/Palette'
import Canvas from '../components/Canvas'
import ScreenSettings from '../components/ScreenSettings'
import { useFlowStore } from '../state/store'

interface ScreenDesignerProps {
  flowName: string
  setFlowName: (name: string) => void
  customMessage: string
  setCustomMessage: (message: string) => void
}

export default function ScreenDesigner({ flowName, setFlowName, customMessage, setCustomMessage }: ScreenDesignerProps) {
  const { screens, selectedScreenId, selectScreen, removeScreen } = useFlowStore()
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Left Sidebar - Screens & Components */}
      <motion.aside 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-2 space-y-6"
      >
        {/* Screens Section */}
        <div className="glass-panel p-4">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-whatsapp-500" />
            <h3 className="text-lg font-semibold text-white">Screens</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {screens.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`screen-tab group ${
                  s.id === selectedScreenId ? 'screen-tab-active' : 'screen-tab-inactive'
                } relative`}
              >
                <button
                  onClick={() => selectScreen(s.id)}
                  className="flex-1 text-left pr-6"
                >
                  {s.id}
                </button>
                {screens.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeScreen(s.id)
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                    title="Delete screen"
                  >
                    <X className="w-3 h-3 text-red-400" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Palette */}
        <Palette />
      </motion.aside>

      {/* Main Canvas */}
      <motion.main 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-7"
      >
        <AnimatePresence mode="wait">
          <Canvas key={selectedScreenId} />
        </AnimatePresence>
      </motion.main>

      {/* Right Sidebar - Screen Settings */}
      <motion.aside
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-3 h-full"
      >
        <div className="glass-panel h-full">
          <ScreenSettings 
            flowName={flowName}
            setFlowName={setFlowName}
            customMessage={customMessage}
            setCustomMessage={setCustomMessage}
          />
        </div>
      </motion.aside>
    </div>
  )
}
