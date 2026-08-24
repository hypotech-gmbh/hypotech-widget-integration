const frame = document.querySelector('#hypotech-financing-widget')
const status = document.querySelector('#status')
const widgetOrigin = new URL(frame.src).origin

window.addEventListener('message', (event) => {
  if (event.source !== frame.contentWindow || event.origin !== widgetOrigin) return
  const message = event.data
  if (
    !message ||
    message.source !== 'hypotech-widget' ||
    message.project !== 'schoenauer-weg' ||
    message.partner !== 'heim-leben'
  ) {
    return
  }

  if (message.type === 'resize' && Number.isFinite(message.height)) {
    frame.style.height = `${Math.min(Math.max(Math.ceil(message.height), 420), 2400)}px`
  }

  if (message.type === 'ready') status.textContent = 'Widget geladen'
  if (message.type === 'unit-change') status.textContent = `Wohneinheit ${message.unitId} ausgewählt`
})
