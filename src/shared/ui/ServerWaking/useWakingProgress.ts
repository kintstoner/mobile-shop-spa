import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const TICK_MS = 500
const PHRASE_MS = 3500
// Estimated progress: quick at first, slowing down, never past 90 % until the server really answers.
const PROGRESS_CAP = 90
const PROGRESS_PACE_MS = 20_000

/** Estimated progress (0–90) and the friendly phrase to show, both derived from the time waited. */
export function useWakingProgress(since: number | null) {
  const { t } = useTranslation()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), TICK_MS)
    return () => clearInterval(timer)
  }, [])

  const waited = Math.max(0, now - (since ?? now))
  const phrases = t('waking.phrases', { returnObjects: true }) as string[]
  return {
    progress: Math.round(PROGRESS_CAP * (1 - Math.exp(-waited / PROGRESS_PACE_MS))),
    phrase: phrases[Math.floor(waited / PHRASE_MS) % phrases.length] ?? '',
  }
}
