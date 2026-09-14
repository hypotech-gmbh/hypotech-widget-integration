# Integration

Two integrations. Both compute in the visitor's browser and transmit nothing.

| | Embedded (recommended) | Iframe |
| --- | --- | --- |
| Markup | `<hypo-financing>` element | `<iframe>` |
| Rendering | Your page flow, isolated in a shadow root | Own document in a frame |
| Height | Follows the content | Reported with `resize` |

## Embedded

```html
<hypo-financing project="example-project" partner="example-partner" unit="7"></hypo-financing>
<script src="https://widgets.hypo.tech/v1/embed.js"></script>
```

| Attribute | Example | Description |
| --- | --- | --- |
| `project` | `example-project` | Published project slug |
| `partner` | `example-partner` | Published partner slug |
| `unit` | `7` | Initial unit |
| `parking` | `hub` | Initial parking option |
| `household` | `single` or `joint` | Initial household mode |

Change an instance later — for example from a unit table on your page:

```js
document.querySelector('hypo-financing').configure({ unit: 4, parking: 'single' })
```

Events are dispatched on the element. None of them contains personal data.

| Event | Detail |
| --- | --- |
| `hypotech:ready` | `{ project, partner, unitId }` |
| `hypotech:unit-change` | `{ unitId }` |
| `hypotech:consultation-open` | `{ url }` |

The element fills its container and arranges itself in three columns from 900 px, two from 620 px, one below.

## Iframe

```html
<iframe
  id="hypotech-financing-widget"
  src="https://widgets.hypo.tech/v1/widget/example-partner/?project=example-project&unit=7"
  title="Financing guidance by hypo.tech"
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin"
  sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
  style="display:block;width:100%;min-height:560px;border:0;background:transparent"
></iframe>
```

Keep `sandbox` and `referrerpolicy` unchanged. Or let the helper script build
the frame and keep its height in sync:

```html
<div id="financing"></div>
<script src="https://widgets.hypo.tech/v1/embed.js"></script>
<script>
  HypotechWidget.mount('#financing', { project: 'example-project', partner: 'example-partner', unit: 7 })
</script>
```

The frame reports `ready`, `resize` and `unit-change` with `window.postMessage`.
Validate origin, source window, project and partner, and never use `'*'` as the
target origin:

```js
window.addEventListener('message', (event) => {
  if (event.source !== frame.contentWindow || event.origin !== new URL(frame.src).origin) return
  if (event.data?.source !== 'hypotech-widget') return
  if (event.data.project !== 'example-project' || event.data.partner !== 'example-partner') return
  if (event.data.type === 'resize') frame.style.height = `${event.data.height}px`
})
```

## Options

Age, income, equity, assets and other personal data never belong in the URL or
the markup — in neither integration.

## Customising

Your partner profile controls the appearance. No partner-specific code runs
inside the widget.

| Setting | Effect |
| --- | --- |
| `theme.primary`, `theme.primaryDark`, `theme.success` | Brand colours |
| `theme.fontFamily` | Font stack, as a plain CSS family list |
| `theme.typeScale` | Factor between 0.9 and 1.3 on the embedded typography, default 1 |
| `theme.radius` | `sharp`, `default` or `round` |
| `logo`, `coBranding`, `cta`, `legal` | Logo, labels and legal texts |
| `attribution.source` | Unpersonal parameter on the call to action |

### CSS variables

The widget sets these on its host element. Your own stylesheet can override
them, so a page can adjust the widget without waiting for a configuration
release:

```css
hypo-financing {
  --hl-blue: #1b3a66;
  --hl-blue-dark: #12294a;
  --success: #17633f;
  --radius: 10px;
  --type-scale: 1.1;
}
```

Values from the profile are the default; a rule on the host element wins.

### Behaviour

React to `hypotech:ready`, `hypotech:unit-change` and
`hypotech:consultation-open`, and change unit, parking or household with
`configure()`. That is the whole extension surface around the widget — there is
no partner-specific code inside it.

A new field or a different calculation is a platform change rather than a
partner change: it belongs in the financing profile, with schema, tests and
documentation, so that every partner is calculated the same way.

## What the widget shows

| Figure | Meaning |
| --- | --- |
| Monthly rate | Model calculation from purchase price, equity and the repayment assumption |
| Stand | Reference date of the financing assumptions |
| Beleihungsauslauf | Loan in relation to the lending value (90 % of the purchase price) |
| Eigenkapitalanteil | Equity in relation to total costs, including ancillary acquisition costs |
| Tilgungsverlauf | Calculated repayment term at a constant monthly payment |

## When no rate appears

The widget withholds the rate whenever it would describe a financing that
cannot be realised, and names the missing requirement instead:

- applicant below 18 years, or age left empty
- equity below the required share (10 % of total costs)
- loan-to-value ratio above the limit (105 %)
- no household income: the rate stays, the affordability assessment stays open

The limits come from the published financing profile and can change without
touching your integration.

## Repayment assumption

The monthly rate combines the model interest rate with an initial repayment
rate. Both come from the published profile and rise with age, so two applicants
can see different rates for the same unit.
