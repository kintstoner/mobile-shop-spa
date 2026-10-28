import { useTranslation } from 'react-i18next'
import { useServerStatus } from '@/shared/api/serverStatus'
import { SpinnerIcon } from '@/shared/ui/icons'
import styles from './ServerWaking.module.css'
import { useWakingProgress } from './useWakingProgress'
import { useWakingScreenShown } from './wakingScreenRegistry'

/** Small floating notice while the server wakes up but the page already has data to show. */
export function ServerWakingNotice() {
  const { waking } = useServerStatus()
  const screenShown = useWakingScreenShown()
  if (!waking || screenShown) return null
  return <Notice />
}

function Notice() {
  const { t } = useTranslation()
  const { since } = useServerStatus()
  const { progress, phrase } = useWakingProgress(since)

  return (
    <aside aria-label={t('waking.noticeLabel')} className={styles.notice}>
      <SpinnerIcon className={styles.spinner} />
      <span className={styles.noticeBody}>
        <strong className={styles.noticeTitle}>{t('waking.noticeTitle')}</strong>
        <span className={styles.noticePhrase} aria-hidden="true">
          {phrase}
        </span>
        <progress
          className={styles.progress}
          max={100}
          value={progress}
          aria-label={t('waking.progress')}
        />
      </span>
    </aside>
  )
}
