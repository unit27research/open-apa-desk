# Public URL Wiring

Date: 2026-06-01

Open APA Desk needs stable public URLs before Marketplace submission.

## Preferred Path

After GitHub authentication is fixed, publish the repository and use the
included GitHub Pages workflow for stable project URLs.

Recommended public URLs:

```text
Project home: https://unit27research.github.io/open-apa-desk/
Privacy: https://unit27research.github.io/open-apa-desk/PRIVACY.html
Terms: https://unit27research.github.io/open-apa-desk/TERMS.html
Support: https://github.com/unit27research/open-apa-desk/issues
Icon: https://unit27research.github.io/open-apa-desk/assets/branding/open-apa-desk-icon-128.png
Banner: https://unit27research.github.io/open-apa-desk/assets/branding/open-apa-desk-card-banner-220x140.png
```

The static site is generated into `site/` with:

```bash
npm run site:build
```

The GitHub Pages workflow is `.github/workflows/pages.yml`. It publishes the
`site/` directory after `main` is pushed.

If GitHub Pages is not enabled, use raw GitHub URLs only as a temporary alpha
fallback.

## Manifest Status

`src/appsscript.json` is already wired to the expected public icon URL:

```json
{
  "addOns": {
    "common": {
      "logoUrl": "https://unit27research.github.io/open-apa-desk/assets/branding/open-apa-desk-icon-128.png"
    }
  }
}
```

After GitHub Pages is live, confirm the URL resolves, then run:

```bash
npm run verify
```

Push the verified build to the alpha Apps Script project and create a new Apps
Script version for Marketplace submission. Apps Script version `2` remains the
no-Sheets alpha smoke reference, but it was created before the public icon URL
change.

## Files That Need URL Updates

- `src/appsscript.json` source is already updated; live Apps Script still needs
  a post-Pages push/version
- `docs/MARKETPLACE_LISTING_DRAFT.md`
- `docs/MARKETPLACE_READINESS.md`
- `docs/OAUTH_CONSENT_DRAFT.md`
- `docs/MARKETPLACE_SDK_CONFIG_DRAFT.md`
- OAuth consent screen
- Marketplace SDK app configuration

## Current Blocker

GitHub CLI auth is invalid for `unit27research`. Fix with:

```bash
gh auth login -h github.com
gh auth status
```
