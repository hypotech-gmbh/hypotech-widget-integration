# Troubleshooting

## The iframe is blocked

Check the browser console for `Content-Security-Policy` or `frame-ancestors`. The exact host origin must be approved by hypo.tech.

## The iframe scrolls internally

Use the helper script or handle `resize` messages as shown in [Events](messages.md).

## The wrong unit is selected

`unit` must be a published numeric unit ID. Invalid values fall back to the project's default unit.

## A configure message is ignored

Check that the origin is approved and the message uses `source: 'hypotech-host'`, `type: 'configure'` and only `unit`, `unitId`, `parking` or `household`.

## The helper script is blocked

Allow `https://widgets.hypo.tech` in your page's `script-src` directive.

## Report a problem

Open an [integration issue](https://github.com/hypotech-gmbh/hypotech-widget-integration/issues/new/choose) with synthetic test data only.
