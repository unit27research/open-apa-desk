# V0 Backlog

Date: 2026-05-31

## Highest Priority

- Add student-paper page-number/header support or a clear manual helper flow.
  - V0.1 status: manual helper/template path documented; dynamic insertion is
    still deferred.
- Add reference edit/delete controls in the sidebar.
  - V0.1 status: implemented locally; needs next live smoke pass.
- Add body-section insertion so users have a clean writing area after the title page.
  - V0.1 status: controlled body-title starter implemented locally; needs next
    live smoke pass.
- Improve Clean Copy so future template/Marketplace paths avoid copied bound-script UI where possible.
  - V0.2 status: automatic Drive copy removed from active build. Users make a
    Google Docs copy and run `Prepare Current Copy` to remove markers from that
    copied document.

## Citation And Reference Accuracy

- Add same-author same-year `a`/`b` disambiguation.
- Add same-surname initial disambiguation.
- Add multiple-source parenthetical citations sorted like the References list.
  - V0.1 status: implemented locally; needs next live smoke pass.
- Add narrative citation insertion.
  - V0.1 status: implemented locally; needs next live smoke pass.
- Add richer locator support for sections, tables, chapters, and page ranges.
- Add more no-author and organization-author reference tests.
- Add APA rendering tests for missing issue, missing volume, reports with report numbers, edited book chapters, and webpages.

## Product Fit

- Add clearer first-run guidance without turning the app into a tutorial.
- Add import/export or Google Sheets sync for reusable cross-document reference
  libraries.
  - Marketplace V0 status: deferred to avoid Google Sheets OAuth scope.
- Add duplicate-reference detection.
  - V0.1 status: DOI and manual-entry duplicate collapse implemented locally;
    needs next live smoke pass.
- Add validation warnings before saving incomplete references.
- Add a clean setup reset command for test/template documents.

## Release Prep

- Prepare Marketplace-compatible branding and consent copy.
  - V0.1 status: draft listing copy and readiness matrix added; custom branding
    assets generated in Sprint 5. Public Pages asset URLs are live and checked
    by `npm run upload:preflight`.
- Confirm real `CROSSREF_MAILTO` is set in the live Apps Script project before
  public DOI testing.
  - V0.1 status: runtime now blocks DOI lookup if the script property is
    missing, malformed, or still an example email.
- Add screenshots/GIFs for install and first-use docs.
- Add contributor setup notes.
  - V0.1 status: `CONTRIBUTING.md` added.
- Add a security/privacy review checklist before any public alpha announcement.
  - V0.1 status: `SECURITY.md` and `docs/MARKETPLACE_READINESS.md` added.
- Live smoke test the reduced-scope `Prepare Current Copy` path.
- Add GitHub CI and issue templates.
  - V0.1 status: `Verify` workflow and issue/PR templates added.
