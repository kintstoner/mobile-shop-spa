import { useState, type CSSProperties, type PointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Lightbox } from '@/shared/ui/Lightbox/Lightbox'
import { ProductImage } from '@/shared/ui/ProductImage/ProductImage'
import { ZoomIcon } from '@/shared/ui/icons'
import styles from './ProductImageZoom.module.css'

interface Props {
  src: string
  alt: string
}

/**
 * Product photo with a magnifier: with a mouse, the photo zooms in around the pointer; a click, a tap
 * or Enter opens it in a full-screen viewer.
 */
export function ProductImageZoom({ src, alt }: Props) {
  const { t } = useTranslation()
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null)
  const [viewerOpen, setViewerOpen] = useState(false)

  function follow(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    if (box.width === 0 || box.height === 0) return
    setOrigin({
      x: ((event.clientX - box.left) / box.width) * 100,
      y: ((event.clientY - box.top) / box.height) * 100,
    })
  }

  const zoomStyle = origin
    ? ({ '--zoom-x': `${origin.x}%`, '--zoom-y': `${origin.y}%` } as CSSProperties)
    : undefined

  return (
    <>
      <button
        type="button"
        className={`${styles.stage} ${origin ? styles.zooming : ''}`}
        style={zoomStyle}
        aria-label={t('zoom.open', { name: alt })}
        onPointerMove={follow}
        onPointerLeave={() => setOrigin(null)}
        onClick={() => {
          setOrigin(null)
          setViewerOpen(true)
        }}
      >
        <ProductImage src={src} alt={alt} loading="eager" className={styles.image} />
        <span className={styles.hint} aria-hidden="true">
          <ZoomIcon />
        </span>
      </button>
      {viewerOpen && <Lightbox src={src} alt={alt} onClose={() => setViewerOpen(false)} />}
    </>
  )
}
