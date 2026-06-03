import { readFile } from 'node:fs/promises';
import { execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';

const evidenceFile = process.argv[2];
const execFile = promisify(execFileCallback);
const REQUIRED_MANUAL_CHECKS = [
  'Google Docs `Open APA Desk` menu appears',
  'Sidebar opens after OAuth authorization',
  '`Check DOI Setup` reports DOI lookup is configured',
  'Smoke target starts from prepared APA template with dynamic page numbers',
  '`Setup APA Paper` creates one controlled title/body starter',
  'Re-running `Setup APA Paper` replaces, not duplicates',
  'Page number `1` is visible in the header/template',
  'Page number `1` remains visible after `Setup APA Paper`',
  'Later page number increments dynamically',
  'DOI lookup succeeds with project Crossref mailto',
  'Manual book reference saves',
  'Duplicate DOI updates existing reference',
  'Reference edit works',
  'Reference delete works without removing visible citation text',
  'Parenthetical citation inserts readable APA text',
  'Narrative citation inserts readable APA text',
  'Grouped citation inserts readable APA text',
  'Direct-quote locator inserts correctly',
  '`Rebuild References` creates centered heading and entries',
  'Re-running `Rebuild References` replaces only controlled section',
  '`Prepare Current Copy` removes visible marker paragraphs',
  'PDF export contains no `[[OPEN_APA_DESK` marker text',
  'DOCX export contains no `[[OPEN_APA_DESK` marker text'
];

if (!evidenceFile || process.argv.includes('--help') || process.argv.includes('-h')) {
  printHelp();
  process.exit(evidenceFile ? 0 : 1);
}

const content = await readFile(evidenceFile, 'utf8');
const failures = [];

checkNoPlaceholders(content);
checkNoPrivateUrls(content);
checkRequiredTextFields(content);
await checkBuildCommitMatchesHead(content);
checkPreflightResults(content);
checkManualChecklist(content);
checkApaSpotCheck(content);
checkExportEvidence(content);
checkScreenshotEvidence(content);
checkSubmissionDecision(content);

if (failures.length > 0) {
  console.error('Smoke evidence check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Smoke evidence check passed.');

function checkNoPlaceholders(value) {
  for (const placeholder of [
    'YYYY-MM-DD',
    '<git SHA>',
    '<version number>',
    'TODO'
  ]) {
    if (value.includes(placeholder)) {
      failures.push(`Evidence still contains placeholder: ${placeholder}`);
    }
  }
}

function checkNoPrivateUrls(value) {
  const privateUrlPatterns = [
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

  for (const { label, pattern } of privateUrlPatterns) {
    if (pattern.test(value)) {
      failures.push(`Evidence contains ${label}; keep IDs in separate private operator notes.`);
    }
  }
}

function checkRequiredTextFields(value) {
  for (const [label, pattern] of [
    ['Date', /^Date:\s*\d{4}-\d{2}-\d{2}$/m],
    ['Build commit', /^Build commit:\s*[A-Fa-f0-9]{7,40}$/m],
    ['Apps Script version', /^Apps Script version:\s*(?!<version number>|TODO)\S+/m],
    ['Project Crossref mailto available', /^Project Crossref mailto available:\s*yes$/im]
  ]) {
    if (!pattern.test(value)) {
      failures.push(`${label} is missing or incomplete.`);
    }
  }
}

async function checkBuildCommitMatchesHead(value) {
  const evidenceCommit = findLineValue(value, 'Build commit');
  if (!evidenceCommit) {
    return;
  }

  let headCommit;
  try {
    const { stdout } = await execFile('git', ['rev-parse', 'HEAD']);
    headCommit = stdout.trim();
  } catch {
    failures.push('Unable to determine current git HEAD for Build commit check.');
    return;
  }

  if (!headCommit.startsWith(evidenceCommit)) {
    failures.push(
      `Build commit must match current git HEAD (${headCommit.slice(0, 7)}); found ${evidenceCommit}.`
    );
  }
}

function checkPreflightResults(value) {
  for (const command of [
    'upload:preflight',
    'build',
    'build:check',
    'npm run clasp:push'
  ]) {
    if (!new RegExp(`^${escapeRegex(command)}:\\s*pass$`, 'im').test(value)) {
      failures.push(`${command} must be recorded as pass.`);
    }
  }
}

function checkManualChecklist(value) {
  const rows = value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && line.endsWith('|'));

  const evidenceRows = rows.filter((row) => {
    const cells = splitMarkdownRow(row);
    return cells.length >= 3 && cells[0] !== 'Check' && !/^---+$/.test(cells[0]);
  });

  if (evidenceRows.length < REQUIRED_MANUAL_CHECKS.length) {
    failures.push('Manual smoke checklist is missing expected evidence rows.');
  }

  const evidenceByCheck = new Map(
    evidenceRows.map((row) => {
      const [check, status] = splitMarkdownRow(row);
      return [check, status];
    })
  );

  for (const check of REQUIRED_MANUAL_CHECKS) {
    const status = evidenceByCheck.get(check);
    if (!status) {
      failures.push(`Manual smoke checklist missing required row: ${check}`);
    }
  }

  for (const row of evidenceRows) {
    const [check, status] = splitMarkdownRow(row);
    if (!check || !status) {
      continue;
    }
    if (status.toLowerCase() !== 'pass') {
      failures.push(`Manual smoke checklist is not PASS: ${check} -> ${status}`);
    }
  }
}

function checkApaSpotCheck(value) {
  for (const label of [
    'Parenthetical citation observed',
    'Narrative citation observed',
    'Grouped citation observed',
    'References entry for DOI article observed',
    'References entry for manual book observed'
  ]) {
    const field = findLineValue(value, label);
    if (!field) {
      failures.push(`${label} must be filled.`);
    }
  }
}

function checkExportEvidence(value) {
  for (const label of [
    'PDF export checked',
    'DOCX export checked',
    'Human visual export check completed'
  ]) {
    if (!lineEquals(value, label, 'yes')) {
      failures.push(`${label} must be yes.`);
    }
  }

  if (!lineEquals(value, 'npm run smoke:exports', 'pass')) {
    failures.push('npm run smoke:exports must be pass.');
  }
  for (const label of ['Marker text found in PDF', 'Marker text found in DOCX']) {
    if (!lineEquals(value, label, 'no')) {
      failures.push(`${label} must be no.`);
    }
  }
}

function checkScreenshotEvidence(value) {
  if (!findLineValue(value, 'Screenshot 1 selected')) {
    failures.push('At least Screenshot 1 must be selected.');
  }
  if (!lineEquals(value, 'npm run marketplace:assets:final', 'pass')) {
    failures.push('npm run marketplace:assets:final must be pass.');
  }
}

function checkSubmissionDecision(value) {
  if (!lineEquals(value, 'Ready for Marketplace console submission', 'yes')) {
    failures.push('Ready for Marketplace console submission must be yes.');
  }
  const blockers = findLineValue(value, 'Remaining blockers');
  if (!blockers || !/^(none|n\/a)$/i.test(blockers)) {
    failures.push('Remaining blockers must be none.');
  }
}

function splitMarkdownRow(row) {
  return row
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim());
}

function findLineValue(value, label) {
  const pattern = new RegExp(`^${escapeRegex(label)}:\\s*(.+)$`, 'im');
  const match = value.match(pattern);
  const result = match?.[1]?.trim();
  if (!result || /^(TODO|<.*>|yes\/no)$/i.test(result)) {
    return '';
  }
  return result;
}

function lineEquals(value, label, expected) {
  const actual = findLineValue(value, label);
  return actual.toLowerCase() === expected.toLowerCase();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function printHelp() {
  console.log(`Usage: npm run smoke:evidence:check -- private/smoke-evidence/YYYY-MM-DD-final-smoke.md

Validates a private final smoke evidence Markdown file before Marketplace console work.
It checks required PASS/yes/no fields, APA spot-check entries, marker-leak results,
the Build commit against current git HEAD, and obvious private Google URLs that
should stay in separate operator notes.`);
}
