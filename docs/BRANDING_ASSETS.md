# Branding Assets

Date: 2026-06-02

Open APA Desk uses simple project-owned PNG assets for Marketplace preparation.
Do not use Google Docs, APA, or other third-party product marks as Open APA Desk
branding.

## Generated Files

- `assets/branding/open-apa-desk-icon-32.png`
- `assets/branding/open-apa-desk-icon-128.png`
- `assets/branding/open-apa-desk-card-banner-220x140.png`

Regenerate them with:

```bash
npm run assets:brand
```

The generator is `scripts/generate-brand-assets.mjs` and has no external image
dependencies.

`npm run release:check` verifies the Marketplace branding dimensions:

- icon: `32 x 32`
- icon: `128 x 128`
- card banner: `220 x 140`

## Marketplace Use

The assets are local and repo-ready. `src/appsscript.json`
`addOns.common.logoUrl` is wired to the expected GitHub Pages URL:

```text
https://unit27research.github.io/open-apa-desk/assets/branding/open-apa-desk-icon-128.png
```

Before Marketplace submission, publish GitHub Pages, confirm that URL resolves,
then push the updated manifest to Apps Script and create a new Apps Script
version.
