import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'
import { i18n } from '@/shared/i18n/i18n'
import { server } from './server'

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))

// Tests read the Spanish texts; jsdom reports an English browser, so set the language explicitly.
beforeEach(async () => {
  await i18n.changeLanguage('es')
})

afterEach(() => {
  cleanup()
  server.resetHandlers()
  localStorage.clear()
})

afterAll(() => server.close())
