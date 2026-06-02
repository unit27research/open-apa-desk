# Final Smoke Evidence Template

Date: YYYY-MM-DD

Do not fill this template with private Google Doc URLs, Apps Script URLs,
script IDs, Cloud project numbers, tester account emails, PDF exports, or DOCX
exports in the public repository.

Create an ignored private copy before final Marketplace smoke testing:

```bash
npm run smoke:evidence
```

This creates an evidence file like:

```text
private/smoke-evidence/YYYY-MM-DD-final-smoke.md
```

## Smoke Target

```text
Apps Script project: recorded in private operator notes
Google Doc target: recorded in private operator notes
Browser/profile: Chrome, authenticated publishing/test account
Build commit: <git SHA>
Apps Script version: <version number>
CROSSREF_MAILTO configured: yes/no
```

`Build commit` must match the current local `git HEAD` when
`npm run smoke:evidence:check` is run. If the repository changes after live
smoke testing, refresh the Apps Script build and rerun the affected smoke
checks before marking the evidence ready.

## Preflight Commands

Run before live smoke:

```bash
npm run upload:preflight
npm run build
npm run build:check
```

Record result:

```text
upload:preflight: pass/fail
build: pass/fail
build:check: pass/fail
npm run clasp:push: pass/fail
```

## Manual Smoke Checklist

| Check | Status | Private evidence notes |
| --- | --- | --- |
| Google Docs `Open APA Desk` menu appears | TODO |  |
| Sidebar opens after OAuth authorization | TODO |  |
| `Check DOI Setup` reports DOI lookup is configured | TODO |  |
| `Setup APA Paper` creates one controlled title/body starter | TODO |  |
| Re-running `Setup APA Paper` replaces, not duplicates | TODO |  |
| Page number `1` is visible in the header/template | TODO |  |
| DOI lookup succeeds with real `CROSSREF_MAILTO` | TODO |  |
| Manual book reference saves | TODO |  |
| Duplicate DOI updates existing reference | TODO |  |
| Reference edit works | TODO |  |
| Reference delete works without removing visible citation text | TODO |  |
| Parenthetical citation inserts readable APA text | TODO |  |
| Narrative citation inserts readable APA text | TODO |  |
| Grouped citation inserts readable APA text | TODO |  |
| Direct-quote locator inserts correctly | TODO |  |
| `Rebuild References` creates centered heading and entries | TODO |  |
| Re-running `Rebuild References` replaces only controlled section | TODO |  |
| `Prepare Current Copy` removes visible marker paragraphs | TODO |  |
| PDF export contains no `[[OPEN_APA_DESK` marker text | TODO |  |
| DOCX export contains no `[[OPEN_APA_DESK` marker text | TODO |  |

## APA Spot Check

Use public-safe fixture data only.

```text
Parenthetical citation observed:
Narrative citation observed:
Grouped citation observed:
References entry for DOI article observed:
References entry for manual book observed:
Known APA limitation observed, if any:
```

## Export Evidence

Keep export files in an ignored private path such as:

```text
private/smoke-evidence/exports/
```

Run the marker-leak helper after exporting:

```bash
npm run smoke:exports
```

Record:

```text
PDF export checked: yes/no
DOCX export checked: yes/no
npm run smoke:exports: pass/fail
Marker text found in PDF: yes/no
Marker text found in DOCX: yes/no
Human visual export check completed: yes/no
```

## Screenshot Evidence

Final public Marketplace screenshots may be committed only after they are
cropped/sanitized and contain no private Google Doc URLs, account details, or
private student data.

```text
Screenshot 1 selected:
Screenshot 2 selected:
Screenshot 3 selected:
Screenshot 4 selected:
Screenshot 5 selected:
npm run marketplace:assets:final: pass/fail
```

## Submission Decision

```text
Ready for Marketplace console submission: yes/no
Remaining blockers:
```

After completing this private evidence file, run:

```bash
npm run smoke:evidence:check -- private/smoke-evidence/YYYY-MM-DD-final-smoke.md
```
