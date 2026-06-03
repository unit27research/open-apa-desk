# Launch Submission Packet

Date: 2026-06-02

Use this file as the single handoff packet for publishing Open APA Desk to
GitHub and preparing the first Google Workspace Marketplace submission.

Use [GOOGLE_CONSOLE_RUNBOOK.md](GOOGLE_CONSOLE_RUNBOOK.md) for the step-by-step
Google Cloud, OAuth consent, Marketplace SDK, and final smoke-test sequence.

## Official Sources Refreshed

Checked on 2026-06-02:

- Publish an add-on:
  https://developers.google.com/workspace/add-ons/how-tos/publish-add-on-overview
- Configure OAuth:
  https://developers.google.com/workspace/marketplace/configure-oauth-consent-screen
- Configure the Marketplace SDK:
  https://developers.google.com/workspace/marketplace/enable-configure-sdk
- Create a store listing:
  https://developers.google.com/workspace/marketplace/create-listing
- App review requirements:
  https://developers.google.com/workspace/marketplace/about-app-review

## Current Local Build

- Package version: `0.1.0-alpha.0`
- Product name: `Open APA Desk`
- License: MIT
- Runtime: Google Docs Editor Add-on through Apps Script
- Source scope: APA 7 Paper + Refs only
- Local release gate: `npm run verify`
- Release preflight: `npm run release:check`
- Apps Script bundle preflight: `npm run build && npm run build:check`
- Safe Apps Script push: `npm run clasp:push`
- Marketplace draft preflight: `npm run marketplace:drafts:check`
- Public repo archive: `npm run publish:archive`
- Upload preflight: `npm run upload:preflight`
- Private smoke evidence setup: `npm run smoke:evidence`
- Private smoke evidence check: `npm run smoke:evidence:check -- private/smoke-evidence/YYYY-MM-DD-final-smoke.md`
- Final submission preflight: `npm run submission:preflight -- private/smoke-evidence/YYYY-MM-DD-final-smoke.md`
- Final smoke fixtures: `docs/SMOKE_TEST_FIXTURES.md`
- Final smoke quick run: `docs/FINAL_SMOKE_QUICK_RUN.md`
- Optional Crossref network smoke: `CROSSREF_MAILTO=project-contact@example.com npm run crossref:smoke`
- Optional export marker scan after PDF/DOCX export: `npm run smoke:exports`

Current manifest scopes:

```text
https://www.googleapis.com/auth/drive.file
https://www.googleapis.com/auth/documents.currentonly
https://www.googleapis.com/auth/script.container.ui
https://www.googleapis.com/auth/script.external_request
https://www.googleapis.com/auth/script.storage
```

The active build requests `drive.file` only to create/copy APA starter
documents from the prepared template. It does not request full Google Drive or
Google Sheets scope.

## GitHub Upload Packet

Target repository:

```text
unit27research/open-apa-desk
```

Recommended settings:

- Visibility: public, after the human-assisted sidebar/export smoke pass
- Default branch: `main`
- License: MIT
- Issues: enabled
- Wiki: off
- GitHub Pages: GitHub Actions workflow from `.github/workflows/pages.yml`

GitHub command sequence:

```bash
gh auth login -h github.com
gh auth status
gh repo create open-apa-desk --public --source=. --remote=origin --push
npm run upload:preflight
```

`npm run upload:preflight` should be run after each gate closes and must pass
before Marketplace submission. It verifies local release gates, public repo
hygiene, remote branch/pull-request refs, latest `Verify` and `Pages` runs for
the current commit, and the required public Pages URLs.

Post-push proof required:

- GitHub repo URL resolves.
- `Verify` GitHub Actions workflow passes on `main`.
- Pages workflow publishes `site/`.
- Public home, privacy, terms, support, and icon URLs resolve.
- PNG branding assets render in the GitHub file browser.
- No stale GitHub pull-request refs from pre-public cleanup remain. If stale PR
  refs exist on a newly created repo, delete and recreate the repo from the
  sanitized local tree before making it public.

Expected GitHub Pages source URLs:

```text
Project home: https://unit27research.github.io/open-apa-desk/
Privacy: https://unit27research.github.io/open-apa-desk/PRIVACY.html
Terms: https://unit27research.github.io/open-apa-desk/TERMS.html
Support: https://github.com/unit27research/open-apa-desk/issues
Icon: https://unit27research.github.io/open-apa-desk/assets/branding/open-apa-desk-icon-128.png
```

Expected Unit27 Marketplace URLs:

```text
Project home: https://unit27research.com/open-apa-desk/
Privacy: https://unit27research.com/open-apa-desk/privacy.html
Terms: https://unit27research.com/open-apa-desk/terms.html
Support: https://github.com/unit27research/open-apa-desk/issues
Icon: https://unit27research.com/open-apa-desk/assets/branding/open-apa-desk-icon-128.png
```

Manual upload fallback:

```bash
npm run publish:archive
```

The archive is written under `release/`, which is ignored by git. It is created
from tracked files only, so local `.clasp.json`, `dist/`, `node_modules/`, and
other ignored files are not included.

## Marketplace Console Packet

Google Cloud project:

- Create a standard Google Cloud project.
- Enable billing if required by the Google publishing flow.
- Link the standard Cloud project to the Apps Script project.
- Enable the Google Workspace Marketplace SDK, not the licensing/billing API.

Apps Script:

```text
Template script ID: keep in local/operator notes only
Current standalone Marketplace version: 1
Submission version: 1
Version description: 0.1.0-alpha.0 marketplace-bound initial
```

Marketplace SDK app configuration:

```text
App visibility: Public
Install setting: Individual + Admin Install
Integration: Google Docs Editor Add-on
Apps Script version: 1
Developer name: Unit27 Research
Developer website URL: https://unit27research.com
Developer email: josh@unit27research.com
Trader status: Non-trader
```

Visibility warning: Google documents the visibility choice as effectively
one-way after saving. Confirm account, owner, and public visibility before
saving the final SDK configuration.

OAuth consent:

```text
App name: Open APA Desk
Audience: External
Support email: publishing Google account email (operator-private)
Developer contact email: josh@unit27research.com
Authorized domain: unit27research.com
```

Google Auth Platform forced the support-email dropdown to the publishing Google
account during setup. Marketplace developer/contact fields remain Unit27
Research.

Scope justifications are drafted in
[OAUTH_CONSENT_DRAFT.md](OAUTH_CONSENT_DRAFT.md).

Store listing:

- Copy fields from
  [MARKETPLACE_LISTING_DRAFT.md](MARKETPLACE_LISTING_DRAFT.md).
- Use support URLs from the public GitHub/Pages deployment.
- Use final screenshots only after the human-assisted sidebar/export smoke
  pass.
- Revisit trader/non-trader status if Google review treats the Unit27 Research
  publisher identity as business/professional activity.
- Initial Marketplace listing was submitted for Google review on 2026-06-02.

Run the strict draft check before entering final Google Cloud or Marketplace
console fields:

```bash
npm run marketplace:drafts:check
```

It should pass before final Google Cloud or Marketplace console entry.

Graphic assets:

```text
assets/branding/open-apa-desk-icon-32.png
assets/branding/open-apa-desk-icon-128.png
assets/branding/open-apa-desk-card-banner-220x140.png
```

`npm run release:check` verifies the branding asset dimensions.

Alpha screenshot assets:

```text
assets/screenshots/01-google-docs-menu-open.jpg
assets/screenshots/02-sidebar-paper-setup.jpg
assets/screenshots/03-references-output.jpg
```

The current alpha screenshots are Marketplace-size evidence captures. Replace
or supplement them with final human-reviewed Marketplace screenshots after the
live deployment is refreshed. Final screenshots should be `1280 x 800`; `640 x
400` and `2560 x 1600` are listed by Google as acceptable alternatives.

Run this before Marketplace submission:

```bash
npm run marketplace:assets:final
```

It verifies that checked-in screenshot files use an accepted Marketplace size.

## Review Evidence

Privacy position:

- no Open APA Desk account
- no backend server
- no hosted database
- no analytics service
- no AI calls
- document/reference data stays in the active Google Doc document properties
- DOI lookup sends the DOI entered by the user to Crossref

Functional evidence:

- `npm run verify` passes locally.
- Fresh checkout `npm ci` and `npm run verify` passed.
- No-Sheets copied-template smoke pass confirmed copied Doc menu, sidebar load
  after authorization/reopen, and `Open APA Desk > Check DOI Setup`.
- Required APA page numbers must be proven in final Marketplace evidence. Final
  smoke must start from a prepared APA template, or another proven dynamic page
  number path, and must show page number `1` on the title page plus an
  incrementing later page number.
- DOI lookup uses the public Unit27 Research project contact fallback when
  copied-template scripts do not carry script properties, and
  `Open APA Desk > Check DOI Setup` confirms DOI lookup is configured for
  Crossref.
- Final smoke fixture values and expected APA output are documented in
  `docs/SMOKE_TEST_FIXTURES.md`.
- Optional local Crossref network smoke can confirm Crossref endpoint
  connectivity with a public fixture DOI, but it does not replace the live
  Google Docs sidebar DOI lookup smoke check.
- Optional private export marker scan can run with `npm run smoke:exports`
  after PDF/DOCX export. It helps catch marker leakage but does not replace
  human visual export review.

Human/manual evidence still needed:

- prepared-template dynamic page-number proof
- full copied-template sidebar form entry
- DOI lookup with the project Crossref mailto
- manual reference entry
- parenthetical and narrative citation insertion visual check
- grouped citation visual check
- References rebuild visual check
- `Prepare Current Copy` visual check
- PDF export check
- DOCX export check
- `npm run smoke:exports` after exports are saved under `private/`
- `npm run smoke:evidence:check` after the private final smoke evidence file
  is filled
- `npm run submission:preflight` after exports and private evidence are
  complete
- no visible `[[OPEN_APA_DESK` marker text in exports
- final Marketplace screenshots

## Do Not Submit Until

- GitHub CLI authentication is valid.
- Public repo exists and `main` is pushed.
- GitHub Actions `Verify` passes on `main`.
- GitHub Pages URLs resolve.
- Crossref uses the public project contact fallback or a real
  `CROSSREF_MAILTO` override.
- Standard Google Cloud project is linked to Apps Script.
- OAuth consent screen is configured with matching scopes.
- A post-Pages Apps Script version is created and recorded.
- Marketplace SDK draft points to the post-Pages Apps Script version.
- Human-assisted sidebar/export smoke pass is recorded.
- Trader/non-trader status is copied from the launch packet into the SDK.
