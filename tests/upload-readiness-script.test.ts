import { execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);

describe('upload readiness script', () => {
  it('retries transient public Pages URL failures before failing upload preflight', async () => {
    const { stdout } = await execFile('node', [
      'scripts/check-upload-readiness.mjs',
      '--public-url-retry-self-test'
    ]);

    expect(stdout).toContain('Public URL retry self-test passed.');
  });
});
