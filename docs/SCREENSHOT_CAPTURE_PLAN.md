# Screenshot Capture Plan

Date: 2026-06-02

Google Workspace Marketplace requires at least one screenshot showing the app's
integration with Google services and allows up to five.

Source checked on 2026-06-02:

- Create a store listing:
  https://developers.google.com/workspace/marketplace/create-listing

Marketplace screenshot size guidance:

- preferred: `1280 x 800`
- fallback: `640 x 400`
- fallback: `2560 x 1600`
- square corners and full bleed, with no padding

## Marketplace-Size Alpha Screenshot Assets

Captured in Chrome from the no-Sheets copied-template smoke Doc:

- `assets/screenshots/01-google-docs-menu-open.jpg`
  - Shows the Google Docs `Open APA Desk` menu with no library-import action.
- `assets/screenshots/02-sidebar-paper-setup.jpg`
  - Shows the Open APA Desk sidebar and paper setup fields.
- `assets/screenshots/03-references-output.jpg`
  - Shows the generated `References` heading in the copied Doc after
    `Prepare Current Copy`.

These are acceptable alpha evidence screenshots and are published by the static
site build under `site/assets/screenshots/`. They have been cropped and resized
to `1280 x 800` so repository and upload preflight checks can verify
Marketplace-compatible dimensions.

Before final Marketplace submission, replace or supplement them with
human-assisted screenshots after the refreshed live deployment and sidebar
form/export pass.

Run the strict final screenshot gate before Marketplace submission:

```bash
npm run marketplace:assets:final
```

This command verifies that the checked-in screenshot files use one of Google's
accepted dimensions. Passing this command does not replace the final visual
review after the live add-on is refreshed.

## Final Screenshot Set

Capture these after no-Sheets OAuth and human-assisted sidebar/export smoke
testing succeeds.

Record private smoke/export evidence with
[FINAL_SMOKE_EVIDENCE_TEMPLATE.md](FINAL_SMOKE_EVIDENCE_TEMPLATE.md). Commit
only sanitized final Marketplace screenshots.

1. Google Docs with `Open APA Desk` menu open
   - Shows the add-on is a Docs Editor Add-on.
   - Include `Prepare Current Copy` in the menu.
2. Sidebar Paper setup section
   - Shows title, author, institution, course, instructor, and due-date fields.
3. DOI lookup and reference form
   - Use a public example DOI.
   - Do not show private student data.
4. Citation insertion and saved-reference picker
   - Show parenthetical/narrative mode and locator field.
5. Generated References section or prepared copy result
   - Show output in the Doc body with no Open APA Desk marker text visible.

## Data Hygiene

- Use fake student names.
- Use fake course/instructor fields.
- Use public bibliographic examples only.
- Do not show browser account details if avoidable.
- Do not show private Google Doc URLs in cropped screenshots.

## Suggested Fixture

Paper:

```text
Title: Learning Workflows With Open Tools
Author: Jordan Miller
Institution: Example State University
Course: EDU 501
Instructor: Dr. Priya Khan
Due date: June 15, 2026
```

References:

```text
DOI journal article: 10.1037/0003-066X.59.1.29
Manual book: Miller, Jordan. 2024. Open Study Systems. Example Press.
```

## Capture Gate

Do not treat screenshots as final Marketplace screenshots until:

- reduced-scope OAuth authorization succeeds
- Crossref uses the public project contact fallback or a real override
- page number is visually confirmed in the template
- copied-template smoke pass succeeds
- copied-template sidebar form entry is visually confirmed
- PDF/DOCX export is checked for no marker text
- final screenshots are captured at `1280 x 800`, `640 x 400`, or
  `2560 x 1600`
- `npm run marketplace:assets:final` passes
