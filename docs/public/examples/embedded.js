const widget = document.querySelector('#financing')
const status = document.querySelector('#status')
const unit = document.querySelector('#unit')

for (const id of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) unit.add(new Option(`Wohnung ${id}`, String(id)))
unit.value = '7'

// The page drives the unit; the widget reports back what the visitor selects.
unit.addEventListener('change', () => widget.configure({ unit: Number(unit.value) }))

widget.addEventListener('hypotech:ready', () => {
  status.textContent = 'Ready'
})

widget.addEventListener('hypotech:unit-change', (event) => {
  status.textContent = `Unit ${event.detail.unitId} selected`
  unit.value = String(event.detail.unitId)
})
