import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Breadcrumbs } from '@/app/layout/Breadcrumbs/Breadcrumbs'
import { LanguageSelect } from '@/app/layout/LanguageSelect/LanguageSelect'
import { CartBadge } from '@/features/cart'
import styles from './Header.module.css'
import { PhoneIcon } from '@/shared/ui/icons'

export function Header() {
  const { t } = useTranslation()
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label={t('app.homeLink')}>
          <span className={styles.logoMark}>
            <PhoneIcon />
          </span>
          <span className={styles.logoText}>mobileshop</span>
        </Link>
        <span aria-hidden="true" className={styles.divider} />
        <Breadcrumbs className={styles.breadcrumbs} />
        <div className={styles.tools}>
          <LanguageSelect />
          <CartBadge />
        </div>
      </div>
    </header>
  )
}
