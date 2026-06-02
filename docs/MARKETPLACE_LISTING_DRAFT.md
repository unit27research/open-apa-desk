# Marketplace Listing Draft

Date: 2026-06-01

This is draft copy for the Google Workspace Marketplace listing. Do not submit
until the readiness gates in `docs/MARKETPLACE_READINESS.md` are closed.

## App Details

Application name:

```text
Open APA Desk
```

Short description:

```text
A free APA 7 helper for Google Docs student papers, citations, and references.
```

Detailed description:

```text
Open APA Desk is a free, privacy-first APA 7 helper for Google Docs.

It helps students set up controlled APA student-paper sections, save common
reference types, look up journal article metadata by DOI through Crossref,
insert readable parenthetical or narrative citations, rebuild a References
section, and prepare a copied document for submission by removing hidden tool
markers.

Open APA Desk does not use an Open APA Desk account, backend server, analytics
service, AI writing call, or hosted database. Document and reference data stays
in the user's Google Doc document properties. DOI lookup sends the DOI entered
by the user to Crossref.

Open APA Desk is not an official APA product and is not affiliated with,
endorsed by, sponsored by, or certified by the American Psychological
Association. Users remain responsible for checking instructor, institution, and
APA requirements before submission.
```

Category:

```text
Productivity
```

Pricing:

```text
Free of charge
```

## Support Links

These URLs should be verified after GitHub Pages is deployed:

- Privacy policy: https://unit27research.github.io/open-apa-desk/PRIVACY.html
- Terms of service: https://unit27research.github.io/open-apa-desk/TERMS.html
- Support URL: https://github.com/unit27research/open-apa-desk/issues
- Report issue URL: https://github.com/unit27research/open-apa-desk/issues

## Developer Information

Needed before submission:

- Developer name
- Developer website URL
- Developer email
- Trader/non-trader status
- Mailing address if trader status applies

## OAuth Scope Justifications

Current manifest scopes:

- `https://www.googleapis.com/auth/documents.currentonly`
  - Used to read and write controlled sections, citations, References, and clean
    copy marker removal in the current document.
- `https://www.googleapis.com/auth/script.container.ui`
  - Used to show the Docs menu, sidebar, and page-number help dialog.
- `https://www.googleapis.com/auth/script.external_request`
  - Used for DOI lookup through Crossref.
- `https://www.googleapis.com/auth/script.storage`
  - Used for document and script properties, including per-document state and
    `CROSSREF_MAILTO`.

## Graphic Assets Needed

- 32 x 32 app icon:
  `assets/branding/open-apa-desk-icon-32.png`
- 128 x 128 app icon:
  `assets/branding/open-apa-desk-icon-128.png`
- 220 x 140 app card banner:
  `assets/branding/open-apa-desk-card-banner-220x140.png`
- Alpha screenshot assets:
  - `assets/screenshots/01-google-docs-menu-open.jpg`
  - `assets/screenshots/02-sidebar-paper-setup.jpg`
  - `assets/screenshots/03-references-output.jpg`
- Final Marketplace screenshots should replace or supplement these after the
  human-assisted sidebar/export smoke pass.

Do not use Google product icons as Open APA Desk branding.
