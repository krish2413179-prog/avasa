const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export class BackendApi {
  static async submitOrder(permissionContext: any) {
    const response = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(permissionContext)
    })

    if (!response.ok) {
      throw new Error('Failed to submit order')
    }

    return response.json()
  }

  static async getOrderStatus(orderId: string) {
    const response = await fetch(`${API_BASE}/api/orders/${orderId}`)
    
    if (!response.ok) {
      throw new Error('Failed to get order status')
    }

    return response.json()
  }

  static async executeAction(action: any, permissionContext: any) {
    const response = await fetch(`${API_BASE}/api/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        permissionContext
      })
    })

    if (!response.ok) {
      throw new Error('Failed to execute action')
    }

    return response.json()
  }
}