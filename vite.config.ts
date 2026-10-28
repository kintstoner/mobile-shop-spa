import react from '@vitejs/plugin-react'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // e2e/ holds Playwright tests, run with npm run test:e2e.
    exclude: [...configDefaults.exclude, 'e2e/**'],
    restoreMocks: true,
    unstubEnvs: true,
  },
})
