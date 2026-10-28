import { screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'
import { config } from '../../config'
import { renderApp } from '../../test/renderApp'
import products from '../../test/fixtures/products.json'
import { server } from '../../test/server'

const LIST_URL = `${config.apiBaseUrl}/api/product`

function cacheOneProductExpired() {
  localStorage.setItem(
    'test:products',
    JSON.stringify({ value: [products[0]], expiresAt: Date.now() - 1 }),
  )
}

describe('ProductListPage', () => {
  it('shows a loading state while the products load', () => {
    renderApp('/')

    expect(screen.getByRole('status', { name: 'Cargando productos' })).toBeInTheDocument()
  })

  it('lists every product returned by the API', async () => {
    renderApp('/')

    const list = await screen.findByRole('list', { name: 'Productos' })

    expect(within(list).getAllByRole('listitem')).toHaveLength(100)
    expect(screen.getByText('100 productos')).toBeInTheDocument()
  })

  it('shows image, brand, model and price on each card', async () => {
    renderApp('/')

    const card = await screen.findByRole('link', { name: /Iconia Talk S/ })

    // The photo is decorative inside the card: the link text already names the product.
    expect(card.querySelector('img')).toHaveAttribute(
      'src',
      'https://itx-frontend-test.onrender.com/images/ZmGrkLRPXOTpxsU4jjAcv.jpg',
    )
    expect(card).toHaveAccessibleName('Acer Iconia Talk S 170 €')
    expect(within(card).getByText('Acer')).toBeInTheDocument()
    expect(within(card).getByText('170 €')).toBeInTheDocument()
  })

  it('says the price is not available when the API sends an empty price', async () => {
    renderApp('/')

    const card = await screen.findByRole('link', { name: /Liquid Jade 2/ })

    expect(within(card).getByText('Precio no disponible')).toBeInTheDocument()
    expect(within(card).queryByText(/€/)).not.toBeInTheDocument()
  })

  it('links each card to its product detail page', async () => {
    renderApp('/')

    const card = await screen.findByRole('link', { name: /Iconia Talk S/ })

    expect(card).toHaveAttribute('href', '/product/ZmGrkLRPXOTpxsU4jjAcv')
  })

  it('shows an error with a retry when the list cannot be loaded', async () => {
    server.use(http.get(LIST_URL, () => new HttpResponse(null, { status: 500 }), { once: true }))
    const { user } = renderApp('/')

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('No hemos podido cargar los productos')

    await user.click(within(alert).getByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByText('100 productos')).toBeInTheDocument()
  })

  describe('with an expired cache (stale-while-revalidate)', () => {
    it('shows the cached list at once and replaces it when the API answers', async () => {
      cacheOneProductExpired()
      renderApp('/')

      expect(screen.getByText('1 producto')).toBeInTheDocument()
      expect(screen.queryByRole('status', { name: 'Cargando productos' })).not.toBeInTheDocument()

      expect(await screen.findByText('100 productos')).toBeInTheDocument()
    })

    it('keeps showing the cached list if the revalidation fails', async () => {
      cacheOneProductExpired()
      let answered = false
      server.use(
        http.get(LIST_URL, () => {
          answered = true
          return new HttpResponse(null, { status: 500 })
        }),
      )
      renderApp('/')

      await vi.waitFor(() => expect(answered).toBe(true))

      expect(screen.getByText('1 producto')).toBeInTheDocument()
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })
})
