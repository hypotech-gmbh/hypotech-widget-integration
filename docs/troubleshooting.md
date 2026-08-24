# Fehlerbehebung

## Das Widget bleibt leer oder der Browser verweigert die Darstellung

Wahrscheinlich ist der Ursprung der einbettenden Seite noch nicht freigegeben. Prüfen Sie in der Entwicklerkonsole auf einen Hinweis zu `Content-Security-Policy` oder `frame-ancestors` und senden Sie hypo.tech den vollständigen Ursprung.

## Das Widget besitzt eine innere Bildlaufleiste

Verwenden Sie das öffentliche Helferskript oder verarbeiten Sie `resize`-Nachrichten. Prüfen Sie dabei Ursprung und Fensterquelle wie im [Nachrichtenvertrag](messages.md) beschrieben.

## Die ausgewählte Wohneinheit stimmt nicht

Prüfen Sie, ob `unit` eine im Projekt veröffentlichte numerische Kennung enthält. Nicht vorhandene Werte werden durch die voreingestellte Wohneinheit ersetzt.

## Eine Konfigurationsnachricht wird ignoriert

Prüfen Sie:

1. Die Nachricht stammt vom Fenster der einbettenden Seite.
2. Der Ursprung ist von hypo.tech freigegeben.
3. `source` lautet `hypotech-host`.
4. `type` lautet `configure`.
5. Es werden ausschließlich `unit`, `unitId`, `parking` oder `household` verwendet.

## Das Helferskript ist nicht verfügbar

Prüfen Sie, ob die Content-Security-Policy Ihrer Seite Skripte von `https://hypotech-widget.vercel.app` erlaubt. Bei restriktiven Richtlinien muss dieser Ursprung in `script-src` aufgenommen werden.

## Meldung eines Problems

Ein öffentliches Issue darf nur technische, unpersönliche Angaben enthalten. Entfernen Sie Bildschirmfotos mit persönlichen Daten, Zugangsdaten, unveröffentlichten Projektinformationen oder internen Adressen.
