import { useEffect, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { useServerStatus } from '@/shared/api/serverStatus'
import { PhoneIcon } from '@/shared/ui/icons'
import styles from './ServerWaking.module.css'
import { useWakingProgress } from './useWakingProgress'
import { wakingScreenRegistry } from './wakingScreenRegistry'

/**
 * Shown instead of the skeleton when there is nothing to display yet and the server is asleep. The
 * rotating phrases are hidden from screen readers (they would repeat every few seconds); the status
 * is announced once.
 */
export function WakingScreen() {
  const { t } = useTranslation()
  const { since } = useServerStatus()
  const { progress, phrase } = useWakingProgress(since)
  const titleId = useId()

  useEffect(() => wakingScreenRegistry.register(), [])

  return (
    <section aria-labelledby={titleId} className={styles.screen}>
      <span className={styles.device} aria-hidden="true">
        <PhoneIcon size={40} strokeWidth={1.6} />
      </span>
      <h2 id={titleId} className={styles.title}>
        {t('waking.title')}
      </h2>
      <p className={styles.phrase} aria-hidden="true" data-testid="waking-phrase">
        {phrase}
      </p>
      <progress
        className={styles.progress}
        max={100}
        value={progress}
        aria-label={t('waking.progress')}
      />
      <output className="visually-hidden">{t('waking.status')}</output>
      <p className={styles.explanation}>{t('waking.explanation')}</p>
    </section>
  )
}
