# Open APA Desk

Open APA Desk is a free, open-source, privacy-first APA 7 helper for Google Docs.

Current package version: `0.1.0-alpha.0`.

Marketplace status: submitted to Google Workspace Marketplace review on
2026-06-02. It is not Marketplace-approved or publicly installable from the
Marketplace yet.

Project page: https://unit27research.com/open-apa-desk/

V0 focuses on a practical student workflow:

- set up controlled APA paper sections
- save common reference types
- look up journal article metadata by DOI through Crossref
- edit, delete, and de-duplicate saved references
- insert readable parenthetical or narrative citations, including optional
  page/paragraph locators for single-source direct quotes
- insert grouped parenthetical citations from multiple selected references
- rebuild a generated References section
- prepare a copied document for submission by removing hidden tool markers

Open APA Desk is not an official APA product and does not replace instructor,
institution, or APA manual requirements.

## V0 Scope

Supported source types:

- journal article
- book
- book chapter
- website
- report

Deferred:

- MLA and Turabian
- URL scraping
- AI writing or summarization
- backend accounts or hosted storage
- whole-document autoformatting
- full APA edge-case coverage
- reusable cross-document reference library sync
- Marketplace approval and production availability, which are pending Google
  review

## Current Alpha Status

The V0.1 alpha build has passed local verification, live Google Docs smoke
testing, and Google Workspace Marketplace submission preflight. The current
external gate is Google review.

The active build now uses current-document Docs access plus narrow
`drive.file` access for APA starter documents. Users start from an APA starter
template with real Google Docs page numbers, then run `Prepare Current Copy`
on a copied submission document to remove hidden Open APA Desk markers.

Dynamic page-number insertion is not automated in V0.1. The alpha package uses
a prepared template for required Google Docs dynamic page numbers; see
[docs/PAGE_NUMBER_FEASIBILITY.md](docs/PAGE_NUMBER_FEASIBILITY.md).

A separate alpha template path exists for copied-template smoke testing. See
[docs/ALPHA_TEMPLATE_PACKAGE.md](docs/ALPHA_TEMPLATE_PACKAGE.md).

The active build does not request full Google Drive access or duplicate
arbitrary Docs. It can create/copy an APA starter document from the configured
template using `drive.file`; if Google blocks automatic copy, it returns a
Google Docs copy-page link instead. Users still run `Prepare Current Copy` on
their copied submission document to remove hidden Open APA Desk markers before
submission.

The final smoke pass confirmed the refreshed menu, sidebar load, DOI setup
check, DOI/manual reference flow, citation insertion, References rebuild,
`Prepare Current Copy`, dynamic page numbers, and PDF/DOCX export preservation.
See [docs/MARKETPLACE_READINESS.md](docs/MARKETPLACE_READINESS.md) for the
submission record.

## Development

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

Typecheck:

```bash
npm run typecheck
```

Build Apps Script files into `dist/`:

```bash
npm run build
```

Run the full local verification:

```bash
npm run verify
```

## Live Google Docs Smoke Evidence

The initial Marketplace submission used a human-assisted Google Docs smoke
pass. For future review requests, regression checks, or resubmission, see
[docs/SMOKE_TEST.md](docs/SMOKE_TEST.md) for the command sequence,
[docs/SMOKE_TEST_FIXTURES.md](docs/SMOKE_TEST_FIXTURES.md) for public-safe
fixture values,
[docs/FINAL_SMOKE_QUICK_RUN.md](docs/FINAL_SMOKE_QUICK_RUN.md) for the compact
operator checklist, and
[docs/ALPHA_TEMPLATE_PACKAGE.md](docs/ALPHA_TEMPLATE_PACKAGE.md) for the
share-package checklist.

Before the final live pass, create the ignored private evidence packet:

```bash
npm run smoke:evidence
```

After completing the private evidence file, validate it with
`npm run smoke:evidence:check -- private/smoke-evidence/YYYY-MM-DD-final-smoke.md`.

After exports and evidence are complete, run the composed submission gate:

```bash
npm run submission:preflight -- private/smoke-evidence/YYYY-MM-DD-final-smoke.md
```

## Release Readiness

Open APA Desk has been submitted to Google Workspace Marketplace review.
Marketplace readiness and review state are tracked in
[docs/MARKETPLACE_READINESS.md](docs/MARKETPLACE_READINESS.md), with draft
listing copy in
[docs/MARKETPLACE_LISTING_DRAFT.md](docs/MARKETPLACE_LISTING_DRAFT.md).
Google Cloud, OAuth consent, and Marketplace SDK console steps are tracked in
[docs/GOOGLE_CONSOLE_RUNBOOK.md](docs/GOOGLE_CONSOLE_RUNBOOK.md).
Branding assets are tracked in [docs/BRANDING_ASSETS.md](docs/BRANDING_ASSETS.md).
GitHub publication is tracked in
[docs/GITHUB_PUBLISH_CHECKLIST.md](docs/GITHUB_PUBLISH_CHECKLIST.md).
Release gates are tracked in [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md).
OAuth consent, Marketplace SDK, screenshots, and public URL wiring are drafted
in `docs/`.
The consolidated launch/submission handoff is
[docs/LAUNCH_SUBMISSION_PACKET.md](docs/LAUNCH_SUBMISSION_PACKET.md).
The public Pages site is generated into `site/` with `npm run site:build`.

The submitted build uses a standard Google Cloud project, External OAuth
configuration, Marketplace SDK entry, Apps Script version `1`, final
starter-template/sidebar/export smoke evidence, and submitted Marketplace
screenshots. Remaining external gates are Google Auth Platform branding review
and Marketplace review. If Google requests changes, update the docs and
manifest as needed, create a new immutable Apps Script version, update the
Marketplace SDK version, and resubmit.

## Apps Script Deployment

This repo is structured for `clasp`, but it does not include a `.clasp.json`
because that file contains a user-specific script id.

1. Copy `.clasp.example.json` to `.clasp.json`.
2. Replace `PASTE_YOUR_SCRIPT_ID_HERE` with your Apps Script project id.
3. Run `npm run clasp:login`.
4. Run `npm run clasp:push`.

`npm run clasp:push` runs `npm run build`, `npm run build:check`, and
`clasp push --force` in sequence.

Early non-developer use should be tested through a template Google Doc with the
script attached. The bound script menu uses `Open APA Desk` so it can appear
during template smoke testing outside the Marketplace install flow.

## Google Permissions

The current Apps Script manifest uses current-document Docs access, narrow
Drive file access for creating APA starter documents from a prepared template,
Apps Script UI/storage scopes, and external request access for Crossref DOI
lookup. It does not request full Google Drive or Google Sheets scope.

Document and reference data stays in the user's Google Doc document properties;
Open APA Desk does not send document content to a backend server.

## Crossref DOI Lookup

DOI lookup sends the DOI entered by the user to Crossref. The build includes a
public Unit27 Research project contact email for copied-template alpha installs.
Apps Script script properties can override it:

```text
CROSSREF_MAILTO=maintainer@example.com
```

If a configured `CROSSREF_MAILTO` value is malformed or still set to an example
email, DOI lookup stops before sending a Crossref request. Manual reference
entry still works.

Optional operator smoke check:

```bash
CROSSREF_MAILTO=project-contact@example.com npm run crossref:smoke
```

This checks Crossref connectivity with a public fixture DOI. It does not
replace the live Google Docs sidebar smoke test.

## Privacy

Open APA Desk V0 has no backend server, account system, AI calls, or hosted
database. Document data is stored in the active Google Doc's document properties.
Reusable cross-document reference library sync is deferred from Marketplace V0
to avoid Google Sheets OAuth scope.

See [PRIVACY.md](PRIVACY.md) for the full V0 privacy note.

## Terms

See [TERMS.md](TERMS.md).
