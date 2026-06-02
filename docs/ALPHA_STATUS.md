# Open APA Desk Alpha Status

Date: 2026-06-02

## Status

Open APA Desk is at a V0.1 alpha hardening checkpoint.

The current build has passed local verification and focused Google Docs smoke
testing. The active Marketplace V0 path uses current-document Docs access,
Apps Script UI/storage scopes, and external request access for Crossref DOI
lookup. It does not request full Google Drive or Google Sheets scope.

Users make a copy in Google Docs and run `Prepare Current Copy` on that copy to
remove hidden Open APA Desk markers before submission.

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

- Dynamic page-number automation is not implemented. The alpha path uses Google
  Docs' built-in page-number UI or a prepared template.
- Full body-text verification for newly inserted citations still needs a human
  visual/export check in Google Docs.
- Reference rendering covers common student-paper cases, not the full APA
  manual.
- The current early install path is still a bound/template Google Doc, not a
  published Google Workspace Marketplace add-on.
- The current smoke-test and refreshed alpha-template scripts have confirmed
  project `CROSSREF_MAILTO` script properties. Future Marketplace deployments
  must confirm the same setting before DOI lookup is used by public testers.
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
