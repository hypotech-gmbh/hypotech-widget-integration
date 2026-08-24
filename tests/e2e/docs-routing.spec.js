import { expect, test } from '@playwright/test'

const exampleScript = `
  window.HypotechWidget = {
    mount(host) {
      const frame = document.createElement('iframe')
      frame.title = 'Financing guidance by hypo.tech'
      host.append(frame)
      queueMicrotask(() => host.dispatchEvent(new CustomEvent('hypotech:ready')))
      return { configure() {} }
    }
  }
`

test.beforeEach(async ({ page }) => {
  await page.route('https://widgets.hypo.tech/v1/embed.js', (route) =>
    route.fulfill({ contentType: 'text/javascript', body: exampleScript }),
  )
})

for (const link of ['Live example', 'Examples']) {
  test(`${link} opens the helper example instead of the docs 404 page`, async ({ page }) => {
    await page.goto('./')
    await page.getByRole('link', { name: link, exact: true }).click()

    await expect(page).toHaveURL(/\/docs\/examples\/helper-script\/$/)
    await expect(page.getByRole('heading', { name: 'Helper script' })).toBeVisible()
    await expect(page.getByRole('status')).toHaveText('Ready')
    await expect(page.locator('iframe')).toHaveCount(1)
    await expect(page.getByText('PAGE NOT FOUND')).toHaveCount(0)
  })
}

for (const example of ['helper-script', 'basic-iframe', 'dynamic-unit-selection']) {
  test(`serves the ${example} example at a clean URL`, async ({ page }) => {
    const response = await page.goto(`examples/${example}/`)
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.getByText('PAGE NOT FOUND')).toHaveCount(0)
  })
}

for (const [example, heading] of [
  ['helper-script', 'Helper script'],
  ['basic-iframe', 'Direct iframe'],
  ['dynamic-unit-selection', 'Dynamic unit selection'],
]) {
  test(`keeps the legacy ${example}.html URL compatible`, async ({ page }) => {
    const response = await page.goto(`examples/${example}.html`)
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { name: heading })).toBeVisible()
  })
}
