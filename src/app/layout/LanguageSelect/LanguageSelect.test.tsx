import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LANGUAGE_STORAGE_KEY } from '@/shared/i18n/i18n'
import { renderApp } from '@/test/renderApp'

describe('LanguageSelect', () => {
  it('starts in Spanish', async () => {
    renderApp('/')

    expect(screen.getByRole('combobox', { name: 'Idioma' })).toHaveValue('es')
    expect((await screen.findAllByText('170 €')).length).toBeGreaterThan(0)
  })

  it('switches the whole interface, prices included, and remembers the choice', async () => {
    const { user } = renderApp('/')
    await screen.findByText('100 productos')

    await user.selectOptions(screen.getByRole('combobox', { name: 'Idioma' }), 'en')

    expect(screen.getByRole('heading', { name: 'Phones and tablets' })).toBeVisible()
    expect(screen.getByText('100 products')).toBeInTheDocument()
    expect(screen.getAllByText('€170').length).toBeGreaterThan(0)
    expect(screen.getByRole('combobox', { name: 'Language' })).toHaveValue('en')
    expect(document.documentElement.lang).toBe('en')
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en')
  })
})
