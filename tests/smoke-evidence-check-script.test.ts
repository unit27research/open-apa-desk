import { execFile as execFileCallback } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);

describe('smoke evidence check script', () => {
  it('passes for complete private final smoke evidence', async () => {
    const root = await mkdtemp(join(tmpdir(), 'open-apa-smoke-check-'));
    try {
      const evidenceFile = join(root, 'complete-final-smoke.md');
      await writeFile(evidenceFile, completeEvidence());

      const { stdout } = await execFile('node', [
        'scripts/check-smoke-evidence.mjs',
        evidenceFile
      ]);

      expect(stdout).toContain('Smoke evidence check passed.');
    } finally {
      await rm(root, { force: true, recursive: true });
    }
  });

  it('fails for incomplete or unsafe private final smoke evidence', async () => {
    const root = await mkdtemp(join(tmpdir(), 'open-apa-smoke-check-'));
    try {
      const evidenceFile = join(root, 'incomplete-final-smoke.md');
      await writeFile(
        evidenceFile,
        completeEvidence()
          .replace('Build commit: abc1234', 'Build commit: <git SHA>')
          .replace('| DOI lookup succeeds with real `CROSSREF_MAILTO` | PASS |', '| DOI lookup succeeds with real `CROSSREF_MAILTO` | TODO |')
          .replace('Marker text found in PDF: no', 'Marker text found in PDF: yes')
          .replace('Ready for Marketplace console submission: yes', 'Ready for Marketplace console submission: no')
          .concat(`\n${privateGoogleDocsUrlFixture()}\n`)
      );

      await expect(
        execFile('node', ['scripts/check-smoke-evidence.mjs', evidenceFile])
      ).rejects.toMatchObject({
        stderr: expect.stringContaining('Smoke evidence check failed:')
      });
    } finally {
      await rm(root, { force: true, recursive: true });
    }
  });
});

function completeEvidence() {
  return `# Final Smoke Evidence Template

Date: 2026-06-02

## Smoke Target

\`\`\`text
Apps Script project: recorded in private operator notes
Google Doc target: recorded in private operator notes
Browser/profile: Chrome, authenticated publishing/test account
Build commit: abc1234
Apps Script version: 2
CROSSREF_MAILTO configured: yes
\`\`\`

## Preflight Commands

\`\`\`text
upload:preflight: pass
build: pass
build:check: pass
clasp push: pass
\`\`\`

## Manual Smoke Checklist

| Check | Status | Private evidence notes |
| --- | --- | --- |
| Google Docs \`Open APA Desk\` menu appears | PASS | observed |
| Sidebar opens after OAuth authorization | PASS | observed |
| \`Check DOI Setup\` reports DOI lookup is configured | PASS | observed |
| \`Setup APA Paper\` creates one controlled title/body starter | PASS | observed |
| Re-running \`Setup APA Paper\` replaces, not duplicates | PASS | observed |
| Page number \`1\` is visible in the header/template | PASS | observed |
| DOI lookup succeeds with real \`CROSSREF_MAILTO\` | PASS | observed |
| Manual book reference saves | PASS | observed |
| Duplicate DOI updates existing reference | PASS | observed |
| Reference edit works | PASS | observed |
| Reference delete works without removing visible citation text | PASS | observed |
| Parenthetical citation inserts readable APA text | PASS | observed |
| Narrative citation inserts readable APA text | PASS | observed |
| Grouped citation inserts readable APA text | PASS | observed |
| Direct-quote locator inserts correctly | PASS | observed |
| \`Rebuild References\` creates centered heading and entries | PASS | observed |
| Re-running \`Rebuild References\` replaces only controlled section | PASS | observed |
| \`Prepare Current Copy\` removes visible marker paragraphs | PASS | observed |
| PDF export contains no \`[[OPEN_APA_DESK\` marker text | PASS | observed |
| DOCX export contains no \`[[OPEN_APA_DESK\` marker text | PASS | observed |

## APA Spot Check

\`\`\`text
Parenthetical citation observed: (Taylor, 2020)
Narrative citation observed: Taylor (2020)
Grouped citation observed: (Adams, 2023; Taylor, 2020)
References entry for DOI article observed: Taylor, A. (2020). Example.
References entry for manual book observed: Adams, R. (2023). Example book.
Known APA limitation observed, if any: none
\`\`\`

## Export Evidence

\`\`\`text
PDF export checked: yes
DOCX export checked: yes
npm run smoke:exports: pass
Marker text found in PDF: no
Marker text found in DOCX: no
Human visual export check completed: yes
\`\`\`

## Screenshot Evidence

\`\`\`text
Screenshot 1 selected: assets/screenshots/01-google-docs-menu-open.jpg
Screenshot 2 selected: assets/screenshots/02-sidebar-paper-setup.jpg
Screenshot 3 selected: assets/screenshots/03-references-output.jpg
Screenshot 4 selected: not used
Screenshot 5 selected: not used
npm run marketplace:assets:final: pass
\`\`\`

## Submission Decision

\`\`\`text
Ready for Marketplace console submission: yes
Remaining blockers: none
\`\`\`
`;
}

function privateGoogleDocsUrlFixture() {
  const host = 'https://docs.google.com';
  const path = '/document/d/privateDocIdForTest1234567890/edit';
  return `${host}${path}`;
}
