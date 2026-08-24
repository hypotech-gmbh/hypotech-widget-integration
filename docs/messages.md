# Nachrichtenvertrag

Das Widget und die einbettende Seite kommunizieren über `window.postMessage`. Nachrichten müssen anhand von Ursprung, Fensterquelle, Projekt- und Partnerkennung geprüft werden.

## Nachrichten des Widgets

### `ready`

Das Widget wurde geladen und die veröffentlichte Konfiguration ist verfügbar.

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

Das Widget meldet die benötigte Dokumenthöhe in Pixeln.

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

Die besuchende Person hat eine andere Wohneinheit ausgewählt.

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

## Sicherheitsprüfung beim direkten iframe

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

  // Nachricht verarbeiten
})
```

Verwenden Sie niemals `'*'` als Zielursprung für eigene Nachrichten an das Widget.

## Datengrenze

Nachrichten enthalten keine Angaben zu Alter, Einkommen, Eigenkapital, Vermögen oder berechneten persönlichen Ergebnissen. Diese Daten dürfen auch von der einbettenden Seite nicht aus dem iframe ausgelesen oder nachgebildet werden.
