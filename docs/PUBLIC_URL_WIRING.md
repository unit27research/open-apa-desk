# Public URL Wiring

Date: 2026-06-02

Open APA Desk needs stable public URLs before Marketplace submission.

## Current Status

GitHub authentication is working for the publishing account, the public
repository is live, and the included GitHub Pages workflow is publishing the
static public site from `site/`.

Verified public URLs:

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
`site/` directory after `main` is pushed. The upload preflight now checks the
home, privacy, terms, and icon URLs directly:

```bash
npm run upload:preflight
```

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

After any manifest or public-site change, run:

```bash
npm run verify
npm run upload:preflight
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

## Remaining Marketplace Blocker

The public URL lane is no longer blocked. Marketplace submission still needs
standard Google Cloud project setup and final human-assisted sidebar/export
evidence.
