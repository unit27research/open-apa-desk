# Phase 0 Feasibility Notes

Date: 2026-05-31

## Citation Engine

Decision: hand-code APA 7 rendering for V0 and keep CSL as a later spike.

Reasoning:

- V0 only supports five common source types.
- The project already has unit-tested renderers for the first source set.
- Full CSL support would add package weight, style-file handling, and Apps Script
  bundling risk before the Google Docs workflow is proven.

Fallback recorded: if broader source coverage becomes the priority, test
`citeproc-js`, Citation.js, and APA CSL style bundling in Apps Script before
expanding the hand-coded renderer.

## Google Docs Tracking

Decision: use document properties as the authoritative V0 state store. Use
visible normal citation text in the document and store citation/reference
relationships internally. Generated title and References sections are wrapped
with Open APA Desk control marker paragraphs styled as tiny white text for the
first smoke-test path. The active Marketplace-oriented build expects users to
make a Google Docs copy and then run `Prepare Current Copy` to remove marker
paragraphs from that copied submission document.

Fallback recorded: named ranges/bookmarks remain a later hardening path after
hands-on Google Docs testing confirms reliability.

## Install Path

Decision: build with `clasp` + TypeScript and deploy compiled files from
`dist/`. Early non-developer testing should use a template/bound Google Doc.
Marketplace packaging remains a later milestone.

Current proof:

- local TypeScript typecheck succeeds
- unit tests run locally
- Apps Script bundle builds into `dist/`
- `.clasp.example.json` points `clasp` at `dist/`

Not yet proven:

- authenticated `clasp push`
- Google Docs runtime behavior
- non-developer template install flow
- marker stripping in the current copied Google Doc
- Google Workspace Marketplace review path
