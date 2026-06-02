const DEFAULT_DOI = '10.1037/0003-066X.59.1.29';
const PLACEHOLDER_CROSSREF_MAILTO = 'open-apa-desk@example.com';
const EXAMPLE_EMAIL_DOMAIN_PATTERN = /@example\.(com|org|net)$/i;
const BASIC_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

try {
  await main();
} catch (error) {
  console.error(`Crossref smoke failed: ${error.message ?? error}`);
  process.exit(1);
}

async function main() {
  const mailto = requireCrossrefMailto(process.env.CROSSREF_MAILTO);
  const doi = normalizeDoi(process.env.CROSSREF_SMOKE_DOI || DEFAULT_DOI);
  const url = `https://api.crossref.org/works/${encodeURIComponent(
    doi
  )}?mailto=${encodeURIComponent(mailto)}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': `OpenAPADesk/0.1.0-alpha.0 (mailto:${mailto})`
    }
  });

  if (!response.ok) {
    throw new Error(`Crossref returned HTTP ${response.status} for DOI ${doi}.`);
  }

  const payload = await response.json();
  const work = payload?.message;
  const title = firstValue(work?.title);
  const returnedDoi = normalizeDoi(work?.DOI || '');
  const year = work?.issued?.['date-parts']?.[0]?.[0];

  if (!title) {
    throw new Error(`Crossref response for DOI ${doi} did not include a title.`);
  }
  if (returnedDoi !== doi) {
    throw new Error(
      `Crossref response DOI mismatch. Expected ${doi}, received ${
        returnedDoi || 'empty'
      }.`
    );
  }
  if (!year) {
    throw new Error(`Crossref response for DOI ${doi} did not include a year.`);
  }

  console.log(`Crossref smoke passed for DOI ${doi}.`);
  console.log(`Title: ${title}`);
  console.log(`Year: ${year}`);
}

function normalizeDoi(input) {
  return String(input)
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
    .replace(/^doi:\s*/i, '')
    .toLowerCase();
}

function requireCrossrefMailto(input) {
  const value = input?.trim() ?? '';
  if (!value) {
    throw new Error(
      'Set CROSSREF_MAILTO to a real project contact email before running this smoke check.'
    );
  }
  if (
    value.toLowerCase() === PLACEHOLDER_CROSSREF_MAILTO ||
    EXAMPLE_EMAIL_DOMAIN_PATTERN.test(value)
  ) {
    throw new Error(
      'CROSSREF_MAILTO still uses a placeholder email. Set a real project contact email.'
    );
  }
  if (!BASIC_EMAIL_PATTERN.test(value)) {
    throw new Error('CROSSREF_MAILTO must be a valid project contact email.');
  }
  return value;
}

function firstValue(values) {
  return Array.isArray(values) ? values[0] || '' : '';
}
