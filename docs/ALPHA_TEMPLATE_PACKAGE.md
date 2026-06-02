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
2. Add page numbers manually in Google Docs:
   `Insert > Page elements > Page numbers`, then choose the top-right option.
3. Bind or attach the current Apps Script project.
4. Push the built `dist/` files with `clasp push --force`.
5. Set the script property:

```text
CROSSREF_MAILTO=maintainer@example.com
```

6. Replace the placeholder email before any public tester uses DOI lookup.

For the current alpha template target above, the page-number menu path was
verified in Chrome. The page-number preset click saved the Doc, but the
top-right page number was not visually confirmed afterward. Before broader
sharing, open the template, confirm page number `1` appears in the header, and
re-apply the Google Docs page-number preset if needed.

## Alpha Smoke Path

Run this on a copy of the template:

1. Reload the Doc and confirm the `Open APA Desk` menu appears.
2. Open the sidebar and complete Google's authorization flow for the copied
   bound script.
3. Run `Check DOI Setup` and confirm DOI lookup is configured.
4. Run `Setup APA Paper`.
5. Confirm title page, controlled body starter, font, margins, and spacing.
6. Confirm Google Docs page numbers still appear in the header.
7. Add one DOI journal article and one manual book.
8. Edit one saved reference.
9. Try saving a duplicate DOI and confirm it updates instead of duplicating.
10. Insert a parenthetical citation with a locator.
11. Insert a narrative citation.
12. Select two references and insert a grouped parenthetical citation.
13. Rebuild References twice.
14. Delete one saved reference and confirm visible body citation text remains.
15. Use Google Docs `File > Make a copy`.
16. In the copied Doc, run `Prepare Current Copy`.
17. Export the prepared copy to PDF and DOCX.
18. Check exports for page numbers, title page, citation text, References, and
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
- Dynamic page numbers are handled by Google Docs' built-in UI or a prepared
  template, not by Open APA Desk automation.

## Not Public Yet

Do not share this as a public alpha link until:

- `CROSSREF_MAILTO` is set to a real project contact email.
- Sidebar loading is confirmed after authorizing the template script.
- The template's top-right Google Docs page number is visually confirmed.
- One copied-template smoke pass completes the full checklist above.
