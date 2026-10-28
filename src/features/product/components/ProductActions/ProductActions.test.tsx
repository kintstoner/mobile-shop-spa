import { screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'
import { config } from '@/config'
import { CART_STORAGE_KEY } from '@/features/cart'
import { renderApp } from '@/test/renderApp'
import { server } from '@/test/server'

const Z6_PLUS = 'cGjFJlmqNPIwU59AOcY8H' // 2 colours, 1 storage
const JADE_2 = 'pMZMhe_ZaAPZoaCCtlDrg' // 1 colour, 1 storage
const TAB_A700 = 'g18mWn2tnbOq2HJx98pTb' // 2 colours, 3 storages
const CART_URL = `${config.apiBaseUrl}/api/cart`

async function openProduct(id: string) {
  const view = renderApp(`/product/${id}`)
  await screen.findByRole('heading', { level: 1 })
  return view
}

function recordCartRequests() {
  const bodies: unknown[] = []
  server.use(
    http.post(CART_URL, async ({ request }) => {
      bodies.push(await request.json())
      return HttpResponse.json({ count: 1 })
    }),
  )
  return bodies
}

const addButton = () => screen.getByRole('button', { name: /^Añad/ })
const group = (name: string) => screen.getByRole('group', { name: new RegExp(`^${name}`) })

describe('ProductActions', () => {
  it('shows both selectors and preselects an option when it is the only one', async () => {
    await openProduct(Z6_PLUS)

    expect(within(group('Almacenamiento')).getByRole('radio', { name: '32 GB' })).toBeChecked()
    expect(within(group('Almacenamiento')).getByText('Única opción disponible')).toBeVisible()
    expect(within(group('Color')).getByRole('radio', { name: 'Black' })).not.toBeChecked()
    expect(within(group('Color')).getByRole('radio', { name: 'White' })).not.toBeChecked()
  })

  it('keeps the add button inactive until every option is chosen', async () => {
    const bodies = recordCartRequests()
    const { user } = await openProduct(TAB_A700)

    expect(screen.getByText('Selecciona almacenamiento y color para continuar.')).toBeVisible()
    await user.click(addButton())

    expect(addButton()).toHaveAttribute('aria-disabled', 'true')
    expect(bodies).toEqual([])
  })

  it('can add straight away when every selector has a single option', async () => {
    await openProduct(JADE_2)

    expect(addButton()).toHaveAttribute('aria-disabled', 'false')
    expect(screen.getByText('Se añadirá: 32 GB · Black')).toBeVisible()
  })

  it('sends the product id and the selected colour and storage codes', async () => {
    const bodies = recordCartRequests()
    const { user } = await openProduct(TAB_A700)

    await user.click(screen.getByRole('radio', { name: '64 GB' }))
    await user.click(screen.getByRole('radio', { name: 'Metallic Red' }))
    await user.click(addButton())

    expect(bodies).toEqual([{ id: TAB_A700, colorCode: 1001, storageCode: 2002 }])
  })

  it('confirms the add and counts every item in the client', async () => {
    const { user } = await openProduct(Z6_PLUS)
    await user.click(screen.getByRole('radio', { name: 'White' }))

    await user.click(addButton())
    expect(
      await screen.findByText(
        'Liquid Z6 Plus · 32 GB · White añadido. Tienes 1 artículo en la cesta.',
      ),
    ).toBeVisible()
    expect(addButton()).toHaveAccessibleName('Añadido a la cesta')

    await user.click(screen.getByRole('radio', { name: 'Black' }))
    await user.click(addButton())
    expect(await screen.findByText(/Tienes 2 artículos en la cesta/)).toBeVisible()
    expect(localStorage.getItem(CART_STORAGE_KEY)).toBe('2')
  })

  it('tells the user when the item could not be added and keeps the count', async () => {
    server.use(http.post(CART_URL, () => new HttpResponse(null, { status: 500 })))
    const { user } = await openProduct(JADE_2)

    await user.click(addButton())

    expect(await screen.findByText('No se ha podido añadir. Inténtalo de nuevo.')).toBeVisible()
    expect(addButton()).toHaveAccessibleName('Añadir a la cesta')
    expect(localStorage.getItem(CART_STORAGE_KEY)).toBeNull()
  })

  it('selects options with the keyboard', async () => {
    const { user } = await openProduct(Z6_PLUS)

    await user.click(screen.getByRole('radio', { name: 'Black' }))
    await user.keyboard('{ArrowRight}')

    expect(screen.getByRole('radio', { name: 'White' })).toBeChecked()
  })
})

describe('ProductActions placement', () => {
  it('puts the add button before the specifications, so it is on screen without scrolling', async () => {
    await openProduct(Z6_PLUS)

    const specs = screen.getByRole('heading', { name: 'Especificaciones' })

    expect(
      addButton().compareDocumentPosition(specs) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })
})

// jsdom has no layout: report the main add button as off screen.
function mainButtonOffScreen() {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      callback: IntersectionObserverCallback
      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback
      }
      observe() {
        this.callback([{ isIntersecting: false } as IntersectionObserverEntry], this as never)
      }
      disconnect() {}
    },
  )
}

const stickyBar = () => screen.findByRole('region', { name: 'Compra rápida' })

describe('Sticky buy bar (small screens, when the add button is off screen)', () => {
  it('shows the price and an add button', async () => {
    mainButtonOffScreen()
    await openProduct(JADE_2)

    expect(within(await stickyBar()).getByText('Precio no disponible')).toBeVisible()
    expect(
      within(await stickyBar()).getByRole('button', { name: 'Añadir a la cesta' }),
    ).toBeVisible()
  })

  it('adds the product straight away when every option is chosen', async () => {
    mainButtonOffScreen()
    const bodies = recordCartRequests()
    const { user } = await openProduct(JADE_2)

    await user.click(within(await stickyBar()).getByRole('button', { name: 'Añadir a la cesta' }))

    await vi.waitFor(() => expect(bodies).toHaveLength(1))
  })

  it('takes the user to the first missing option instead of doing nothing', async () => {
    mainButtonOffScreen()
    const bodies = recordCartRequests()
    const { user } = await openProduct(Z6_PLUS)

    await user.click(within(await stickyBar()).getByRole('button', { name: 'Elegir opciones' }))

    expect(screen.getByRole('radio', { name: 'Black' })).toHaveFocus()
    expect(bodies).toEqual([])
  })

  it('is not shown while the main add button is on screen', async () => {
    await openProduct(JADE_2)

    expect(screen.queryByRole('region', { name: 'Compra rápida' })).not.toBeInTheDocument()
  })
})
