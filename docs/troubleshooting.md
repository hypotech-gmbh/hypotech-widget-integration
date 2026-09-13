# Troubleshooting

## The iframe is blocked

Check the browser console for `Content-Security-Policy` or `frame-ancestors`. The exact host origin must be approved by hypo.tech.

## The widget stays on "Loading widget…"

The page renders but the frame never completes. Three causes, in order of likelihood:

1. **Your page's `frame-src` does not allow `https://widgets.hypo.tech`.** A frame blocked this way produces no console entry; add the directive as described in [Security](security.md).
2. **You are embedding a preview deployment.** Preview URLs are protected by Vercel authentication and return `X-Frame-Options: DENY`. Use the production endpoint.
3. **The iframe URL carries an unapproved origin.** The `frame-ancestors` allowlist is per partner; send the exact origin to hypo.tech.

## No monthly rate appears, but the widget works

This is intentional. The widget withholds the rate when the constellation cannot be financed — for example when equity stays below the required share or the loan-to-value ratio exceeds the limit. The widget names the missing requirement. See [What the widget shows](integration.md#what-the-widget-shows).

## Inputs are not accepted

Applicant age below 18, income of zero and missing ages do not produce a rate or an affordability figure. This is by design: the widget never substitutes a placeholder value for a missing personal figure.

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
