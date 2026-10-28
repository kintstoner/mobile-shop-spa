import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/renderApp'

async function cards() {
  const list = await screen.findByRole('list', { name: 'Productos' })
  return within(list).getAllByRole('listitem')
}

describe('Product search', () => {
  it('filters the list while the user types', async () => {
    const { user } = renderApp('/')
    await cards()

    await user.type(screen.getByRole('searchbox', { name: 'Buscar por marca o modelo' }), 'liquid')

    expect(await cards()).toHaveLength(47)
    expect(screen.getByText('47 resultados de 100 productos')).toBeInTheDocument()
  })

  it('keeps the query in the URL so it survives going back', async () => {
    const { user, router } = renderApp('/')
    await cards()

    await user.type(screen.getByRole('searchbox'), 'alcatel')

    expect(router.state.location.search).toBe('?q=alcatel')
    expect(screen.getByText('1 resultado de 100 productos')).toBeInTheDocument()
  })

  it('starts from the query in the URL', async () => {
    renderApp('/?q=jade')

    expect(await cards()).toHaveLength(5)
    expect(screen.getByRole('searchbox')).toHaveValue('jade')
  })

  it('shows an empty state that clears the search', async () => {
    const { user } = renderApp('/?q=pixel')

    expect(
      await screen.findByRole('heading', { name: 'Sin resultados para «pixel»' }),
    ).toBeVisible()
    await user.click(
      within(screen.getByRole('main')).getAllByRole('button', { name: 'Limpiar búsqueda' })[1]!,
    )

    expect(await cards()).toHaveLength(100)
    expect(screen.getByRole('searchbox')).toHaveValue('')
  })

  it('clears the query from the button inside the search box and keeps the focus there', async () => {
    const { user, router } = renderApp('/?q=liquid')
    await cards()

    await user.click(
      // jsdom does not map <search> to the search role yet, so scope the query by the element.
      within(screen.getByRole('searchbox').closest('search')!).getByRole('button', {
        name: 'Limpiar búsqueda',
      }),
    )

    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.getByRole('searchbox')).toHaveFocus()
    expect(router.state.location.search).toBe('')
    expect(await cards()).toHaveLength(100)
  })
})
