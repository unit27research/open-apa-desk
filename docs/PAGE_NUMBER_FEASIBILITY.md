# Page Number Feasibility

Date: 2026-05-31

## Finding

Open APA Desk V0.1 should not fake page numbers with static text.

Google Docs supports automatic page numbers in the editor, and the Docs API can
represent page numbers as `AutoText` with `PAGE_NUMBER`. However, the public
Docs API `batchUpdate` request list does not expose an insert-auto-text request,
and Apps Script `DocumentApp` documents page numbers as unsupported elements.

## V0 Release Blocker

Page numbers are required for APA 7 student papers. Open APA Desk must not ship
a Marketplace V0 that claims APA paper setup while relying on a manual
page-number step.

Because Apps Script cannot safely insert dynamic Google Docs page-number fields,
V0 must use a prepared APA starter document with Google Docs page numbers
already inserted, or another proven dynamic-field path. Static header numbers
are not acceptable because they fail on multi-page papers.

Sprint 6 implements and live-proves the prepared-starter path. `Create APA
Starter Doc` copies the configured template with narrow `drive.file` access when
Google allows it. In the live alpha project, Google returned Drive status `403`
for automatic copy, and the fallback Google Docs copy-page link successfully
created the starter document without requesting full Drive scope.

Live Google Docs proof on 2026-06-02 confirmed:

- page `1` appears in the title-page header of a fresh starter copy
- page `2` appears after a real page break, proving the field is dynamic
- `Setup APA Paper` preserves page `1` on the generated title page
- `Setup APA Paper` preserves page `2` on the next page
- `Prepare Current Copy`, PDF export, and DOCX export preserve the dynamic page
  numbers in the submitted Marketplace evidence

## Sources

- Apps Script Document service: `UnsupportedElement` includes regions such as a
  page number.
  https://developers.google.com/apps-script/reference/document
- Google Docs API structure: `AutoText` is used for dynamic page numbers.
  https://developers.google.com/workspace/docs/api/concepts/structure
- Google Docs API `batchUpdate`: request types include text/header operations,
  but no insert-auto-text request.
  https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/batchUpdate
- Google Docs Help: page numbers can be added from the Google Docs editor.
  https://support.google.com/docs/answer/86629

## Later Options

- Re-check the Docs API before Marketplace packaging in case Google adds an
  insert-auto-text request.
- Keep an alpha template with top-right page numbers already configured and
  treat it as the required starting surface for Marketplace V0.
- Re-check clean-copy PDF/DOCX export preservation after any future template,
  setup, or marker-removal change.

## Sprint 2 Check

On 2026-06-01, Chrome verification found Google Docs' current page-number menu
under `Insert > Page elements > Page numbers`. The top-right preset was clicked
in the alpha template and the Doc saved, but the page number was not visually
confirmed afterward.

On 2026-06-02, live copied-template smoke testing confirmed that the current
blank/current-document setup flow can produce a title block without visible page
number `1`. That is a release blocker, not a cosmetic limitation. Treat final
Marketplace smoke evidence as failed until a prepared-template or equivalent
dynamic page-number path is proven.

Later on 2026-06-02, the prepared-template path was corrected and proven in
Google Docs. Later smoke evidence also confirmed PDF/DOCX export preservation.
The remaining page-number risk is regression after future template, setup, or
marker-removal changes.
