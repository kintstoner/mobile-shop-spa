import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useMatches, type Params } from 'react-router'
import styles from './Breadcrumbs.module.css'

/** Route `handle` contract: a route that adds a crumb after the home link. */
export interface CrumbHandle {
  crumb: (params: Params) => ReactNode
}

function isCrumbHandle(handle: unknown): handle is CrumbHandle {
  return typeof handle === 'object' && handle !== null && 'crumb' in handle
}

export function Breadcrumbs({ className }: { className?: string }) {
  const { t } = useTranslation()
  const matches = useMatches()
  const crumbs = matches.flatMap((match) =>
    isCrumbHandle(match.handle) ? [{ id: match.id, node: match.handle.crumb(match.params) }] : [],
  )
  const onHome = crumbs.length === 0

  return (
    <nav aria-label={t('breadcrumbs.label')} className={`${styles.nav} ${className ?? ''}`}>
      <ol className={styles.list}>
        <li className={styles.item}>
          <Link
            to="/"
            className={onHome ? styles.current : styles.link}
            aria-current={onHome ? 'page' : undefined}
          >
            {t('breadcrumbs.home')}
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.id} className={styles.item}>
            <span aria-hidden="true" className={styles.separator}>
              /
            </span>
            <span aria-current="page" className={styles.current}>
              {crumb.node}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  )
}
