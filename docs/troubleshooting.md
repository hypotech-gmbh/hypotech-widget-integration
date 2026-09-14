# Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Embedded: shell renders, no unit, price or rate | `connect-src` blocked | allow `https://widgets.hypo.tech` in `connect-src` |
| Embedded: partner logo missing | `img-src` blocked | allow `https://widgets.hypo.tech` in `img-src` |
| Embedded: brand colours missing | inline styles blocked | allow `style-src 'unsafe-inline'` |
| Iframe: stays on "Loading widget…" | `frame-src` missing — no console entry | allow `https://widgets.hypo.tech` in `frame-src` |
| Iframe: frame stays empty | preview deployment, or origin not approved | use the production endpoint; send the exact origin |
| Iframe: scrolls internally | height not adjusted | use the helper script or handle `resize` |
| Helper script blocked | `script-src` | allow `https://widgets.hypo.tech` in `script-src` |
| No rate although all inputs are filled | by design | the widget names the missing requirement, see [Integration](integration.md#when-no-rate-appears) |
| Inputs seem ignored | age below 18, income of zero, age missing | by design — no placeholder values |
| Wrong unit | `unit` is not a published numeric ID | invalid values fall back to the default unit |
| `configure()` has no effect | unknown keys | only `unit`, `parking` and `household` are accepted |
| Iframe: a message is ignored | origin not approved, or the message does not match | `source: 'hypotech-host'`, `type: 'configure'`, keys as above |

Report a problem with synthetic test data only: [integration issue](https://github.com/hypotech-gmbh/hypotech-widget-integration/issues/new/choose).
