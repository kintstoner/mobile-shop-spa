import styles from './Skeleton.module.css'

export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden="true" className={`${styles.skeleton} ${className ?? ''}`} />
}
