# Changelog

## 1.4.0 – 2026-09-14

- Documentation restructured around the embedded integration, which is now the recommended way on every page
- Merged the separate embedded and events pages into the integration page; the old URLs redirect
- Trimmed security, go-live and troubleshooting to the essentials; troubleshooting is a symptom table
- Added an embedded example and removed two redundant iframe examples
- The documentation site now allows the widget's origin in `connect-src` and `img-src`, so its own examples can run the embedded integration

## 1.3.0 – 2026-09-14

- Documented the separation between partners: one path per partner, only approved combinations in a delivery
- Samples use neutral placeholders instead of a specific partner configuration

## 1.2.1 – 2026-09-13

- The call to action is a crawlable link to the financing page, qualified with nofollow
- Documented the unpersonal `source` attribution parameter

## 1.2.0 – 2026-09-13

- Embedded integration: the widget renders in the page flow instead of an iframe
- Corrected content security directives for both integrations
- Documented the widget's own column layout and how to place it
- Documented the cases in which no rate is shown

## 1.1.0 – 2026-09-13

- Document what the widget shows: reference date, loan-to-value ratio, equity share and repayment term
- Document the cases in which the widget deliberately withholds a rate
- Document the `script-src` and `frame-src` directives the embedding page must allow
- Document preview deployments as non-embeddable and the silent "Loading widget…" state

## 1.0.0 – 2026-08-24

- First public integration documentation
- Direct iframe and helper-script examples
- Message contract for `ready`, `resize` and `unit-change`
- Security, privacy and rollout guidance
- Runnable examples and TypeScript definitions
