import { execFile as execFileCallback } from 'node:child_process';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);
const DEFAULT_EVIDENCE_DIR = 'private/smoke-evidence';

const options = parseArgs(process.argv.slice(2));

if (options.help) {
  printHelp();
  process.exit(0);
}

const evidenceFile = options.evidenceFile ?? (await findLatestEvidenceFile());
const checks = [
  {
    name: 'Upload preflight',
    command: ['npm', 'run', 'upload:preflight']
  },
  {
    name: 'Export marker scan',
    command: ['npm', 'run', 'smoke:exports']
  },
  {
    name: 'Final smoke evidence',
    command: ['npm', 'run', 'smoke:evidence:check', '--', evidenceFile]
  }
];

if (options.dryRun) {
  console.log(`Evidence file: ${evidenceFile}`);
  for (const check of checks) {
    console.log(`${check.name}: ${shellJoin(check.command)}`);
  }
  process.exit(0);
}

const results = [];
for (const check of checks) {
  results.push(await runCheck(check));
}

for (const result of results) {
  console.log(`${result.passed ? 'PASS' : 'FAIL'} ${result.name}`);
  if (!result.passed) {
    const detail = summarizeOutput(result.output);
    if (detail) {
      console.log(indent(detail));
    }
  }
}

const failed = results.filter((result) => !result.passed);
if (failed.length > 0) {
  console.error(`\nSubmission preflight failed: ${failed.length} blocker(s).`);
  process.exit(1);
}

console.log('\nSubmission preflight passed.');

function parseArgs(args) {
  const parsed = {
    evidenceFile: undefined,
    dryRun: false,
    help: false
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    switch (arg) {
      case '--dry-run':
        parsed.dryRun = true;
        break;
      case '--help':
      case '-h':
        parsed.help = true;
        break;
      default:
        if (arg.startsWith('--')) {
          throw new Error(`Unknown argument: ${arg}`);
        }
        if (parsed.evidenceFile) {
          throw new Error(`Unexpected extra evidence file: ${arg}`);
        }
        parsed.evidenceFile = arg;
    }
  }

  return parsed;
}

async function findLatestEvidenceFile() {
  let entries;
  try {
    entries = await readdir(DEFAULT_EVIDENCE_DIR);
  } catch {
    console.error(
      `No smoke evidence directory found. Run npm run smoke:evidence first, or pass an evidence file path.`
    );
    process.exit(1);
  }

  const candidates = [];
  for (const entry of entries) {
    if (!/^\d{4}-\d{2}-\d{2}-final-smoke\.md$/.test(entry)) {
      continue;
    }
    const file = join(DEFAULT_EVIDENCE_DIR, entry);
    const fileStat = await stat(file);
    if (fileStat.isFile()) {
      candidates.push(file);
    }
  }

  candidates.sort();
  const latest = candidates.at(-1);
  if (!latest) {
    console.error(
      `No final smoke evidence file found under ${DEFAULT_EVIDENCE_DIR}. Run npm run smoke:evidence first, or pass an evidence file path.`
    );
    process.exit(1);
  }
  return latest;
}

async function runCheck(check) {
  try {
    const { stdout, stderr } = await execFile(check.command[0], check.command.slice(1), {
      maxBuffer: 1024 * 1024 * 10
    });
    return {
      ...check,
      output: `${stdout}${stderr}`,
      passed: true
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
    .slice(-10)
    .join('\n');
}

function indent(value) {
  return value
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');
}

function shellJoin(command) {
  return command.map((part) => (/\s/.test(part) ? JSON.stringify(part) : part)).join(' ');
}

function printHelp() {
  console.log(`Usage: npm run submission:preflight -- [private/smoke-evidence/YYYY-MM-DD-final-smoke.md]

Runs the final submission gate after the human-assisted smoke pass:
- npm run upload:preflight
- npm run smoke:exports
- npm run smoke:evidence:check -- <evidence file>

If no evidence file is provided, the latest private/smoke-evidence/*-final-smoke.md file is used.

Options:
  --dry-run   Print the resolved commands without running them.
  --help      Show this help text.`);
}
