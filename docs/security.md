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
