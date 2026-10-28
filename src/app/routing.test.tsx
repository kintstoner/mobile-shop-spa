import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/test/renderApp'

afterEach(() => {
  vi.useRealTimers()
})

describe('routing and app-level states', () => {
  it('shows a not-found page with a way back for unknown URLs', async () => {
    renderApp('/does/not/exist')

    expect(screen.getByRole('heading', { name: 'Página no encontrada' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Ver todos los productos' })).toHaveAttribute(
      'href',
      '/',
    )
    expect(screen.getByRole('link', { name: 'mobileshop, ir al listado' })).toBeVisible()
  })

  it('offers a skip link to the main content', () => {
    renderApp('/')

    expect(screen.getByRole('link', { name: 'Saltar al contenido' })).toHaveAttribute(
      'href',
      '#main',
    )
    expect(document.getElementById('main')).toBe(screen.getByRole('main'))
  })
})
