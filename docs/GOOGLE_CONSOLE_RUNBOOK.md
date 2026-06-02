# Google Console Runbook

Date: 2026-06-02

Use this runbook when moving Open APA Desk from green local/public gates into
Google Cloud, OAuth consent, and Google Workspace Marketplace SDK setup.

## Source Check

Official Google sources checked on 2026-06-02:

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

## Preconditions

Run from the repository root:

```bash
npm run upload:preflight
```

Do not enter final Google console fields unless this passes.

Before final submission, also complete:

- final no-Sheets sidebar/export smoke pass
- DOI lookup with live `CROSSREF_MAILTO`
- PDF and DOCX export check with no `[[OPEN_APA_DESK` marker text
- final Marketplace screenshots

## 1. Confirm Owner Account

- Use the publishing account intended to own the public Marketplace listing.
- Confirm the Apps Script project owner/collaborator account can publish.
- Keep script IDs, Google Doc IDs, Cloud project numbers, and deployment URLs
  out of the public repo.

## 2. Create Standard Cloud Project

Google says Apps Script's default Cloud project cannot be used to publish.

Create or select a standard Google Cloud project:

```text
Project name: Open APA Desk
```

Then:

- enable billing if Google requires it
- link the standard Cloud project to the Apps Script project
- keep the Cloud project ID/number in local operator notes only unless it is
  already public-safe

## 3. Configure OAuth Consent

Use [OAUTH_CONSENT_DRAFT.md](OAUTH_CONSENT_DRAFT.md).

Field map:

```text
App name: Open APA Desk
Audience/user type: External
Support email: josh@unit27research.com
Developer contact email: josh@unit27research.com
App logo: https://unit27research.github.io/open-apa-desk/assets/branding/open-apa-desk-icon-128.png
Application home page: https://unit27research.github.io/open-apa-desk/
Privacy policy: https://unit27research.github.io/open-apa-desk/PRIVACY.html
Terms of service: https://unit27research.github.io/open-apa-desk/TERMS.html
Authorized domain: github.io
```

Scopes must match `src/appsscript.json`, the OAuth consent screen, and the
Marketplace SDK:

```text
https://www.googleapis.com/auth/documents.currentonly
https://www.googleapis.com/auth/script.container.ui
https://www.googleapis.com/auth/script.external_request
https://www.googleapis.com/auth/script.storage
```

If Google requires OAuth verification, prepare a demo video showing the exact
install/authorization flow and the APA Paper + Refs features. Do not add new
scopes to work around verification.

If the Google Auth platform prompts for OAuth credentials during setup, create
them inside the standard Cloud project and keep any generated client IDs or
secrets out of the public repo.

## 4. Refresh Apps Script Deployment

From the repository root:

```bash
npm run verify
npm run build
./node_modules/.bin/clasp push --force
```

In Apps Script project settings, add or confirm:

```text
CROSSREF_MAILTO=josh@unit27research.com
```

Create a new Apps Script version after the public icon URL, manifest scopes,
and script property are confirmed. Record the version number in local operator
notes and update public docs only if the version number is safe to publish.

## 5. Configure Marketplace SDK

Use [MARKETPLACE_SDK_CONFIG_DRAFT.md](MARKETPLACE_SDK_CONFIG_DRAFT.md) and
[MARKETPLACE_LISTING_DRAFT.md](MARKETPLACE_LISTING_DRAFT.md).

App configuration:

```text
App visibility: Public
Install setting: Individual + Admin Install
Integration: Google Docs Editor Add-on
Apps Script project ID: from Apps Script project settings
Apps Script version: post-console Apps Script version
Developer name: Unit27 Research
Developer website URL: https://unit27research.com
Developer email: josh@unit27research.com
Trader status: Non-trader
```

Important:

- Google documents Marketplace visibility as effectively one-way after saving.
- Use the Google Workspace Marketplace SDK, not the licensing/billing API.
- For an Editor add-on, Google asks for the Apps Script project script ID and
  version.
- Revisit non-trader only if Google review questions the Unit27 Research
  publisher identity for this free/open-source project.

Save as draft first. Do not publish until the final smoke pass is recorded.

## 6. Store Listing And Assets

Use [MARKETPLACE_LISTING_DRAFT.md](MARKETPLACE_LISTING_DRAFT.md).

Required public URLs:

```text
Home: https://unit27research.github.io/open-apa-desk/
Privacy: https://unit27research.github.io/open-apa-desk/PRIVACY.html
Terms: https://unit27research.github.io/open-apa-desk/TERMS.html
Support: https://github.com/unit27research/open-apa-desk/issues
Icon: https://unit27research.github.io/open-apa-desk/assets/branding/open-apa-desk-icon-128.png
```

Graphics:

```text
assets/branding/open-apa-desk-icon-32.png
assets/branding/open-apa-desk-icon-128.png
assets/branding/open-apa-desk-card-banner-220x140.png
```

Screenshots:

- Google requires at least one screenshot showing Google integration.
- Use up to five screenshots.
- Accepted sizes are tracked in [SCREENSHOT_CAPTURE_PLAN.md](SCREENSHOT_CAPTURE_PLAN.md).

Run:

```bash
npm run marketplace:assets:final
```

## 7. Final Smoke Evidence

Use [SMOKE_TEST.md](SMOKE_TEST.md) and
[SCREENSHOT_CAPTURE_PLAN.md](SCREENSHOT_CAPTURE_PLAN.md).
Copy [FINAL_SMOKE_EVIDENCE_TEMPLATE.md](FINAL_SMOKE_EVIDENCE_TEMPLATE.md) into
an ignored private path before recording live evidence.

Record local/private evidence for:

- sidebar form entry
- DOI lookup with real `CROSSREF_MAILTO`
- manual reference entry
- parenthetical citation insertion
- narrative citation insertion
- grouped citation insertion
- References rebuild
- `Prepare Current Copy`
- PDF export without visible marker text
- DOCX export without visible marker text

Keep Google Doc URLs, script IDs, tester account details, and export files out
of the public repo unless they are explicitly sanitized.

## 8. Pre-Submit Gate

Immediately before Marketplace submission:

```bash
npm run upload:preflight
```

Then confirm:

- OAuth consent screen is external and no longer in a testing-only state if
  Google requires production status for review
- Marketplace SDK app configuration is saved as draft with matching scopes
- final screenshots are selected
- support and developer fields match the launch packet
- no internal local files, script IDs, Google Doc URLs, or private tester
  details are committed
