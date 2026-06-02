import { execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);
const REPO_FULL_NAME = 'unit27research/open-apa-desk';
const REMOTE_REF_SCAN_NAMESPACE = 'refs/tmp/open-apa-upload-scan';

const FORBIDDEN_REMOTE_PATH_PREFIXES = [
  '.agents',
  '.codex',
  '.clasp.json',
  '.env',
  'dist/',
  'node_modules/',
  'release/',
  'docs/LIVE_SMOKE_STATUS_',
  'docs/SPRINT_',
  'docs/FRESH_CHECKOUT_STATUS_',
  'docs/APPS_SCRIPT_RELEASE_STATUS_'
];

const FORBIDDEN_REMOTE_TEXT_PATTERN =
  'josh@gigcityai\\.ai|/Users/|Documents/Codex|Melissa Bloodworth|https://docs\\.google\\.com/document/d/[A-Za-z0-9_-]{20,}|https://drive\\.google\\.com/open\\?id=[A-Za-z0-9_-]{20,}|https://script\\.google\\.com/d/[A-Za-z0-9_-]{20,}';

const checks = [
  {
    id: 'git-clean',
    name: 'Git worktree is clean',
    command: ['git', 'status', '--short'],
    validate: ({ stdout }) => stdout.trim() === '',
    failureHint: 'Commit or stash local changes before publishing.'
  },
  {
    id: 'branch-main',
    name: 'Current branch is main',
    command: ['git', 'branch', '--show-current'],
    validate: ({ stdout }) => stdout.trim() === 'main',
    failureHint: 'Run the upload from the main branch.'
  },
  {
    id: 'local-verify',
    name: 'Local verification passes',
    command: ['npm', 'run', 'verify']
  },
  {
    id: 'publish-archive',
    name: 'Public repo archive can be created',
    command: ['npm', 'run', 'publish:archive'],
    failureHint:
      'Fix tracked-file or worktree issues before creating a manual upload archive.'
  },
  {
    id: 'final-screenshots',
    name: 'Final Marketplace screenshot assets pass',
    command: ['npm', 'run', 'marketplace:assets:final'],
    failureHint:
      'Replace alpha screenshots with final 1280x800, 640x400, or 2560x1600 screenshots.'
  },
  {
    id: 'marketplace-drafts',
    name: 'Marketplace submission drafts are complete',
    command: ['npm', 'run', 'marketplace:drafts:check'],
    failureHint:
      'Fill confirmed support/developer contacts and post-Pages Apps Script version fields before Marketplace submission.'
  },
  {
    id: 'github-auth',
    name: 'GitHub CLI authentication is valid',
    command: ['gh', 'auth', 'status'],
    failureHint: 'Run gh auth login -h github.com.'
  },
  {
    id: 'origin-remote',
    name: 'origin remote is configured',
    command: ['git', 'remote', 'get-url', 'origin'],
    failureHint:
      'Create the repo with gh repo create open-apa-desk --public --source=. --remote=origin --push, or add origin manually.'
  },
  {
    id: 'github-repo',
    name: `GitHub repo is public: ${REPO_FULL_NAME}`,
    command: [
      'gh',
      'repo',
      'view',
      REPO_FULL_NAME,
      '--json',
      'url,visibility,isPrivate'
    ],
    requires: ['github-auth'],
    validate: ({ stdout }) => {
      const repo = parseJson(stdout);
      return repo?.isPrivate === false && repo?.visibility === 'PUBLIC';
    },
    failureHint: 'Create the public GitHub repository, or switch it back to public after cleanup.'
  },
  {
    id: 'remote-public-boundary',
    name: 'Remote branch and pull-request refs pass public-boundary scan',
    run: checkRemotePublicBoundary,
    requires: ['origin-remote'],
    failureHint:
      'Delete/recreate the brand-new GitHub repo from the sanitized local tree if stale GitHub refs contain internal files.'
  }
];

const results = [];

for (const check of checks) {
  const missingRequirement = check.requires?.find((requiredId) =>
    results.some((result) => result.id === requiredId && !result.passed)
  );
  if (missingRequirement) {
    results.push({
      ...check,
      output: `Skipped because ${missingRequirement} did not pass.`,
      passed: false,
      skipped: true
    });
    continue;
  }
  results.push(check.run ? await check.run(check) : await runCheck(check));
}

for (const result of results) {
  const prefix = result.skipped ? 'SKIP' : result.passed ? 'PASS' : 'FAIL';
  console.log(`${prefix} ${result.name}`);
  if (!result.passed || result.skipped) {
    const detail = summarizeOutput(result.output);
    if (detail) {
      console.log(indent(detail));
    }
    if (!result.skipped && result.failureHint) {
      console.log(indent(`Next: ${result.failureHint}`));
    }
  }
}

const failed = results.filter((result) => !result.passed && !result.skipped);
if (failed.length > 0) {
  console.error(`\nUpload preflight failed: ${failed.length} blocker(s).`);
  process.exit(1);
}

console.log('\nUpload preflight passed.');

async function runCheck(check) {
  try {
    const { stdout, stderr } = await execFile(check.command[0], check.command.slice(1), {
      maxBuffer: 1024 * 1024 * 10
    });
    const passed = check.validate ? check.validate({ stdout, stderr }) : true;
    return {
      ...check,
      output: `${stdout}${stderr}`,
      passed
    };
  } catch (error) {
    return {
      ...check,
      output: `${error.stdout ?? ''}${error.stderr ?? ''}${error.message ?? ''}`,
      passed: false
    };
  }
}

function summarizeOutput(output) {
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(-8)
    .join('\n');
}

function indent(value) {
  return value
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');
}

function parseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function checkRemotePublicBoundary(check) {
  const details = [];
  try {
    await cleanupRemoteScanRefs();
    await execFile('git', [
      'fetch',
      '--quiet',
      '--depth=1',
      'origin',
      `+refs/heads/*:${REMOTE_REF_SCAN_NAMESPACE}/heads/*`,
      `+refs/pull/*/head:${REMOTE_REF_SCAN_NAMESPACE}/pull/*`
    ]);

    const { stdout } = await execFile('git', [
      'for-each-ref',
      '--format=%(refname)',
      REMOTE_REF_SCAN_NAMESPACE
    ]);
    const refs = stdout
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    for (const ref of refs) {
      const pathFindings = await findForbiddenPaths(ref);
      const textFindings = await findForbiddenText(ref);
      for (const finding of [...pathFindings, ...textFindings]) {
        details.push(`${ref}: ${finding}`);
      }
    }

    return {
      ...check,
      output:
        details.length > 0
          ? details.join('\n')
          : `Scanned ${refs.length} remote branch/pull-request ref(s).`,
      passed: details.length === 0
    };
  } catch (error) {
    return {
      ...check,
      output: `${error.stdout ?? ''}${error.stderr ?? ''}${error.message ?? ''}`,
      passed: false
    };
  } finally {
    await cleanupRemoteScanRefs();
  }
}

async function findForbiddenPaths(ref) {
  const { stdout } = await execFile('git', ['ls-tree', '-r', '--name-only', ref]);
  return stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((file) =>
      FORBIDDEN_REMOTE_PATH_PREFIXES.some(
        (prefix) => file === prefix || file.startsWith(prefix)
      )
    )
    .map((file) => `internal/local-only file tracked: ${file}`);
}

async function findForbiddenText(ref) {
  try {
    const { stdout } = await execFile('git', [
      'grep',
      '-n',
      '-I',
      '-E',
      FORBIDDEN_REMOTE_TEXT_PATTERN,
      ref,
      '--',
      ':!scripts/check-release-readiness.mjs'
    ]);
    return stdout
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 20);
  } catch (error) {
    if (error.code === 1) {
      return [];
    }
    throw error;
  }
}

async function cleanupRemoteScanRefs() {
  const { stdout } = await execFile('git', [
    'for-each-ref',
    '--format=%(refname)',
    REMOTE_REF_SCAN_NAMESPACE
  ]);
  const refs = stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  for (const ref of refs) {
    await execFile('git', ['update-ref', '-d', ref]);
  }
}
