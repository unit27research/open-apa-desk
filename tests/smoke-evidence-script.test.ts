import { execFile as execFileCallback } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);

describe('smoke evidence setup script', () => {
  it('creates a dated private evidence file and export directory', async () => {
    const outputDir = await mkdtemp(join(tmpdir(), 'open-apa-smoke-evidence-'));
    try {
      const { stdout } = await execFile('node', [
        'scripts/create-smoke-evidence.mjs',
        '--date',
        '2026-06-02',
        '--commit',
        'abc1234',
        '--output-dir',
        outputDir
      ]);

      const evidenceFile = join(outputDir, '2026-06-02-final-smoke.md');
      const evidence = await readFile(evidenceFile, 'utf8');
      await writeFile(join(outputDir, 'exports', '.write-check'), 'ok');

      expect(stdout).toContain(evidenceFile);
      expect(stdout).toContain(join(outputDir, 'exports'));
      expect(evidence).toContain('Date: 2026-06-02');
      expect(evidence).toContain('Build commit: abc1234');
      expect(evidence).not.toContain('Date: YYYY-MM-DD');
      expect(evidence).not.toContain('Build commit: <git SHA>');
    } finally {
      await rm(outputDir, { force: true, recursive: true });
    }
  });

  it('refuses to overwrite existing evidence without force', async () => {
    const outputDir = await mkdtemp(join(tmpdir(), 'open-apa-smoke-evidence-'));
    try {
      await execFile('node', [
        'scripts/create-smoke-evidence.mjs',
        '--date',
        '2026-06-02',
        '--commit',
        'abc1234',
        '--output-dir',
        outputDir
      ]);

      await expect(
        execFile('node', [
          'scripts/create-smoke-evidence.mjs',
          '--date',
          '2026-06-02',
          '--commit',
          'abc1234',
          '--output-dir',
          outputDir
        ])
      ).rejects.toMatchObject({
        stderr: expect.stringContaining('already exists')
      });
    } finally {
      await rm(outputDir, { force: true, recursive: true });
    }
  });
});
