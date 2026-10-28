import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProductImage } from './ProductImage'

describe('ProductImage', () => {
  it('shows the product photo', () => {
    render(<ProductImage src="https://img.test/1.jpg" alt="Acer Liquid Z6" />)

    expect(screen.getByRole('img', { name: 'Acer Liquid Z6' })).toHaveAttribute(
      'src',
      'https://img.test/1.jpg',
    )
  })

  it('falls back to a placeholder that keeps the description when the photo fails', () => {
    render(<ProductImage src="https://img.test/broken.jpg" alt="Acer Liquid Z6" />)

    fireEvent.error(screen.getByRole('img'))

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText('Acer Liquid Z6')).toBeInTheDocument()
  })

  it('tries again when it receives a different photo', () => {
    const { rerender } = render(<ProductImage src="https://img.test/broken.jpg" alt="A" />)
    fireEvent.error(screen.getByRole('img'))

    rerender(<ProductImage src="https://img.test/2.jpg" alt="A" />)

    expect(screen.getByRole('img', { name: 'A' })).toHaveAttribute('src', 'https://img.test/2.jpg')
  })
})

describe('ProductImage while loading', () => {
  it('shows a placeholder until the photo arrives', () => {
    const { container } = render(<ProductImage src="https://img.test/1.jpg" alt="A" />)
    const frame = container.firstElementChild!

    expect(frame).toHaveAttribute('data-state', 'loading')

    fireEvent.load(screen.getByRole('img'))

    expect(frame).toHaveAttribute('data-state', 'loaded')
  })
})
