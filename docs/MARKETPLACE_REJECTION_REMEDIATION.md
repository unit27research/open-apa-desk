# Marketplace Rejection Remediation

Date: 2026-06-10

Google rejected the initial Open APA Desk Marketplace submission on
2026-06-03, then rejected the first resubmission on 2026-06-10. The rejection
is correctable.

Source PDFs: Google Workspace Marketplace review and rejection emails saved in
local operator files. Do not commit Marketplace app IDs, private review links,
or reviewer-only artifacts.

## Rejection Items

### 0. Privacy And Terms URLs Must Match Hosted Case

Google's 2026-06-10 rejection says the Privacy Policy and Terms of Service links
point to a "page does not exist" error. This is a live URL casing issue.

Use these exact Marketplace URLs:

```text
Privacy Policy URL: https://unit27research.com/open-apa-desk/PRIVACY.html
Terms of Service URL: https://unit27research.com/open-apa-desk/TERMS.html
Support URL: https://unit27research.com/open-apa-desk/support.html
```

Do not use lowercase `/privacy.html` or `/terms.html` in Marketplace fields
unless the Hostinger deployment intentionally includes true lowercase files.
macOS treats those filenames as aliases on the local filesystem; Hostinger does
not.

### 1. Google Trademark Attribution

Google said the short and detailed Marketplace descriptions must include the
trademark symbol when using Google product names.

Use this short description:

```text
A free APA 7 helper for Google Docs™ student papers, citations, and references.
```

Use the corrected detailed description in
`docs/MARKETPLACE_LISTING_DRAFT.md`.

The detailed description includes this attribution:

```text
Google Docs™ is a trademark of Google LLC.
```

### 2. Support URL Needs Contact Information

Google said the support link must provide a point of contact.

Use this Marketplace Support URL after the public site is uploaded:

```text
https://unit27research.com/open-apa-desk/support.html
```

The support page includes:

- `josh@unit27research.com`
- GitHub issues link
- warning not to post private paper/student/document data in public issues

### 3. OAuth Verification Is Missing

Google said Open APA Desk is missing OAuth verification. Before resubmitting to
Marketplace, check Google Auth Platform > Verification Center and the legacy
OAuth consent URL for the standard Cloud project.

If Google exposes a `Submit for Verification` action, submit OAuth verification
for the exact scopes used by the Apps Script project, OAuth consent screen, and
Marketplace SDK.

If Google Auth Platform continues to show:

```text
Branding: verified
Data access: Verification is not required since your app is not requesting any
sensitive or restricted scopes.
```

then resubmit with a reviewer note explaining that OAuth/data-access
verification is not available for the project because Google says it is not
required. Include the current scope list and, if possible, a screenshot of the
Verification Center state.

The scopes must match exactly:

```text
https://www.googleapis.com/auth/drive.file
https://www.googleapis.com/auth/documents.currentonly
https://www.googleapis.com/auth/script.container.ui
https://www.googleapis.com/auth/script.external_request
https://www.googleapis.com/auth/script.storage
```

Prepare a screen recording that shows:

1. Opening a Google Docs™ document.
2. Opening the Open APA Desk menu/sidebar.
3. Creating or opening the APA starter document path.
4. Setting up the APA paper.
5. Looking up a DOI through Crossref.
6. Adding a manual reference.
7. Inserting parenthetical and narrative citations.
8. Rebuilding References.
9. Running `Prepare Current Copy`.
10. Showing privacy behavior: no account, no backend, no AI calls, document
    state stored in the Google Doc.

## Resubmission Order

1. Run `npm run verify`.
2. Run `npm run marketplace:drafts:check`.
3. Run `npm run site:build`.
4. Confirm the public URLs resolve:
   - `https://unit27research.com/open-apa-desk/PRIVACY.html`
   - `https://unit27research.com/open-apa-desk/TERMS.html`
   - `https://unit27research.com/open-apa-desk/support.html`
5. In Google Workspace Marketplace SDK, update:
   - Privacy Policy URL
   - Terms of Service URL
   - Short description
   - Detailed description
   - Support URL
6. In Google Cloud OAuth consent / Google Auth Platform, confirm the scopes
   match exactly. Submit OAuth verification if Google exposes that action; if it
   does not, document the "verification not required" state in reviewer notes.
7. Resubmit the Marketplace listing.

Do not add new scopes to work around review. If Google requests scope changes,
update `src/appsscript.json`, OAuth consent, Marketplace SDK scopes, docs, and
tests together.
