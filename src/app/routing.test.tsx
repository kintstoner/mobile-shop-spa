import { act, screen } from '@testing-library/react'
import { delay, http } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { config } from '../config'
import { renderApp } from '../test/renderApp'
import { server } from '../test/server'

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

  it('explains a slow first load (the API sleeps when idle and takes up to a minute to wake up)', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    server.use(
      http.get(`${config.apiBaseUrl}/api/product`, async () => {
        await delay('infinite')
        return new Response()
      }),
    )
    renderApp('/')
    expect(screen.queryByText(/está arrancando/)).not.toBeInTheDocument()

    await act(() => vi.advanceTimersByTimeAsync(5000))

    expect(
      screen.getByText(
        'El servidor está arrancando. La primera carga puede tardar hasta un minuto.',
      ),
    ).toBeVisible()
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
