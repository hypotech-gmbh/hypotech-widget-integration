# Embedded integration

The widget renders directly in the page flow of your site — no iframe, no
intermediate step. This is the recommended integration.

## Embed it

```html
<hypo-financing project="example-project" partner="example-partner" unit="7" parking="hub"></hypo-financing>
<script src="https://widgets.hypo.tech/v1/embed.js"></script>
```

The helper script registers the `hypo-financing` element and renders the widget
inside it. Place the element where the widget should appear; it takes the full
width of its container and chooses its own column layout from that width
(three columns at 900 px and above, two columns from 620 px, single column
below).

## Options

| Attribute | Example | Description |
| --- | --- | --- |
| `project` | `example-project` | Published project slug |
| `partner` | `example-partner` | Published partner slug |
| `unit` | `7` | Initially selected unit |
| `parking` | `hub` | Initial parking option |
| `household` | `single` or `joint` | Initial household mode |

Never put age, income, equity or assets into the markup.

## Update an instance

Unit, parking and household mode can be changed at any time — for example from
a unit table on your page:

```js
const widget = document.querySelector('hypo-financing')

widget.configure({ unit: 4, parking: 'single' })
widget.addEventListener('hypotech:unit-change', (event) => {
  console.log('selected unit', event.detail.unitId)
})
```

## Events

The widget dispatches events on the element itself. They never contain personal
data.

| Event | Detail |
| --- | --- |
| `hypotech:ready` | `{ project, partner, unitId }` once the widget is rendered |
| `hypotech:unit-change` | `{ unitId }` when the visitor selects another unit |
| `hypotech:consultation-open` | `{ url }` when the visitor follows the link to hypo.tech |

## The call to action

The button "Persönliche Prüfung bei hypo.tech" is an ordinary link, not a script
call:

```html
<a class="primary-action" href="https://www.hypo.tech/de/finanzierung?source=…" rel="nofollow noopener" target="_blank">
```

It works without JavaScript, opens a new tab, and carries `rel="nofollow"`. The
`source` parameter is an unpersonal identifier for the partner and project; it
contains nothing about the visitor.

Because the link sits in your page's DOM, search engines can follow it. In the
iframe integration the same link lives inside the frame and is therefore not
attributed to your page.

## Differences from the iframe integration

| | Iframe | Embedded |
| --- | --- | --- |
| Rendering | Own document inside a frame | Your page, isolated in a shadow root |
| Height | Reported via `resize` messages | Follows the content |
| Events | `ready`, `resize`, `unit-change` via `postMessage` | `hypotech:*` events on the element |
| Direction to hypo.tech | Opens a new tab | Opens a new tab |
| Personal data | Never transmitted | Never transmitted |

Both modes compute in the visitor's browser. The difference is where the code
runs: embedded, the widget's JavaScript executes under your origin. The data
flow is identical — nothing is transmitted and nothing is stored. See
[Data protection](#data-protection) below.

## Data protection

- Age, income, equity and assets are computed in the browser and never leave it.
- No cookies, no local storage, no session recognition.
- The selected unit, parking option and household mode travel to
  `widgets.hypo.tech` as unpersonal parameters to load the matching published
  configuration.
- No consent is required under § 25 TDDDG because nothing is stored on the
  device.
- The link to hypo.tech is a normal navigation; nothing is sent before the
  visitor follows it.

Because the embedded mode executes under your origin, your privacy notice
should mention it. A wording proposal and the full data flow are part of the
onboarding material.
