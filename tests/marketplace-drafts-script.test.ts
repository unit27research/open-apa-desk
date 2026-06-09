import { execFile as execFileCallback } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);
const script = resolve('scripts/check-marketplace-drafts.mjs');

describe('marketplace drafts check script', () => {
  it('passes for complete public-safe Marketplace drafts', async () => {
    const root = await createDraftRoot();
    try {
      const { stdout } = await execFile('node', [script], { cwd: root });
      expect(stdout).toContain('Marketplace draft check passed.');
    } finally {
      await rm(root, { force: true, recursive: true });
    }
  });

  it('fails when a Marketplace draft contains TODO placeholder text', async () => {
    const root = await createDraftRoot({
      sdkSuffix: '\nTODO: Apps Script project ID from the standard Cloud-linked deployment\n'
    });
    try {
      await expect(execFile('node', [script], { cwd: root })).rejects.toMatchObject({
        stderr: expect.stringContaining(
          'Marketplace draft still contains TODO placeholder text'
        )
      });
    } finally {
      await rm(root, { force: true, recursive: true });
    }
  });
});

async function createDraftRoot(options: { sdkSuffix?: string } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'open-apa-marketplace-drafts-'));
  await mkdir(join(root, 'docs'), { recursive: true });
  await mkdir(join(root, 'src'), { recursive: true });

  const scopes = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/documents.currentonly',
    'https://www.googleapis.com/auth/script.container.ui',
    'https://www.googleapis.com/auth/script.external_request',
    'https://www.googleapis.com/auth/script.storage'
  ];
  await writeFile(
    join(root, 'src', 'appsscript.json'),
    JSON.stringify({ oauthScopes: scopes }, null, 2)
  );

  const shared = [
    'https://unit27research.com/open-apa-desk/',
    'https://unit27research.com/open-apa-desk/privacy.html',
    'https://unit27research.com/open-apa-desk/terms.html',
    'https://unit27research.com/open-apa-desk/support.html',
    'https://unit27research.com/open-apa-desk/assets/branding/open-apa-desk-icon-128.png',
    'Open APA Desk is not an official APA product',
    'no backend server',
    'no Open APA Desk account',
    'no AI calls',
    'DOI lookup sends',
    'publishing status is not `Testing`',
    'Google Docs™',
    'Google Docs™ is a trademark of Google LLC',
    ...scopes
  ].join('\n');

  await writeFile(
    join(root, 'docs', 'MARKETPLACE_LISTING_DRAFT.md'),
    `# Marketplace Listing Draft\n\nDeveloper name\nUnit27 Research\nDeveloper website URL\nhttps://unit27research.com\nDeveloper email\njosh@unit27research.com\n${shared}\n`
  );
  await writeFile(
    join(root, 'docs', 'OAUTH_CONSENT_DRAFT.md'),
    `# OAuth Consent Draft\n\n${shared}\n`
  );
  await writeFile(
    join(root, 'docs', 'MARKETPLACE_SDK_CONFIG_DRAFT.md'),
    `# Marketplace SDK Config Draft\n\n${shared}\n${options.sdkSuffix ?? ''}\n`
  );
  await writeFile(
    join(root, 'docs', 'LAUNCH_SUBMISSION_PACKET.md'),
    `# Launch Submission Packet\n\n${shared}\n`
  );

  return root;
}
