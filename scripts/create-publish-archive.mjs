import { execFile as execFileCallback } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);
const OUT_DIR = 'release';
const FORBIDDEN_TRACKED_PREFIXES = ['.clasp.json', 'dist/', 'node_modules/', 'release/'];

const status = await execGit(['status', '--short']);
if (status.trim()) {
  console.error('Publish archive requires a clean git worktree.');
  console.error(status.trim());
  process.exit(1);
}

const trackedFiles = (await execGit(['ls-files']))
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

const forbiddenTrackedFiles = trackedFiles.filter((file) =>
  FORBIDDEN_TRACKED_PREFIXES.some(
    (prefix) => file === prefix.replace(/\/$/, '') || file.startsWith(prefix)
  )
);

if (forbiddenTrackedFiles.length > 0) {
  console.error('Publish archive would include forbidden tracked files:');
  for (const file of forbiddenTrackedFiles) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

const shortSha = (await execGit(['rev-parse', '--short=7', 'HEAD'])).trim();
const archiveName = `open-apa-desk-public-repo-${shortSha}.zip`;
const manifestName = `open-apa-desk-public-repo-${shortSha}.manifest.txt`;

await mkdir(OUT_DIR, { recursive: true });

const archivePath = join(OUT_DIR, archiveName);
const manifestPath = join(OUT_DIR, manifestName);

await execGit(['archive', '--format=zip', '--output', archivePath, 'HEAD']);
await writeFile(
  manifestPath,
  [
    `Open APA Desk public repo archive`,
    `Commit: ${shortSha}`,
    `Archive: ${archivePath}`,
    '',
    ...trackedFiles
  ].join('\n')
);

console.log(`Created ${archivePath}`);
console.log(`Wrote ${manifestPath}`);

async function execGit(args) {
  const { stdout } = await execFile('git', args, {
    maxBuffer: 1024 * 1024 * 10
  });
  return stdout;
}
