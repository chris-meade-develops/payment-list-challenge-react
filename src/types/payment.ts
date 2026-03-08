export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded'

export interface Payment {
  id: string
  customerName: string
  amount: number
  customerAddress: string
  currency: string
  date: string
  description: string
  status: PaymentStatus
}

export interface PaymentSearchResponse {
  page: number
  pageSize: number
  payments: Payment[]
  total: number
}
