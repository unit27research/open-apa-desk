# Final Smoke Quick Run

Date: 2026-06-02

Use this as the short operator script for the final copied-template smoke pass.
Keep Google Doc URLs, Apps Script IDs, tester emails, PDF files, and DOCX files
out of the public repo.

Use a copied Open APA Desk APA starter template Doc that already has Google Docs
dynamic page numbers in the top-right header. Do not use a blank Doc for final
Marketplace smoke evidence.

Reference docs:

- [SMOKE_TEST.md](SMOKE_TEST.md)
- [SMOKE_TEST_FIXTURES.md](SMOKE_TEST_FIXTURES.md)
- [FINAL_SMOKE_EVIDENCE_TEMPLATE.md](FINAL_SMOKE_EVIDENCE_TEMPLATE.md)

## Before Touching The Doc

From the repo root:

```bash
npm run upload:preflight
npm run marketplace:assets:final
npm run submission:preflight -- --dry-run private/smoke-evidence/2026-06-02-final-smoke.md
git rev-parse --short HEAD
```

Confirm the private evidence file exists:

```text
private/smoke-evidence/2026-06-02-final-smoke.md
```

Confirm its `Build commit` matches the `git rev-parse --short HEAD` output.
If it does not, refresh the Apps Script build and rerun the affected smoke
checks before filling final evidence.

## In Google Docs

Use the copied APA starter template Doc, not the public template source and not
a blank Doc.

1. Reload the copied Doc.
2. Confirm `Open APA Desk` menu appears.
3. Open `Open APA Desk > Check DOI Setup`.
4. Confirm it says DOI lookup is configured for Crossref.
5. Open the sidebar.
6. Before setup, confirm page number `1` is visible in the title-page header.
7. Fill Paper fields from [SMOKE_TEST_FIXTURES.md](SMOKE_TEST_FIXTURES.md).
8. Click `Setup APA Paper`.
9. Visually confirm:
   - one title page
   - body starts with centered `Testing Open APA Desk`
   - page number `1` remains visible in the header/template
10. Add enough body text or a page break to reach a second page and confirm the
    next page shows `2`, proving the number is dynamic.
11. Run `Setup APA Paper` again and confirm it replaces the controlled starter
   section instead of duplicating it.

## References And Citations

Use the DOI fixture:

```text
10.1037/0003-066x.59.1.29
```

1. Run DOI lookup.
2. Confirm/edit the loaded Ray article fields.
3. Save the DOI reference.
4. Save the same DOI again and confirm the list still has one Ray article.
5. Add the manual Garcia book from
   [SMOKE_TEST_FIXTURES.md](SMOKE_TEST_FIXTURES.md).
6. Add one throwaway manual website reference for edit/delete testing.
7. Use `Edit Selected` on the throwaway reference, save, and confirm it updates.
8. Insert a visible citation for the throwaway reference, then use
   `Delete Selected` and confirm the visible citation text remains in the Doc.
9. Insert these citations at the cursor:
   - `(Ray, 2004)`
   - `Ray (2004)`
   - `(Ray, 2004, p. 23)`
   - `(Garcia, 2021; Ray, 2004)`

Record the observed citation strings in the private evidence file.

## References Section And Clean Copy

1. Run `Rebuild References`.
2. Confirm the controlled References section has:
   - centered `References` heading
   - Ray article entry
   - Garcia book entry
   - no visible Open APA Desk marker text
3. Run `Rebuild References` again and confirm it replaces only the controlled
   References section.
4. Make a Google Docs copy of the smoke Doc.
5. In the copy, run `Prepare Current Copy`.
6. Confirm no visible `[[OPEN_APA_DESK` marker text remains in the copy.

## Export Evidence

Export the prepared copy to:

```text
private/smoke-evidence/exports/
```

Required files:

```text
*.pdf
*.docx
```

Then run:

```bash
npm run smoke:exports
```

Visually inspect both exports. The helper is a marker-leak scan; it is not a
substitute for checking that the PDF and DOCX are readable and still show
correct page numbers.

## Final Gates

After filling the private evidence file:

```bash
npm run smoke:evidence:check -- private/smoke-evidence/2026-06-02-final-smoke.md
npm run submission:preflight -- private/smoke-evidence/2026-06-02-final-smoke.md
```

Only proceed to Google Cloud, OAuth consent, and Marketplace SDK console fields
after both commands pass.
