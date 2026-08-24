const host = document.querySelector('#finanzierungsorientierung')
const status = document.querySelector('#status')

host.addEventListener('hypotech:ready', () => {
  status.textContent = 'Ready'
})

host.addEventListener('hypotech:unit-change', (event) => {
  status.textContent = `Unit ${event.detail.unitId} selected`
})

window.HypotechWidget.mount(host, {
  project: 'schoenauer-weg',
  partner: 'heim-leben',
  unit: 7,
  parking: 'hub',
  household: 'joint',
  loading: 'eager',
})
