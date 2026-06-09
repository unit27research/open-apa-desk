import { readFile } from 'node:fs/promises';

const requiredFiles = [
  'docs/MARKETPLACE_LISTING_DRAFT.md',
  'docs/OAUTH_CONSENT_DRAFT.md',
  'docs/MARKETPLACE_SDK_CONFIG_DRAFT.md',
  'docs/LAUNCH_SUBMISSION_PACKET.md'
];

const requiredUrls = [
  'https://unit27research.com/open-apa-desk/',
  'https://unit27research.com/open-apa-desk/privacy.html',
  'https://unit27research.com/open-apa-desk/terms.html',
  'https://unit27research.com/open-apa-desk/support.html',
  'https://unit27research.com/open-apa-desk/assets/branding/open-apa-desk-icon-128.png'
];

const requiredClaims = [
  'Open APA Desk is not an official APA product',
  'no backend server',
  'no Open APA Desk account',
  'no AI calls',
  'DOI lookup sends',
  'publishing status is not `Testing`',
  'Google Docs™',
  'Google Docs™ is a trademark of Google LLC'
];

const blockers = [];

const files = new Map();
for (const file of requiredFiles) {
  try {
    files.set(file, await readFile(file, 'utf8'));
  } catch {
    blockers.push(`Missing Marketplace draft file: ${file}`);
  }
}
const manifest = JSON.parse(await readFile('src/appsscript.json', 'utf8'));

checkRequiredUrls();
checkRequiredClaims();
checkPlaceholderFields();
checkScopeParity();

if (blockers.length > 0) {
  console.error('Marketplace draft check failed:');
  for (const blocker of blockers) {
    console.error(`- ${blocker}`);
  }
  process.exit(1);
}

console.log('Marketplace draft check passed.');

function checkRequiredUrls() {
  const combined = combinedDraftText();
  for (const url of requiredUrls) {
    if (!combined.includes(url)) {
      blockers.push(`Missing required public URL in Marketplace drafts: ${url}`);
    }
  }
}

function checkRequiredClaims() {
  const combined = combinedDraftText();
  for (const claim of requiredClaims) {
    if (!combined.includes(claim)) {
      blockers.push(`Missing public-safe claim in Marketplace drafts: ${claim}`);
    }
  }
}

function checkPlaceholderFields() {
  const oauthDraft = files.get('docs/OAUTH_CONSENT_DRAFT.md') ?? '';
  const sdkDraft = files.get('docs/MARKETPLACE_SDK_CONFIG_DRAFT.md') ?? '';
  const listingDraft = files.get('docs/MARKETPLACE_LISTING_DRAFT.md') ?? '';
  const launchPacket = files.get('docs/LAUNCH_SUBMISSION_PACKET.md') ?? '';

  for (const [file, content] of files) {
    if (content.includes('TODO:')) {
      blockers.push(`Marketplace draft still contains TODO placeholder text: ${file}`);
    }
  }
  if (oauthDraft.includes('TODO: confirmed project support email')) {
    blockers.push('OAuth consent draft still needs confirmed project support email.');
  }
  if (oauthDraft.includes('TODO: confirmed project contact email')) {
    blockers.push('OAuth consent draft still needs confirmed project contact email.');
  }
  if (sdkDraft.includes('TODO: create post-Pages version after public logoUrl is live')) {
    blockers.push('Marketplace SDK draft still needs the final Apps Script version.');
  }
  if (sdkDraft.includes('TODO: 0.1.0-alpha.0 marketplace-url alpha')) {
    blockers.push('Marketplace SDK draft still needs the final Apps Script version description.');
  }
  for (const field of [
    'Developer name',
    'Developer website URL',
    'Developer email'
  ]) {
    if (listingDraft.includes(`- ${field}`)) {
      blockers.push(`Marketplace listing draft still needs ${field}.`);
    }
  }
  if (listingDraft.includes('TODO: confirmed trader status')) {
    blockers.push('Marketplace listing draft still needs confirmed trader/non-trader status.');
  }
  if (listingDraft.includes('TODO: confirmed developer mailing address for Trader status')) {
    blockers.push('Marketplace listing draft still needs developer mailing address for Trader status.');
  }
  if (launchPacket.includes('Developer mailing address: TODO confirmed business-safe mailing address')) {
    blockers.push('Launch packet still needs developer mailing address for Trader status.');
  }
  if (launchPacket.includes('Support email: TODO confirmed project support email')) {
    blockers.push('Launch packet still needs confirmed project support email.');
  }
  if (launchPacket.includes('Developer contact email: TODO confirmed project contact email')) {
    blockers.push('Launch packet still needs confirmed developer contact email.');
  }
}

function checkScopeParity() {
  const manifestScopes = new Set(manifest.oauthScopes ?? []);
  const combined = combinedDraftText();
  for (const scope of manifestScopes) {
    if (!combined.includes(scope)) {
      blockers.push(`Marketplace drafts are missing manifest OAuth scope: ${scope}`);
    }
  }
}

function combinedDraftText() {
  return [...files.values()].join('\n\n');
}
