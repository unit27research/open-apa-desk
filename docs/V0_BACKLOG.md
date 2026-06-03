# V0 Backlog

Date: 2026-05-31

## Highest Priority

- Resolve required APA page numbers for V0.
  - V0.1 status: starter-template copy path implemented and live-proven in
    Google Docs for page `1`, dynamic page `2`, and setup preservation.
    Marketplace readiness still needs PDF/DOCX export proof.
  - Required path: prepared APA starter template with export evidence, or
    another proven dynamic-field method.
- Add reference edit/delete controls in the sidebar.
  - V0.1 status: implemented locally; needs next live smoke pass.
- Add body-section insertion so users have a clean writing area after the title page.
  - V0.1 status: controlled body-title starter implemented locally; needs next
    live smoke pass.
- Improve Clean Copy so future template/Marketplace paths avoid copied bound-script UI where possible.
  - V0.1 status: active build uses `Prepare Current Copy` marker removal. It
    does not request full Drive scope; the only Drive scope is narrow
    `drive.file` access for APA starter-template copy creation.

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
- Confirm DOI lookup uses a project contact email before public DOI testing.
  - V0.1 status: runtime now uses the public Unit27 Research fallback when
    copied-template scripts do not carry script properties, and still blocks
    malformed or example `CROSSREF_MAILTO` overrides. The actual sidebar DOI
    lookup call still needs the final smoke pass.
- Add screenshots/GIFs for install and first-use docs.
- Add contributor setup notes.
  - V0.1 status: `CONTRIBUTING.md` added.
- Add a security/privacy review checklist before any public alpha announcement.
  - V0.1 status: `SECURITY.md` and `docs/MARKETPLACE_READINESS.md` added.
- Live smoke test the reduced-scope `Prepare Current Copy` path.
- Add GitHub CI and issue templates.
  - V0.1 status: `Verify` workflow and issue/PR templates added.
