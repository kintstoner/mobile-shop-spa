import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ToastProvider } from './ToastProvider'
import { useToast } from './useToast'

function Trigger({ message = 'Hola' }: { message?: string }) {
  const toast = useToast()
  return (
    <button type="button" onClick={() => toast.show({ message, tone: 'warning' })}>
      show
    </button>
  )
}

function setup(message?: string) {
  const user = userEvent.setup()
  render(
    <ToastProvider>
      <Trigger message={message} />
    </ToastProvider>,
  )
  return { user }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('Toast', () => {
  it('announces the message politely', async () => {
    const { user } = setup('Funcionalidad en desarrollo...')

    await user.click(screen.getByRole('button', { name: 'show' }))

    const region = screen.getByRole('status')
    expect(region).toHaveTextContent('Funcionalidad en desarrollo...')
  })

  it('closes from its close button', async () => {
    const { user } = setup('Hola')
    await user.click(screen.getByRole('button', { name: 'show' }))

    await user.click(screen.getByRole('button', { name: 'Cerrar aviso' }))

    expect(screen.queryByText('Hola')).not.toBeInTheDocument()
  })

  it('goes away on its own after a few seconds', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    setup('Hola')
    fireEvent.click(screen.getByRole('button', { name: 'show' }))
    expect(screen.getByText('Hola')).toBeInTheDocument()

    await act(() => vi.advanceTimersByTimeAsync(4000))

    expect(screen.queryByText('Hola')).not.toBeInTheDocument()
  })

  it('shows the same message once even if it is triggered again', async () => {
    const { user } = setup('Hola')

    await user.click(screen.getByRole('button', { name: 'show' }))
    await user.click(screen.getByRole('button', { name: 'show' }))

    expect(screen.getAllByText('Hola')).toHaveLength(1)
  })
})
