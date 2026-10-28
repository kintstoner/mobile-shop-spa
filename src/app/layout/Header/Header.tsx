import { Link } from 'react-router'
import { Breadcrumbs } from '@/app/layout/Breadcrumbs/Breadcrumbs'
import { CartBadge } from '@/features/cart'
import styles from './Header.module.css'
import { PhoneIcon } from '@/shared/ui/icons'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="mobileshop, ir al listado">
          <span className={styles.logoMark}>
            <PhoneIcon />
          </span>
          <span className={styles.logoText}>mobileshop</span>
        </Link>
        <span aria-hidden="true" className={styles.divider} />
        <Breadcrumbs className={styles.breadcrumbs} />
        <CartBadge className={styles.cart} />
      </div>
    </header>
  )
}
