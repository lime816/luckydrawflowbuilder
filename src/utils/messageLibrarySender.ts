import { WhatsAppService } from './whatsappService'
import type { MessageLibraryEntry } from '../types'

const PHONE_NUMBER_ID = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || ''
const ACCESS_TOKEN = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN || ''

function authHeaders() {
  return {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
}

export async function sendLibraryMessage(entry: MessageLibraryEntry, to: string): Promise<{ success: boolean; error?: string }> {
  if (!to) return { success: false, error: 'Missing recipient phone number' }
  // Normalize
  const recipient = to.replace(/\s+/g, '')

  try {
    switch (entry.type) {
      case 'standard_text': {
        const body = (entry.contentPayload as any).body || ''
        const res = await fetch(`https://graph.facebook.com/${import.meta.env.VITE_WHATSAPP_API_VERSION || 'v22.0'}/${PHONE_NUMBER_ID}/messages`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: recipient,
            type: 'text',
            text: { body }
          })
        })
        const data = await res.json()
        if (!res.ok) return { success: false, error: data.error?.message || 'Failed to send text' }
        return { success: true }
      }

      case 'interactive_button': {
        const payload = entry.contentPayload as any
        const buttons = (payload.buttons || []).slice(0, 3).map((b: any) => ({ type: 'reply', reply: { id: b.buttonId || b.id, title: b.title } }))
        const message = {
          messaging_product: 'whatsapp',
          to: recipient,
          type: 'interactive',
          interactive: {
            type: 'button',
            header: payload.header ? { type: 'text', text: payload.header } : undefined,
            body: { text: payload.body || '' },
            footer: payload.footer ? { text: payload.footer } : undefined,
            action: { buttons }
          }
        }
        const res = await fetch(`https://graph.facebook.com/${import.meta.env.VITE_WHATSAPP_API_VERSION || 'v22.0'}/${PHONE_NUMBER_ID}/messages`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(message)
        })
        const data = await res.json()
        if (!res.ok) return { success: false, error: data.error?.message || 'Failed to send interactive buttons' }
        return { success: true }
      }

      case 'interactive_list': {
        const payload = entry.contentPayload as any
        // Build sections/rows according to payload
        const interactive: any = {
          type: 'list',
          header: payload.header ? { type: 'text', text: payload.header } : undefined,
          body: { text: payload.body || '' },
          footer: payload.footer ? { text: payload.footer } : undefined,
          action: {
            button: payload.buttonText || 'View',
            sections: (payload.sections || []).map((s: any) => ({
              title: s.title,
              rows: (s.rows || []).map((r: any) => ({ id: r.rowId || r.id, title: r.title, description: r.description }))
            }))
          }
        }

        const res = await fetch(`https://graph.facebook.com/${import.meta.env.VITE_WHATSAPP_API_VERSION || 'v22.0'}/${PHONE_NUMBER_ID}/messages`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ messaging_product: 'whatsapp', to: recipient, type: 'interactive', interactive })
        })
        const data = await res.json()
        if (!res.ok) return { success: false, error: data.error?.message || 'Failed to send interactive list' }
        return { success: true }
      }

      case 'flow_starter': {
        const payload = entry.contentPayload as any
        const service = new WhatsAppService()
        await service.sendFlowMessage(recipient, payload.flowId, undefined, payload.message || 'Start Flow')
        return { success: true }
      }

      default:
        return { success: false, error: 'Unsupported message type for sending' }
    }
  } catch (error: any) {
    return { success: false, error: error?.message || String(error) }
  }
}

export default sendLibraryMessage
