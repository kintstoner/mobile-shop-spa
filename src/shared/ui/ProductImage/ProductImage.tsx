import { useEffect, useRef, useState } from 'react'
import { serverStatus } from '@/shared/api/serverStatus'
import { PhoneIcon } from '@/shared/ui/icons'
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton'
import { useInView } from '@/shared/ui/useInView'
import styles from './ProductImage.module.css'

interface Props {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
}

type State = 'loading' | 'loaded' | 'failed'

/**
 * Product photo on its white stage. A shimmering placeholder stands in until the photo arrives (the
 * API host can take a minute to wake up), and a device outline replaces it if it fails. While it is
 * on screen and still loading, the server status tracks it, so a sleeping server can be explained.
 */
export function ProductImage({ src, alt, className, loading = 'lazy' }: Props) {
  const [result, setResult] = useState<{ src: string; state: State } | null>(null)
  const state: State = result?.src === src ? result.state : 'loading'
  const frameRef = useRef<HTMLSpanElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const inView = useInView(frameRef)

  // A photo already in the browser cache may be complete before React listens for "load".
  useEffect(() => {
    const image = imageRef.current
    if (image?.complete && image.naturalWidth > 0) setResult({ src, state: 'loaded' })
  }, [src])

  // Lazy photos off screen are not requested yet, so only visible ones count as waiting.
  useEffect(() => {
    if (state !== 'loading' || !inView) return
    return serverStatus.begin()
  }, [state, inView])

  return (
    <span ref={frameRef} data-state={state} className={`${styles.frame} ${className ?? ''}`}>
      {state === 'failed' ? (
        <span className={styles.fallback}>
          <PhoneIcon size={48} strokeWidth={1.4} />
          {alt && <span className="visually-hidden">{alt}</span>}
        </span>
      ) : (
        <>
          {state === 'loading' && <Skeleton className={styles.placeholder} />}
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            loading={loading}
            decoding="async"
            className={styles.image}
            onLoad={() => setResult({ src, state: 'loaded' })}
            onError={() => setResult({ src, state: 'failed' })}
          />
        </>
      )}
    </span>
  )
}
