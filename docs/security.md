# Security

## Rules

- Never add personal data to the iframe URL.
- Validate `event.origin` and `event.source` for every message.
- Keep the documented `sandbox` and `referrerpolicy` attributes.
- Load the widget only from the published HTTPS endpoint.
- Do not attempt to read iframe contents.

## Origin allowlist

The widget's `Content-Security-Policy` only permits approved `frame-ancestors`. Send hypo.tech the exact origin for each environment:

```text
https://www.partner.de
https://staging.partner.de
```

Do not send wildcards or paths.

## Credentials

The integration requires no API key or access token.

## Reporting

Use [GitHub private vulnerability reporting](https://github.com/hypotech-gmbh/hypotech-widget-integration/security/advisories/new). Never include real financial data.

## What the embedding page must allow

Your own `Content-Security-Policy` applies to the iframe as well. Without these directives the widget stays on its loading state and browsers report nothing, because a blocked frame is not a console error:

```text
script-src 'self' https://widgets.hypo.tech;
frame-src  https://widgets.hypo.tech;
```

`script-src` is required for the helper script, `frame-src` for the iframe it creates. Adding `https://widgets.hypo.tech` to `default-src` covers both. Your page never needs to allow anything else for the widget.

## Preview deployments

Widget preview URLs are protected by Vercel authentication and answer every resource request with `X-Frame-Options: DENY`. They cannot be embedded. Test against the production endpoint, or run the widget locally.
