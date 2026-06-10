# Marketplace Listing Draft

Date: 2026-06-02

This is the corrected copy for the Google Workspace Marketplace resubmission.
Review status is tracked in `docs/MARKETPLACE_READINESS.md`.

## App Details

Application name:

```text
Open APA Desk
```

Short description:

```text
A free APA 7 helper for Google Docs™ student papers, citations, and references.
```

Detailed description:

```text
Open APA Desk is a free, privacy-first APA 7 helper for Google Docs™.

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

Google Docs™ is a trademark of Google LLC.
```

Category:

```text
Academic Resources
```

Pricing:

```text
Free of charge
```

## Support Links

Use these public URLs for the Marketplace resubmission:

- Privacy policy: https://unit27research.com/open-apa-desk/PRIVACY.html
- Terms of service: https://unit27research.com/open-apa-desk/TERMS.html
- Support URL: https://unit27research.com/open-apa-desk/support.html
- Report issue URL: https://github.com/unit27research/open-apa-desk/issues

## Developer Information

Developer name:

```text
Unit27 Research
```

If the Marketplace SDK requires a personal legal name instead of an organization
display name, use:

```text
Joshua Bloodworth
```

Developer website URL:

```text
https://unit27research.com
```

Developer email:

```text
josh@unit27research.com
```

Trader/non-trader status:

```text
Non-trader
```

Google's Marketplace SDK describes this as an EEA consumer-disclosure field.
Non-trader is selected for the initial draft because Open APA Desk is free,
open-source, and not monetized, and the developer does not want to disclose a
home address as a Marketplace mailing address. If Google review treats the
Unit27 Research publisher identity as business/professional activity, revisit
this choice and either switch to Trader with a business-safe mailing address or
adjust the developer identity.

## OAuth Scope Justifications

Current manifest scopes:

- `https://www.googleapis.com/auth/drive.file`
  - Used only to create/copy an APA starter document from the prepared template
    so required dynamic page numbers are present.
- `https://www.googleapis.com/auth/documents.currentonly`
  - Used to read and write controlled sections, citations, References, and clean
    copy marker removal in the current document.
- `https://www.googleapis.com/auth/script.container.ui`
  - Used to show the Docs menu, sidebar, and page-number help dialog.
- `https://www.googleapis.com/auth/script.external_request`
  - Used for DOI lookup through Crossref.
- `https://www.googleapis.com/auth/script.storage`
  - Used for document properties and per-document Open APA Desk state; also
    supports an optional `CROSSREF_MAILTO` override.

## Graphic Assets

- 32 x 32 app icon:
  `assets/branding/open-apa-desk-icon-32.png`
- 128 x 128 app icon:
  `assets/branding/open-apa-desk-icon-128.png`
- 220 x 140 app card banner:
  `assets/branding/open-apa-desk-card-banner-220x140.png`
- Submitted Marketplace screenshot assets:
  - `assets/screenshots/01-google-docs-menu-open.jpg`
  - `assets/screenshots/02-sidebar-paper-setup.jpg`
  - `assets/screenshots/03-references-output.jpg`

Do not use Google product icons as Open APA Desk branding.
