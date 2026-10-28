import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('starts on the product list with the shop header', async () => {
    render(<App />)

    expect(screen.getByRole('link', { name: 'mobileshop, ir al listado' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Móviles y tablets' })).toBeInTheDocument()
  })
})
