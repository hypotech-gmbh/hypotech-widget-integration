# hypo.tech Widget Integration

Public developer documentation and examples for the hypo.tech financing widget.

- [Documentation](https://hypotech-widget-integration.vercel.app/docs/)
- [Quickstart](https://hypotech-widget-integration.vercel.app/docs/integration)
- [Live example](https://hypotech-widget-integration.vercel.app/docs/examples/helper-script.html)

## Quickstart

```html
<div id="financing-widget"></div>

<script src="https://hypotech-widget.vercel.app/v1/embed.js"></script>
<script>
  HypotechWidget.mount('#financing-widget', {
    project: 'schoenauer-weg',
    partner: 'heim-leben',
    unit: 7,
    parking: 'hub',
    household: 'joint',
  })
</script>
```

The host origin must be approved by hypo.tech. No API key is required. Never put personal or financial data in the iframe URL.

## Local development

```bash
npm install
npm run docs:dev
```

The site uses [VitePress](https://vitepress.dev/) and builds below `/docs/`.

## Public scope

This repository contains only the public integration contract, examples and TypeScript definitions. Widget source code, calculation logic, unpublished project data and operational configuration remain private.

## Support

- [Integration issue](https://github.com/hypotech-gmbh/hypotech-widget-integration/issues/new/choose)
- [Private security report](https://github.com/hypotech-gmbh/hypotech-widget-integration/security/advisories/new)

Examples and TypeScript definitions are available under the [MIT License](LICENSE). Brand names and logos are not licensed for reuse.
