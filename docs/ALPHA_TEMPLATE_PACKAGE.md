# Alpha Template Package

Date: 2026-06-01

## Purpose

This is the practical package for a small, non-Marketplace alpha test of Open
APA Desk. It keeps the current privacy-first design and avoids claiming full APA
automation before the dynamic page-number gap is solved.

## Alpha Template Target

Create a separate bound Apps Script project for alpha testing so any disposable
smoke-test documents remain separate from the Marketplace deployment path. Do
not commit private Google Doc URLs, Apps Script URLs, script IDs, or tester
account details.

Live template checks should confirm:

- the template Doc loads
- the `Open APA Desk` menu appears
- the menu contains `Open Sidebar`, `Setup APA Paper`, `Page Number Help`,
  `Check DOI Setup`, `Rebuild References`, and `Prepare Current Copy`
- first sidebar open shows Google's expected `Authorization required` dialog
- sidebar loading succeeds after OAuth authorization

Sprint 4 changed the active build from automatic `Prepare Clean Copy` to
current-document `Prepare Current Copy`.

## Template Doc Setup

1. Create a new Google Doc named `Open APA Desk Alpha Template`.
2. Add real Google Docs dynamic page numbers in the top-right header and confirm
   page number `1` is visible on the title page.
3. Bind or attach the current Apps Script project.
4. Push the built `dist/` files with `clasp push --force`.
5. Optionally set the script-property override:

```text
CROSSREF_MAILTO=maintainer@example.com
```

6. Replace the placeholder email before public testing if an override is used.
   If no override is set, DOI lookup uses the public Unit27 Research project
   contact fallback.

For the current alpha template target above, the page-number preset click was
not enough evidence because the top-right page number was not visually confirmed
afterward. Before broader sharing, open the template, confirm page number `1`
appears in the title-page header, add enough content or a page break to confirm
the next page shows `2`, and re-apply the Google Docs page-number preset if
needed.

## Alpha Smoke Path

Run this on a copy of the template:

1. Reload the Doc and confirm the `Open APA Desk` menu appears.
2. Open the sidebar and complete Google's authorization flow for the copied
   bound script.
3. Run `Check DOI Setup` and confirm DOI lookup is configured.
4. Run `Setup APA Paper`.
5. Confirm title page, controlled body starter, font, margins, and spacing.
6. Confirm page number `1` still appears in the title-page header.
7. Add enough content or a page break to confirm the next page shows `2`.
8. Add one DOI journal article and one manual book.
9. Edit one saved reference.
10. Try saving a duplicate DOI and confirm it updates instead of duplicating.
11. Insert a parenthetical citation with a locator.
12. Insert a narrative citation.
13. Select two references and insert a grouped parenthetical citation.
14. Rebuild References twice.
15. Delete one saved reference and confirm visible body citation text remains.
16. Use Google Docs `File > Make a copy`.
17. In the copied Doc, run `Prepare Current Copy`.
18. Export the prepared copy to PDF and DOCX.
19. Check exports for page numbers, title page, citation text, References, and
    absence of `[[OPEN_APA_DESK` marker text.

## Package Contents

- `README.md`
- `PRIVACY.md`
- `LIMITATIONS.md`
- `docs/SMOKE_TEST.md`
- `docs/PAGE_NUMBER_FEASIBILITY.md`
- `docs/APA_CITATION_AUDIT.md`
- `docs/ALPHA_STATUS.md`

## Public-Safe Notes

- Open APA Desk is not an official APA product.
- Users remain responsible for instructor, institution, and APA requirements.
- V0.1 has no backend server, no Open APA Desk account, and no AI calls.
- DOI lookup sends the entered DOI to Crossref.
- Required dynamic page numbers are provided by the prepared APA starter
  template until Open APA Desk has a proven API-safe way to create them.

## Not Public Yet

Do not share this as a public alpha link until:

- Crossref uses the public project contact fallback or a real
  `CROSSREF_MAILTO` override.
- Sidebar loading is confirmed after authorizing the template script.
- The template's top-right Google Docs page number `1` is visually confirmed.
- A later template page shows an incremented dynamic page number.
- One copied-template smoke pass completes the full checklist above.
