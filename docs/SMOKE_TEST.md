# Live Google Docs Smoke Test

This checklist is the next step after local verification.

## Prerequisites

- Google account available in the browser.
- Apps Script project created for Open APA Desk.
- Test Google Doc created or ready to bind to the script.
- Real maintainer/project contact email available for Crossref polite API use.

## Smoke-Test Targets

Create a disposable bound Google Doc for regression checks and a separate
template-bound Google Doc for copied-template share testing. Keep the actual
Google Doc URLs, file IDs, Apps Script URLs, script IDs, and tester account
details out of the public repository.

For final Marketplace evidence, create an ignored private evidence packet:

```bash
npm run smoke:evidence
```

This creates `private/smoke-evidence/YYYY-MM-DD-final-smoke.md` from
[FINAL_SMOKE_EVIDENCE_TEMPLATE.md](FINAL_SMOKE_EVIDENCE_TEMPLATE.md), records
the current commit, and creates `private/smoke-evidence/exports/` for PDF/DOCX
exports. Keep PDF/DOCX exports under `private/` as well.

## Command Sequence

From the project root:

```bash
npm install
npm run verify
```

If the Apps Script API is not enabled, open:

```text
https://script.google.com/home/usersettings
```

Enable the Apps Script API toggle for the authenticated Google account and wait
a few minutes if Google has not propagated the setting yet.

Then run:

```bash
npm run clasp:push
```

In Apps Script project settings, add script property:

```text
CROSSREF_MAILTO=maintainer@example.com
```

Replace the placeholder with the actual project contact email before public
testing.

Optional local Crossref network check:

```bash
CROSSREF_MAILTO=project-contact@example.com npm run crossref:smoke
```

This sends one public fixture DOI to Crossref and confirms that Crossref returns
usable metadata. It does not replace the live Google Docs sidebar DOI lookup
check because it does not exercise Apps Script `UrlFetchApp` or the add-on UI.

Optional private export marker scan after PDF/DOCX export:

```bash
npm run smoke:exports
```

By default this scans PDF and DOCX files under
`private/smoke-evidence/exports/`. You can also pass export files or directories:

```bash
npm run smoke:exports -- private/smoke-evidence/exports/final.docx private/smoke-evidence/exports/final.pdf
```

This helper catches obvious `[[OPEN_APA_DESK` marker leakage in DOCX exports
and byte-level PDF output. It does not replace the human visual PDF/DOCX export
check because PDF text can be compressed or encoded.

After filling the private final smoke evidence file, validate it:

```bash
npm run smoke:evidence:check -- private/smoke-evidence/YYYY-MM-DD-final-smoke.md
```

## Manual Acceptance Checklist

Open the test Google Doc and reload it after pushing.

- `Open APA Desk` menu appears.
- `Open Sidebar` opens the sidebar.
- `Check DOI Setup` reports that DOI lookup is configured after
  `CROSSREF_MAILTO` is set.
- `Setup APA Paper` creates one controlled title page with one-inch margins,
  12-point Times New Roman, double spacing, centered student-paper fields, and
  a page break into the body.
- The body starts with a controlled centered copy of the paper title and a
  normal writing area after it.
- Running `Setup APA Paper` again replaces the existing controlled title/body
  starter blocks instead of duplicating them.
- DOI lookup sends the DOI to Crossref and fills editable fields.
- Manual reference entry works without DOI lookup.
- Author entry uses one author per line, not JSON.
- Saving a reference stores it in the current document state.
- Saving the same DOI twice updates the likely existing reference instead of
  adding a duplicate.
- `Edit Selected` loads a saved reference into the form and saving updates it.
- `Delete Selected` removes the saved reference from the document library
  without removing existing visible citation text.
- Parenthetical citation insertion writes readable citation text at the cursor.
- Narrative citation insertion writes readable citation text at the cursor.
- Multiple selected references insert one grouped parenthetical citation.
- Direct-quote locators such as `23`, `23-24`, and `para. 4` are included in
  single-source citations.
- `Rebuild References` creates the controlled References section with a centered
  heading and double-spaced hanging-indent entries.
- Running `Rebuild References` again replaces only the controlled References section.
- User can make a Google Docs copy, then `Prepare Current Copy` removes Open
  APA Desk marker paragraphs from that current copied document.
- Google Docs export to PDF and `.docx` still produces readable output.

## Known Live-Test Risks

- Apps Script scopes may need adjustment after first authorization.
- Chrome automation can see the sidebar visually but may not be able to read
  add-on iframe contents through DOM locators.
- Chrome automation may also be unable to type or paste into Google's
  sandboxed add-on sidebar iframe; DOI and reference form-entry checks can
  require manual entry even when the sidebar is visible.
- Google Docs canvas text and export URLs may not be machine-readable through
  browser automation, so final citation body text and PDF/DOCX checks can
  require human visual inspection.
- Marker paragraphs are intentionally used for the smoke-test path; named ranges/bookmarks are a later hardening option.
- `Prepare Current Copy` should be run only on a copied submission document.
  It removes hidden Open APA Desk control markers from the current document and
  does not create a duplicate automatically.
- `npm run smoke:exports` is a marker-leak helper, not proof of correct APA
  formatting or readable export layout.
- `npm run smoke:evidence:check` validates the private evidence file's required
  pass/yes/no fields. It cannot replace the actual live smoke actions.
- In the bound-script smoke-test path, the copied Google Doc can still show the
  `Open APA Desk` editor menu. That menu is not document body content and will
  not appear in PDF/DOCX exports.
- Google Docs visual formatting must be judged in the actual document, not from local tests.
- Dynamic page-number/header automation is not implemented. Users must add
  Google Docs page numbers manually or start from a prepared template before
  submission.
