# Quickstart

Two integrations are available. Both compute in the visitor's browser and
transmit nothing.

| | Embedded (recommended) | Iframe |
| --- | --- | --- |
| Rendering | In your page flow, isolated in a shadow root | Own document inside a frame |
| Markup | `<hypo-financing …>` element | `<iframe>` created by the helper script |
| Layout | Takes the width of its container | Fixed width of the frame |
| Details | [Embedded integration](embedded.md) | This page |

## Helper script

```html
<div id="finanzierungsorientierung"></div>

<script src="https://widgets.hypo.tech/v1/embed.js"></script>
<script>
  const widget = HypotechWidget.mount('#finanzierungsorientierung', {
    project: 'example-project',
    partner: 'example-partner',
    unit: 7,
    parking: 'hub',
    household: 'joint',
  })
</script>
```

The helper creates the iframe, validates widget messages and keeps its height in sync.

For the embedded integration the same script registers the `hypo-financing`
element instead — see [Embedded integration](embedded.md). That variant needs no
height synchronisation at all, because the widget simply follows the page flow.

## Direct iframe

```html
<iframe
  id="hypotech-financing-widget"
  src="https://widgets.hypo.tech/v1/widget/example-partner/?project=example-project&unit=7&parking=hub&household=joint"
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
| `project` | `example-project` | Published project slug |
| `partner` | `example-partner` | Published partner slug |
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

## Placing the widget

Give the widget a full-width container of its own. It then arranges itself in
three columns from 900 px, two columns from 620 px and a single column below
that. A container of about 750 px — the width of a three-fifth column in a
typical builder layout — still works but stays in the two-column arrangement.

If you want a unit table on your page to drive the widget, select the row and
call `configure({ unit })`. The embedded variant can also be wrapped in a
container you control; when the visitor selects a unit there, forward the call.

## What the widget shows

The widget displays an unverbindliche Modellrechnung (non-binding model calculation). Next to the monthly rate it discloses the figures that drive a lender's decision:

| Figure | Meaning |
| --- | --- |
| Stand | Reference date of the financing assumptions, taken from the published financing profile |
| Beleihungsauslauf | Loan amount in relation to the lending value (90 % of the purchase price) |
| Eigenkapitalanteil | Equity in relation to total costs, including ancillary acquisition costs |
| Tilgungsverlauf | Calculated repayment term at a constant monthly payment |

Your page does not need to do anything for these values. They arrive inside the iframe with the `ready` message.

## When the widget shows no rate

The widget deliberately withholds the monthly rate whenever a figure would describe a financing that cannot be realised. It names the missing requirement instead:

- **Applicant below the minimum age** – the applicable age is 18. A second applicant with a valid age does not replace this requirement.
- **Age left empty** – no rate is shown, because age drives the repayment assumption.
- **Equity below the required share** – the published profile requires at least 10 % of total costs.
- **Loan-to-value ratio above the limit** – the published limit is 105 %.
- **Household income not entered** – the rate still appears, because it does not depend on income, but the affordability assessment stays open.

The limits live in the published financing profile. They can change between configuration releases without any change to your integration.

## Repayment assumption

The monthly rate combines the model interest rate with an initial repayment rate (`Anfangstilgung`). Both come from the financing profile. Repayment rates are calibrated against real market proposals and rise with age, so two applicants with the same income and equity can see different rates for the same unit.
