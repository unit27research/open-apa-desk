# Release Checklist

Date: 2026-06-02

Use this checklist before tagging or submitting Open APA Desk.

## Local Release Gate

- [ ] `git status --short` is clean.
- [ ] `npm ci` works from a fresh checkout.
- [ ] `npm run verify` passes.
- [ ] `npm run build:check` passes after `npm run build`.
- [ ] `npm run release:check` passes inside `npm run verify`.
- [ ] `npm run marketplace:drafts:check` passes before Marketplace submission.
- [ ] `npm run publish:archive` creates a tracked-file-only public repo archive.
- [ ] `npm run upload:preflight` passes before Marketplace submission.
- [ ] Release preflight validates public repo docs, package metadata, GitHub
  workflows/templates, source-scope guardrails, and untracked local deployment
  files.
- [ ] Release preflight validates Marketplace branding dimensions and warns if
  alpha screenshots are not final Marketplace screenshot sizes.
- [ ] Release preflight validates sidebar review UX guardrails.
- [ ] Release preflight validates DOI lookup has a project contact mailto and
  blocks malformed or placeholder `CROSSREF_MAILTO` overrides before external
  requests.
- [ ] `npm run assets:brand` leaves no asset diff.
- [ ] `npm run site:build` leaves no site diff.
- [ ] `src/appsscript.json` uses only intended OAuth scopes.
- [ ] Marketplace V0 requests `drive.file` only for APA starter-template copy
  creation and does not request full Google Drive or Google Sheets scope.
- [ ] Alpha screenshot assets exist under `assets/screenshots/`.
- [ ] `.clasp.json`, `dist/`, and `node_modules/` are not tracked.

## GitHub Release Gate

- [ ] `gh auth status` is valid.
- [ ] Public repo exists.
- [ ] `main` is pushed.
- [ ] GitHub Pages workflow publishes `site/`.
- [ ] GitHub Actions `Verify` workflow passes on `main`.
- [ ] README, Privacy, Terms, Security, Contributing, and License render.
- [ ] PNG branding assets render in GitHub.
- [ ] GitHub Issues are enabled.

## Alpha Template Gate

- [ ] Current build is pushed to the alpha template Apps Script project.
- [ ] `npm run smoke:evidence` creates ignored `private/` evidence storage
  before live testing.
- [ ] Template menu shows `Prepare Current Copy`.
- [ ] Sidebar opens after reduced-scope OAuth authorization.
- [ ] Crossref uses the public project contact fallback or a real
  `CROSSREF_MAILTO` override.
- [ ] `Check DOI Setup` reports DOI lookup is configured.
- [ ] Smoke target starts from a prepared APA template or otherwise already has
  dynamic Google Docs page numbers.
- [ ] Page number `1` is visually confirmed in the template header.
- [ ] Page number `1` remains visible after `Setup APA Paper`.
- [ ] A later page shows the next page number, not a repeated static `1`.
- [ ] Copied-template smoke pass completes.
- [ ] Copied-template smoke pass uses public-safe fixture values from
  `docs/SMOKE_TEST_FIXTURES.md`.
- [ ] PDF and DOCX exports contain no `[[OPEN_APA_DESK` markers.
- [ ] `npm run smoke:exports` passes against the private PDF/DOCX exports.
- [ ] `npm run smoke:evidence:check` passes against the completed private
  final smoke evidence file.
- [ ] `npm run submission:preflight -- private/smoke-evidence/YYYY-MM-DD-final-smoke.md`
  passes after exports and evidence are complete.

## Marketplace Gate

- [ ] Launch submission packet is current:
  `docs/LAUNCH_SUBMISSION_PACKET.md`.
- [ ] Google console runbook is current:
  `docs/GOOGLE_CONSOLE_RUNBOOK.md`.
- [ ] Public `PRIVACY.md` URL is available.
- [ ] Public `TERMS.md` URL is available.
- [ ] Public `open-apa-desk-icon-128.png` URL is available.
- [ ] `src/appsscript.json` `logoUrl` uses the public Open APA Desk icon URL.
- [ ] Standard Google Cloud project is linked to the Apps Script project.
- [ ] OAuth consent screen is configured.
- [ ] OAuth consent audience/user type is `External`, and publishing status is
  not `Testing` if Google requires production status for review.
- [x] Post-Pages Apps Script version is created for the alpha template.
- [ ] Marketplace SDK app configuration is complete.
- [ ] Final store screenshots are captured or selected.
- [ ] Final screenshots are sanitized and contain no private Google Doc URLs,
  account details, or private student data.
- [ ] Final store screenshots are `1280 x 800`, `640 x 400`, or
  `2560 x 1600`.
- [ ] `npm run marketplace:assets:final` passes after final screenshots are
  captured.
- [ ] OAuth consent draft is copied into Google Cloud.
- [ ] Marketplace SDK config draft is copied into Google Cloud.
- [ ] OAuth verification requirements are understood and started if required.
