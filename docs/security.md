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

Your own `Content-Security-Policy` governs what the widget needs. Which directives are required depends on the integration:

```text
Embedded:  script-src  'self' https://widgets.hypo.tech;
           connect-src 'self' https://widgets.hypo.tech;
           img-src     'self' https://widgets.hypo.tech;

Iframe:    script-src  'self' https://widgets.hypo.tech;
           frame-src          https://widgets.hypo.tech;
```

- `script-src` loads the helper script and, in embedded mode, the widget's modules.
- `connect-src` allows the configuration JSON to be fetched. It is only needed in embedded mode, where the configuration lives on a different origin than the page.
- `img-src` allows the partner logo. Only needed in embedded mode.
- `frame-src` allows the iframe. Only needed in iframe mode.

If your policy sets a `default-src` that does not include `https://widgets.hypo.tech`, listing only `script-src` is not enough in embedded mode: the widget renders its shell but stays without data, and the console reports a refused connection.

Adding `https://widgets.hypo.tech` to `default-src` covers all of them.

Also allow inline styles (`style-src 'unsafe-inline'` or `default-src` with `'unsafe-inline'`). The widget applies your brand colours as an inline style; without it the widget loads but stays uncoloured.

In iframe mode, a missing `frame-src` produces **no console entry at all** — the frame simply stays empty and the widget shows its loading state forever.

## Outbound link

The call to action links to hypo.tech with `rel="nofollow noopener"`. The
`nofollow` is deliberate: a widget distributed across many partner sites should
not pass ranking signals, and a followable link on every install would amount to
a distributed link scheme. Visitors are unaffected — the link works normally.

If you want to reference hypo.tech editorially, do it in your own words outside
the widget. That reference is yours and needs no `nofollow`.

## Preview deployments

Widget preview URLs are protected by Vercel authentication and answer every resource request with `X-Frame-Options: DENY`. They cannot be embedded. Test against the production endpoint, or run the widget locally.
