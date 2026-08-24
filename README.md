# hypo.tech Finanzierungswidget – Partnerintegration

Öffentliche Integrationsdokumentation für Partner, Projektentwickler und betreuende Internetagenturen.

Diese Ablage enthält ausschließlich:

- die öffentliche Einbindungsschnittstelle,
- kopierbare Beispiele,
- die Nachrichten- und Konfigurationsverträge,
- Hinweise zu Sicherheit, Datenschutz und Inbetriebnahme.

Die Implementierung des Widgets, interne Berechnungslogik, nicht veröffentlichte Projekte und betriebliche Konfigurationen sind **nicht** Bestandteil dieser Ablage.

## Schnellstart

```html
<div id="finanzierungsorientierung"></div>

<script src="https://hypotech-widget.vercel.app/v1/embed.js"></script>
<script>
  HypotechWidget.mount('#finanzierungsorientierung', {
    project: 'schoenauer-weg',
    partner: 'heim-leben',
    unit: 7,
    parking: 'hub',
    household: 'joint',
  })
</script>
```

Die Internetadresse der einbettenden Seite muss vorab von hypo.tech freigegeben werden. Für die Freigabe werden ausschließlich vollständige Ursprünge benötigt, beispielsweise:

```text
https://www.partner.de
https://staging.partner.de
```

## Dokumentation

- [Einbindung und Konfiguration](docs/integration.md)
- [Nachrichtenvertrag](docs/messages.md)
- [Sicherheit und Datenschutz](docs/security-and-privacy.md)
- [Inbetriebnahme](docs/onboarding.md)
- [Fehlerbehebung](docs/troubleshooting.md)
- [Typdefinitionen](types/hypotech-widget.d.ts)

## Ausführbare Beispiele

- [Direkte iframe-Einbindung](examples/basic-iframe.html)
- [Einbindung mit dem Helferskript](examples/helper-script.html)
- [Dynamischer Wechsel der Wohneinheit](examples/dynamic-unit-selection.html)

## Öffentliche Endpunkte

| Zweck | Adresse |
| --- | --- |
| Beispielprojektseite | <https://hypotech-widget.vercel.app> |
| Widget, API-Version 1 | <https://hypotech-widget.vercel.app/v1/widget/heim-leben/?project=schoenauer-weg> |
| Helferskript | <https://hypotech-widget.vercel.app/v1/embed.js> |
| Versionsinformation | <https://hypotech-widget.vercel.app/v1/release.json> |

## Wichtige Datengrenze

Alter, Einkommen, Eigenkapital, Vermögen oder andere persönliche Angaben dürfen niemals als Adressparameter übergeben werden. Das Widget sendet diese Eingaben auch nicht an die einbettende Seite.

Zulässige unpersönliche Startparameter sind `project`, `unit`, `parking` und `household`.

## Unterstützung

Allgemeine Integrationsfragen können als GitHub-Issue gestellt werden. Bitte veröffentlichen Sie dabei keine persönlichen Daten, Zugangsdaten, Vertragsinhalte oder vertraulichen Projektinformationen.

Sicherheitsrelevante Hinweise bitte ausschließlich über eine [private GitHub-Sicherheitsmeldung](../../security/advisories/new) übermitteln.

## Lizenz

Die Beispielimplementierungen und Typdefinitionen stehen unter der [MIT-Lizenz](LICENSE). Namen, Marken und Logos von hypo.tech oder Partnern werden dadurch nicht zur anderweitigen Nutzung freigegeben.
