# Sicherheit und Datenschutz

## Datenverarbeitung im Widget

Die aktuelle Widget-Version verarbeitet eingegebene Orientierungswerte im Browser. Alter, Einkommen, Eigenkapital und Vermögen werden weder an die einbettende Seite gesendet noch in Adressparametern erwartet.

Die persönliche Prüfung auf hypo.tech ist ein getrennter, ausdrücklich gekennzeichneter Vorgang. Beim Wechsel gelten die dort ausgewiesenen Datenschutzinformationen.

## Vorgaben für Partnerseiten

- Keine persönlichen Angaben in der iframe-Adresse übergeben.
- Den Zielursprung jeder `postMessage`-Nachricht genau angeben.
- Bei empfangenen Nachrichten `event.origin` und `event.source` prüfen.
- Das dokumentierte `sandbox`-Attribut verwenden.
- Das Widget ausschließlich über die veröffentlichte HTTPS-Adresse laden.
- Keine Skripte verwenden, die versuchen, Inhalte des iframe auszulesen.

## Domainfreigabe

Das Widget wird mit einer `Content-Security-Policy` ausgeliefert. `frame-ancestors` erlaubt nur ausdrücklich freigegebene Ursprünge. Eine nicht freigegebene Seite kann das Widget deshalb nicht darstellen.

Für jede Umgebung wird der genaue Ursprung benötigt:

```text
https://www.partner.de
https://staging.partner.de
```

Freigaben mit Platzhaltern oder vollständige Pfade werden nicht verwendet.

## Zugangsdaten

Für die iframe-Einbindung ist kein API-Schlüssel und kein Zugriffstoken erforderlich. Hinterlegen Sie deshalb keine Zugangsdaten im HTML, in Adressparametern oder in öffentlich einsehbaren JavaScript-Dateien.

## Sicherheitsmeldungen

Sicherheitslücken dürfen nicht als öffentliches Issue gemeldet werden. Nutzen Sie die privaten GitHub-Sicherheitsmeldungen dieser Ablage und verwenden Sie ausschließlich erfundene Testwerte.
