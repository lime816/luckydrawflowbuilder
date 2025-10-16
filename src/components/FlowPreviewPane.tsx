import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, Loader, AlertCircle, ExternalLink } from 'lucide-react'
import { WhatsAppService } from '../utils/whatsappService'

interface FlowPreviewPaneProps {
  flowId: string
  flowName: string
  onClose: () => void
}

interface FlowAsset {
  screens?: any[]
  version?: string
  routing_model?: any
  data_api_version?: string
  _note?: string
  _flowInfo?: {
    preview?: {
      preview_url?: string
      download_url?: string
    }
    [key: string]: any
  }
  [key: string]: any
}

export default function FlowPreviewPane({ flowId, flowName, onClose }: FlowPreviewPaneProps) {
  const [flowAsset, setFlowAsset] = useState<FlowAsset | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedScreen, setSelectedScreen] = useState<number>(0)
  const [showIframePreview, setShowIframePreview] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    loadFlowAsset()
  }, [flowId])

  const loadFlowAsset = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const service = new WhatsAppService()
      const asset = await service.getFlowAsset(flowId)
      
      console.log('Loaded flow asset:', asset)
      
      if (asset) {
        setFlowAsset(asset)
        if (asset.screens && asset.screens.length > 0) {
          setSelectedScreen(0)
        }
        
        // Extract preview URL if available
        if (asset._flowInfo?.preview?.preview_url) {
          setPreviewUrl(asset._flowInfo.preview.preview_url)
        }
      } else {
        setError('No flow data available. The flow may be empty or not yet configured.')
      }
    } catch (err) {
      console.error('Error loading flow asset:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load flow preview'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const renderScreenPreview = (screen: any) => {
    if (!screen) return null

    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="mb-4">
          <h4 className="text-lg font-bold text-gray-900 mb-1">{screen.title || 'Untitled Screen'}</h4>
          <p className="text-sm text-gray-500">ID: {screen.id}</p>
          {screen.terminal && (
            <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
              Terminal Screen
            </span>
          )}
        </div>

        {/* Screen Layout */}
        {screen.layout && (
          <div className="space-y-3">
            <h5 className="font-semibold text-gray-700 text-sm">Layout: {screen.layout.type}</h5>
            
            {/* Render Children */}
            {screen.layout.children && screen.layout.children.length > 0 && (
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                {screen.layout.children.map((child: any, idx: number) => (
                  <div key={idx} className="bg-white p-3 rounded border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase">{child.type}</span>
                      {child.name && (
                        <span className="text-xs text-gray-400">name: {child.name}</span>
                      )}
                    </div>
                    
                    {/* Text Elements */}
                    {child.text && (
                      <p className="text-sm text-gray-800">{child.text}</p>
                    )}
                    
                    {/* Input Elements */}
                    {(child.type === 'TextInput' || child.type === 'EmailInput' || child.type === 'PhoneInput') && (
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder={child.label || 'Input field'}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          disabled
                        />
                        {child['helper-text'] && (
                          <p className="text-xs text-gray-500 mt-1">{child['helper-text']}</p>
                        )}
                      </div>
                    )}
                    
                    {/* Dropdown */}
                    {child.type === 'Dropdown' && (
                      <div className="mt-2">
                        <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm" disabled>
                          <option>{child.label || 'Select option'}</option>
                          {child['data-source']?.map((option: any, i: number) => (
                            <option key={i}>{option.title}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    {/* CheckboxGroup */}
                    {child.type === 'CheckboxGroup' && (
                      <div className="mt-2 space-y-2">
                        {child['data-source']?.map((option: any, i: number) => (
                          <label key={i} className="flex items-center gap-2 text-sm">
                            <input type="checkbox" disabled />
                            <span>{option.title}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    
                    {/* RadioButtonsGroup */}
                    {child.type === 'RadioButtonsGroup' && (
                      <div className="mt-2 space-y-2">
                        {child['data-source']?.map((option: any, i: number) => (
                          <label key={i} className="flex items-center gap-2 text-sm">
                            <input type="radio" name={child.name} disabled />
                            <span>{option.title}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    
                    {/* Footer Buttons */}
                    {child.type === 'Footer' && (
                      <div className="mt-2">
                        <button className="w-full px-4 py-2 bg-primary-600 text-white rounded text-sm font-medium">
                          {child.label || 'Continue'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Data API */}
        {screen.data && (
          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs font-semibold text-blue-700 mb-1">Data API Endpoint</p>
            <p className="text-xs text-blue-600 break-all">{screen.data}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-full md:w-2/3 lg:w-1/2 bg-white border-l border-gray-200 shadow-2xl z-[9999] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Flow Preview
            </h2>
            <p className="text-sm text-gray-600">{flowName}</p>
            <p className="text-xs text-gray-500">Flow ID: {flowId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader className="w-12 h-12 text-primary-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Loading flow preview...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-red-600 font-medium mb-2">Failed to load preview</p>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <button
                onClick={loadFlowAsset}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : flowAsset ? (
            <div>
              {/* Check if flow has screens */}
              {flowAsset.screens && flowAsset.screens.length > 0 ? (
                <>
                  {/* Screen Tabs */}
                  {flowAsset.screens.length > 1 && (
                    <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                      {flowAsset.screens.map((screen: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedScreen(index)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                            selectedScreen === index
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          {screen.title || `Screen ${index + 1}`}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Selected Screen Preview */}
                  {renderScreenPreview(flowAsset.screens[selectedScreen])}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
                  <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
                  <p className="text-gray-900 font-medium mb-2">Screen Data Not Accessible</p>
                  <p className="text-sm text-gray-600 mb-4 text-center max-w-md">
                    {flowAsset._note || "Unable to load flow screens due to CORS restrictions. This is a limitation of WhatsApp's API."}
                  </p>
                  
                  <div className="space-y-3 w-full max-w-md">
                    {previewUrl && (
                      <button
                        onClick={() => window.open(previewUrl, '_blank', 'width=400,height=700')}
                        className="w-full px-4 py-3 bg-whatsapp-500 hover:bg-whatsapp-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open WhatsApp Preview
                      </button>
                    )}
                    
                    {flowAsset._flowInfo?.preview?.download_url && (
                      <button
                        onClick={() => window.open(flowAsset._flowInfo.preview.download_url, '_blank')}
                        className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Download Flow JSON
                      </button>
                    )}
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-800 mb-2">
                        <strong>Why can't I see the screens?</strong>
                      </p>
                      <p className="text-xs text-amber-700 mb-2">
                        WhatsApp's download URLs have CORS restrictions that prevent direct access from web browsers.
                      </p>
                      <p className="text-xs text-amber-700">
                        <strong>Workaround:</strong> Use the buttons above to view the flow in WhatsApp's preview or download the JSON directly.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Flow Info */}
              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Flow Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Version:</span>
                    <span className="font-medium text-gray-900">{flowAsset.version || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Screens:</span>
                    <span className="font-medium text-gray-900">{flowAsset.screens?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data API Version:</span>
                    <span className="font-medium text-gray-900">{flowAsset.data_api_version || 'N/A'}</span>
                  </div>
                  {flowAsset._flowInfo?.preview?.preview_url && (
                    <div className="pt-2 border-t border-gray-200">
                      <a
                        href={flowAsset._flowInfo.preview.preview_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View in WhatsApp Preview
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 font-medium">No flow data available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <a
              href={`https://business.facebook.com/wa/manage/flows/${flowId}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Open in WhatsApp Manager
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}
