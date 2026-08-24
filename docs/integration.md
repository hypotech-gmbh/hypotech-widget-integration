# Einbindung und Konfiguration

## Voraussetzungen

1. Sie besitzen die Projekt- und Partnerkennung von hypo.tech.
2. Die vollständigen Ursprünge Ihrer Produktiv- und Testseiten wurden von hypo.tech freigegeben.
3. Die Seite wird über HTTPS ausgeliefert.

Ein Ursprung besteht aus Protokoll, Hostname und gegebenenfalls Port. Pfade gehören nicht dazu.

## Empfohlene Einbindung

```html
<div id="finanzierungsorientierung"></div>

<script src="https://hypotech-widget.vercel.app/v1/embed.js"></script>
<script>
  const widget = HypotechWidget.mount('#finanzierungsorientierung', {
    project: 'schoenauer-weg',
    partner: 'heim-leben',
    unit: 7,
    parking: 'hub',
    household: 'joint',
  })
</script>
```

Das Helferskript erstellt das iframe, prüft eingehende Nachrichten und passt die Höhe automatisch an.

## Direkte iframe-Einbindung

```html
<iframe
  id="hypotech-financing-widget"
  src="https://hypotech-widget.vercel.app/v1/widget/heim-leben/?project=schoenauer-weg&unit=7&parking=hub&household=joint"
  title="Unverbindliche Finanzierungsorientierung von hypo.tech"
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin"
  sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
  style="display:block;width:100%;min-height:560px;border:0;background:transparent"
></iframe>
```

Die Attribute `referrerpolicy` und `sandbox` sollten unverändert übernommen werden.

## Unpersönliche Startparameter

| Parameter | Beispiel | Bedeutung |
| --- | --- | --- |
| `project` | `schoenauer-weg` | von hypo.tech veröffentlichte Projektkennung |
| `unit` | `7` | anfänglich ausgewählte Wohneinheit |
| `parking` | `hub` | anfängliche Stellplatzvariante |
| `household` | `single` oder `joint` | alleinige oder gemeinsame Finanzierung |

Andere Parameter werden nicht unterstützt. Persönliche oder finanzielle Angaben dürfen niemals Bestandteil der Adresse sein.

## Nachträgliche Änderung

Die mit `mount` zurückgegebene Instanz kann unpersönliche Einstellungen ändern:

```js
widget.configure({
  unit: 4,
  parking: 'single',
  household: 'joint',
})
```

## Abbau des Widgets

Bei Einzelseitenanwendungen kann die Einbindung beim Verlassen einer Ansicht entfernt werden:

```js
widget.destroy()
```

Dadurch werden iframe und Nachrichtenüberwachung entfernt.
