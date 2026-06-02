# Contributing

Open APA Desk is currently in V0.1 alpha.

## Scope

V0 is intentionally narrow:

- APA 7 only.
- Google Docs Editor Add-on only.
- Paper setup, saved references, DOI lookup, citation insertion, References
  rebuild, companion Sheet sync, and Clean Copy.
- No MLA, Turabian, URL scraping, AI writing, backend account system, or
  whole-document formatter.

Pull requests should keep that scope unless an issue or maintainer note
explicitly expands it.

## Local Setup

```bash
npm install
npm run verify
```

`npm run verify` runs TypeScript, Vitest, and the Apps Script bundle build.

## Apps Script Testing

Use a copied Google Doc or disposable bound Apps Script project for live testing.
Do not commit `.clasp.json`; it contains a user-specific script ID and is
ignored by Git.

## Privacy And Safety

- Do not add backend calls.
- Do not add AI calls.
- Do not collect analytics.
- Keep DOI lookup limited to Crossref unless a separate privacy review is done.
- Prefer the narrowest Google OAuth scopes that still support the feature.

## Citation Accuracy

APA rendering changes should include focused tests under `tests/`. Do not claim
full APA manual coverage unless the code and tests actually support it.
