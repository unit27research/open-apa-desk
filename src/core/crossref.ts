import type { ApaAuthor, ApaReference } from './types';

const PLACEHOLDER_CROSSREF_MAILTO = 'open-apa-desk@example.com';
const EXAMPLE_EMAIL_DOMAIN_PATTERN = /@example\.(com|org|net)$/i;
const BASIC_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CrossrefAuthor {
  family?: string;
  given?: string;
  name?: string;
}

interface CrossrefDate {
  'date-parts'?: number[][];
}

export interface CrossrefWork {
  DOI?: string;
  title?: string[];
  'container-title'?: string[];
  issued?: CrossrefDate;
  author?: CrossrefAuthor[];
  volume?: string;
  issue?: string;
  page?: string;
  URL?: string;
}

export interface CrossrefMailtoStatus {
  configured: boolean;
  message: string;
}

export function normalizeDoi(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
    .replace(/^doi:\s*/i, '')
    .toLowerCase();
}

export function requireCrossrefMailto(input: string | null | undefined): string {
  const mailto = input?.trim() ?? '';
  if (!mailto) {
    throw new Error(
      'CROSSREF_MAILTO script property must be set to a real project contact email before DOI lookup can run.'
    );
  }
  if (
    mailto.toLowerCase() === PLACEHOLDER_CROSSREF_MAILTO ||
    EXAMPLE_EMAIL_DOMAIN_PATTERN.test(mailto)
  ) {
    throw new Error(
      'CROSSREF_MAILTO still uses a placeholder email. Set it to a real project contact email before DOI lookup can run.'
    );
  }
  if (!BASIC_EMAIL_PATTERN.test(mailto)) {
    throw new Error('CROSSREF_MAILTO must be a valid project contact email.');
  }
  return mailto;
}

export function getCrossrefMailtoStatus(
  input: string | null | undefined
): CrossrefMailtoStatus {
  try {
    requireCrossrefMailto(input);
    return {
      configured: true,
      message: 'DOI lookup is configured for Crossref.'
    };
  } catch (error) {
    return {
      configured: false,
      message:
        error instanceof Error
          ? error.message
          : 'CROSSREF_MAILTO script property is not configured.'
    };
  }
}

export function buildCrossrefWorksUrl(doi: string, mailto: string): string {
  return `https://api.crossref.org/works/${encodeURIComponent(
    doi
  )}?mailto=${encodeURIComponent(mailto)}`;
}

export function buildCrossrefUserAgent(version: string, mailto: string): string {
  return `OpenAPADesk/${version} (mailto:${mailto})`;
}

export function normalizeCrossrefWork(work: CrossrefWork): ApaReference {
  return {
    id: createReferenceId(),
    sourceType: 'journalArticle',
    authors: normalizeAuthors(work.author ?? []),
    year: normalizeYear(work.issued),
    title: firstValue(work.title),
    containerTitle: firstValue(work['container-title']),
    volume: work.volume,
    issue: work.issue,
    pages: work.page,
    doi: work.DOI ? normalizeDoi(work.DOI) : undefined,
    url: work.URL
  };
}

function normalizeAuthors(authors: CrossrefAuthor[]): ApaAuthor[] {
  return authors.map((author) => {
    if (author.family) {
      return {
        family: author.family,
        given: author.given
      };
    }
    return {
      family: author.name ?? 'Unknown author'
    };
  });
}

function normalizeYear(date: CrossrefDate | undefined): string {
  const year = date?.['date-parts']?.[0]?.[0];
  return year ? String(year) : '';
}

function firstValue(values: string[] | undefined): string {
  return values?.[0] ?? '';
}

function createReferenceId(): string {
  return `ref_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
