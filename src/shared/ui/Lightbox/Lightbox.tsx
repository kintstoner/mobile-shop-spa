import { useEffect, useEffectEvent, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { CloseIcon } from '@/shared/ui/icons'
import styles from './Lightbox.module.css'

interface Props {
  src: string
  alt: string
  onClose: () => void
}

/**
 * Full-screen image viewer on a native <dialog>: modal, focus kept inside, Escape closes it.
 * Where showModal is missing (old browsers, jsdom) it falls back to the open attribute. Focus goes
 * back to whatever opened it. The close button is the accessible way out; Escape and a click on
 * the dark area around the picture are the usual dialog shortcuts.
 */
export function Lightbox({ src, alt, onClose }: Props) {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const close = useEffectEvent(onClose)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const opener = document.activeElement as HTMLElement | null

    const onCancel = (event: Event) => {
      event.preventDefault()
      close()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    const onBackdropClick = (event: MouseEvent) => {
      if (event.target === dialog) close()
    }
    dialog.addEventListener('cancel', onCancel)
    dialog.addEventListener('keydown', onKeyDown)
    dialog.addEventListener('click', onBackdropClick)

    if (typeof dialog.showModal === 'function') dialog.showModal()
    else dialog.setAttribute('open', '')
    dialog.querySelector<HTMLButtonElement>('button')?.focus()

    return () => {
      dialog.removeEventListener('cancel', onCancel)
      dialog.removeEventListener('keydown', onKeyDown)
      dialog.removeEventListener('click', onBackdropClick)
      opener?.focus()
    }
  }, [])

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId} className={styles.dialog}>
      <h2 id={titleId} className="visually-hidden">
        {alt}
      </h2>
      <button type="button" className={styles.close} aria-label={t('zoom.close')} onClick={onClose}>
        <CloseIcon size={22} />
      </button>
      <img src={src} alt={alt} className={styles.image} />
    </dialog>
  )
}
