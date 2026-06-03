import { execFile as execFileCallback } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);

describe('Apps Script bundle check script', () => {
  it('passes for a clean deployable Apps Script bundle', async () => {
    const root = await mkdtemp(join(tmpdir(), 'open-apa-bundle-check-'));
    try {
      const { distDir, manifestFile } = await writeBundleFixture(root, {
        code: [
          'function onOpen(e) {}',
          'function showOpenApaDeskSidebar() {}',
          'function apiLookupDoi(doi) {}',
          'function apiCreateApaStarterDocument() {}',
          'function apiPrepareCurrentCopyForSubmission() {}'
        ].join('\n')
      });

      const { stdout } = await execFile('node', [
        'scripts/check-apps-script-bundle.mjs',
        '--dist-dir',
        distDir,
        '--source-manifest',
        manifestFile
      ]);

      expect(stdout).toContain('Apps Script bundle check passed.');
    } finally {
      await rm(root, { force: true, recursive: true });
    }
  });

  it('fails for forbidden deploy output', async () => {
    const root = await mkdtemp(join(tmpdir(), 'open-apa-bundle-check-'));
    try {
      const { distDir, manifestFile } = await writeBundleFixture(root, {
        code: [
          'function onOpen(e) {}',
          'function showOpenApaDeskSidebar() {}',
          'function apiLookupDoi(doi) {}',
          'function apiCreateApaStarterDocument() {}',
          'function apiPrepareCurrentCopyForSubmission() {}',
          'DriveApp.getFileById("abc");',
          privateGoogleDocsUrlFixture()
        ].join('\n')
      });

      await expect(
        execFile('node', [
          'scripts/check-apps-script-bundle.mjs',
          '--dist-dir',
          distDir,
          '--source-manifest',
          manifestFile
        ])
      ).rejects.toMatchObject({
        stderr: expect.stringContaining('Apps Script bundle check failed:')
      });
    } finally {
      await rm(root, { force: true, recursive: true });
    }
  });

  it('requires the APA starter template creation wrapper', async () => {
    const root = await mkdtemp(join(tmpdir(), 'open-apa-bundle-check-'));
    try {
      const { distDir, manifestFile } = await writeBundleFixture(root, {
        code: [
          'function onOpen(e) {}',
          'function showOpenApaDeskSidebar() {}',
          'function apiLookupDoi(doi) {}',
          'function apiPrepareCurrentCopyForSubmission() {}'
        ].join('\n')
      });

      await expect(
        execFile('node', [
          'scripts/check-apps-script-bundle.mjs',
          '--dist-dir',
          distDir,
          '--source-manifest',
          manifestFile
        ])
      ).rejects.toMatchObject({
        stderr: expect.stringContaining(
          'dist/Code.js missing required wrapper: function apiCreateApaStarterDocument'
        )
      });
    } finally {
      await rm(root, { force: true, recursive: true });
    }
  });

  it('rejects optional page-number-helper wording in the Apps Script bundle', async () => {
    const root = await mkdtemp(join(tmpdir(), 'open-apa-bundle-check-'));
    try {
      const { distDir, manifestFile } = await writeBundleFixture(root, {
        code: [
          'function onOpen(e) {}',
          'function showOpenApaDeskSidebar() {}',
          'function apiLookupDoi(doi) {}',
          'function apiCreateApaStarterDocument() {}',
          'function apiPrepareCurrentCopyForSubmission() {}',
          'const copy = "Open APA Desk cannot safely insert dynamic page-number fields yet.";'
        ].join('\n')
      });

      await expect(
        execFile('node', [
          'scripts/check-apps-script-bundle.mjs',
          '--dist-dir',
          distDir,
          '--source-manifest',
          manifestFile
        ])
      ).rejects.toMatchObject({
        stderr: expect.stringContaining('optional page-number helper')
      });
    } finally {
      await rm(root, { force: true, recursive: true });
    }
  });
});

async function writeBundleFixture(root: string, options: { code: string }) {
  const distDir = join(root, 'dist');
  const sourceDir = join(root, 'src');
  const manifestFile = join(sourceDir, 'appsscript.json');
  const manifest = JSON.stringify(
    {
      timeZone: 'America/New_York',
      exceptionLogging: 'STACKDRIVER',
      runtimeVersion: 'V8',
      oauthScopes: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/documents.currentonly',
        'https://www.googleapis.com/auth/script.container.ui',
        'https://www.googleapis.com/auth/script.external_request',
        'https://www.googleapis.com/auth/script.storage'
      ],
      addOns: {
        common: {
          name: 'Open APA Desk',
          logoUrl:
            'https://unit27research.github.io/open-apa-desk/assets/branding/open-apa-desk-icon-128.png'
        },
        docs: {}
      }
    },
    null,
    2
  );

  await mkdir(distDir, { recursive: true });
  await mkdir(sourceDir, { recursive: true });
  await writeFile(manifestFile, manifest);
  await writeFile(join(distDir, 'appsscript.json'), manifest);
  await writeFile(join(distDir, 'Code.js'), options.code);
  await writeFile(join(distDir, 'Sidebar.html'), '<!doctype html><html></html>');

  return { distDir, manifestFile };
}

function privateGoogleDocsUrlFixture() {
  const host = 'https://docs.google.com';
  const path = '/document/d/privateDocIdForTest1234567890/edit';
  return `${host}${path}`;
}
