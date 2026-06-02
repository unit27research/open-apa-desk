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
and still needs confirmed trader/non-trader status, Google Cloud/Marketplace
console setup, and human-assisted sidebar/export checks.

The consolidated launch/submission handoff is
[LAUNCH_SUBMISSION_PACKET.md](LAUNCH_SUBMISSION_PACKET.md).

## Upload Requirements

| Area | Current evidence | Status |
| --- | --- | --- |
| Functional add-on | V0.1 build passes local verification and has live smoke coverage in a bound Doc. | Partial |
| Editor add-on menu | `onOpen()` and `onInstall()` populate an `Open APA Desk` menu. Sprint 2 confirmed the menu appears in the template Doc. | Passing for alpha |
| Apps Script version | Post-Pages Apps Script version `1` exists in the operator environment after the public `logoUrl` manifest change was pushed. | Passing for alpha |
| Standard Google Cloud project | No standard Cloud project is linked yet. Required setup is documented in the SDK and OAuth drafts. | Missing |
| Cloud billing | Google lists billing as an OAuth/publishing prerequisite for the Cloud project. Billing has not been confirmed. | Missing |
| Marketplace SDK config | Draft field map exists in `docs/MARKETPLACE_SDK_CONFIG_DRAFT.md`. | Draft |
| OAuth consent screen | Draft field map exists in `docs/OAUTH_CONSENT_DRAFT.md`. | Draft |
| Marketplace draft preflight | `npm run marketplace:drafts:check` fails until support/developer contact fields, developer identity fields, and post-Pages Apps Script version fields are filled. | Failing as expected |
| OAuth scopes | Manifest now uses current-document Docs scope and no Drive or Sheets scope. No-Sheets copied-template OAuth/menu path partially passed, but Chrome did not capture the final permission-list screen. | Improved; needs human consent review |
| Sidebar review UX | Sidebar has explicit button types, disables actions while Apps Script calls are pending, exposes status through an ARIA live region, and is guarded by `npm run release:check`. | Passing locally |
| OAuth verification | Required if public release uses sensitive or restricted scopes. Not started. | Missing |
| Store listing | Draft copy exists in `docs/MARKETPLACE_LISTING_DRAFT.md`. | Draft |
| Terms of service | `TERMS.md` exists locally, generated `site/TERMS.html` is checked in, and the public Pages URL resolves. | Passing public URL gate |
| Privacy policy | `PRIVACY.md` exists locally, generated `site/PRIVACY.html` is checked in, and the public Pages URL resolves. | Passing public URL gate |
| Support/contact | Project support and developer contact email are set in the drafts as `josh@unit27research.com`. | Draft field filled |
| Branding assets | Project-owned PNG assets exist under `assets/branding/` and `site/assets/branding/`. Source manifest uses the public Pages icon URL, and the public icon URL resolves. | Passing public URL gate |
| Screenshots | Alpha screenshot assets exist under `assets/screenshots/` and are copied into `site/assets/screenshots/`. Final human-assisted Marketplace screenshots still needed after sidebar/export checks. | Partial |
| Crossref mailto | Runtime now blocks DOI lookup if `CROSSREF_MAILTO` is missing, malformed, or still an example email. The confirmed project email is `josh@unit27research.com`; the live Apps Script property still needs to be set before public DOI testing. | Missing live config |
| Public repo | Public GitHub repo exists, `origin` is configured, GitHub auth is valid, remote branch/pull-request refs pass the public-boundary scan, and `Verify`/`Pages` are green on `main`. | Passing upload gate |

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
make a copy in Google Docs and run `Prepare Current Copy` on that copy. This
removes the full Drive scope from the Apps Script manifest.

The reduced-scope build should show `Prepare Current Copy` and should no longer
show `Prepare Clean Copy`.

## Sprint 5 Scope Decision

Reusable cross-document reference library sync was deferred from Marketplace V0.
The active build stores references only in the current document state and no
longer requests Google Sheets scope.

No-Sheets copied-template smoke testing should confirm that the copy retains
the `Open APA Desk` menu, loads the sidebar after authorization and side-sheet
reopen, rebuilds a visible `References` section, and runs `Prepare Current
Copy` without a visible browser error. Full sidebar entry and export inspection
remain human-assisted checks.

## Recommended Next Sprint

The next sprint should finish release packaging:

- Run a human-assisted sidebar/export smoke test against the no-Sheets manifest.
- Keep the public repo, GitHub Actions checks, remote public-boundary scan, and
  Pages URLs green with `npm run upload:preflight`.
- Create the standard Google Cloud project, confirm billing, and cut a
  post-Pages Apps Script version after the public icon URL is live.
- Capture Marketplace screenshots using `docs/SCREENSHOT_CAPTURE_PLAN.md`.
- Confirm trader/non-trader status in the Marketplace SDK. If trader status is
  selected, collect the required mailing address.
- Fill any remaining Marketplace/OAuth fields until
  `npm run marketplace:drafts:check` passes.

Do not submit to Marketplace until these packaging gates are closed.
