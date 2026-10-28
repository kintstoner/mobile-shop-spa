import { expect, test, type Page } from '@playwright/test'
import { mockApi } from './apiMock.ts'

const Z6_PLUS = 'cGjFJlmqNPIwU59AOcY8H'

const cartBadge = (page: Page) => page.getByText('Artículos en la cesta:').locator('..')

// Number of distinct columns in the product grid, measured from the cards' positions.
async function gridColumns(page: Page) {
  const lefts = await page
    .getByRole('list', { name: 'Productos' })
    .getByRole('listitem')
    .evaluateAll((items) => items.map((item) => Math.round(item.getBoundingClientRect().left)))
  return new Set(lefts).size
}

test('finds a product, adds it to the cart and keeps the count', async ({ page }) => {
  const calls = await mockApi(page)
  await page.goto('/')

  await page.getByRole('searchbox', { name: 'Buscar por marca o modelo' }).fill('z6 plus')
  await expect(page.getByText('1 resultado de 100 productos')).toBeVisible()
  await page.getByRole('link', { name: /Liquid Z6 Plus/ }).click()

  await expect(page.getByRole('heading', { level: 1, name: 'Liquid Z6 Plus' })).toBeVisible()
  await expect(page.getByRole('radio', { name: '32 GB' })).toBeChecked()
  await page.getByText('White', { exact: true }).click()
  await page.getByRole('button', { name: 'Añadir a la cesta' }).click()

  await expect(page.getByRole('button', { name: 'Añadido a la cesta' })).toBeVisible()
  await expect(cartBadge(page)).toHaveText(/Artículos en la cesta:\s*1/)
  expect(calls.cart).toEqual([{ id: Z6_PLUS, colorCode: 1001, storageCode: 2000 }])

  await page.getByRole('link', { name: 'Volver al listado' }).click()
  await expect(page.getByRole('searchbox')).toHaveValue('z6 plus')

  await page.reload()
  await expect(cartBadge(page)).toHaveText(/Artículos en la cesta:\s*1/)
})

test('shows at most four columns on a wide screen and one on a phone', async ({ page }) => {
  await mockApi(page)

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.getByText('100 productos')).toBeVisible()
  expect(await gridColumns(page)).toBe(4)

  await page.setViewportSize({ width: 390, height: 844 })
  expect(await gridColumns(page)).toBe(1)
})

test('serves a second visit from the client cache', async ({ page }) => {
  const calls = await mockApi(page)

  await page.goto('/')
  await expect(page.getByText('100 productos')).toBeVisible()
  await page.reload()
  await expect(page.getByText('100 productos')).toBeVisible()

  expect(calls.list).toBe(1)
})

test('opens a product page directly from its URL', async ({ page }) => {
  await mockApi(page)

  await page.goto(`/product/${Z6_PLUS}`)

  await expect(page.getByRole('heading', { level: 1, name: 'Liquid Z6 Plus' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Migas de pan' })).toContainText(
    'Acer Liquid Z6 Plus',
  )
})

test('explains when a product cannot be loaded', async ({ page }) => {
  await mockApi(page)

  await page.goto('/product/does-not-exist')

  await expect(
    page.getByRole('heading', { level: 1, name: 'No hemos podido cargar este producto' }),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: 'Ver todos los productos' })).toBeVisible()
})

test('magnifies the product photo under the mouse and opens it in a viewer', async ({ page }) => {
  await mockApi(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`/product/${Z6_PLUS}`)

  const photo = page.getByRole('button', { name: 'Ampliar imagen: Acer Liquid Z6 Plus' })
  const box = (await photo.boundingBox())!
  await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.25)

  // The picture (or its fallback, as the mock answers 404 for images) is scaled 2× around the pointer.
  const scaled = photo.locator(':scope > :first-child')
  await expect(scaled).toHaveCSS('transform', 'matrix(2, 0, 0, 2, 0, 0)')

  await photo.click()
  await expect(page.getByRole('dialog', { name: 'Acer Liquid Z6 Plus' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
})
