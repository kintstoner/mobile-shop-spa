import type { ReactNode } from 'react'
import styles from './ErrorMessage.module.css'
import { AlertIcon } from './icons'

interface Props {
  title: string
  children?: ReactNode
  onRetry?: () => void
  actions?: ReactNode
}

export function ErrorMessage({ title, children, onRetry, actions }: Props) {
  return (
    <section role="alert" className={styles.box}>
      <span className={styles.icon}>
        <AlertIcon />
      </span>
      <h2 className={styles.title}>{title}</h2>
      {children && <p className={styles.text}>{children}</p>}
      <div className={styles.actions}>
        {onRetry && (
          <button type="button" className={styles.retry} onClick={onRetry}>
            Reintentar
          </button>
        )}
        {actions}
      </div>
    </section>
  )
}
