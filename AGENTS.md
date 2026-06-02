# London & Oxford 2026 – Reiseplaner Website

Eine statische Single-Page-Website zur Planung und Organisation einer 4-tägigen Reise nach London und Oxford (30. April – 3. Mai 2026).

## Projektübersicht

Dies ist eine **rein statische HTML-Website** für drei Reisende (Martin & Markus). Die Seite dient als digitaler Reisebegleiter mit tagesgenauem Programm, Restaurantkontakten, interaktiven Checklisten und Backup-Plänen.

**Sprache:** Deutsch (gesamter Inhalt ist auf Deutsch)  
**Domain:** reisen.danicek.at (konfiguriert in `CNAME`)  
**Zielzeitraum:** 30. April – 3. Mai 2026  
**Hosting:** Statisch (GitHub Pages oder ähnlich)

## Technologie-Stack

| Komponente | Technologie |
|------------|-------------|
| Struktur | HTML5 (Single File) |
| Styling | CSS3 mit CSS Custom Properties |
| Logik | Vanilla JavaScript (ES6) |
| Schriften | Google Fonts (Cormorant Garamond, Inter, Playfair Display) |
| Bilder | Externe Unsplash-URLs (hot-linked) |
| Karten | OpenStreetMap Embed-Frames |
| Hosting | Statisch (GitHub Pages) |

**Keine Build-Tools, keine Package-Manager, keine Abhängigkeiten.**

## Projektstruktur

```
.
├── index.html          # Komplette Website (HTML + CSS + JS) ~2360 Zeilen
├── manifest.json       # PWA-Manifest
├── sw.js               # Service Worker für Offline-Unterstützung
├── CNAME               # Domain-Konfiguration (reisen.danicek.at)
├── CLAUDE.md           # Projekt-spezifische Agent-Anweisungen (graphify)
├── .gitignore          # Git-Ignore (nur .dropbox.attr)
└── AGENTS.md           # Diese Datei
```

Die gesamte Anwendung befindet sich in einer einzigen `index.html`:
- **Zeilen 11–1248:** CSS-Styles im `<style>`-Block
- **Zeilen 1250–2140:** HTML-Inhalt
- **Zeilen 2142–2360:** JavaScript im `<script>`-Block

## Architektur

### 1. Layout-Sektionen (Tab-basierte SPA-Navigation)

Die Seite verwendet ein tab-basiertes Navigationssystem:

| Sektion | ID | Beschreibung |
|---------|-----|-------------|
| Tagesplan | `#plan` | Tagesgenaues Programm (Standard) |
| Restaurants | `#restaurants` | Alle Restaurantkontakte und Links |
| Checkliste | `#checklist` | Interaktive To-Do- und Packlisten |
| Backup | `#backup` | Alternativpläne und nützliche Links |

**Navigation:** `showSection(sectionId, btn)` schaltet Sichtbarkeit, aktualisiert aktive Buttons und scrollt sanft zum Navigationsbereich. Beim Wechsel werden Timeline-Animationen neu getriggert.

**Deep-Linking:**
```javascript
function showSection(sectionId, btn, skipHistory)
function handleHash()
```
- URL-Hash wird beim Tab-Wechsel aktualisiert (`#plan`, `#restaurants`, `#checklist`, `#backup`)
- Direkte Links auf einzelne Tabs möglich
- Browser-Zurück/-Vorwärts funktioniert zwischen Tabs
- `popstate`-Event-Listener für History-Navigation

### 2. CSS-Architektur

**Farbpalette – British Royal Theme:**
```css
--royal-navy: #0A1628;          /* Primäre dunkle Farbe */
--royal-navy-light: #1A2A42;    /* Sekundäre dunkle Farbe */
--royal-gold: #C9A962;          /* Akzentfarbe Gold */
--burgundy: #722F37;            /* Akzentfarbe Burgund */
--cream: #FAF7F0;               /* Hintergrund */
--warm-white: #FEFCF8;          /* Karten-Hintergrund */
--charcoal: #1F1F1F;            /* Überschriften */
--text-primary: #2D3748;        /* Fließtext */
--text-secondary: #5A6578;      /* Sekundärer Text */
--text-muted: #8B95A5;          /* Gedämpfter Text */
```

**Wichtige CSS-Patterns:**
- **BEM-ähnliche Namensgebung:** `.day-card`, `.timeline-item`, `.checklist-text`
- **Utility-Klassen:** `.tag`, `.btn`, `.priority.high`, `.text-center`, `.mt-2`, `.mb-2`
- **Responsive Breakpoints:** 768px (Tablet), 480px (Mobile)
- **Druck-Styles:** `@media print` blendet Navigation und Hero-Bilder aus
- **Glassmorphism:** Navigation mit `backdrop-filter: blur(20px)`
- **Parallax-Hero:** Header mit animiertem Hintergrundmuster und Parallax-Effekt
- **Reduced Motion:** `@media (prefers-reduced-motion: reduce)` deaktiviert Animationen
- **Live-Mode:** `.current-day` (Gold-Rahmen), `.live-badge` (pulsierendes "Heute"), `.trip-status` (Statusbanner)

### 3. JavaScript-Features

**Navigation:**
```javascript
function showSection(sectionId, btn)
```
- Wechselt sichtbare Sektion
- Aktualisiert aktiven Navigations-Button
- Sanftes Scrollen zur Navigation
- Re-triggert Timeline-Animationen via `IntersectionObserver`

**Checklisten-Persistenz:**
```javascript
function toggleCheck(element)     // Checked-State toggeln
function saveChecklist()          // Speichert in localStorage
function loadChecklist()          // Stellt aus localStorage wieder her
```
- Key: `londonChecklist2026`
- Speichert Array von Boolean-Werten für jedes Checklisten-Element

**Countdown-Timer & Live-Modus:**
```javascript
function updateCountdown()
function highlightCurrentDay()
```
- **Vor Reise:** Countdown bis Reisebeginn (30. April 2026, 18:25 Uhr)
- **Während Reise:** Countdown bis Reiseende (03. Mai 2026, 17:15 Uhr) + Statusbanner
- **Nach Reise:** "Bis zum nächsten Abenteuer!"
- Aktualisiert sich alle 60 Sekunden
- Aktueller Tag wird mit Gold-Rahmen und rotem "Heute"-Badge hervorgehoben (`.current-day`, `.live-badge`)

**Parallax-Effekt:**
```javascript
function handleParallax()
```
- Verschiebt Hero-Bild bei Scroll um 50% der Scroll-Position

**Navbar-Scroll-Effekt:**
```javascript
function handleNavbar()
```
- Fügt Klasse `.scrolled` hinzu, wenn Scroll-Position > 100px

**Timeline-Animationen:**
```javascript
function observeTimelineItems()
```
- Nutzt `IntersectionObserver` (threshold: 0.1, rootMargin: `0px 0px -50px 0px`)
- Fügt Klasse `.visible` hinzu, wenn Element in Viewport scrollt
- Erzeugt Fade-In-Effekt mit horizontaler Verschiebung

**PWA / Offline-Support:**
```javascript
// Service Worker Registration
navigator.serviceWorker.register('sw.js')
```
- `manifest.json` für installierbare Web-App
- `sw.js` cached `index.html` für Offline-Nutzung
- Favicon als SVG-Data-URI (🇬🇧)
- Meta-Tags für iOS: `apple-mobile-web-app-capable`, `theme-color`, `apple-mobile-web-app-title`
- Open Graph Tags für Social Sharing

## Inhaltsorganisation

### Day-Card-Struktur

Jeder Tag folgt diesem Pattern:
```html
<div class="day-card">
    <div class="day-header">
        <h2 class="day-title">Tag – Aktivität</h2>
        <span class="day-date">Datum</span>
    </div>
    <div class="timeline">
        <div class="timeline-item">
            <div class="timeline-time">HH:MM</div>
            <div class="timeline-content">
                <img src="..." class="location-image" loading="lazy">
                <h3>Titel</h3>
                <p>Beschreibung</p>
                <span class="tag kategorie">Label</span>
                <a href="..." class="btn">Button-Text →</a>
            </div>
        </div>
    </div>
</div>
```

### Restaurant-Cards

```html
<div class="restaurant-card">
    <div class="restaurant-image-container">
        <img src="..." class="restaurant-image" loading="lazy">
        <div class="restaurant-image-overlay"></div>
    </div>
    <div class="restaurant-content">
        <h3 class="restaurant-name">Name</h3>
        <p class="restaurant-type">Kategorie</p>
        <div class="restaurant-details">...</div>
        <a href="..." class="btn">Reservieren</a>
    </div>
</div>
```

### Tag-System

Tags kategorisieren Aktivitäten:
- `.food` – Essen und Dining
- `.drink` – Bars, Cafés, Cocktails
- `.transport` – Flüge, Züge, ÖPNV
- `.highlight` – Besondere Empfehlungen

### Quick-Links-Bar

Im Tagesplan befindet sich oberhalb der Day-Cards eine Quick-Links-Bar mit direkten Links zu:
- TfL Journey Planner
- Trainline
- Citymapper
- BBC Weather

### Train-Info-Box

Für Zugverbindungen wird eine spezielle `.train-info`-Box verwendet mit Header, Details-Grid und SVG-Icon.

### Notfall- & Reiseinfos (Backup-Tab)

Im Backup-Tab befindet sich eine `.emergency-card` mit:
- Hotel-Adresse und Telefon
- Hin- und Rückflugdaten (BA 795 / BA 794)
- Notrufnummern: **999** (Notfall), **111** (NHS)
- Österreichische Botschaft London
- Gestaltet als `.info-grid` mit Icons

## Entwicklungsrichtlinien

### Änderungen vornehmen

1. **`index.html` direkt bearbeiten** – kein Build-Schritt nötig
2. **Lokal testen** durch Öffnen der Datei im Browser
3. **Deployen** durch Push in das Hosting-Repository

### Neuen Tag hinzufügen

1. Bestehenden `.day-card`-Block kopieren
2. `.day-title` und `.day-date` aktualisieren
3. `.timeline-item`-Elemente für jede Aktivität hinzufügen
4. Passende Tags verwenden (`.tag`, `.tag.food`, etc.)
5. Für Bilder Unsplash-URLs mit `?w=800&q=80` verwenden
6. Für Karten OpenStreetMap-Embed-URLs verwenden

### Checklisten-Items hinzufügen

1. Checklisten-Sektion (`id="checklist"`) finden
2. `.checklist-item`-Div hinzufügen:
```html
<div class="checklist-item" onclick="toggleCheck(this)">
    <div class="checkbox"></div>
    <div class="checklist-text">
        <h4>Titel</h4>
        <p>Beschreibung</p>
    </div>
    <span class="priority high">Priorität</span>
</div>
```
3. Prioritäts-Klassen: `.high`, `.medium`, `.low`

### Styling-Konventionen

- **Farben:** Immer CSS-Variablen verwenden (`var(--royal-navy)` statt `#0A1628`)
- **Abstände:** rem-Einheiten verwenden
- **Radien:** 2px–4px (subtiles Rounding)
- **Schatten:** `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-gold` verwenden
- **Transitions:** `--transition-fast`, `--transition-base`, `--transition-slow`, `--transition-bounce` verwenden
- **Schriften:** `Playfair Display` für Überschriften, `Inter` für Fließtext, `Cormorant Garamond` für Akzente

## Deployment

### Aktuelles Setup

- **Domain:** reisen.danicek.at (konfiguriert in `CNAME`)
- **Hosting:** GitHub Pages (repository-basiert)
- **SSL:** Automatisch (bei GitHub Pages)

### Deployment-Schritte

1. Änderungen committen
2. Auf main/master-Branch pushen
3. Änderungen sind innerhalb weniger Minuten live

Keine CI/CD-Pipeline, keine Build-Artefakte zu generieren.

## Browser-Kompatibilität

Zielt auf moderne Browser ab mit:
- CSS Grid (`display: grid`)
- CSS Custom Properties
- ES6 JavaScript
- `localStorage` API
- `IntersectionObserver` API
- `backdrop-filter` (Glassmorphism)
- Service Worker API (Offline-Support)

Getestet/unterstützt:
- Chrome/Edge (aktuell)
- Firefox (aktuell)
- Safari (aktuell)
- Mobile Browser (iOS Safari, Chrome Android)

## Test-Checkliste

Vor dem Committen:
- [ ] Seite lädt ohne Konsolen-Fehler
- [ ] Navigations-Tabs funktionieren korrekt
- [ ] Checklisten-Items lassen sich abhaken und persistieren (localStorage testen)
- [ ] Countdown wird korrekt angezeigt
- [ ] Responsive Layout funktioniert auf Mobile (320px+)
- [ ] Druckvorschau zeigt alle Sektionen an
- [ ] Externe Bilder laden (Unsplash-URLs valide)
- [ ] Alle Restaurant-Reservierungslinks funktionieren
- [ ] Parallax-Effekt im Hero funktioniert
- [ ] Timeline-Animationen beim Scrollen sichtbar
- [ ] Deep-Linking funktioniert (URL-Hash ändert sich beim Tab-Wechsel)
- [ ] Service Worker registriert sich (DevTools → Application → Service Workers)
- [ ] Offline: Seite lädt ohne Netzwerk (DevTools → Network → Offline)
- [ ] Live-Badge erscheint am aktuellen Tag (Datum simulieren zum Testen)
- [ ] `prefers-reduced-motion` deaktiviert Animationen (Systemeinstellung testen)

## Sicherheitsaspekte

- **Keine Benutzereingabe** – gesamter Inhalt ist statisch
- **Kein Backend** – keine Datenbank oder serverseitiger Code
- **Externe Ressourcen:** Google Fonts, Unsplash-Bilder und OpenStreetMap-Embed (alle HTTPS)
- **localStorage:** Speichert nur Checklisten-Status, keine sensiblen Daten

## Externe Abhängigkeiten

| Ressource | URL | Zweck |
|-----------|-----|-------|
| Google Fonts | fonts.googleapis.com | Cormorant Garamond, Inter, Playfair Display |
| Unsplash | images.unsplash.com | Standortfotos |
| OpenStreetMap | openstreetmap.org | Eingebettete Karten |

Alle externen Ressourcen verwenden HTTPS und benötigen keine Authentifizierung.

## Wichtige Daten & Zeiten

| Event | Datum/Uhrzeit | Ort |
|-------|---------------|-----|
| Ankunft | 30. April 2026, 18:25 | London Heathrow (BA 795) |
| Hotel Check-in | 30. April 2026, ~21:00 | The Z Hotel Victoria |
| Mamma Mia Musical | 1. Mai 2026, 19:30 | Novello Theatre |
| Oxford Tagesausflug | 2. Mai 2026 | Christ Church, Punting |
| Abreise | 3. Mai 2026, 17:15 | London Heathrow (BA 794) |

## Agent-spezifische Hinweise

### graphify (aus `CLAUDE.md`)

Im Projekt existiert ein `graphify-out/`-Verzeichnis mit Knowledge-Graph-Ausgaben. **Vor jeder Codebase-Frage / Architektur-Analyse / Debugging:** `graphify-out/GRAPH_REPORT.md` lesen. Für gezielte Fragen kann `/graphify query "<frage>"` verwendet werden. Nach Code-Änderungen in einer Session `graphify update .` ausführen (AST-only, kein LLM-Cost).

---

*Letzte Aktualisierung: April 2026*
