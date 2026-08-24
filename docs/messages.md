# Events

The iframe uses `window.postMessage`. Validate the exact origin, source window, project and partner before handling a message.

## Widget messages

### `ready`

```json
{
  "source": "hypotech-widget",
  "type": "ready",
  "version": "1.0.0",
  "project": "schoenauer-weg",
  "partner": "heim-leben",
  "unitId": 7
}
```

### `resize`

```json
{
  "source": "hypotech-widget",
  "type": "resize",
  "version": "1.0.0",
  "project": "schoenauer-weg",
  "partner": "heim-leben",
  "height": 760
}
```

### `unit-change`

```json
{
  "source": "hypotech-widget",
  "type": "unit-change",
  "version": "1.0.0",
  "project": "schoenauer-weg",
  "partner": "heim-leben",
  "unitId": 4
}
```

## Validate messages

```js
const frame = document.querySelector('#hypotech-financing-widget')
const widgetOrigin = new URL(frame.src).origin

window.addEventListener('message', (event) => {
  if (event.source !== frame.contentWindow) return
  if (event.origin !== widgetOrigin) return

  const message = event.data
  if (!message || message.source !== 'hypotech-widget') return
  if (message.project !== 'schoenauer-weg') return
  if (message.partner !== 'heim-leben') return

  // Handle the message
})
```

Never use `'*'` as the target origin when sending messages to the widget.

## Data boundary

Messages never contain age, income, equity, assets or calculated personal results. The host page must not attempt to read or reproduce those values.
