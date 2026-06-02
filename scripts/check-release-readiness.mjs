import { execFile as execFileCallback } from 'node:child_process';
import { access, readFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);
const requireFinalScreenshots = process.argv.includes('--final-screenshots');

const EXPECTED_LOGO_URL =
  'https://unit27research.github.io/open-apa-desk/assets/branding/open-apa-desk-icon-128.png';
const EXPECTED_REPO_URL = 'https://github.com/unit27research/open-apa-desk.git';
const EXPECTED_ISSUES_URL = 'https://github.com/unit27research/open-apa-desk/issues';
const EXPECTED_HOMEPAGE = 'https://unit27research.github.io/open-apa-desk/';

const EXPECTED_SCOPES = [
  'https://www.googleapis.com/auth/documents.currentonly',
  'https://www.googleapis.com/auth/script.container.ui',
  'https://www.googleapis.com/auth/script.external_request',
  'https://www.googleapis.com/auth/script.storage'
];

const REQUIRED_SITE_FILES = [
  'site/index.html',
  'site/PRIVACY.html',
  'site/TERMS.html',
  'site/LICENSE',
  'site/assets/branding/open-apa-desk-icon-32.png',
  'site/assets/branding/open-apa-desk-icon-128.png',
  'site/assets/branding/open-apa-desk-card-banner-220x140.png',
  'site/assets/screenshots/01-google-docs-menu-open.jpg',
  'site/assets/screenshots/02-sidebar-paper-setup.jpg',
  'site/assets/screenshots/03-references-output.jpg'
];

const REQUIRED_BRANDING_IMAGES = [
  {
    file: 'assets/branding/open-apa-desk-icon-32.png',
    type: 'png',
    width: 32,
    height: 32
  },
  {
    file: 'assets/branding/open-apa-desk-icon-128.png',
    type: 'png',
    width: 128,
    height: 128
  },
  {
    file: 'assets/branding/open-apa-desk-card-banner-220x140.png',
    type: 'png',
    width: 220,
    height: 140
  }
];

const REQUIRED_ALPHA_SCREENSHOTS = [
  'assets/screenshots/01-google-docs-menu-open.jpg',
  'assets/screenshots/02-sidebar-paper-setup.jpg',
  'assets/screenshots/03-references-output.jpg'
];

const FINAL_MARKETPLACE_SCREENSHOT_SIZES = [
  { width: 1280, height: 800 },
  { width: 640, height: 400 },
  { width: 2560, height: 1600 }
];

const REQUIRED_REPO_FILES = [
  'README.md',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'LICENSE',
  'LIMITATIONS.md',
  'PRIVACY.md',
  'SECURITY.md',
  'TERMS.md',
  'package-lock.json',
  '.clasp.example.json',
  'scripts/create-publish-archive.mjs',
  'scripts/create-smoke-evidence.mjs',
  'scripts/check-smoke-evidence.mjs',
  'scripts/check-apps-script-bundle.mjs',
  'scripts/check-marketplace-drafts.mjs',
  'scripts/check-upload-readiness.mjs',
  'scripts/check-submission-readiness.mjs',
  'scripts/check-smoke-exports.mjs',
  '.github/workflows/verify.yml',
  '.github/workflows/pages.yml',
  '.github/PULL_REQUEST_TEMPLATE.md',
  '.github/dependabot.yml',
  '.github/ISSUE_TEMPLATE/bug_report.yml',
  '.github/ISSUE_TEMPLATE/feature_request.yml',
  'docs/LAUNCH_SUBMISSION_PACKET.md',
  'docs/GITHUB_PUBLISH_CHECKLIST.md',
  'docs/MARKETPLACE_READINESS.md',
  'docs/MARKETPLACE_LISTING_DRAFT.md',
  'docs/MARKETPLACE_SDK_CONFIG_DRAFT.md',
  'docs/OAUTH_CONSENT_DRAFT.md',
  'docs/GOOGLE_CONSOLE_RUNBOOK.md',
  'docs/FINAL_SMOKE_EVIDENCE_TEMPLATE.md',
  'docs/SMOKE_TEST_FIXTURES.md',
  'docs/PUBLIC_URL_WIRING.md',
  'docs/SCREENSHOT_CAPTURE_PLAN.md'
];

const FORBIDDEN_SOURCE_TOKENS = [
  'DriveApp.',
  'SpreadsheetApp.',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/spreadsheets',
  'Prepare Clean Copy',
  'Import Library References'
];

const FORBIDDEN_PUBLIC_PATH_PREFIXES = [
  '.agents',
  '.codex',
  '.clasp.json',
  '.env',
  'dist/',
  'node_modules/',
  'private/',
  'smoke-evidence/',
  'release/',
  'docs/LIVE_SMOKE_STATUS_',
  'docs/SPRINT_',
  'docs/FRESH_CHECKOUT_STATUS_',
  'docs/APPS_SCRIPT_RELEASE_STATUS_'
];

const FORBIDDEN_PUBLIC_FILE_EXTENSIONS = new Set(['.docx', '.pdf']);

const PUBLIC_TEXT_FILE_EXTENSIONS = new Set([
  '',
  '.css',
  '.html',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.ts',
  '.tsx',
  '.txt',
  '.yml',
  '.yaml'
]);

const FORBIDDEN_PUBLIC_TEXT_PATTERNS = [
  { label: 'local macOS user path', pattern: /\/Users\// },
  { label: 'local Codex workspace path', pattern: /Documents\/Codex/ },
  { label: 'private smoke-test account email', pattern: /josh@gigcityai\.ai/i },
  { label: 'private real-person test fixture', pattern: /Melissa Bloodworth/i },
  {
    label: 'private Google Docs document URL',
    pattern: /https:\/\/docs\.google\.com\/document\/d\/[A-Za-z0-9_-]{20,}/
  },
  {
    label: 'private Google Drive open URL',
    pattern: /https:\/\/drive\.google\.com\/open\?id=[A-Za-z0-9_-]{20,}/
  },
  {
    label: 'private Apps Script editor URL',
    pattern: /https:\/\/script\.google\.com\/d\/[A-Za-z0-9_-]{20,}/
  }
];

const failures = [];
const warnings = [];

const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
const manifest = JSON.parse(await readFile('src/appsscript.json', 'utf8'));
const scopes = manifest.oauthScopes ?? [];
const sortedScopes = [...scopes].sort();
const sortedExpectedScopes = [...EXPECTED_SCOPES].sort();

checkPackageMetadata(packageJson);
await checkRequiredFiles();
await checkWorkflows();
await checkGitTracking();
await checkPublicLeakBoundary();
await checkActiveSource();
await checkLegacyCleanCopyApi();
await checkCrossrefRuntimeGuard();
await checkMarketplaceImages();
await checkSidebarReviewUx();

if (JSON.stringify(sortedScopes) !== JSON.stringify(sortedExpectedScopes)) {
  failures.push(
    `Unexpected Apps Script scopes: ${JSON.stringify(scopes, null, 2)}`
  );
}

for (const scope of scopes) {
  if (scope.includes('/auth/drive') || scope.includes('/auth/spreadsheets')) {
    failures.push(`Forbidden Marketplace V0 scope found: ${scope}`);
  }
}

const logoUrl = manifest.addOns?.common?.logoUrl;
if (logoUrl !== EXPECTED_LOGO_URL) {
  failures.push(`Unexpected manifest logoUrl: ${logoUrl}`);
}
if (typeof logoUrl === 'string' && logoUrl.includes('gstatic.com/images/branding/product')) {
  failures.push('Manifest logoUrl still points at a Google product placeholder.');
}

for (const file of REQUIRED_SITE_FILES) {
  try {
    await access(file);
  } catch {
    failures.push(`Missing required public-site file: ${file}`);
  }
}

const termsHtml = await readFile('site/TERMS.html', 'utf8');
if (termsHtml.includes('href="LICENSE"')) {
  try {
    await access('site/LICENSE');
  } catch {
    failures.push('TERMS.html links to LICENSE, but site/LICENSE is missing.');
  }
}

await checkLaunchPacket();

if (failures.length > 0) {
  console.error('Release readiness check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn('Release readiness warnings:');
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

console.log('Release readiness check passed.');

function checkPackageMetadata(pkg) {
  if (pkg.name !== 'open-apa-desk') {
    failures.push(`Unexpected package name: ${pkg.name}`);
  }
  if (pkg.private !== true) {
    failures.push('package.json should stay private to prevent accidental npm publish.');
  }
  if (pkg.license !== 'MIT') {
    failures.push(`Unexpected package license: ${pkg.license}`);
  }
  if (pkg.repository?.url !== EXPECTED_REPO_URL) {
    failures.push(`Unexpected repository URL: ${pkg.repository?.url}`);
  }
  if (pkg.bugs?.url !== EXPECTED_ISSUES_URL) {
    failures.push(`Unexpected bugs URL: ${pkg.bugs?.url}`);
  }
  if (pkg.homepage !== EXPECTED_HOMEPAGE) {
    failures.push(`Unexpected package homepage: ${pkg.homepage}`);
  }
  if (!pkg.scripts?.verify?.includes('release:check')) {
    failures.push('npm run verify must include npm run release:check.');
  }
  if (!pkg.scripts?.verify?.includes('typecheck')) {
    failures.push('npm run verify must include TypeScript typecheck.');
  }
  if (!pkg.scripts?.verify?.includes('test')) {
    failures.push('npm run verify must include unit tests.');
  }
  if (!pkg.scripts?.verify?.includes('build')) {
    failures.push('npm run verify must include Apps Script build.');
  }
  if (!pkg.scripts?.verify?.includes('build:check')) {
    failures.push('npm run verify must include Apps Script bundle check.');
  }
  if (pkg.scripts?.['upload:preflight'] !== 'node scripts/check-upload-readiness.mjs') {
    failures.push('package.json must expose npm run upload:preflight.');
  }
  if (pkg.scripts?.['marketplace:drafts:check'] !== 'node scripts/check-marketplace-drafts.mjs') {
    failures.push('package.json must expose npm run marketplace:drafts:check.');
  }
  if (pkg.scripts?.['publish:archive'] !== 'node scripts/create-publish-archive.mjs') {
    failures.push('package.json must expose npm run publish:archive.');
  }
  if (pkg.scripts?.['smoke:evidence'] !== 'node scripts/create-smoke-evidence.mjs') {
    failures.push('package.json must expose npm run smoke:evidence.');
  }
  if (pkg.scripts?.['smoke:evidence:check'] !== 'node scripts/check-smoke-evidence.mjs') {
    failures.push('package.json must expose npm run smoke:evidence:check.');
  }
  if (pkg.scripts?.['smoke:exports'] !== 'node scripts/check-smoke-exports.mjs') {
    failures.push('package.json must expose npm run smoke:exports.');
  }
  if (pkg.scripts?.['submission:preflight'] !== 'node scripts/check-submission-readiness.mjs') {
    failures.push('package.json must expose npm run submission:preflight.');
  }
  if (pkg.scripts?.['build:check'] !== 'node scripts/check-apps-script-bundle.mjs') {
    failures.push('package.json must expose npm run build:check.');
  }
  if (pkg.scripts?.['clasp:push'] !== 'npm run build && npm run build:check && clasp push --force') {
    failures.push('package.json clasp:push must run build, build:check, and clasp push --force.');
  }
}

async function checkRequiredFiles() {
  for (const file of REQUIRED_REPO_FILES) {
    try {
      await access(file);
    } catch {
      failures.push(`Missing required repo file: ${file}`);
    }
  }

  const gitignore = await readFile('.gitignore', 'utf8');
  for (const ignoredPath of [
    'node_modules/',
    'dist/',
    '.clasp.json',
    'coverage/',
    'release/',
    'private/',
    'smoke-evidence/',
    '*.pdf',
    '*.docx'
  ]) {
    if (!gitignore.includes(ignoredPath)) {
      failures.push(`.gitignore must ignore ${ignoredPath}`);
    }
  }
}

async function checkWorkflows() {
  const verifyWorkflow = await readFile('.github/workflows/verify.yml', 'utf8');
  for (const required of [
    'FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true',
    'actions/checkout@v6',
    'actions/setup-node@v6',
    'node-version: 24',
    'npm ci',
    'npm run verify'
  ]) {
    if (!verifyWorkflow.includes(required)) {
      failures.push(`Verify workflow missing: ${required}`);
    }
  }

  const pagesWorkflow = await readFile('.github/workflows/pages.yml', 'utf8');
  for (const required of [
    'FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true',
    'actions/checkout@v6',
    'actions/setup-node@v6',
    'node-version: 24',
    'npm ci',
    'npm run site:build',
    'actions/upload-pages-artifact@v5',
    'actions/deploy-pages@v5'
  ]) {
    if (!pagesWorkflow.includes(required)) {
      failures.push(`Pages workflow missing: ${required}`);
    }
  }
}

async function checkGitTracking() {
  const { stdout } = await execFile('git', [
    'ls-files',
    '.clasp.json',
    'dist',
    'node_modules'
  ]);
  const trackedFiles = stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (trackedFiles.length > 0) {
    failures.push(
      `Local deployment or build files are tracked: ${trackedFiles.join(', ')}`
    );
  }
}

async function checkPublicLeakBoundary() {
  const { stdout } = await execFile('git', ['ls-files', '-z']);
  const trackedFiles = stdout.split('\0').filter(Boolean);

  for (const file of trackedFiles) {
    if (
      FORBIDDEN_PUBLIC_PATH_PREFIXES.some(
        (prefix) => file === prefix || file.startsWith(prefix)
      )
    ) {
      failures.push(`Internal or local-only file is tracked: ${file}`);
    }
    if (FORBIDDEN_PUBLIC_FILE_EXTENSIONS.has(extname(file).toLowerCase())) {
      failures.push(`Private export artifact must not be tracked: ${file}`);
    }
  }

  for (const file of trackedFiles) {
    if (
      file === 'scripts/check-release-readiness.mjs' ||
      file === 'scripts/check-upload-readiness.mjs' ||
      !isPublicTextFile(file)
    ) {
      continue;
    }

    let content;
    try {
      content = await readFile(file, 'utf8');
    } catch (error) {
      if (error?.code === 'ENOENT') {
        continue;
      }
      throw error;
    }
    for (const { label, pattern } of FORBIDDEN_PUBLIC_TEXT_PATTERNS) {
      if (pattern.test(content)) {
        failures.push(`Public leak guard found ${label} in ${file}`);
      }
    }
  }
}

async function checkActiveSource() {
  const sourceFiles = await collectFiles('src');
  for (const file of sourceFiles) {
    const content = await readFile(file, 'utf8');
    for (const token of FORBIDDEN_SOURCE_TOKENS) {
      if (content.includes(token)) {
        failures.push(`Forbidden Marketplace V0 source token found in ${file}: ${token}`);
      }
    }
  }
}

async function checkLegacyCleanCopyApi() {
  for (const file of ['src/apps-script.ts', 'scripts/build.mjs']) {
    const content = await readFile(file, 'utf8');
    for (const token of ['apiPrepareCleanCopy', 'prepareCleanCopy']) {
      if (content.includes(token)) {
        failures.push(`Legacy clean-copy API token found in ${file}: ${token}`);
      }
    }
  }
}

function isPublicTextFile(file) {
  const basename = file.split('/').pop() ?? '';
  const dotIndex = basename.lastIndexOf('.');
  const extension = dotIndex === -1 ? '' : basename.slice(dotIndex);
  return PUBLIC_TEXT_FILE_EXTENSIONS.has(extension);
}

async function checkCrossrefRuntimeGuard() {
  const docsActions = await readFile('src/app/docsActions.ts', 'utf8');
  for (const required of [
    'requireCrossrefMailto',
    'buildCrossrefWorksUrl',
    'buildCrossrefUserAgent'
  ]) {
    if (!docsActions.includes(required)) {
      failures.push(`Crossref runtime guard missing from docsActions: ${required}`);
    }
  }
  if (docsActions.includes('open-apa-desk@example.com')) {
    failures.push(
      'docsActions must not fall back to open-apa-desk@example.com for DOI lookup.'
    );
  }
}

async function checkLaunchPacket() {
  const readme = await readFile('README.md', 'utf8');
  if (!readme.includes('docs/LAUNCH_SUBMISSION_PACKET.md')) {
    failures.push('README.md must link to docs/LAUNCH_SUBMISSION_PACKET.md.');
  }
  if (!readme.includes('docs/GOOGLE_CONSOLE_RUNBOOK.md')) {
    failures.push('README.md must link to docs/GOOGLE_CONSOLE_RUNBOOK.md.');
  }

  const launchPacket = await readFile('docs/LAUNCH_SUBMISSION_PACKET.md', 'utf8');
  for (const required of [
    'unit27research/open-apa-desk',
    'gh repo create open-apa-desk --public --source=. --remote=origin --push',
    EXPECTED_HOMEPAGE,
    EXPECTED_ISSUES_URL,
    EXPECTED_LOGO_URL,
    'Do Not Submit Until',
    'CROSSREF_MAILTO',
    'npm run submission:preflight -- private/smoke-evidence/YYYY-MM-DD-final-smoke.md',
    'Standard Google Cloud project',
    'post-Pages Apps Script version',
    'Human-assisted sidebar/export smoke pass'
  ]) {
    if (!launchPacket.includes(required)) {
      failures.push(`Launch submission packet missing: ${required}`);
    }
  }
}

async function checkMarketplaceImages() {
  for (const expected of REQUIRED_BRANDING_IMAGES) {
    const actual = await readImageSize(expected.file);
    if (!actual) {
      continue;
    }
    if (actual.type !== expected.type) {
      failures.push(
        `Unexpected image type for ${expected.file}: ${actual.type}; expected ${expected.type}`
      );
    }
    if (actual.width !== expected.width || actual.height !== expected.height) {
      failures.push(
        `Unexpected dimensions for ${expected.file}: ${actual.width}x${actual.height}; expected ${expected.width}x${expected.height}`
      );
    }
  }

  if (REQUIRED_ALPHA_SCREENSHOTS.length < 1 || REQUIRED_ALPHA_SCREENSHOTS.length > 5) {
    failures.push('Marketplace screenshot count must be between 1 and 5.');
  }

  for (const file of REQUIRED_ALPHA_SCREENSHOTS) {
    const actual = await readImageSize(file);
    if (!actual) {
      continue;
    }
    if (!['jpeg', 'png'].includes(actual.type)) {
      failures.push(`Unexpected screenshot type for ${file}: ${actual.type}`);
    }
    if (actual.width < 640 || actual.height < 400) {
      failures.push(
        `Screenshot ${file} is too small for Marketplace evidence: ${actual.width}x${actual.height}`
      );
    }
    if (!isFinalMarketplaceScreenshotSize(actual)) {
      const message = `${file} is ${actual.width}x${actual.height}; use 1280x800, 640x400, or 2560x1600 for final Marketplace screenshots.`;
      if (requireFinalScreenshots) {
        failures.push(message);
      } else {
        warnings.push(message);
      }
    }
  }
}

async function checkSidebarReviewUx() {
  const sidebar = await readFile('src/Sidebar.html', 'utf8');
  for (const required of [
    'button:disabled',
    'type="button"',
    'role="status"',
    'aria-live="polite"',
    'function setBusy',
    'setBusy(true,'
  ]) {
    if (!sidebar.includes(required)) {
      failures.push(`Sidebar review UX guard missing: ${required}`);
    }
  }
}

async function readImageSize(file) {
  let buffer;
  try {
    buffer = await readFile(file);
  } catch {
    failures.push(`Missing image file: ${file}`);
    return null;
  }

  if (isPng(buffer)) {
    return {
      type: 'png',
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20)
    };
  }

  if (isJpeg(buffer)) {
    const size = readJpegSize(buffer);
    if (size) {
      return { type: 'jpeg', ...size };
    }
  }

  failures.push(`Unsupported or unreadable image format: ${file}`);
  return null;
}

function isPng(buffer) {
  return (
    buffer.length >= 24 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  );
}

function isJpeg(buffer) {
  return buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8;
}

function readJpegSize(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    while (buffer[offset] === 0xff) {
      offset += 1;
    }

    const marker = buffer[offset];
    offset += 1;

    if (marker === 0xd9 || marker === 0xda) {
      break;
    }

    if (offset + 2 > buffer.length) {
      break;
    }

    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) {
      break;
    }

    if (isStartOfFrameMarker(marker)) {
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5)
      };
    }

    offset += length;
  }

  return null;
}

function isStartOfFrameMarker(marker) {
  return (
    (marker >= 0xc0 && marker <= 0xc3) ||
    (marker >= 0xc5 && marker <= 0xc7) ||
    (marker >= 0xc9 && marker <= 0xcb) ||
    (marker >= 0xcd && marker <= 0xcf)
  );
}

function isFinalMarketplaceScreenshotSize(actual) {
  return FINAL_MARKETPLACE_SCREENSHOT_SIZES.some(
    (size) => size.width === actual.width && size.height === actual.height
  );
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(path)));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }

  return files;
}
