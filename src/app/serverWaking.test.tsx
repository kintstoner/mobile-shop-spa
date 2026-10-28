import { act, fireEvent, screen } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { config } from '@/config'
import { SLOW_AFTER_MS } from '@/shared/api/serverStatus'
import products from '@/test/fixtures/products.json'
import { renderApp } from '@/test/renderApp'
import { server } from '@/test/server'

const LIST_URL = `${config.apiBaseUrl}/api/product`

function apiAsleepUntilReleased() {
  let release: (() => void) | undefined
  const answered = new Promise<void>((resolve) => {
    release = resolve
  })
  server.use(
    http.get(LIST_URL, async () => {
      await answered
      return HttpResponse.json(products)
    }),
  )
  return () => release?.()
}

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'],
  })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('sleeping server', () => {
  it('keeps the normal loading state while the API answers within a few seconds', async () => {
    server.use(
      http.get(LIST_URL, async () => {
        await delay('infinite')
        return new Response()
      }),
    )
    renderApp('/')

    await act(() => vi.advanceTimersByTimeAsync(SLOW_AFTER_MS - 100))

    expect(screen.getByRole('status', { name: 'Cargando productos' })).toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('replaces the skeleton with a waiting screen when there is nothing to show yet', async () => {
    apiAsleepUntilReleased()
    renderApp('/')

    await act(() => vi.advanceTimersByTimeAsync(SLOW_AFTER_MS))

    expect(screen.getByRole('heading', { name: 'Despertando al servidor…' })).toBeVisible()
    expect(screen.getByRole('progressbar', { name: 'Progreso estimado' })).toBeInTheDocument()
    expect(screen.getByText(/se duerme cuando nadie lo visita/)).toBeVisible()
  })

  it('moves the estimated progress forward and rotates the friendly messages', async () => {
    apiAsleepUntilReleased()
    renderApp('/')
    await act(() => vi.advanceTimersByTimeAsync(SLOW_AFTER_MS))
    const progress = screen.getByRole('progressbar')
    const firstValue = Number(progress.getAttribute('value'))
    const firstPhrase = screen.getByTestId('waking-phrase').textContent

    await act(() => vi.advanceTimersByTimeAsync(10_000))

    expect(Number(progress.getAttribute('value'))).toBeGreaterThan(firstValue)
    expect(Number(progress.getAttribute('value'))).toBeLessThan(90)
    expect(screen.getByTestId('waking-phrase').textContent).not.toBe(firstPhrase)
  })

  it('shows the products as soon as the server answers', async () => {
    const release = apiAsleepUntilReleased()
    renderApp('/')
    await act(() => vi.advanceTimersByTimeAsync(SLOW_AFTER_MS))

    release()
    await act(() => vi.advanceTimersByTimeAsync(0))

    expect(screen.getByText('100 productos')).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Despertando al servidor…' }),
    ).not.toBeInTheDocument()
  })

  it('keeps a cached list usable and shows a small notice while the photos wait for the server', async () => {
    localStorage.setItem(
      'test:products',
      JSON.stringify({ value: products, expiresAt: Date.now() + 60_000 }),
    )
    renderApp('/')
    expect(screen.getByText('100 productos')).toBeInTheDocument()

    // jsdom never loads images, like a server that has not woken up yet.
    await act(() => vi.advanceTimersByTimeAsync(SLOW_AFTER_MS))

    expect(screen.getByRole('complementary', { name: 'Servidor despertando' })).toBeVisible()
    expect(
      screen.queryByRole('heading', { name: 'Despertando al servidor…' }),
    ).not.toBeInTheDocument()

    for (const image of document.querySelectorAll('main img')) fireEvent.load(image)

    expect(
      screen.queryByRole('complementary', { name: 'Servidor despertando' }),
    ).not.toBeInTheDocument()
  })
})
