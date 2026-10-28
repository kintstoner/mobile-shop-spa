import { useEffect, useState, type RefObject } from 'react'

/**
 * Whether the element is inside the viewport. Without IntersectionObserver (old browsers, jsdom)
 * the element counts as visible, so nothing depending on it appears by mistake.
 */
export function useInView(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? true))
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return inView
}
