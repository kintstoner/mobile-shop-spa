import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './SlowLoadNotice.module.css'

// The API runs on a free host that sleeps when idle; its first answer can take close to a minute.
const SLOW_AFTER_MS = 5000

export function SlowLoadNotice() {
  const { t } = useTranslation()
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), SLOW_AFTER_MS)
    return () => clearTimeout(timer)
  }, [])

  return (
    <p className={styles.notice} aria-live="polite">
      {slow && t('slowLoad')}
    </p>
  )
}
