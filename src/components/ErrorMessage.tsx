import type { ReactNode } from 'react'
import styles from './ErrorMessage.module.css'
import { AlertIcon } from './icons'

interface Props {
  title: string
  children?: ReactNode
  onRetry?: () => void
  actions?: ReactNode
  /** 1 when the error replaces the whole page content, 2 when the page already has its h1. */
  headingLevel?: 1 | 2
}

export function ErrorMessage({ title, children, onRetry, actions, headingLevel = 2 }: Props) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2'
  return (
    <section role="alert" className={styles.box}>
      <span className={styles.icon}>
        <AlertIcon />
      </span>
      <Heading className={styles.title}>{title}</Heading>
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
