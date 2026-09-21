# Security

## Rules

- Never put personal data into the URL, the markup or an event.
- Load the widget only from `https://widgets.hypo.tech`.
- Embedded: do not reach into the widget's shadow root.
- Iframe: keep `sandbox` and `referrerpolicy`, validate `event.origin` and `event.source`, and never use `'*'` as the target origin.

## Data boundary

| Data | Where it stays | Where it goes |
| --- | --- | --- |
| Age, income, equity, assets | In the browser | Nowhere |
| Unit, parking, household | In the browser, as unpersonal parameters | `widgets.hypo.tech`, to load the configuration |
| IP address, user agent | Processed by the deliverer, no access logs kept | Amazon Web Services (Amazon CloudFront); files stored in Frankfurt (`eu-central-1`) |

No cookies, no local storage, no session recognition: two page views cannot be
linked. Because nothing is stored on the device, no consent is required under
§ 25 TDDDG — what your privacy notice needs is the information, not a gate.

## Separation between partners

- Every published project/partner combination has its own path and its own configuration: `https://widgets.hypo.tech/v1/widget/<partner-slug>/`.
- The code is identical for every partner. Only the configuration differs: project data, brand colours, legal texts, call to action.
- A delivery contains only the combinations approved in the registry; everything else is removed from the package.
- The widget refuses an unapproved combination and never falls back to another partner's configuration.
- Configuration texts are rendered as text, never as markup. The call-to-action target is restricted to the financing page of hypo.tech, the logo path to the widget's own asset directory.
- Revoking a partner takes effect with the next delivery: remove the registry entry and the origin, and the path is gone.

If a partner needs the widget under their own subdomain, that is a hosting
decision rather than a change to the integration. Talk to hypo.tech.

## What your page must allow

```text
Embedded:  script-src  'self' https://widgets.hypo.tech;
           connect-src 'self' https://widgets.hypo.tech;
           img-src     'self' https://widgets.hypo.tech;

Iframe:    script-src  'self' https://widgets.hypo.tech;
           frame-src          https://widgets.hypo.tech;
```

Also allow inline styles (`style-src 'unsafe-inline'`): the widget applies the
brand colours as an inline style. A `default-src` that includes
`https://widgets.hypo.tech` covers all directives at once.

Two failures are easy to misread:

- **Embedded:** without `connect-src` the shell renders but stays without data. The console reports it.
- **Iframe:** a missing `frame-src` produces **no console entry at all**. The frame stays empty and the widget shows its loading state.

Preview deployments answer with `X-Frame-Options: DENY` and cannot be embedded.
Use the production endpoint.

## Origin allowlist

For the iframe integration, send hypo.tech the exact origin of every
environment. No wildcards, no paths:

```text
https://www.partner.de
https://staging.partner.de
```

Any change to scheme, host or port needs a new approval. The embedded
integration does not use this allowlist — there, your own CSP decides.

## Credentials

No API key, no access token.

## Reporting

Use [GitHub private vulnerability reporting](https://github.com/hypotech-gmbh/hypotech-widget-integration/security/advisories/new). Never include real financial data.
