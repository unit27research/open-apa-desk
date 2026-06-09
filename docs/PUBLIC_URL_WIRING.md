# Public URL Wiring

Date: 2026-06-02

Open APA Desk uses two public URL lanes:

- GitHub Pages for the open-source repository, package homepage, and Apps
  Script manifest logo URL.
- `unit27research.com/open-apa-desk/` for Google Auth Platform and Marketplace
  listing URLs, because Google required ownership verification for the
  OAuth/Marketplace homepage domain.

## Current Status

GitHub authentication is working for the publishing account, the public
repository is live, and the included GitHub Pages workflow is publishing the
static public site from `site/`.

Verified GitHub Pages URLs:

```text
Project home: https://unit27research.github.io/open-apa-desk/
Privacy: https://unit27research.github.io/open-apa-desk/PRIVACY.html
Terms: https://unit27research.github.io/open-apa-desk/TERMS.html
Support: https://github.com/unit27research/open-apa-desk/issues
Support page: https://unit27research.github.io/open-apa-desk/support.html
Icon: https://unit27research.github.io/open-apa-desk/assets/branding/open-apa-desk-icon-128.png
Banner: https://unit27research.github.io/open-apa-desk/assets/branding/open-apa-desk-card-banner-220x140.png
```

Verified Unit27 Marketplace URLs:

```text
Project home: https://unit27research.com/open-apa-desk/
Privacy: https://unit27research.com/open-apa-desk/privacy.html
Terms: https://unit27research.com/open-apa-desk/terms.html
Support: https://unit27research.com/open-apa-desk/support.html
Icon: https://unit27research.com/open-apa-desk/assets/branding/open-apa-desk-icon-128.png
Banner: https://unit27research.com/open-apa-desk/assets/branding/open-apa-desk-card-banner-220x140.png
```

The static site is generated into `site/` with:

```bash
npm run site:build
```

The GitHub Pages workflow is `.github/workflows/pages.yml`. It publishes the
`site/` directory after `main` is pushed. The upload preflight now checks the
home, privacy, terms, support, and icon URLs directly:

```bash
npm run upload:preflight
```

## Manifest Status

`src/appsscript.json` is already wired to the expected GitHub Pages icon URL:

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

Push the verified build to the standalone Marketplace Apps Script project after
public-site or manifest changes. Apps Script version `1` exists in the
Marketplace-bound operator environment with description
`0.1.0-alpha.0 marketplace-bound initial` and was used for the initial Google
Workspace Marketplace review submission.

## Public URL Consumers

`src/appsscript.json`, `package.json`, upload preflight, and public-source
checks use the public GitHub Pages URLs.

OAuth consent, Google Auth Platform branding, and Marketplace SDK/listing fields
use the Unit27 URLs.

## Remaining Marketplace Blocker

The public URL lane needs the refreshed support page uploaded to Hostinger.
`unit27research.com` ownership was verified through Google Search Console
during the Marketplace submission pass. The initial Marketplace listing was
rejected on 2026-06-03; the remaining external blocker is OAuth verification
plus Marketplace resubmission with the corrected support and trademark fields.
