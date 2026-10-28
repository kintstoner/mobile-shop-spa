import { useState } from 'react'
import styles from './ProductImage.module.css'
import { PhoneIcon } from './icons'

interface Props {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
}

/** Product photo on its white stage; falls back to a device outline if the image fails. */
export function ProductImage({ src, alt, className, loading = 'lazy' }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (failedSrc === src) {
    return (
      <span className={`${styles.fallback} ${className ?? ''}`}>
        <PhoneIcon size={48} strokeWidth={1.4} />
        {alt && <span className="visually-hidden">{alt}</span>}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      className={`${styles.image} ${className ?? ''}`}
      onError={() => setFailedSrc(src)}
    />
  )
}
