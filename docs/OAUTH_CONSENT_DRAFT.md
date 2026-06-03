# OAuth Consent Draft

Date: 2026-06-02

Use this as the working draft for Google Cloud OAuth consent setup.

Sources checked on 2026-06-02:

- Configure OAuth:
  https://developers.google.com/workspace/marketplace/configure-oauth-consent-screen
- Publish an add-on:
  https://developers.google.com/workspace/add-ons/how-tos/publish-add-on-overview

## Current Status

OAuth consent is not configured for public release yet.

The OAuth consent screen, Google Workspace Marketplace SDK, and Apps Script
manifest scopes must match before submission.

Google lists billing and a standard Cloud project as publishing prerequisites.
Neither has been confirmed yet for Open APA Desk.

## App Information

App name:

```text
Open APA Desk
```

User support email:

```text
josh@unit27research.com
```

App logo:

```text
https://unit27research.github.io/open-apa-desk/assets/branding/open-apa-desk-icon-128.png
```

Application home page:

```text
https://unit27research.github.io/open-apa-desk/
```

Application privacy policy:

```text
https://unit27research.github.io/open-apa-desk/PRIVACY.html
```

Application terms of service:

```text
https://unit27research.github.io/open-apa-desk/TERMS.html
```

Authorized domains:

```text
github.io
```

Developer contact email:

```text
josh@unit27research.com
```

## Audience

Recommended first public setting:

```text
External
```

Reason: Open APA Desk is intended as a public, free tool rather than a private
domain-only add-on.

## Scopes

Current Apps Script manifest scopes:

```text
https://www.googleapis.com/auth/drive.file
https://www.googleapis.com/auth/documents.currentonly
https://www.googleapis.com/auth/script.container.ui
https://www.googleapis.com/auth/script.external_request
https://www.googleapis.com/auth/script.storage
```

Scope justifications:

- `drive.file`: create/copy an Open APA Desk APA starter document from the
  prepared template so required dynamic Google Docs page numbers are present.
- `documents.currentonly`: create and update controlled APA sections, citations,
  References, and marker removal inside the active copied Google Doc.
- `script.container.ui`: show the Google Docs menu, sidebar, and page-number
  help dialog.
- `script.external_request`: send DOI lookup requests to Crossref.
- `script.storage`: store per-document state and read an optional project
  `CROSSREF_MAILTO` script-property override.

## Sensitive Scope Watch

The current manifest avoids full Google Drive and Google Sheets scopes. The
limited `drive.file` scope is used only for the APA starter-template copy path.
Reusable cross-document reference library sync is deferred from Marketplace V0
to reduce consent friction.

## Verification Notes

Google might require OAuth verification for public apps with sensitive scopes.
If requested, prepare:

- a demo video showing the exact OAuth flow and feature use
- public privacy policy URL
- explanation of every scope
- confirmation that Open APA Desk has no backend server, account system,
  analytics service, AI calls, or hosted database

Before Marketplace review, confirm the OAuth audience/user type is `External`
and the publishing status is not `Testing` if Google requires production status
for review.
