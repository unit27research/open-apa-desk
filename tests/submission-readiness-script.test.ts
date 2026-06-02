import { execFile as execFileCallback } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);
const script = resolve('scripts/check-submission-readiness.mjs');

describe('submission readiness script', () => {
  it('dry-runs final submission checks against the latest private evidence file', async () => {
    const root = await mkdtemp(join(tmpdir(), 'open-apa-submission-'));
    try {
      const evidenceDir = join(root, 'private', 'smoke-evidence');
      await mkdir(evidenceDir, { recursive: true });
      await writeFile(join(evidenceDir, '2026-06-01-final-smoke.md'), 'old');
      await writeFile(join(evidenceDir, '2026-06-02-final-smoke.md'), 'new');

      const { stdout } = await execFile('node', [script, '--dry-run'], {
        cwd: root
      });

      expect(stdout).toContain(
        'Evidence file: private/smoke-evidence/2026-06-02-final-smoke.md'
      );
      expect(stdout).toContain('Upload preflight: npm run upload:preflight');
      expect(stdout).toContain('Export marker scan: npm run smoke:exports');
      expect(stdout).toContain(
        'Final smoke evidence: npm run smoke:evidence:check -- private/smoke-evidence/2026-06-02-final-smoke.md'
      );
    } finally {
      await rm(root, { force: true, recursive: true });
    }
  });
});
