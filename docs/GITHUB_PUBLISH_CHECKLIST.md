# GitHub Publish Checklist

Date: 2026-06-02

## Current State

The public GitHub repository has been created. Use this checklist before each
future push or release update.

Confirmed locally:

- GitHub CLI authentication works for the publishing account
- `origin` points to `unit27research/open-apa-desk`
- `.clasp.json` is ignored and not tracked
- `dist/` is ignored and not tracked
- `node_modules/` is ignored and not tracked
- local verification passes with `npm run verify`
- upload readiness can be checked with `npm run upload:preflight`
- a manual public-repo archive can be created with `npm run publish:archive`
- Marketplace draft placeholders can be checked with
  `npm run marketplace:drafts:check`
- `npm run verify` includes a release-readiness check for OAuth scopes,
  generated public-site files, manifest icon URL, package metadata, GitHub
  workflows/templates, public repo docs, source guardrails, and tracked-file
  hygiene
- GitHub Actions workflow exists at `.github/workflows/verify.yml`
- GitHub Pages workflow exists at `.github/workflows/pages.yml`
- issue and pull request templates exist under `.github/`
- Dependabot is configured for npm and GitHub Actions updates
- static public site output exists under `site/`

Before pushing, run `npm run verify` and confirm `npm run release:check` passes.

## Recommended Repo Settings

- Repository name: `open-apa-desk`
- Visibility: public, after the human-assisted sidebar/export smoke pass
- License: MIT
- Default branch: `main`
- Issues: enabled
- Discussions: optional
- Wiki: off
- GitHub Pages: enable later if using Pages URLs for Privacy, Terms, and assets

## Publish Commands

After `gh auth login -h github.com` succeeds:

```bash
gh repo create open-apa-desk --public --source=. --remote=origin --push
npm run upload:preflight
```

If the repository is created manually in GitHub first:

```bash
git remote add origin git@github.com:unit27research/open-apa-desk.git
git push -u origin main
npm run upload:preflight
```

Adjust the owner if the public repository should live somewhere other than
`unit27research`.

## Manual Upload Fallback

If CLI publishing remains blocked, create a tracked-file-only archive:

```bash
npm run publish:archive
```

Use the generated `release/open-apa-desk-public-repo-<commit>.zip` for manual
GitHub web upload. The archive excludes `.clasp.json`, `dist/`, `node_modules/`,
and other ignored local files.

## Post-Push Tasks

1. Confirm the GitHub README renders correctly.
2. Confirm the PNG assets render in the GitHub file browser.
3. Confirm the `Verify` GitHub Actions workflow passes on `main`.
4. Enable GitHub Pages through GitHub Actions if it is not already enabled.
5. Confirm the Pages deployment publishes the `site/` directory.
6. Confirm the public icon URL resolves:
   `https://unit27research.github.io/open-apa-desk/assets/branding/open-apa-desk-icon-128.png`
7. Re-run `npm run verify`.
8. Push the updated manifest to the Apps Script alpha template.
9. Create a post-Pages Apps Script version for Marketplace SDK use.
