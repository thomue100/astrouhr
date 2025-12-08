# CONTRIBUTING.md

## Ziel
Dieses Dokument legt die Richtlinien fest, die beim Beitrag zur Codebasis einzuhalten sind, damit die Anwendung produktionsreif, sicher und wartbar bleibt.

## Richtlinienübersicht
- Codequalität: Nutze statische Analyse, Formatierung und Unit-Tests bei jedem Pull Request (PR).
- CI/CD: Jede Änderung muss durch eine automatisierte Pipeline (Build → Test → Analyse) laufen.
- Branching: Verwendet `master` für Production-Hotfixes und `develop` oder feature-Branches für Änderungen.
- Pull Requests: Kleine, beschreibbare PRs; mindestens ein Reviewer; automatisierte Checks müssen erfolgreich sein.

## Code Style & Formatierung
- Halte dich an `.editorconfig` im Repository (wird bei Bedarf erstellt).
- Nutze `dotnet format` vor dem Commit oder aktiviere __Code Cleanup__ in Visual Studio.
- Aktiviere Nullable-Referenztypen (`<Nullable>enable</Nullable>`) in Projekten.
- Verwende konsistente Namenskonventionen (PascalCase für Typen und Methoden, camelCase für Parameter/Privatfelder mit `_`-Prefix falls gewünscht).

## Analyse & Qualitätssicherung
- Aktiviere Roslyn-Analyzers und Microsoft.CodeAnalysis-Fixes.
- Build-Fehler und Warnungen sollen in CI als Fehler behandelt werden (`TreatWarningsAsErrors` für Release-Builds).
- Verwende Code-Coverage-Messung (z. B. Coverlet) und definiere Minimalgrenzen für neue Features.

## Testing
- Unit-Tests mit xUnit/NUnit oder MSTest; Integrationstests für kritische Pfade.
- Tests müssen deterministisch, schnell und unabhängig sein.
- Testdaten: Nutze Mocks/Stubs und getrennte Testdatenbanken für Integrationstests.

## Security
- Secrets dürfen nicht im Repository liegen; nutze Geheimnisspeicher (z. B. Azure Key Vault, GitHub Secrets).
- Scanne Abhängigkeiten regelmäßig (Dependabot, OWASP Dependency-Check, Snyk).
- Führe statische Sicherheitsanalyse und SAST-Scans in CI durch.

## Releases & Versionierung
- Semantic Versioning (SemVer) verwenden.
- Erstelle Release-Notes automatisiert (z. B. mit GitHub Releases oder Azure DevOps).
- Automatisierte Releases durch die CI/CD-Pipeline für `master`-Tags.

## Infrastruktur & Deployment
- Infrastruktur als Code (IaC) verwenden (Bicep, ARM, Terraform) und in CI prüfen.
- Containerize-Anwendungen mit Multi-Stage Docker-Builds.
- Health-Checks, Liveness/Readiness und Metriken (OpenTelemetry) implementieren.

## Monitoring & Observability
- Logs strukturiert erfassen (Serilog, OpenTelemetry) und zentral sammeln.
- Telemetrie/Traces für kritische Pfade instrumentieren.

## Commit- und PR-Standards
- Schreibe klare Commit-Messages (z. B. Conventional Commits).
- PR-Beschreibungen: Zweck, Änderungen, Testanweisungen, Risiken.

## Onboarding & Dokumentation
- Ergänze README mit lokalen Run-Schritten, Build-, Test- und Release-Anleitungen.
- Dokumentiere Konfigurationsschlüssel und Umgebungsvariablen.

## Werkzeug-Empfehlungen
- Visual Studio: __Code Cleanup__, __Analyze > Run Code Analysis__, __Publish__-Profile konfigurieren.
- Locally: `dotnet tool install -g dotnet-format`; `dotnet format` in Pre-Commit hook.

## Checkliste vor Merge in `master`
- [ ] Alle CI-Prüfungen erfolgreich
- [ ] Unit- und Integrationstests bestanden
- [ ] Code-Analyse-Warnungen behandelt
- [ ] Security- und Dependency-Scans grün
- [ ] Release-Notes / Changelog aktualisiert

## Kontakt
Bei Unsicherheiten: Erstelle ein Issue oder kontaktiere das Maintainer-Team über die Repo-Administratoren.