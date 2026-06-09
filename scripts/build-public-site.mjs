import { mkdir, readFile, readdir, rm, writeFile, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const OUT_DIR = 'site';
const BRANDING_DIR = 'assets/branding';
const SCREENSHOTS_DIR = 'assets/screenshots';

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(join(OUT_DIR, 'assets', 'branding'), { recursive: true });
await mkdir(join(OUT_DIR, 'assets', 'screenshots'), { recursive: true });

await copyFile(
  join(BRANDING_DIR, 'open-apa-desk-icon-32.png'),
  join(OUT_DIR, 'assets', 'branding', 'open-apa-desk-icon-32.png')
);
await copyFile(
  join(BRANDING_DIR, 'open-apa-desk-icon-128.png'),
  join(OUT_DIR, 'assets', 'branding', 'open-apa-desk-icon-128.png')
);
await copyFile(
  join(BRANDING_DIR, 'open-apa-desk-card-banner-220x140.png'),
  join(OUT_DIR, 'assets', 'branding', 'open-apa-desk-card-banner-220x140.png')
);
for (const screenshot of await readdir(SCREENSHOTS_DIR)) {
  if (screenshot.endsWith('.jpg') || screenshot.endsWith('.png')) {
    await copyFile(
      join(SCREENSHOTS_DIR, screenshot),
      join(OUT_DIR, 'assets', 'screenshots', screenshot)
    );
  }
}
await copyFile('LICENSE', join(OUT_DIR, 'LICENSE'));

await writePage(
  'index.html',
  'Open APA Desk',
  [
    '<section class="hero">',
    '<img src="assets/branding/open-apa-desk-icon-128.png" alt="Open APA Desk icon" width="96" height="96">',
    '<div>',
    '<h1>Open APA Desk</h1>',
    '<p>A free, open-source, privacy-first APA 7 helper for Google Docs.</p>',
    '<p class="status">Current release: 0.1.0-alpha.0</p>',
    '</div>',
    '</section>',
    '<nav class="links">',
    '<a href="privacy.html">Privacy Policy</a>',
    '<a href="terms.html">Terms of Service</a>',
    '<a href="support.html">Support</a>',
    '<a href="https://github.com/unit27research/open-apa-desk">GitHub Repository</a>',
    '</nav>',
    '<section>',
    '<h2>What It Does</h2>',
    '<ul>',
    '<li>Sets up controlled APA 7 student-paper sections in Google Docs.</li>',
    '<li>Stores common reference types and looks up journal metadata by DOI through Crossref.</li>',
    '<li>Inserts readable parenthetical, narrative, locator, and grouped citations.</li>',
    '<li>Rebuilds a controlled References section.</li>',
    '<li>Prepares a copied document for submission by removing hidden tool markers.</li>',
    '</ul>',
    '</section>',
    '<section>',
    '<h2>Important</h2>',
    '<p>Open APA Desk is not affiliated with, endorsed by, sponsored by, or certified by the American Psychological Association. Users remain responsible for checking instructor, institution, and APA requirements.</p>',
    '</section>'
  ].join('\n')
);

await writeMarkdownPage('PRIVACY.html', 'Privacy Policy', 'PRIVACY.md');
await writeMarkdownPage('privacy.html', 'Privacy Policy', 'PRIVACY.md');
await writeMarkdownPage('TERMS.html', 'Terms of Service', 'TERMS.md');
await writeMarkdownPage('terms.html', 'Terms of Service', 'TERMS.md');
await writeMarkdownPage('support.html', 'Support', 'SUPPORT.md');

async function writeMarkdownPage(outputFile, title, markdownFile) {
  const markdown = await readFile(markdownFile, 'utf8');
  await writePage(outputFile, title, markdownToHtml(markdown));
}

async function writePage(outputFile, title, body) {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)} | Open APA Desk</title>
    <link rel="icon" href="assets/branding/open-apa-desk-icon-32.png">
    <style>
      :root {
        color: #172026;
        background: #f8fafc;
        font-family: Arial, sans-serif;
      }
      body {
        margin: 0;
      }
      main {
        margin: 0 auto;
        max-width: 880px;
        padding: 32px 20px 56px;
      }
      .hero {
        align-items: center;
        display: flex;
        gap: 20px;
        margin-bottom: 24px;
      }
      h1 {
        font-size: 34px;
        line-height: 1.1;
        margin: 0 0 8px;
      }
      h2 {
        border-top: 1px solid #d8dee4;
        font-size: 22px;
        margin: 28px 0 10px;
        padding-top: 20px;
      }
      p, li {
        font-size: 16px;
        line-height: 1.55;
      }
      a {
        color: #155e75;
        font-weight: 700;
      }
      .links {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        margin: 20px 0 28px;
      }
      .status {
        color: #495865;
        font-size: 14px;
        margin: 0;
      }
      code {
        background: #edf2f7;
        border-radius: 4px;
        padding: 2px 4px;
      }
    </style>
  </head>
  <body>
    <main>
${body}
    </main>
  </body>
</html>
`;
  await mkdir(dirname(join(OUT_DIR, outputFile)), { recursive: true });
  await writeFile(join(OUT_DIR, outputFile), html);
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let inList = false;
  let paragraph = [];

  for (const line of lines) {
    if (!line.trim()) {
      flushParagraph();
      closeList();
      continue;
    }

    if (line.startsWith('# ')) {
      flushParagraph();
      closeList();
      html.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`);
      continue;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      closeList();
      html.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
      continue;
    }

    if (line.startsWith('- ')) {
      flushParagraph();
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`  <li>${inlineMarkdown(line.slice(2))}</li>`);
      continue;
    }

    closeList();
    paragraph.push(line.trim());
  }

  flushParagraph();
  closeList();
  return html.join('\n');

  function flushParagraph() {
    if (paragraph.length > 0) {
      html.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  }

  function closeList() {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  }
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
