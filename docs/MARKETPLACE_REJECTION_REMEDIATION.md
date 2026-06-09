# Marketplace Rejection Remediation

Date: 2026-06-09

Google rejected the initial Open APA Desk Marketplace submission on
2026-06-03. The rejection is correctable.

Source PDFs: Google Workspace Marketplace review and rejection emails saved in
local operator files. Do not commit Marketplace app IDs, private review links,
or reviewer-only artifacts.

## Rejection Items

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
Marketplace, submit OAuth verification in Google Cloud for the exact scopes used
by the Apps Script project, OAuth consent screen, and Marketplace SDK.

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
4. Upload the refreshed `site/` contents or Hostinger `open-apa-desk` folder so
   `https://unit27research.com/open-apa-desk/support.html` resolves.
5. In Google Workspace Marketplace SDK, update:
   - Short description
   - Detailed description
   - Support URL
6. In Google Cloud OAuth consent, confirm the scopes match exactly and submit
   OAuth verification.
7. After OAuth verification is approved, resubmit the Marketplace listing.

Do not add new scopes to work around review. If Google requests scope changes,
update `src/appsscript.json`, OAuth consent, Marketplace SDK scopes, docs, and
tests together.
