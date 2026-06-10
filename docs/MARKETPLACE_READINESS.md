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

Open APA Desk was submitted to Google Workspace Marketplace review and rejected
on 2026-06-03. The rejection is addressable and requires Marketplace SDK/OAuth
changes before resubmission.

Google rejected the resubmission again on 2026-06-10. The policy-link issue is
confirmed: the submitted lowercase Privacy and Terms URLs return 404 on
Hostinger's case-sensitive server, while the checked-in uppercase pages are live.
Use the uppercase URLs in the Marketplace SDK until the hosted site deliberately
adds lowercase aliases.

The submitted build uses a standalone Apps Script project linked to a standard
Google Cloud project. Google Auth Platform branding passed the domain ownership
gate for `unit27research.com`, but Google rejected the add-on because OAuth
verification was not complete. Current Google Auth Platform evidence shows
branding verified and data-access verification not required because the app is
not requesting sensitive or restricted scopes; include that evidence in the next
review notes if Google repeats the OAuth blocker.

Google's rejection listed three blockers:

1. Add proper Google trademark attribution in the short and detailed
   Marketplace descriptions, including `Google Docs™`.
2. Replace the support link with a page that gives users a point of contact,
   such as an email address or form.
3. Complete OAuth verification for the script project's OAuth client before
   resubmitting the Marketplace listing.

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
| Marketplace SDK config | Marketplace SDK App Configuration and Store Listing were submitted, then rejected for correctable listing/support/OAuth issues. The latest rejection also caught lowercase Privacy/Terms URLs that 404 on Hostinger. | Needs resubmission |
| OAuth consent screen | OAuth consent is configured as External. Latest Google Auth Platform evidence shows branding verified and data-access verification not required; reviewer notes should state this explicitly if no Submit for Verification button is available. | Review contradiction |
| Marketplace draft preflight | `npm run marketplace:drafts:check` passes and rejects public `TODO:` placeholders in Marketplace draft files. | Passing locally |
| OAuth scopes | Manifest uses current-document Docs scope, `drive.file` for APA starter-template copy creation, UI/storage scopes, and external request access for Crossref. It does not request full Drive or Sheets scope. | Submitted |
| Sidebar review UX | Sidebar has explicit button types, disables actions while Apps Script calls are pending, exposes status through an ARIA live region, and is guarded by `npm run release:check`. | Passing locally |
| OAuth verification | Google rejected the listing because OAuth verification is missing, but the Verification Center currently says data-access verification is not required. Confirm the legacy OAuth consent page does not expose a Submit for Verification action, then resubmit with reviewer evidence. | Needs reviewer note |
| Store listing | Store listing was rejected. Corrected listing copy now uses `Google Docs™`, includes Google trademark attribution, and points Support to `https://unit27research.com/open-apa-desk/support.html`. | Needs resubmission |
| Terms of service | `TERMS.md` exists locally, generated `site/TERMS.html` is checked in, and `https://unit27research.com/open-apa-desk/TERMS.html` resolves. The lowercase `/terms.html` URL should not be used in Marketplace fields unless a true lowercase server file is uploaded. | Corrected URL required |
| Privacy policy | `PRIVACY.md` exists locally, generated `site/PRIVACY.html` is checked in, and `https://unit27research.com/open-apa-desk/PRIVACY.html` resolves. The lowercase `/privacy.html` URL should not be used in Marketplace fields unless a true lowercase server file is uploaded. | Corrected URL required |
| Support/contact | Marketplace Support should use `https://unit27research.com/open-apa-desk/support.html`, which includes `josh@unit27research.com` and GitHub issues. Google Auth support email is the publishing account `publishing Google account email (operator-private)`. | Corrected |
| Trader status | Non-trader was selected because Open APA Desk is free, open-source, and not monetized. If Google treats the Unit27 Research identity as business/professional activity, revisit this choice. | Submitted |
| Branding assets | Project-owned PNG assets exist under `assets/branding/` and `site/assets/branding/`. Source manifest uses the public Pages icon URL, and the public icon URL resolves. | Passing public URL gate |
| Screenshots | Three 1280 x 800 Marketplace screenshots were submitted. | Submitted |
| Crossref mailto | Runtime uses the public Unit27 Research project contact email fallback while still rejecting malformed/example overrides. `Open APA Desk > Check DOI Setup` confirms DOI lookup is configured for Crossref, and DOI smoke evidence passed. | Submitted |
| Public repo | Public GitHub repo exists, `origin` is configured, GitHub auth is valid, remote branch/pull-request refs pass the public-boundary scan, and `Verify`/`Pages` are green on `main`. `npm run upload:preflight` also retries short-lived public Pages URL propagation failures. | Passing upload gate |

## High-Risk Marketplace Items

1. Upload the refreshed `open-apa-desk` public site folder to Hostinger so
   `https://unit27research.com/open-apa-desk/support.html` resolves.
2. Update the Marketplace SDK short and detailed descriptions with the
   corrected `Google Docs™` wording and trademark attribution.
3. Update the Marketplace SDK Support URL to
   `https://unit27research.com/open-apa-desk/support.html`.
4. Check Google Auth Platform > Verification Center and the legacy OAuth consent
   screen. If a Submit for Verification action exists, submit it for the exact
   Apps Script/OAuth scopes. If no action exists and Google says verification is
   not required, resubmit with that evidence in reviewer notes.
5. Revisit non-trader status only if Google review questions the Unit27 Research
   publisher identity for this free/open-source project.
6. Keep `npm run upload:preflight` passing after each push so the public URLs,
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

- Update the Marketplace SDK Privacy and Terms URLs to the uppercase live URLs
  before resubmitting:
  `https://unit27research.com/open-apa-desk/PRIVACY.html` and
  `https://unit27research.com/open-apa-desk/TERMS.html`.
- Recheck OAuth verification first. If Google Auth Platform still says
  verification is not required, include that evidence in reviewer notes rather
  than adding broader scopes.
- If Google asks for reviewer/test notes or a demo video, use the prepared notes
  from the launch packet and smoke fixtures.
- If Google requests listing or scope changes, update the docs, Apps Script
  manifest if needed, create a new immutable Apps Script version, and update the
  Marketplace SDK version before resubmitting.
- Keep `npm run marketplace:drafts:check` passing after any listing, OAuth, or
  SDK wording changes.
