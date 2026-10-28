import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/test/renderApp'

// Make the list page throw while rendering, as an unexpected bug would.
vi.mock('@/features/catalog/hooks/useProducts', () => ({
  useProducts: () => {
    throw new Error('boom')
  },
}))

describe('route error boundary', () => {
  it('keeps the header and offers a reload when a page crashes while rendering', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    renderApp('/')

    expect(screen.getByRole('heading', { name: 'Algo ha fallado' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Recargar la página' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'mobileshop, ir al listado' })).toBeVisible()
  })
})
