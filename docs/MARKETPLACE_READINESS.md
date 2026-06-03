# Marketplace Readiness

Date: 2026-06-02

This file tracks Open APA Desk's Google Workspace Marketplace readiness and
review state.

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

Open APA Desk has been submitted to Google Workspace Marketplace review.

The submitted build uses a standalone Apps Script project linked to a standard
Google Cloud project. Google Auth Platform branding is under review after
`unit27research.com` ownership verification through Google Search Console.

Page-number handling has an in-editor alpha path now. APA 7 student papers
require page numbers, and the blank/current-document setup flow cannot be called
complete APA setup. The active build now uses a template-first starter-document
path that has passed live Google Docs proof for page `1`, dynamic page `2`,
setup preservation, and PDF/DOCX export preservation.

Marketplace draft fields are filled for the submitted public-safe plan, and
`npm run marketplace:drafts:check` validates the Unit27 Marketplace URLs.
Reviewer/test notes are prepared locally, but Google did not request them during
the initial submission flow.

The consolidated launch/submission handoff is
[LAUNCH_SUBMISSION_PACKET.md](LAUNCH_SUBMISSION_PACKET.md).
The Google console execution path is
[GOOGLE_CONSOLE_RUNBOOK.md](GOOGLE_CONSOLE_RUNBOOK.md).

## Upload Requirements

| Area | Current evidence | Status |
| --- | --- | --- |
| Functional add-on | V0.1 build passes local verification and has live Google Docs smoke coverage. | Submitted |
| Editor add-on menu | `onOpen()` and `onInstall()` populate an `Open APA Desk` menu. The refreshed copied-template Doc shows the version with `Check DOI Setup`. | Passing for alpha |
| Apps Script version | Standalone Marketplace Apps Script version `1` exists and was used for the submitted listing. | Submitted |
| APA page numbers | Marketplace V0 uses the prepared-template path. Live Google Docs proof shows page `1`, dynamic page `2`, preservation after `Setup APA Paper`, and PDF/DOCX export preservation. | Submitted |
| Standard Google Cloud project | Standard Google Cloud project is created and linked to the standalone Apps Script project. | Complete |
| Cloud billing | Billing was attached because Google required it during Cloud project setup; Open APA Desk does not use billable backend services. | Complete |
| Marketplace SDK config | Marketplace SDK App Configuration and Store Listing were filled and submitted for review. | Submitted |
| OAuth consent screen | OAuth consent is configured as External and Google Auth Platform branding is under review. | Under review |
| Marketplace draft preflight | `npm run marketplace:drafts:check` passes and rejects public `TODO:` placeholders in Marketplace draft files. | Passing locally |
| OAuth scopes | Manifest uses current-document Docs scope, `drive.file` for APA starter-template copy creation, UI/storage scopes, and external request access for Crossref. It does not request full Drive or Sheets scope. | Submitted |
| Sidebar review UX | Sidebar has explicit button types, disables actions while Apps Script calls are pending, exposes status through an ARIA live region, and is guarded by `npm run release:check`. | Passing locally |
| OAuth verification | Google Auth Platform branding is under review after successful `unit27research.com` ownership verification. | Under review |
| Store listing | Store listing was submitted for review. Category: Academic Resources. Regions: All regions. | Submitted |
| Terms of service | `TERMS.md` exists locally, generated `site/TERMS.html` is checked in, and `https://unit27research.com/open-apa-desk/terms.html` resolves. | Submitted |
| Privacy policy | `PRIVACY.md` exists locally, generated `site/PRIVACY.html` is checked in, and `https://unit27research.com/open-apa-desk/privacy.html` resolves. | Submitted |
| Support/contact | Google Auth support email is the publishing account `publishing Google account email (operator-private)`; Marketplace developer/contact fields use `josh@unit27research.com`. | Submitted |
| Trader status | Non-trader was selected because Open APA Desk is free, open-source, and not monetized. If Google treats the Unit27 Research identity as business/professional activity, revisit this choice. | Submitted |
| Branding assets | Project-owned PNG assets exist under `assets/branding/` and `site/assets/branding/`. Source manifest uses the public Pages icon URL, and the public icon URL resolves. | Passing public URL gate |
| Screenshots | Three 1280 x 800 Marketplace screenshots were submitted. | Submitted |
| Crossref mailto | Runtime uses the public Unit27 Research project contact email fallback while still rejecting malformed/example overrides. `Open APA Desk > Check DOI Setup` confirms DOI lookup is configured for Crossref, and DOI smoke evidence passed. | Submitted |
| Public repo | Public GitHub repo exists, `origin` is configured, GitHub auth is valid, remote branch/pull-request refs pass the public-boundary scan, and `Verify`/`Pages` are green on `main`. `npm run upload:preflight` also retries short-lived public Pages URL propagation failures. | Passing upload gate |

## High-Risk Marketplace Items

1. Monitor Google Auth Platform branding and Marketplace review status.
2. Be ready to provide reviewer/test notes if Google asks for them.
3. Revisit non-trader status only if Google review questions the Unit27 Research
   publisher identity for this free/open-source project.
4. Keep `npm run upload:preflight` passing after each push so the public URLs,
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

## Recommended Next Review Pass

- Watch Google Auth Platform branding and Marketplace SDK review status.
- If Google asks for reviewer/test notes, use the prepared notes from the launch
  packet and smoke fixtures.
- If Google requests listing or scope changes, update the docs, Apps Script
  manifest if needed, create a new immutable Apps Script version, and update the
  Marketplace SDK version before resubmitting.
- Keep `npm run marketplace:drafts:check` passing after any listing, OAuth, or
  SDK wording changes.
