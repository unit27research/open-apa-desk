# Page Number Feasibility

Date: 2026-05-31

## Finding

Open APA Desk V0.1 should not fake page numbers with static text.

Google Docs supports automatic page numbers in the editor, and the Docs API can
represent page numbers as `AutoText` with `PAGE_NUMBER`. However, the public
Docs API `batchUpdate` request list does not expose an insert-auto-text request,
and Apps Script `DocumentApp` documents page numbers as unsupported elements.

## V0.1 Decision

Use a manual/template flow:

- For alpha smoke tests, add page numbers in Google Docs with
  `Insert > Page elements > Page numbers` and choose the top-right option.
- For shared templates, prepare the template Doc with Google Docs page numbers
  already inserted.
- Open APA Desk can show a page-number reminder, but it should not insert static
  numeric header text.

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
- Keep an alpha template with top-right page numbers already configured.
- If a template is used, verify clean-copy PDF/DOCX exports preserve the page
  numbers before public alpha release.

## Sprint 2 Check

On 2026-06-01, Chrome verification found Google Docs' current page-number menu
under `Insert > Page elements > Page numbers`. The top-right preset was clicked
in the alpha template and the Doc saved, but the page number was not visually
confirmed afterward. Treat page numbers as a human-confirmed template setup item
until a copied-template PDF/DOCX export proves the header number survives.
