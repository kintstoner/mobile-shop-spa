import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CART_STORAGE_KEY } from '../features/cart/cartStorage'
import { renderApp } from '../test/renderApp'

const JADE_2 = '/product/pMZMhe_ZaAPZoaCCtlDrg'

const breadcrumbs = () => screen.getByRole('navigation', { name: 'Migas de pan' })
const cartStatus = () => screen.getByText(/Artículos en la cesta/).parentElement!

describe('Header', () => {
  it('links the logo to the product list', async () => {
    renderApp(JADE_2)

    expect(screen.getByRole('link', { name: 'mobileshop, ir al listado' })).toHaveAttribute(
      'href',
      '/',
    )
  })

  it('marks the list as the current page in the breadcrumbs', async () => {
    renderApp('/')

    const home = within(breadcrumbs()).getByRole('link', { name: 'Inicio' })
    expect(home).toHaveAttribute('aria-current', 'page')
  })

  it('shows the product in the breadcrumbs with a link back to the list', async () => {
    renderApp(JADE_2)

    const nav = breadcrumbs()
    expect(await within(nav).findByText('Acer Liquid Jade 2')).toHaveAttribute(
      'aria-current',
      'page',
    )
    const home = within(nav).getByRole('link', { name: 'Inicio' })
    expect(home).toHaveAttribute('href', '/')
    expect(home).not.toHaveAttribute('aria-current')
  })

  it('shows an empty cart as zero', () => {
    renderApp('/')

    expect(cartStatus()).toHaveTextContent('Artículos en la cesta: 0')
  })

  it('shows the persisted count on every view', async () => {
    localStorage.setItem(CART_STORAGE_KEY, '3')
    renderApp(JADE_2)

    expect(cartStatus()).toHaveTextContent('Artículos en la cesta: 3')
  })

  it('updates the count after adding a product and keeps it on the list', async () => {
    const { user } = renderApp(JADE_2)

    await user.click(await screen.findByRole('button', { name: 'Añadir a la cesta' }))
    await screen.findByRole('button', { name: 'Añadido a la cesta' })
    expect(cartStatus()).toHaveTextContent('Artículos en la cesta: 1')

    await user.click(screen.getByRole('link', { name: 'Volver al listado' }))

    expect(await screen.findByRole('heading', { name: 'Móviles y tablets' })).toBeVisible()
    expect(cartStatus()).toHaveTextContent('Artículos en la cesta: 1')
  })
})
