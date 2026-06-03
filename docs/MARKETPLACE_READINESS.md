# Marketplace Readiness

Date: 2026-06-02

This file tracks what must be true before Open APA Desk can be submitted to the
Google Workspace Marketplace.

Sources checked on 2026-06-02:

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

## Current Position

Open APA Desk is public-repo and public-URL ready, but it is not
Marketplace-ready yet. It has partial no-Sheets copied-template smoke coverage
and still needs Google Cloud/Marketplace console setup and human-assisted
sidebar/export checks.

Page-number handling has an in-editor alpha path now. APA 7 student papers
require page numbers, and the blank/current-document setup flow cannot be called
complete APA setup. The active build now uses a template-first starter-document
path that has passed live Google Docs proof for page `1`, dynamic page `2`, and
setup preservation. PDF/DOCX export evidence is still required before
Marketplace submission.

Marketplace draft fields are filled for the current public-safe plan, and
`npm run marketplace:drafts:check` now rejects public `TODO:` placeholders.
The remaining pre-submission evidence gap is the live Google Docs
sidebar/export smoke pass plus private export evidence.

The consolidated launch/submission handoff is
[LAUNCH_SUBMISSION_PACKET.md](LAUNCH_SUBMISSION_PACKET.md).
The Google console execution path is
[GOOGLE_CONSOLE_RUNBOOK.md](GOOGLE_CONSOLE_RUNBOOK.md).

## Upload Requirements

| Area | Current evidence | Status |
| --- | --- | --- |
| Functional add-on | V0.1 build passes local verification and has live smoke coverage in a bound Doc. | Partial |
| Editor add-on menu | `onOpen()` and `onInstall()` populate an `Open APA Desk` menu. The refreshed copied-template Doc shows the version with `Check DOI Setup`. | Passing for alpha |
| Apps Script version | Apps Script version `2` exists in the smoke-test operator environment, and the refreshed alpha template has a final-smoke-ready template version. | Passing for alpha |
| APA page numbers | Blank/current-document setup can leave the title page without visible page number `1`, so Marketplace V0 uses the prepared-template path. Live Google Docs proof now shows page `1`, dynamic page `2`, and preservation after `Setup APA Paper`. PDF/DOCX export preservation still needs final evidence. | Passing in editor; export proof pending |
| Standard Google Cloud project | No standard Cloud project is linked yet. Required setup is documented in the SDK and OAuth drafts. | Missing |
| Cloud billing | Google lists billing as an OAuth/publishing prerequisite for the Cloud project. Billing has not been confirmed. | Missing |
| Marketplace SDK config | Draft field map exists in `docs/MARKETPLACE_SDK_CONFIG_DRAFT.md`; private script IDs are intentionally kept in operator notes only. | Draft |
| OAuth consent screen | Draft field map exists in `docs/OAUTH_CONSENT_DRAFT.md`, including the External/not-Testing review guard. | Draft |
| Marketplace draft preflight | `npm run marketplace:drafts:check` passes and rejects public `TODO:` placeholders in Marketplace draft files. | Passing locally |
| OAuth scopes | Manifest now uses current-document Docs scope, `drive.file` for APA starter-template copy creation, UI/storage scopes, and external request access for Crossref. It does not request full Drive or Sheets scope. Chrome did not capture the final permission-list screen. | Improved; needs human consent review |
| Sidebar review UX | Sidebar has explicit button types, disables actions while Apps Script calls are pending, exposes status through an ARIA live region, and is guarded by `npm run release:check`. | Passing locally |
| OAuth verification | Required if public release uses sensitive or restricted scopes. Not started. | Missing |
| Store listing | Draft copy exists in `docs/MARKETPLACE_LISTING_DRAFT.md`. | Draft |
| Terms of service | `TERMS.md` exists locally, generated `site/TERMS.html` is checked in, and the public Pages URL resolves. | Passing public URL gate |
| Privacy policy | `PRIVACY.md` exists locally, generated `site/PRIVACY.html` is checked in, and the public Pages URL resolves. | Passing public URL gate |
| Support/contact | Project support and developer contact email are set in the drafts as `josh@unit27research.com`. | Draft field filled |
| Trader status | Non-trader is selected for the initial draft because Open APA Desk is free, open-source, and not monetized. If Google treats the Unit27 Research identity as business/professional activity, revisit this choice. | Draft field filled |
| Branding assets | Project-owned PNG assets exist under `assets/branding/` and `site/assets/branding/`. Source manifest uses the public Pages icon URL, and the public icon URL resolves. | Passing public URL gate |
| Screenshots | Alpha screenshot assets exist under `assets/screenshots/` and are copied into `site/assets/screenshots/`. Final human-assisted Marketplace screenshots still needed after sidebar/export checks. | Partial |
| Crossref mailto | Runtime now uses the public Unit27 Research project contact email when copied-template alpha scripts do not carry script properties, while still rejecting malformed or example `CROSSREF_MAILTO` overrides. `Open APA Desk > Check DOI Setup` confirms DOI lookup is configured for Crossref. The actual sidebar DOI lookup call still needs the final smoke pass. | Fallback implemented; lookup pending |
| Public repo | Public GitHub repo exists, `origin` is configured, GitHub auth is valid, remote branch/pull-request refs pass the public-boundary scan, and `Verify`/`Pages` are green on `main`. `npm run upload:preflight` also retries short-lived public Pages URL propagation failures. | Passing upload gate |

## High-Risk Marketplace Items

1. Confirm the standard Google Cloud project and Marketplace SDK owner/account
   before entering the post-Pages Apps Script version in the SDK.
2. Create and link a standard Google Cloud project. Apps Script's default Cloud
   project cannot be used for publishing.
3. Confirm Cloud billing if required by the Google publishing flow.
4. Use the post-Pages Apps Script version for the Marketplace SDK draft.
5. Keep `npm run upload:preflight` passing after each push so the public URLs,
   GitHub Actions, and remote ref hygiene stay verified.

## Sprint 4 Scope Decision

Automatic Clean Copy duplication was removed from the active build. Users now
make a copy in Google Docs and run `Prepare Current Copy` on that copy.

The reduced-scope build should show `Prepare Current Copy` and should no longer
show `Prepare Clean Copy`.

## Sprint 5 Scope Decision

Reusable cross-document reference library sync was deferred from Marketplace V0.
The active build stores references only in the current document state and no
longer requests Google Sheets scope.

No-Sheets copied-template smoke testing has confirmed that the copy retains the
`Open APA Desk` menu, exposes `Check DOI Setup`, and loads the sidebar after
authorization and side-sheet reopen. Rebuilding a visible `References` section,
running `Prepare Current Copy`, and export inspection remain human-assisted
checks because Chrome automation cannot type or paste into Google's sandboxed
add-on iframe.

## Sprint 6 Scope Decision

The no-Sheets blank/current-document flow is not sufficient for Marketplace V0
because it cannot guarantee required APA page numbers. Sprint 6 added a
template-first setup path intended to preserve real Google Docs dynamic page
numbers through `Setup APA Paper`, `Prepare Current Copy`, PDF export, and DOCX
export.

Alpha path: distribute a prepared Google Docs APA starter template and use the
`Create APA Starter Doc` command to copy it before writing. This validates the
workflow and preserves real dynamic page numbers.

Marketplace path: use `drive.file` to create/copy an APA starter document from
the project-owned template. If Google Drive blocks automatic copy under
`drive.file`, the command returns a Google Docs copy-page link instead of
requesting full Drive scope. Full Drive scope remains disallowed.

Live result on 2026-06-02: automatic Drive copy was blocked with status `403`,
the Google Docs copy-page fallback created a starter copy, the current menu came
along after the template bound script was updated, and page numbers survived
`Setup APA Paper`.

## Recommended Next Live Pass

The next live pass should finish full sidebar/export smoke before release
packaging:

- Run the complete reference/citation smoke path on a fresh prepared-template
  copy.
- Capture PDF/DOCX export proof showing page numbers survive export.
- Update smoke evidence so final Marketplace evidence starts from a document
  with real Google Docs dynamic page numbers.
- Re-run the human-assisted sidebar/export smoke test only after page numbers
  are visibly correct and preserved.
- Keep the public repo, GitHub Actions checks, remote public-boundary scan, and
  Pages URLs green with `npm run upload:preflight`.
- Follow `docs/GOOGLE_CONSOLE_RUNBOOK.md` to create the standard Google Cloud
  project, confirm billing if required, configure OAuth, configure the
  Marketplace SDK, and cut a post-console Apps Script version.
- Capture Marketplace screenshots using `docs/SCREENSHOT_CAPTURE_PLAN.md`.
- Revisit trader/non-trader status only if Google review questions the
  non-trader selection for a Unit27-branded free/open-source project.
- Keep `npm run marketplace:drafts:check` passing after any listing, OAuth, or
  SDK wording changes.

Do not submit to Marketplace until these packaging gates are closed.
