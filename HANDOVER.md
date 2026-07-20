# HANDOVER — reisen.danicek.at

## Letzte große Änderung
Zusammenführung der Reise-Repos `london.danicek.at`, `china.danicek.at` und `zypern.danicek.at` in ein gemeinsames Portal unter `reisen.danicek.at`.

## Struktur
- `index.html` – Portal mit Kacheln für alle Reisen
- `london/`, `barcelona/`, `sicily/`, `vilnius/` – Bestehende Reisen
- `china/` – Neu: Guangzhou & Shenzhen 2026
- `zypern/` – Neu: Zypern 2025/26 (vergangene Reise)
- `css/style.css`, `js/main.js` – Gemeinsame Assets

## Wichtige Regeln
1. **Keine Buchungscodes/PNRs im Klartext**
2. **HTTPS-First:** Keine `http://` Ressourcen einbinden
3. Service Worker wird über `/sw.js` registriert
4. Jede Reise hat ein eigenes `data-trip-id` für Checklisten-Persistenz

## Offene Tasks
- [ ] GitHub-Repository `london.danicek.at` → `reisen.danicek.at` umbenennen
- [ ] Alte Repos (`china.danicek.at`, `zypern.danicek.at`, `london.danicek.at`) löschen
- [ ] Smoke-Test nach Deploy
