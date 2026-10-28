import { createContext } from 'react'

export type ToastTone = 'warning' | 'success' | 'info'

export interface ToastOptions {
  message: string
  tone?: ToastTone
}

export interface ToastApi {
  show(options: ToastOptions): void
}

export const ToastContext = createContext<ToastApi | null>(null)
