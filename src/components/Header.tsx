import { Link } from 'react-router'
import styles from './Header.module.css'
import { PhoneIcon } from './icons'

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
      </div>
    </header>
  )
}
