import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const EXPECTED_LOGO_URL =
  'https://unit27research.github.io/open-apa-desk/assets/branding/open-apa-desk-icon-128.png';
const EXPECTED_SCOPES = [
  'https://www.googleapis.com/auth/documents.currentonly',
  'https://www.googleapis.com/auth/script.container.ui',
  'https://www.googleapis.com/auth/script.external_request',
  'https://www.googleapis.com/auth/script.storage'
];
const REQUIRED_DIST_FILES = ['Code.js', 'Sidebar.html', 'appsscript.json'];
const REQUIRED_CODE_EXPORTS = [
  'function onOpen',
  'function showOpenApaDeskSidebar',
  'function apiLookupDoi',
  'function apiPrepareCurrentCopyForSubmission'
];
const FORBIDDEN_TOKENS = [
  'DriveApp.',
  'SpreadsheetApp.',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/spreadsheets',
  'Prepare Clean Copy',
  'apiPrepareCleanCopy',
  'Import Library References'
];
const FORBIDDEN_TEXT_PATTERNS = [
  { label: 'local macOS user path', pattern: /\/Users\// },
  { label: 'local Codex workspace path', pattern: /Documents\/Codex/ },
  { label: 'private smoke-test account email', pattern: /josh@gigcityai\.ai/i },
  {
    label: 'private real-person test fixture',
    pattern: new RegExp(['Melissa', 'Bloodworth'].join('\\s+'), 'i')
  },
  {
    label: 'private Google Docs document URL',
    pattern: /https:\/\/docs\.google\.com\/document\/d\/[A-Za-z0-9_-]{20,}/
  },
  {
    label: 'private Google Drive URL',
    pattern: /https:\/\/drive\.google\.com\/(?:open\?id=|file\/d\/)[A-Za-z0-9_-]{20,}/
  },
  {
    label: 'private Apps Script URL',
    pattern: /https:\/\/script\.google\.com\/(?:d|macros)\/[A-Za-z0-9_/-]{20,}/
  }
];

const options = parseArgs(process.argv.slice(2));

if (options.help) {
  printHelp();
  process.exit(0);
}

const failures = [];
const distDir = options.distDir ?? 'dist';
const sourceManifestFile = options.sourceManifest ?? 'src/appsscript.json';

await checkRequiredDistFiles();
await checkManifest();
await checkCode();
await checkTextFiles();

if (failures.length > 0) {
  console.error('Apps Script bundle check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Apps Script bundle check passed.');

async function checkRequiredDistFiles() {
  for (const file of REQUIRED_DIST_FILES) {
    try {
      await access(join(distDir, file));
    } catch {
      failures.push(`Missing dist file: ${join(distDir, file)}`);
    }
  }
}

async function checkManifest() {
  let sourceManifest;
  let distManifest;
  try {
    sourceManifest = JSON.parse(await readFile(sourceManifestFile, 'utf8'));
    distManifest = JSON.parse(await readFile(join(distDir, 'appsscript.json'), 'utf8'));
  } catch (error) {
    failures.push(`Unable to read Apps Script manifest: ${error.message ?? error}`);
    return;
  }

  if (JSON.stringify(sourceManifest, null, 2) !== JSON.stringify(distManifest, null, 2)) {
    failures.push('dist/appsscript.json must match src/appsscript.json exactly.');
  }

  const scopes = distManifest.oauthScopes ?? [];
  const sortedScopes = [...scopes].sort();
  const sortedExpectedScopes = [...EXPECTED_SCOPES].sort();
  if (JSON.stringify(sortedScopes) !== JSON.stringify(sortedExpectedScopes)) {
    failures.push(`Unexpected dist OAuth scopes: ${JSON.stringify(scopes)}`);
  }
  if (distManifest.addOns?.common?.logoUrl !== EXPECTED_LOGO_URL) {
    failures.push(`Unexpected dist logoUrl: ${distManifest.addOns?.common?.logoUrl}`);
  }
}

async function checkCode() {
  let code;
  try {
    code = await readFile(join(distDir, 'Code.js'), 'utf8');
  } catch (error) {
    failures.push(`Unable to read dist/Code.js: ${error.message ?? error}`);
    return;
  }

  for (const required of REQUIRED_CODE_EXPORTS) {
    if (!code.includes(required)) {
      failures.push(`dist/Code.js missing required wrapper: ${required}`);
    }
  }
}

async function checkTextFiles() {
  for (const file of REQUIRED_DIST_FILES) {
    const path = join(distDir, file);
    let content;
    try {
      content = await readFile(path, 'utf8');
    } catch {
      continue;
    }

    for (const token of FORBIDDEN_TOKENS) {
      if (content.includes(token)) {
        failures.push(`Forbidden deploy token found in ${path}: ${token}`);
      }
    }
    for (const { label, pattern } of FORBIDDEN_TEXT_PATTERNS) {
      if (pattern.test(content)) {
        failures.push(`Deploy leak guard found ${label} in ${path}`);
      }
    }
  }
}

function parseArgs(args) {
  const parsed = {
    distDir: undefined,
    sourceManifest: undefined,
    help: false
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    switch (arg) {
      case '--dist-dir':
        parsed.distDir = requireValue(args, index, arg);
        index += 1;
        break;
      case '--source-manifest':
        parsed.sourceManifest = requireValue(args, index, arg);
        index += 1;
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

function printHelp() {
  console.log(`Usage: npm run build:check -- [options]

Validates the generated Apps Script bundle before clasp push.

Options:
  --dist-dir DIR           Generated Apps Script directory. Defaults to dist.
  --source-manifest FILE   Source appsscript.json. Defaults to src/appsscript.json.
  --help                   Show this help text.`);
}
