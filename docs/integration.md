# Quickstart

Use the helper script unless you need full control over `postMessage` handling.

## Helper script

```html
<div id="finanzierungsorientierung"></div>

<script src="https://widgets.hypo.tech/v1/embed.js"></script>
<script>
  const widget = HypotechWidget.mount('#finanzierungsorientierung', {
    project: 'schoenauer-weg',
    partner: 'heim-leben',
    unit: 7,
    parking: 'hub',
    household: 'joint',
  })
</script>
```

The helper creates the iframe, validates widget messages and keeps its height in sync.

## Direct iframe

```html
<iframe
  id="hypotech-financing-widget"
  src="https://widgets.hypo.tech/v1/widget/heim-leben/?project=schoenauer-weg&unit=7&parking=hub&household=joint"
  title="Financing guidance by hypo.tech"
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin"
  sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
  style="display:block;width:100%;min-height:560px;border:0;background:transparent"
></iframe>
```

Keep `referrerpolicy` and `sandbox` unchanged.

## Options

| Option | Example | Description |
| --- | --- | --- |
| `project` | `schoenauer-weg` | Published project slug |
| `partner` | `heim-leben` | Published partner slug |
| `unit` | `7` | Initial unit |
| `parking` | `hub` | Initial parking option |
| `household` | `single` or `joint` | Initial household mode |

Never put age, income, equity, assets or other personal data in the URL.

## Update an instance

```js
widget.configure({
  unit: 4,
  parking: 'single',
  household: 'joint',
})
```

## Destroy an instance

```js
widget.destroy()
```

This removes the iframe and its event listeners.
