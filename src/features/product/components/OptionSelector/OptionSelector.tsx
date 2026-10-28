import { useTranslation } from 'react-i18next'
import type { ProductOption } from '@/shared/domain/types'
import { CheckIcon } from '@/shared/ui/icons'
import styles from './OptionSelector.module.css'

interface Props {
  name: string
  legend: string
  options: ProductOption[]
  selected: number | null
  onSelect: (code: number) => void
  swatch?: (option: ProductOption) => string | null
}

/** Native radio group drawn as chips: arrow keys, focus and group semantics come for free. */
export function OptionSelector({ name, legend, options, selected, onSelect, swatch }: Props) {
  const { t } = useTranslation()
  const single = options.length === 1
  const label = (option: ProductOption) => option.name ?? t('actions.unspecified')
  const selectedOption = options.find((option) => option.code === selected)

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>
        {legend}
        {selectedOption && <span className={styles.current}>{label(selectedOption)}</span>}
      </legend>
      <div className={styles.options}>
        {options.map((option) => {
          const checked = option.code === selected
          const colour = swatch?.(option)
          return (
            <label
              key={option.code}
              className={`${styles.chip} ${checked ? styles.checked : ''} ${single ? styles.locked : ''}`}
            >
              <input
                type="radio"
                name={name}
                value={option.code}
                checked={checked}
                onChange={() => onSelect(option.code)}
                className={styles.input}
              />
              {swatch && (
                <span
                  aria-hidden="true"
                  className={`${styles.swatch} ${colour ? '' : styles.noSwatch}`}
                  style={colour ? { background: colour } : undefined}
                />
              )}
              {!swatch && checked && <CheckIcon />}
              {label(option)}
            </label>
          )
        })}
        {single && <span className={styles.note}>{t('actions.onlyOption')}</span>}
      </div>
    </fieldset>
  )
}
