const WS_BASE = import.meta.env.VITE_WS_URL || 'ws://localhost:8787'

export interface CollabUser {
  id: string
  name: string
  cursor?: { x: number; y: number }
}

export class CollaborationClient {
  private ws: WebSocket | null = null
  private projectId: string | null = null
  private userId: string
  private onUsersChange?: (users: CollabUser[]) => void
  private onOperation?: (operation: unknown) => void
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  constructor(userId: string) {
    this.userId = userId
  }

  connect(projectId: string) {
    this.projectId = projectId
    const url = `${WS_BASE}/collab/${projectId}?userId=${this.userId}`

    this.ws = new WebSocket(url)

    this.ws.onopen = () => {
      console.log('Connected to collaboration room')
      this.reconnectAttempts = 0
    }

    this.ws.onmessage = event => {
      try {
        const message = JSON.parse(event.data)
        this.handleMessage(message)
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    this.ws.onerror = error => {
      console.error('WebSocket error:', error)
    }

    this.ws.onclose = () => {
      console.log('Disconnected from collaboration room')
      this.attemptReconnect()
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  sendOperation(operation: unknown) {
    this.send({
      type: 'operation',
      data: operation,
    })
  }

  sendCursor(position: { x: number; y: number }) {
    this.send({
      type: 'cursor',
      data: position,
    })
  }

  onUsersUpdate(callback: (users: CollabUser[]) => void) {
    this.onUsersChange = callback
  }

  onOperationReceived(callback: (operation: unknown) => void) {
    this.onOperation = callback
  }

  private handleMessage(message: { type: string; data: any }) {
    switch (message.type) {
      case 'join':
        if (this.onUsersChange && message.data.users) {
          this.onUsersChange(message.data.users)
        }
        break

      case 'leave':
        // User left, update users list
        break

      case 'operation':
        if (this.onOperation) {
          this.onOperation(message.data)
        }
        break

      case 'cursor':
        // Update cursor position for user
        break
    }
  }

  private send(message: unknown) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.projectId) {
      this.reconnectAttempts++
      console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      setTimeout(() => this.connect(this.projectId!), 1000 * this.reconnectAttempts)
    }
  }
}
