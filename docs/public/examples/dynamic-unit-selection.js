const host = document.querySelector('#finanzierungsorientierung')
const select = document.querySelector('#unit')
const status = document.querySelector('#status')

for (let unit = 1; unit <= 10; unit += 1) {
  const option = document.createElement('option')
  option.value = String(unit)
  option.textContent = `Unit ${unit}`
  option.selected = unit === 7
  select.append(option)
}

const widget = window.HypotechWidget.mount(host, {
  project: 'schoenauer-weg',
  partner: 'heim-leben',
  unit: 7,
  parking: 'hub',
  household: 'joint',
  loading: 'eager',
})

host.addEventListener('hypotech:ready', () => {
  status.textContent = 'Widget ready'
})

host.addEventListener('hypotech:unit-change', (event) => {
  select.value = String(event.detail.unitId)
  status.textContent = `Unit ${event.detail.unitId} selected`
})

document.querySelector('#apply').addEventListener('click', () => {
  widget.configure({ unit: Number(select.value) })
})
