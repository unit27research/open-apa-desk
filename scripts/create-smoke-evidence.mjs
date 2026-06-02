import { execFile as execFileCallback } from 'node:child_process';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);
const TEMPLATE_FILE = 'docs/FINAL_SMOKE_EVIDENCE_TEMPLATE.md';
const DEFAULT_OUTPUT_DIR = 'private/smoke-evidence';

const options = parseArgs(process.argv.slice(2));

if (options.help) {
  printHelp();
  process.exit(0);
}

const date = options.date ?? currentIsoDate();
validateDate(date);
const commit = options.commit ?? (await currentGitSha());
const outputDir = resolve(options.outputDir ?? DEFAULT_OUTPUT_DIR);
const exportsDir = join(outputDir, 'exports');
const evidenceFile = join(outputDir, `${date}-final-smoke.md`);

await mkdir(exportsDir, { recursive: true });

if (!options.force && (await exists(evidenceFile))) {
  console.error(
    `${evidenceFile} already exists. Use --force to overwrite it intentionally.`
  );
  process.exit(1);
}

const template = await readFile(TEMPLATE_FILE, 'utf8');
const evidence = template
  .replaceAll('YYYY-MM-DD', date)
  .replaceAll('<git SHA>', commit);

await writeFile(evidenceFile, evidence);

console.log(`Created smoke evidence file: ${evidenceFile}`);
console.log(`Created export directory: ${exportsDir}`);
console.log('Keep both paths private; do not commit smoke evidence or exports.');

function parseArgs(args) {
  const parsed = {
    date: undefined,
    commit: undefined,
    outputDir: undefined,
    force: false,
    help: false
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    switch (arg) {
      case '--date':
        parsed.date = requireValue(args, index, arg);
        index += 1;
        break;
      case '--commit':
        parsed.commit = requireValue(args, index, arg);
        index += 1;
        break;
      case '--output-dir':
        parsed.outputDir = requireValue(args, index, arg);
        index += 1;
        break;
      case '--force':
        parsed.force = true;
        break;
      case '--help':
      case '-h':
        parsed.help = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return parsed;
}

function requireValue(args, index, flag) {
  const value = args[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${flag} requires a value.`);
  }
  return value;
}

function validateDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Date must use YYYY-MM-DD format: ${date}`);
  }
}

async function currentGitSha() {
  const { stdout } = await execFile('git', ['rev-parse', '--short', 'HEAD']);
  return stdout.trim();
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function currentIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function printHelp() {
  console.log(`Usage: npm run smoke:evidence -- [options]

Creates an ignored private smoke evidence file from docs/FINAL_SMOKE_EVIDENCE_TEMPLATE.md.

Options:
  --date YYYY-MM-DD      Date for the evidence filename and template heading.
  --commit SHA           Build commit to record. Defaults to git rev-parse --short HEAD.
  --output-dir DIR       Evidence directory. Defaults to ${DEFAULT_OUTPUT_DIR}.
  --force                Overwrite an existing evidence file.
  --help                 Show this help text.`);
}
