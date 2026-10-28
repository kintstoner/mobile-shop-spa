import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { CloseIcon } from '@/shared/ui/icons'
import { ToastContext, type ToastOptions, type ToastTone } from './ToastContext'
import styles from './Toast.module.css'

const DISMISS_AFTER_MS = 4000

interface Toast {
  id: number
  message: string
  tone: ToastTone
}

let nextId = 0

/**
 * Toasts in a polite live region (<output>, role status) at the bottom right. Each closes on its own after a few seconds or
 * from its close button; the same message is not stacked twice.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const show = useCallback(({ message, tone = 'info' }: ToastOptions) => {
    setToasts((current) =>
      current.some((toast) => toast.message === message)
        ? current
        : [...current, { id: (nextId += 1), message, tone }],
    )
  }, [])

  const api = useMemo(() => ({ show }), [show])

  return (
    <ToastContext value={api}>
      {children}
      <output className={styles.region}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </output>
    </ToastContext>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const { t } = useTranslation()

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), DISMISS_AFTER_MS)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <span className={`${styles.toast} ${styles[toast.tone]}`}>
      <span className={styles.message}>{toast.message}</span>
      <button
        type="button"
        className={styles.close}
        aria-label={t('toast.close')}
        onClick={() => onDismiss(toast.id)}
      >
        <CloseIcon size={16} />
      </button>
    </span>
  )
}
