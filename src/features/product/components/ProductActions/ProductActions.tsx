import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BagIcon, CheckIcon, SpinnerIcon } from '@/shared/ui/icons'
import { colorSwatch } from '@/shared/domain/colorSwatch'
import type { ProductDetail, ProductOption } from '@/shared/domain/types'
import { useCart } from '@/features/cart'
import { useFormatPrice } from '@/shared/i18n/useFormatPrice'
import { useInView } from '@/shared/ui/useInView'
import { OptionSelector } from '@/features/product/components/OptionSelector/OptionSelector'
import styles from './ProductActions.module.css'

type Status = 'idle' | 'adding' | 'added' | 'failed'

const FEEDBACK_MS = 2000

const onlyOption = (options: ProductOption[]) => (options.length === 1 ? options[0]!.code : null)

export function ProductActions({ product }: { product: ProductDetail }) {
  const { t } = useTranslation()
  const cart = useCart()
  const formatPrice = useFormatPrice()
  const sectionRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const ctaInView = useInView(ctaRef)
  const [storage, setStorage] = useState(() => onlyOption(product.storages))
  const [color, setColor] = useState(() => onlyOption(product.colors))
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    if (status !== 'added') return
    const timer = setTimeout(() => setStatus('idle'), FEEDBACK_MS)
    return () => clearTimeout(timer)
  }, [status])

  const optionLabel = (options: ProductOption[], code: number | null) => {
    const option = options.find((candidate) => candidate.code === code)
    return option ? (option.name ?? t('actions.unspecified')) : ''
  }
  const storageName = optionLabel(product.storages, storage)
  const colorName = optionLabel(product.colors, color)
  const ready = storage !== null && color !== null

  const select = (setter: (code: number) => void) => (code: number) => {
    setter(code)
    if (status !== 'adding') setStatus('idle')
  }

  async function add() {
    if (!ready || status === 'adding') return
    setStatus('adding')
    try {
      await cart.add({ id: product.id, colorCode: color, storageCode: storage })
      setStatus('added')
    } catch {
      setStatus('failed')
    }
  }

  const missing =
    storage === null && color === null ? 'both' : storage === null ? 'storage' : 'color'
  const helper = !ready
    ? t(`actions.choose.${missing}`)
    : status === 'added'
      ? t('actions.addedMessage', {
          model: product.model,
          storage: storageName,
          color: colorName,
          count: cart.count,
        })
      : status === 'failed'
        ? t('actions.failed')
        : t('actions.willAdd', { storage: storageName, color: colorName })

  const visual = !ready ? 'disabled' : status
  const ctaLabel =
    status === 'adding'
      ? t('actions.adding')
      : status === 'added'
        ? t('actions.added')
        : t('actions.add')
  const ctaIcon =
    status === 'adding' ? (
      <SpinnerIcon className={styles.spin} />
    ) : status === 'added' ? (
      <CheckIcon size={20} />
    ) : (
      <BagIcon size={20} strokeWidth={2} />
    )

  // From the sticky bar: add if everything is chosen, otherwise take the user to the missing option.
  function addFromBar() {
    if (ready) {
      void add()
      return
    }
    const group = storage === null ? 'storage' : 'color'
    const firstOption = sectionRef.current?.querySelector<HTMLInputElement>(
      `input[name="${group}"]`,
    )
    firstOption?.scrollIntoView?.({ block: 'center', behavior: 'smooth' })
    firstOption?.focus({ preventScroll: true })
  }

  return (
    <section ref={sectionRef} aria-labelledby="product-actions" className={styles.actions}>
      <h2 id="product-actions" className="visually-hidden">
        {t('actions.title')}
      </h2>

      <OptionSelector
        name="storage"
        legend={t('actions.storage')}
        options={product.storages}
        selected={storage}
        onSelect={select(setStorage)}
      />
      <OptionSelector
        name="color"
        legend={t('actions.color')}
        options={product.colors}
        selected={color}
        onSelect={select(setColor)}
        swatch={(option) => colorSwatch(option.name ?? '')}
      />

      <div className={styles.footer}>
        <button
          ref={ctaRef}
          type="button"
          className={`${styles.cta} ${styles[visual]}`}
          aria-disabled={!ready}
          aria-busy={status === 'adding'}
          onClick={add}
        >
          {ctaIcon}
          {ctaLabel}
        </button>
        <p
          aria-live="polite"
          className={`${styles.helper} ${status === 'added' ? styles.success : ''} ${status === 'failed' ? styles.error : ''}`}
        >
          {helper}
        </p>
      </div>

      {/* Small screens: while the main button is off screen, a bar at the bottom keeps it at hand. */}
      {!ctaInView && (
        <section aria-label={t('actions.quickBuy')} className={styles.stickyBar}>
          <span className={styles.stickyPrice}>
            {product.price === null ? t('product.noPrice') : formatPrice(product.price)}
          </span>
          <button
            type="button"
            className={`${styles.cta} ${styles.stickyCta} ${styles[ready ? status : 'idle']}`}
            aria-busy={status === 'adding'}
            onClick={addFromBar}
          >
            {ready ? ctaIcon : null}
            {ready ? ctaLabel : t('actions.chooseOptions')}
          </button>
        </section>
      )}
    </section>
  )
}
