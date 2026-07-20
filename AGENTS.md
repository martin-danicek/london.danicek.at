# reisen.danicek.at – Reiseportal

Ein statisches Multi-Reise-Portal unter `reisen.danicek.at`. Ursprünglich als `london.danicek.at` gestartet, dienen nun alle Reisen unter einer gemeinsamen Domain.

## Projektübersicht

Dies ist eine **rein statische HTML-Website** als digitaler Reisebegleiter für Reisen von Martin & Markus (und Mitreisenden). Jede Reise hat eine eigene Unterseite im einheitlichen Portal-Design.

**Sprache:** Deutsch (gesamter Inhalt ist auf Deutsch)  
**Domain:** reisen.danicek.at (konfiguriert in `CNAME`)  
**Hosting:** Statisch (GitHub Pages)

## Technologie-Stack

| Komponente | Technologie |
|------------|-------------|
| Struktur | HTML5 (pro Reise eine Single-Page-Datei) |
| Styling | CSS3 mit CSS Custom Properties |
| Logik | Vanilla JavaScript (ES6) |
| Schriften | Google Fonts (Cormorant Garamond, Inter, Playfair Display) |
| Bilder | Externe Unsplash-URLs + lokale Bilder pro Reise |
| Karten | OpenStreetMap Embed-Frames |
| Hosting | Statisch (GitHub Pages) |

**Keine Build-Tools, keine Package-Manager, keine Abhängigkeiten.**

## Projektstruktur

```
.
├── index.html              # Portal-Startseite mit Kacheln für alle Reisen
├── manifest.json           # PWA-Manifest
├── sw.js                   # Service Worker für Offline-Unterstützung
├── CNAME                   # Domain-Konfiguration (reisen.danicek.at)
├── AGENTS.md               # Diese Datei
├── css/
│   └── style.css           # Gemeinsames Stylesheet
├── js/
│   └── main.js             # Gemeinsame Navigation, Checkliste, Countdown
├── london/
│   └── index.html          # London & Oxford 2026
├── barcelona/
│   └── index.html          # Barcelona 2026
├── sicily/
│   └── index.html          # Sizilien Roadtrip 2026
├── vilnius/
│   └── index.html          # Vilnius & Riga 2026
├── china/
│   ├── index.html          # China 2026 (Guangzhou & Shenzhen)
│   └── images/             # Lokale Bilder für China
└── zypern/
    ├── index.html          # Zypern 2025/26 (vergangene Reise)
    └── images/             # Lokale Bilder für Zypern
```

## Architektur

### Einheitliches Portal-Design

Jede Reise folgt dem gleichen Template:
- Parallax-Hero mit reisespezifischem Hintergrundbild
- Tab-basierte Navigation (`plan`, `hotels`, `restaurants`, `checklist`, optional `info`/`praktisch`/`backup`/`impressum`)
- Day-Cards mit Timeline für den Tagesplan
- Restaurant-Cards
- Interaktive Checkliste mit `localStorage`-Persistenz (pro `data-trip-id`)
- Countdown/Live-Modus für kommende Reisen; vergangene Reisen zeigen ein Badge

### CSS-Architektur

Gemeinsame Variablen in `css/style.css`, reisespezifische Overrides im `<style>`-Block jeder `index.html`:
```css
:root {
    --theme-primary: #...;
    --theme-primary-light: #...;
    --theme-accent: #C9A962;
    --theme-secondary: #...;
    --hero-url: url('...');
}
```

### JavaScript-Features

Siehe `js/main.js`:
- `showSection(sectionId, btn)` – Tab-Wechsel
- `handleHash()` – Deep-Linking
- Checklisten-Persistenz pro `data-trip-id`
- Countdown & Live-Modus
- Timeline-Animationen via `IntersectionObserver`

## Neue Reise hinzufügen

1. Neuen Ordner `reiseziel/` anlegen
2. `index.html` aus einer bestehenden Reise kopieren und anpassen
3. Reisespezifische `:root`-Variablen setzen (Farben, Hero-Bild)
4. `body data-trip-id="reiseziel2026"` setzen
5. Inhalte in Sections füllen (`#plan`, `#hotels`, `#restaurants`, `#checklist`, optional weitere)
6. Kachel in `index.html` (Root) ergänzen
7. Bilder lokal in `reiseziel/images/` ablegen oder Unsplash-URLs verwenden

## Deployment

1. Änderungen committen
2. Auf `main`-Branch pushen
3. GitHub Pages aktualisiert die Seite automatisch

## Sicherheitsaspekte

- Kein Backend, keine Datenbank
- Keine personenbezogenen Daten von Besuchern
- Checklisten-Status bleibt im lokalen Browser-Speicher

---

*Letzte Aktualisierung: Juli 2026*
