# Marketplace SDK Config Draft

Date: 2026-06-01

Use this as the working field map for the Google Workspace Marketplace SDK.

Sources checked on 2026-06-01:

- Configure your app in the Google Workspace Marketplace SDK:
  https://developers.google.com/workspace/marketplace/enable-configure-sdk
- Publish an add-on:
  https://developers.google.com/workspace/add-ons/how-tos/publish-add-on-overview
- Create a store listing:
  https://developers.google.com/workspace/marketplace/create-listing

## Current Status

The Marketplace SDK configuration has not been created yet.

Post-Pages Apps Script version `1` exists in the operator environment after the
public manifest `logoUrl` was pushed.

Use [LAUNCH_SUBMISSION_PACKET.md](LAUNCH_SUBMISSION_PACKET.md) as the
copy/paste handoff packet when entering the SDK, OAuth, and listing fields.

## App Configuration

App visibility:

```text
Public
```

Install setting:

```text
Individual + Admin Install
```

Reason: Open APA Desk is useful for individual students and writers, while
schools or organizations may also install it centrally.

Visibility warning: confirm the publishing account and public/private choice
before saving. Google documents Marketplace visibility as a one-way setting
after the App Configuration page is saved.

Google Workspace integration:

```text
Google Docs Editor Add-on
```

Apps Script project ID:

```text
TODO: Apps Script project ID from the standard Cloud-linked deployment
```

Apps Script version:

```text
1
```

Version description:

```text
0.1.0-alpha.0 post-pages public-url alpha
```

## OAuth Scopes

Add exactly the same scopes used in `src/appsscript.json`:

```text
https://www.googleapis.com/auth/documents.currentonly
https://www.googleapis.com/auth/script.container.ui
https://www.googleapis.com/auth/script.external_request
https://www.googleapis.com/auth/script.storage
```

## Store Listing Fields

Use the copy in `docs/MARKETPLACE_LISTING_DRAFT.md`.

Required screenshot files still need final selection after the human-assisted
smoke pass. Alpha files currently available:

- `assets/screenshots/01-google-docs-menu-open.jpg`
- `assets/screenshots/02-sidebar-paper-setup.jpg`
- `assets/screenshots/03-references-output.jpg`

Expected public URLs after GitHub Pages deploy:

- Privacy policy URL:
  https://unit27research.github.io/open-apa-desk/PRIVACY.html
- Terms of service URL:
  https://unit27research.github.io/open-apa-desk/TERMS.html
- Support URL:
  https://github.com/unit27research/open-apa-desk/issues
- App icon public URL:
  https://unit27research.github.io/open-apa-desk/assets/branding/open-apa-desk-icon-128.png

## Save Strategy

1. Create the SDK app configuration as a draft.
2. Do not publish until OAuth consent and copied-template smoke testing are
   complete.
3. If any scope changes, update all three places together:
   - `src/appsscript.json`
   - OAuth consent screen
   - Marketplace SDK app configuration

## Irreversible Choice Warning

Google documents that some visibility choices cannot be changed after saving the
Marketplace SDK app configuration. Confirm the target owner/account and public
visibility decision before saving the final configuration.
