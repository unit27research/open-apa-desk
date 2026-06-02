# Security Policy

## Supported Versions

Open APA Desk is in V0.1 alpha. Security fixes should target the current `main`
branch until a formal release line exists.

## Reporting A Vulnerability

Before public launch, report issues directly to the maintainer through the
repository issue tracker or the developer contact listed in the Marketplace
draft.

Do not include private document content, private Google Doc URLs, access tokens,
or OAuth credentials in public issues.

## Privacy-Sensitive Areas

Security review should focus on:

- Google OAuth scopes in `src/appsscript.json`
- `Prepare Clean Copy` and any Drive access
- Crossref DOI lookup through `UrlFetchApp`
- document properties and companion Sheet storage
- generated marker removal in clean copies

Open APA Desk V0 should not add a backend server, analytics service, AI call, or
account system without a new privacy and security review.
