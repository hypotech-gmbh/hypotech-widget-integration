document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const target = document.querySelector(`#${button.dataset.copy}`)
    if (!target) return
    await navigator.clipboard.writeText(target.textContent)
    const original = button.textContent
    button.textContent = 'Kopiert'
    window.setTimeout(() => {
      button.textContent = original
    }, 1600)
  })
})
