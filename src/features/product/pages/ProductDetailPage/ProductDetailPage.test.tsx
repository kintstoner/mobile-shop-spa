import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/renderApp'

const Z6_PLUS = '/product/cGjFJlmqNPIwU59AOcY8H'
const JADE_2 = '/product/pMZMhe_ZaAPZoaCCtlDrg'

function specValue(label: string) {
  const term = screen.getByText(label, { selector: 'dt' })
  return term.nextElementSibling?.textContent
}

describe('ProductDetailPage', () => {
  it('shows a loading state while the product loads', () => {
    renderApp(Z6_PLUS)

    expect(screen.getByRole('status', { name: 'Cargando producto' })).toBeInTheDocument()
  })

  it('shows brand, model, price and the product image', async () => {
    renderApp(Z6_PLUS)

    expect(await screen.findByRole('heading', { level: 1, name: 'Liquid Z6 Plus' })).toBeVisible()
    expect(screen.getByText('Acer', { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByText('250 €')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Acer Liquid Z6 Plus' })).toHaveAttribute(
      'src',
      'https://itx-frontend-test.onrender.com/images/cGjFJlmqNPIwU59AOcY8H.jpg',
    )
  })

  it('lists the normalized specifications', async () => {
    renderApp(Z6_PLUS)
    await screen.findByRole('heading', { level: 1 })

    expect(specValue('CPU')).toBe('Octa-core 1.3 GHz Cortex-A53')
    expect(specValue('RAM')).toBe('3 GB RAM')
    expect(specValue('Sistema operativo')).toBe('Android 6.0 (Marshmallow)')
    expect(specValue('Resolución de pantalla')).toBe('1080 x 1920 pixels (~401 ppi pixel density)')
    expect(specValue('Batería')).toBe('Removable Li-Po 4080 mAh battery')
    expect(specValue('Cámaras')).toBe('Principal: 13 MP, autofocus, LED flash\nFrontal: 5 MP')
    expect(specValue('Dimensiones')).toBe('153.8 x 75.6 x 8.5 mm (6.06 x 2.98 x 0.33 in)')
    expect(specValue('Peso')).toBe('169 g')
  })

  it('says when the price or a spec is missing', async () => {
    renderApp(JADE_2)
    await screen.findByRole('heading', { level: 1, name: 'Liquid Jade 2' })

    expect(screen.getByText('Precio no disponible')).toBeInTheDocument()
    expect(specValue('Batería')).toBe('No disponible')
    expect(specValue('Peso')).toBe('No disponible')
  })

  it('names the page after the product', async () => {
    renderApp(Z6_PLUS)
    await screen.findByRole('heading', { level: 1 })

    expect(document.title).toBe('Acer Liquid Z6 Plus · mobileshop')
  })

  it('shows an error with a retry and a way back when the product cannot be loaded', async () => {
    // The real API answers 500 (not 404) for an unknown id.
    renderApp('/product/does-not-exist')

    const alert = await screen.findByRole('alert')

    expect(within(alert).getByRole('heading', { level: 1 })).toHaveTextContent(
      'No hemos podido cargar este producto',
    )
    expect(within(alert).getByRole('button', { name: 'Reintentar' })).toBeInTheDocument()
    expect(within(alert).getByRole('link', { name: 'Ver todos los productos' })).toHaveAttribute(
      'href',
      '/',
    )
  })

  it('navigates from a card to the detail and back to the same search', async () => {
    const { user, router } = renderApp('/?q=z6 plus')

    await user.click(await screen.findByRole('link', { name: /Liquid Z6 Plus/ }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Liquid Z6 Plus' })).toBeVisible()

    await user.click(screen.getByRole('link', { name: 'Volver al listado' }))

    expect(router.state.location.pathname).toBe('/')
    expect(new URLSearchParams(router.state.location.search).get('q')).toBe('z6 plus')
    expect(await screen.findByText('1 resultado de 100 productos')).toBeInTheDocument()
  })
})
