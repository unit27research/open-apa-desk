import { execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);
const REPO_FULL_NAME = 'unit27research/open-apa-desk';

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
    name: `GitHub repo exists: ${REPO_FULL_NAME}`,
    command: ['gh', 'repo', 'view', REPO_FULL_NAME, '--json', 'url'],
    requires: ['github-auth'],
    failureHint: 'Create and push the public GitHub repository first.'
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
  results.push(await runCheck(check));
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
