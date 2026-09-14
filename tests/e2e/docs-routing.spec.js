import { expect, test } from '@playwright/test'

const exampleScript = `
  class FakeFinancing extends HTMLElement {
    configure() {}
  }
  if (!customElements.get('hypo-financing')) customElements.define('hypo-financing', FakeFinancing)

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
  test(`${link} opens the embedded example instead of the docs 404 page`, async ({ page }) => {
    await page.goto('./')
    await page.getByRole('link', { name: link, exact: true }).click()

    await expect(page).toHaveURL(/\/docs\/examples\/embedded\/$/)
    await expect(page.getByRole('heading', { name: 'Embedded integration' })).toBeVisible()
    await expect(page.getByText('PAGE NOT FOUND')).toHaveCount(0)
  })
}

for (const example of ['embedded', 'helper-script']) {
  test(`serves the ${example} example at a clean URL`, async ({ page }) => {
    const response = await page.goto(`examples/${example}/`)
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.getByText('PAGE NOT FOUND')).toHaveCount(0)
  })
}

for (const [example, heading] of [
  ['embedded', 'Embedded integration'],
  ['helper-script', 'Helper script'],
]) {
  test(`keeps the legacy ${example}.html URL compatible`, async ({ page }) => {
    const response = await page.goto(`examples/${example}.html`)
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { name: heading })).toBeVisible()
  })
}

test('the iframe example mounts a frame and reports readiness', async ({ page }) => {
  await page.goto('examples/helper-script/')

  await expect(page.getByRole('status')).toHaveText('Ready')
  await expect(page.locator('iframe')).toHaveCount(1)
})
