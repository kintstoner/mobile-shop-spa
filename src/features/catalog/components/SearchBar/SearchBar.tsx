import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { CloseIcon, SearchIcon } from '@/shared/ui/icons'
import styles from './SearchBar.module.css'

interface Props {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: Props) {
  const { t } = useTranslation()
  const input = useRef<HTMLInputElement>(null)

  return (
    <search className={styles.search}>
      <label htmlFor="product-search" className="visually-hidden">
        {t('catalog.search.label')}
      </label>
      <SearchIcon className={styles.icon} />
      <input
        ref={input}
        id="product-search"
        type="search"
        className={styles.input}
        placeholder={t('catalog.search.placeholder')}
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button
          type="button"
          className={styles.clear}
          aria-label={t('catalog.search.clear')}
          onClick={() => {
            onChange('')
            input.current?.focus()
          }}
        >
          <CloseIcon />
        </button>
      )}
    </search>
  )
}
