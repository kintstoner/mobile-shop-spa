import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/renderApp'

const Z6_PLUS = '/product/cGjFJlmqNPIwU59AOcY8H'
const IMAGE = 'https://itx-frontend-test.onrender.com/images/cGjFJlmqNPIwU59AOcY8H.jpg'

async function openProduct() {
  const view = renderApp(Z6_PLUS)
  await screen.findByRole('heading', { level: 1, name: 'Liquid Z6 Plus' })
  return view
}

const zoomButton = () => screen.getByRole('button', { name: 'Ampliar imagen: Acer Liquid Z6 Plus' })

describe('ProductImageZoom', () => {
  it('offers the product photo as a button that enlarges it', async () => {
    await openProduct()

    expect(within(zoomButton()).getByRole('img', { name: 'Acer Liquid Z6 Plus' })).toHaveAttribute(
      'src',
      IMAGE,
    )
  })

  it('opens the photo in a viewer and closes it again', async () => {
    const { user } = await openProduct()

    await user.click(zoomButton())
    const viewer = screen.getByRole('dialog', { name: 'Acer Liquid Z6 Plus' })
    expect(within(viewer).getByRole('img', { name: 'Acer Liquid Z6 Plus' })).toHaveAttribute(
      'src',
      IMAGE,
    )

    await user.click(within(viewer).getByRole('button', { name: 'Cerrar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(zoomButton()).toHaveFocus()
  })

  it('closes the viewer with Escape', async () => {
    const { user } = await openProduct()
    await user.click(zoomButton())

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens the viewer from the keyboard', async () => {
    const { user } = await openProduct()
    zoomButton().focus()

    await user.keyboard('{Enter}')

    expect(screen.getByRole('dialog', { name: 'Acer Liquid Z6 Plus' })).toBeInTheDocument()
  })
})
