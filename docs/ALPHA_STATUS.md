# Open APA Desk Alpha Status

Date: 2026-06-02

## Status

Open APA Desk is at a V0.1 alpha hardening checkpoint.

The current build has passed local verification and focused Google Docs smoke
testing. The active Marketplace V0 path uses current-document Docs access,
limited Drive file access to create APA starter documents from a prepared
template, Apps Script UI/storage scopes, and external request access for
Crossref DOI lookup. It does not request full Google Drive or Google Sheets
scope.

Users start from the prepared APA starter template, using `Create APA Starter
Doc` when the template ID is configured. For submission, they run `Prepare
Current Copy` on a copied document to remove hidden Open APA Desk markers.

## What The Alpha Covers

- custom `Open APA Desk` menu
- sidebar loading
- controlled APA student-paper setup
- idempotent paper setup
- DOI lookup through Crossref
- manual reference entry
- saved-reference edit and delete controls
- duplicate reference update behavior
- parenthetical, narrative, locator, and grouped citation rendering
- controlled References rebuild
- current-copy marker removal

## Remaining Alpha Risks

- Required APA page numbers now have a proven in-editor alpha path. The alpha
  path starts from a prepared Google Docs APA template with dynamic top-right
  page numbers; live proof confirmed page `1`, dynamic page `2`, and
  preservation after `Setup APA Paper`. Final smoke/export evidence must still
  prove page numbers survive current-copy prep, PDF export, and DOCX export.
- Full body-text verification for newly inserted citations still needs a human
  visual/export check in Google Docs.
- Reference rendering covers common student-paper cases, not the full APA
  manual.
- The current early install path is still a bound/template Google Doc, not a
  published Google Workspace Marketplace add-on.
- DOI lookup uses the public Unit27 Research project contact email when copied
  template scripts do not carry script properties. A `CROSSREF_MAILTO` script
  property can still override the fallback for deployed/operator projects.
- Chrome automation can open the sidebar and focus fields, but cannot type or
  paste into Google's sandboxed add-on iframe. Full sidebar form-entry smoke
  checks still need human input.
- PDF/DOCX export after `Prepare Current Copy` still needs a human/manual check
  in the current no-Drive-scope path.
- Reusable cross-document reference library sync is deferred from Marketplace
  V0 to avoid Google Sheets OAuth scope.

## Public Links

- Citation audit:
  [APA_CITATION_AUDIT.md](APA_CITATION_AUDIT.md)
- Page-number feasibility:
  [PAGE_NUMBER_FEASIBILITY.md](PAGE_NUMBER_FEASIBILITY.md)
- Smoke-test checklist:
  [SMOKE_TEST.md](SMOKE_TEST.md)
