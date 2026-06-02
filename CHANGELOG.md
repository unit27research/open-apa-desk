# Changelog

All notable project changes will be tracked here.

## 0.1.0-alpha.0 - 2026-06-01

Initial alpha package for copied-template testing.

### Added

- Google Docs Editor Add-on scaffold with TypeScript and `clasp`.
- Controlled APA 7 student-paper setup for title/body starter sections.
- Reference management for journal articles, books, book chapters, websites,
  and reports.
- DOI lookup through Crossref with editable metadata before saving.
- Parenthetical, narrative, locator, and grouped citation insertion.
- Controlled References rebuild.
- Companion Google Sheet reference library.
- `Prepare Current Copy` marker-removal workflow for copied submission Docs.
- Marketplace-readiness docs, privacy note, terms, security policy, and
  branding assets.
- GitHub Actions verification workflow and issue/PR templates.

### Changed

- Removed automatic Google Drive copy creation from the active build to avoid
  full Drive scope.
- Apps Script manifest now uses current-document Docs access instead of full
  Docs plus Drive access.

### Known Gaps

- Reduced-scope OAuth flow still needs a human live smoke test.
- Public GitHub upload is blocked until `gh` is re-authenticated.
- Marketplace submission still needs public privacy/terms URLs, public branding
  asset URLs, Crossref contact email, standard Google Cloud project, Apps
  Script version, screenshots, and SDK configuration.
