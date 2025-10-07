import React, { useState, useEffect } from 'react'
import { Globe, Settings, TestTube, Plus, Trash2, Play, Pause, AlertCircle, CheckCircle, Copy, ExternalLink, Server, MessageCircle } from 'lucide-react'
import { backendApiService, FlowTrigger } from '../utils/backendApiService'

interface WebhookSetupProps {
  flows: any[]
}

export default function WebhookSetup({ flows }: WebhookSetupProps) {
  const [triggers, setTriggers] = useState<FlowTrigger[]>([])
  const [newTrigger, setNewTrigger] = useState({
    keyword: '',
    flowId: '',
    message: ''
  })
  const [isAddingTrigger, setIsAddingTrigger] = useState(false)
  const [testMessage, setTestMessage] = useState('hello')
  const [testPhoneNumber, setTestPhoneNumber] = useState('918281348343')
  const [isTestingWebhook, setIsTestingWebhook] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoadingTriggers, setIsLoadingTriggers] = useState(false)
  const [backendHealth, setBackendHealth] = useState<any>(null)
  const [webhookStatus, setWebhookStatus] = useState({
    isConfigured: false,
    webhookUrl: 'http://localhost:3001/webhook',
    backendUrl: 'http://localhost:3001',
    triggersCount: 0,
    activeTriggersCount: 0,
    isBackendRunning: false
  })

  useEffect(() => {
    // Initialize webhook status with defaults
    const initialStatus = backendApiService.getWebhookStatus()
    setWebhookStatus(prev => ({
      ...prev,
      ...initialStatus,
      triggersCount: 0,
      activeTriggersCount: 0
    }))
    
    loadTriggers()
    updateWebhookStatus()
  }, [])

  const loadTriggers = async () => {
    setIsLoadingTriggers(true)
    try {
      const loadedTriggers = await backendApiService.getAllTriggers()
      setTriggers(loadedTriggers)
    } catch (error) {
      console.error('Error loading triggers:', error)
      alert('Failed to load triggers. Make sure backend server is running.')
    } finally {
      setIsLoadingTriggers(false)
    }
  }

  const updateWebhookStatus = async () => {
    console.log('🔍 Checking backend health...')
    try {
      const health = await backendApiService.checkHealth()
      console.log('✅ Health check result:', health)
      setBackendHealth(health)
      
      const status = backendApiService.getWebhookStatus()
      const isRunning = health.status === 'healthy' && health.isConnected !== false
      
      console.log('📊 Backend status:', { health, isRunning, status })
      
      setWebhookStatus({
        ...status,
        triggersCount: triggers.length,
        activeTriggersCount: triggers.filter(t => t.isActive).length,
        isBackendRunning: isRunning
      })
    } catch (error) {
      console.error('❌ Error checking backend status:', error)
      const status = backendApiService.getWebhookStatus()
      setWebhookStatus({
        ...status,
        triggersCount: triggers.length,
        activeTriggersCount: triggers.filter(t => t.isActive).length,
        isBackendRunning: false
      })
    }
  }

  const addTrigger = async () => {
    if (!newTrigger.keyword || !newTrigger.flowId) {
      alert('Please enter a keyword and select a flow')
      return
    }

    try {
      const trigger = await backendApiService.createTrigger({
        keyword: newTrigger.keyword,
        flowId: newTrigger.flowId,
        message: newTrigger.message || 'Please complete this form:',
        isActive: true
      })

      setTriggers(prev => [...prev, trigger])
      setNewTrigger({ keyword: '', flowId: '', message: '' })
      setIsAddingTrigger(false)
      updateWebhookStatus()
    } catch (error: any) {
      console.error('Error adding trigger:', error)
      alert(`Failed to add trigger: ${error.message}`)
    }
  }

  const removeTrigger = async (id: string) => {
    try {
      await backendApiService.deleteTrigger(id)
      setTriggers(prev => prev.filter(t => t.id !== id))
      updateWebhookStatus()
    } catch (error: any) {
      console.error('Error removing trigger:', error)
      alert(`Failed to remove trigger: ${error.message}`)
    }
  }

  const toggleTrigger = async (id: string, isActive: boolean) => {
    try {
      const updatedTrigger = await backendApiService.toggleTrigger(id, isActive)
      setTriggers(prev => prev.map(t => t.id === id ? updatedTrigger : t))
      updateWebhookStatus()
    } catch (error: any) {
      console.error('Error toggling trigger:', error)
      alert(`Failed to ${isActive ? 'activate' : 'deactivate'} trigger: ${error.message}`)
    }
  }

  const testWebhook = async () => {
    if (!testMessage) {
      alert('Please enter a test message')
      return
    }

    setIsTestingWebhook(true)
    try {
      const result = await backendApiService.testTrigger(testMessage, testPhoneNumber)
      setTestResult({
        success: true,
        ...result
      })
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Test failed'
      })
    } finally {
      setIsTestingWebhook(false)
    }
  }

  const copyWebhookUrl = () => {
    const webhookUrl = webhookStatus.webhookUrl || 'http://localhost:3001/webhook'
    navigator.clipboard.writeText(webhookUrl)
    alert('Webhook URL copied to clipboard')
  }

  const copyBackendUrl = () => {
    navigator.clipboard.writeText(webhookStatus.backendUrl)
    alert('Backend URL copied to clipboard')
  }

  const runLocalTest = async () => {
    try {
      console.log('🔍 Running local backend test...')
      const health = await backendApiService.checkHealth()
      setBackendHealth(health)
      console.log('✅ Backend test result:', health)
      
      if (health.status === 'healthy') {
        alert(`✅ Backend Status: ${health.status}\\n⏱️ Uptime: ${health.uptime || 'N/A'}s\\n📦 Version: ${health.version || 'N/A'}\\n🌐 URL: ${webhookStatus.backendUrl}`)
      } else {
        alert(`❌ Backend Error: ${health.error || 'Unknown error'}\\n🔗 Trying to connect to: ${webhookStatus.backendUrl}/health`)
      }
      
      // Update webhook status after test
      updateWebhookStatus()
    } catch (error) {
      console.error('❌ Local test failed:', error)
      alert(`❌ Backend Test Failed\\n\\nError: ${error instanceof Error ? error.message : 'Unknown error'}\\n🔗 URL: ${webhookStatus.backendUrl}\\n\\n💡 Make sure the backend server is running on port 3001`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Globe className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Webhook Setup & Backend Integration</h2>
      </div>

      {/* Backend Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Backend Configuration</span>
          </h3>
          <div className="flex items-center space-x-2">
            {webhookStatus.isBackendRunning ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-sm ${webhookStatus.isBackendRunning ? 'text-green-600' : 'text-red-600'}`}>
              {webhookStatus.isBackendRunning ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Webhook URL:</label>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <code className="flex-1 text-sm font-mono text-blue-800 bg-transparent select-all">
                {webhookStatus.webhookUrl || 'http://localhost:3001/webhook'}
              </code>
              <button
                onClick={copyWebhookUrl}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium flex items-center gap-1"
                title="Copy Webhook URL"
              >
                <Copy className="h-3 w-3" />
                Copy
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Backend API URL:</label>
            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <code className="flex-1 text-sm font-mono text-green-800 bg-transparent select-all">
                {webhookStatus.backendUrl || 'http://localhost:3001'}
              </code>
              <button
                onClick={copyBackendUrl}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium flex items-center gap-1"
                title="Copy Backend URL"
              >
                <Copy className="h-3 w-3" />
                Copy
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Backend Status:</label>
              <div className={`p-3 rounded-lg border flex items-center space-x-3 ${
                webhookStatus.isBackendRunning 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                {webhookStatus.isBackendRunning ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-sm font-medium text-green-800">Connected</div>
                      <div className="text-xs text-green-600">Server is running</div>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <div className="text-sm font-medium text-red-800">Disconnected</div>
                      <div className="text-xs text-red-600">Server not accessible</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Active Triggers:</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-lg font-bold text-gray-800">
                  {webhookStatus.activeTriggersCount}
                  <span className="text-sm font-normal text-gray-600"> / {webhookStatus.triggersCount}</span>
                </div>
                <div className="text-xs text-gray-500">triggers active</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Start the backend server (should be running on port 3001)</li>
          <li>Configure your WhatsApp credentials in backend/.env</li>
          <li>Deploy backend to production (Heroku, Railway, Vercel, etc.)</li>
          <li>Update webhook URL in WhatsApp Business API settings</li>
          <li>Subscribe to 'messages' field in webhook configuration</li>
        </ol>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => window.open('https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks', '_blank')}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
          >
            <ExternalLink className="h-3 w-3" />
            <span>WhatsApp Docs</span>
          </button>
          <button
            onClick={() => window.open(webhookStatus.backendUrl, '_blank')}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
          >
            <Server className="h-3 w-3" />
            <span>Backend API</span>
          </button>
        </div>
      </div>

      {/* Flow Triggers */}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Flow Triggers</h3>
              <p className="text-sm text-gray-500">Automatically send flows when users message keywords</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddingTrigger(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              webhookStatus.isBackendRunning
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!webhookStatus.isBackendRunning}
          >
            <Plus className="h-4 w-4" />
            <span>Add Trigger</span>
          </button>
        </div>

        {/* Backend connection warning */}
        {!webhookStatus.isBackendRunning && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-red-800 mb-1">Backend Server Required</div>
                <div className="text-sm text-red-700">
                  The backend server must be running to manage triggers. Please start the server first.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show example trigger when we have a connection but no triggers */}
        {webhookStatus.isBackendRunning && triggers.length === 0 && !isAddingTrigger && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-blue-900">→ hello</span>
                <span className="text-blue-600">triggers</span>
                <span className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded">
                  your_flow_id_here
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1.5 text-green-600 hover:bg-green-100 rounded" disabled>
                  <Play className="h-4 w-4" />
                </button>
                <button className="p-1.5 text-red-600 hover:bg-red-100 rounded" disabled>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="text-sm text-blue-700">
              "Hello! Please complete this form:"
            </div>
            <div className="text-xs text-blue-600 mt-2 opacity-75">
              This is how your triggers will appear once created
            </div>
          </div>
        )}

        {/* Add New Trigger */}
        {isAddingTrigger && (
          <div className="bg-gray-50 rounded p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium mb-1">Keyword</label>
                <input
                  type="text"
                  value={newTrigger.keyword}
                  onChange={(e) => setNewTrigger(prev => ({ ...prev, keyword: e.target.value }))}
                  placeholder="e.g., hello, start, register"
                  className="w-full px-3 py-1.5 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Flow</label>
                <select
                  value={newTrigger.flowId}
                  onChange={(e) => setNewTrigger(prev => ({ ...prev, flowId: e.target.value }))}
                  className="w-full px-3 py-1.5 border rounded text-sm"
                >
                  <option value="">Select a flow</option>
                  {flows.map((flow) => (
                    <option key={flow.id} value={flow.id}>
                      {flow.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Custom Message (Optional)</label>
                <input
                  type="text"
                  value={newTrigger.message}
                  onChange={(e) => setNewTrigger(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Please complete this form:"
                  className="w-full px-3 py-1.5 border rounded text-sm"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={addTrigger}
                className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                Add Trigger
              </button>
              <button
                onClick={() => setIsAddingTrigger(false)}
                className="px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoadingTriggers && (
          <div className="text-center py-4">
            <div className="text-sm text-gray-500">Loading triggers...</div>
          </div>
        )}

        {/* Existing Triggers */}
        {!isLoadingTriggers && triggers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No triggers configured yet</h4>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Add triggers to automatically send flows when users send specific keywords like "hello", "register", or "start".
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="text-sm text-blue-800">
                <strong>Example:</strong> User sends "hello" → System responds with registration flow
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {triggers.map((trigger) => (
              <div
                key={trigger.id}
                className={`flex items-center justify-between p-3 border rounded ${
                  trigger.isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{trigger.keyword}</span>
                    <span className="text-gray-500">→</span>
                    <span className="text-sm text-gray-600">
                      {flows.find(f => f.id === trigger.flowId)?.name || trigger.flowId}
                    </span>
                  </div>
                  {trigger.message && (
                    <p className="text-sm text-gray-500 mt-1">"{trigger.message}"</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleTrigger(trigger.id, !trigger.isActive)}
                    className={`p-1.5 rounded ${
                      trigger.isActive 
                        ? 'text-green-600 hover:bg-green-100' 
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={trigger.isActive ? 'Deactivate' : 'Activate'}
                    disabled={!webhookStatus.isBackendRunning}
                  >
                    {trigger.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => removeTrigger(trigger.id)}
                    className="p-1.5 text-red-600 hover:bg-red-100 rounded"
                    title="Delete"
                    disabled={!webhookStatus.isBackendRunning}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Webhook Testing */}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <TestTube className="h-4 w-4 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">Test Webhook</h3>
            <p className="text-sm text-gray-500">Send test messages to verify your triggers work</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Test Message</label>
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Enter a keyword to test (e.g., hello, register, start)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              />
              <p className="text-xs text-gray-500">This should match one of your trigger keywords</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Test Phone Number</label>
              <input
                type="text"
                value={testPhoneNumber}
                onChange={(e) => setTestPhoneNumber(e.target.value)}
                placeholder="918281348343"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              />
              <p className="text-xs text-gray-500">WhatsApp number with country code (no +)</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={testWebhook}
              disabled={isTestingWebhook || !testMessage || !webhookStatus.isBackendRunning}
              className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
                isTestingWebhook || !testMessage || !webhookStatus.isBackendRunning
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <TestTube className="h-4 w-4" />
              <span>{isTestingWebhook ? 'Testing...' : 'Test Webhook'}</span>
            </button>

            <button
              onClick={runLocalTest}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 flex items-center space-x-2 transition-colors"
            >
              <Server className="h-4 w-4" />
              <span>Check Backend</span>
            </button>

            {!webhookStatus.isBackendRunning && (
              <div className="flex items-center px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                Backend must be running to test
              </div>
            )}
          </div>

          {/* Test Results */}
          {testResult && (
            <div className={`mt-4 p-3 rounded border ${
              testResult.success 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="font-medium">
                {testResult.success ? '✅ Test Successful' : '❌ Test Failed'}
              </div>
              <div className="text-sm mt-1">
                {testResult.message || testResult.error}
              </div>
              {testResult.allActiveTriggers && (
                <div className="text-sm mt-1">
                  <div>Matching trigger: {testResult.matchingTrigger ? testResult.matchingTrigger.keyword : 'None'}</div>
                  <div>Active triggers: {testResult.allActiveTriggers.length}</div>
                  {testResult.simulationResult && (
                    <div>Simulation: {testResult.simulationResult}</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}