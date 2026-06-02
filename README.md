# Open APA Desk

Open APA Desk is a free, open-source, privacy-first APA 7 helper for Google Docs.

Current package version: `0.1.0-alpha.0`.

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
- Google Workspace Marketplace release

## Current Alpha Status

The V0.1 alpha build has passed local verification and live Google Docs smoke
testing in two stages. The original bound-Doc smoke pass covered paper setup,
DOI lookup, manual reference entry, citation insertion, References rebuild, and
the earlier Drive-based clean-copy export path. That export path was later
removed to reduce Marketplace OAuth scope.

The active build now uses current-document Docs access only. Users make a copy
in Google Docs and run `Prepare Current Copy` on that copy to remove hidden Open
APA Desk markers before submission.

Dynamic page-number insertion is not automated in V0.1. The alpha package uses
Google Docs' built-in page-number UI or a prepared template for page numbers;
see [docs/PAGE_NUMBER_FEASIBILITY.md](docs/PAGE_NUMBER_FEASIBILITY.md).

A separate alpha template path exists for copied-template smoke testing. See
[docs/ALPHA_TEMPLATE_PACKAGE.md](docs/ALPHA_TEMPLATE_PACKAGE.md).

After the Marketplace readiness pass, the active build no longer creates a
duplicate Google Doc with Drive access. Users should make a copy in Google Docs,
then run `Prepare Current Copy` on that copy to remove hidden Open APA Desk
markers before submission.
See [docs/MARKETPLACE_READINESS.md](docs/MARKETPLACE_READINESS.md) for the
scope-reduction record.

The no-Sheets copied-template smoke path has confirmed the reduced-scope
template copy path, refreshed menu, sidebar load, and DOI setup check. Full
sidebar form entry, References output, `Prepare Current Copy`, and PDF/DOCX
export checks still need a human-assisted pass before final Marketplace
screenshots.

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

## Live Google Docs Smoke Test

The next milestone is a copied-template alpha smoke pass using a prepared
template target. See [docs/SMOKE_TEST.md](docs/SMOKE_TEST.md) for the command
sequence, [docs/SMOKE_TEST_FIXTURES.md](docs/SMOKE_TEST_FIXTURES.md) for
public-safe fixture values,
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

After exports and evidence are complete, run the final composed submission gate:

```bash
npm run submission:preflight -- private/smoke-evidence/YYYY-MM-DD-final-smoke.md
```

## Release Readiness

Open APA Desk is not ready for Google Workspace Marketplace submission yet.
Marketplace preparation is tracked in
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

The former full Google Drive scope risk has been reduced by replacing automatic
Doc duplication with current-copy submission prep. Before public submission, the
project still needs a standard Google Cloud project, OAuth consent
configuration, Marketplace SDK console entry, final sidebar/export smoke
evidence, and final Marketplace screenshots.

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
script attached. Marketplace packaging is a later release milestone. The bound
script menu uses `Open APA Desk` so it can appear during template smoke testing
before Marketplace add-on packaging.

## Google Permissions

The current Apps Script manifest uses current-document Docs access, Apps Script
UI/storage scopes, and external request access for Crossref DOI lookup. It no
longer requests full Google Drive or Google Sheets scope.

Document and reference data stays in the user's Google Doc document properties;
Open APA Desk does not send document content to a backend server.

## Crossref DOI Lookup

DOI lookup sends the DOI entered by the user to Crossref. Configure a project
contact email in Apps Script script properties:

```text
CROSSREF_MAILTO=maintainer@example.com
```

If `CROSSREF_MAILTO` is missing, malformed, or still set to an example email,
DOI lookup stops before sending a Crossref request. Manual reference entry still
works.

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
