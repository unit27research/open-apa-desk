import type { ApaAuthor, ApaReference } from './types';

export type CitationMode = 'parenthetical' | 'narrative';

export function formatReference(reference: ApaReference): string {
  const lead = formatReferenceLead(reference);
  const title = hasAuthors(reference)
    ? ensureSentencePunctuation(reference.title)
    : '';
  switch (reference.sourceType) {
    case 'journalArticle':
      return compactParts([
        lead,
        title,
        formatJournalContainer(reference),
        formatDoiOrUrl(reference)
      ]);
    case 'book':
      return compactParts([
        lead,
        title ? italicText(title) : '',
        formatPublisher(reference)
      ]);
    case 'bookChapter':
      return compactParts([
        lead,
        title,
        formatBookChapterContainer(reference),
        formatDoiOrUrl(reference)
      ]);
    case 'website':
      return compactParts([
        lead,
        title,
        reference.siteName ? `${reference.siteName}.` : '',
        reference.url ?? ''
      ]);
    case 'report':
      return compactParts([
        lead,
        title ? italicText(title) : '',
        formatPublisher(reference),
        formatDoiOrUrl(reference)
      ]);
  }
}

export function formatCitation(
  reference: ApaReference,
  locator?: string | undefined
): string {
  const source = formatCitationSource(reference);
  const locatorSegment = formatCitationLocator(locator);
  if (source.commaInsideLabel) {
    return `(${source.label} ${formatYear(reference.year)}${locatorSegment})`;
  }
  return `(${source.label}, ${formatYear(reference.year)}${locatorSegment})`;
}

export function formatNarrativeCitation(
  reference: ApaReference,
  locator?: string | undefined
): string {
  const label = formatNarrativeCitationSource(reference);
  return `${label} (${formatYear(reference.year)}${formatCitationLocator(locator)})`;
}

export function formatCitationByMode(
  reference: ApaReference,
  mode: CitationMode,
  locator?: string | undefined
): string {
  return mode === 'narrative'
    ? formatNarrativeCitation(reference, locator)
    : formatCitation(reference, locator);
}

export function formatCitationGroup(
  references: ApaReference[],
  locatorsByReferenceId: Record<string, string | undefined> = {}
): string {
  const segments = sortReferences(references).map((reference) => {
    const source = formatCitationSource(reference);
    const locatorSegment = formatCitationLocator(
      locatorsByReferenceId[reference.id]
    );
    if (source.commaInsideLabel) {
      return `${source.label} ${formatYear(reference.year)}${locatorSegment}`;
    }
    return `${source.label}, ${formatYear(reference.year)}${locatorSegment}`;
  });
  return `(${segments.join('; ')})`;
}

export function sortReferences(references: ApaReference[]): ApaReference[] {
  return [...references].sort((left, right) => {
    const leftKey = sortKey(left);
    const rightKey = sortKey(right);
    return leftKey.localeCompare(rightKey);
  });
}

function sortKey(reference: ApaReference): string {
  return [
    formatSortAuthor(reference).toLowerCase(),
    formatYear(reference.year),
    reference.title.toLowerCase()
  ].join('|');
}

function hasAuthors(reference: ApaReference): boolean {
  return reference.authors.length > 0;
}

function formatReferenceLead(reference: ApaReference): string {
  if (hasAuthors(reference)) {
    return `${formatAuthorSegment(reference.authors)} (${formatYear(
      reference.year
    )}).`;
  }
  return `${ensureSentencePunctuation(reference.title)} (${formatYear(
    reference.year
  )}).`;
}

function formatSortAuthor(reference: ApaReference): string {
  return hasAuthors(reference) ? formatAuthors(reference.authors) : reference.title;
}

function formatJournalContainer(reference: ApaReference): string {
  const title = reference.containerTitle ?? '';
  const volume = reference.volume ? `, ${reference.volume}` : '';
  const issue = reference.issue ? `(${reference.issue})` : '';
  const pages = reference.pages ? `, ${reference.pages}` : '';
  return `${title}${volume}${issue}${pages}.`;
}

function formatBookChapterContainer(reference: ApaReference): string {
  const container = reference.containerTitle
    ? `In ${italicText(reference.containerTitle)}`
    : '';
  const pages = reference.pages ? ` (pp. ${reference.pages})` : '';
  const publisher = reference.publisher ? `. ${reference.publisher}.` : '.';
  return `${container}${pages}${publisher}`;
}

function formatPublisher(reference: ApaReference): string {
  return reference.publisher ? `${reference.publisher}.` : '';
}

function formatDoiOrUrl(reference: ApaReference): string {
  if (reference.doi) {
    return `https://doi.org/${reference.doi}`;
  }
  return reference.url ?? '';
}

function formatAuthors(authors: ApaAuthor[]): string {
  if (authors.length === 0) {
    return 'Unknown author';
  }
  const formatted = authors.map(formatAuthor);
  if (formatted.length === 1) {
    return formatted[0] ?? 'Unknown author';
  }
  if (formatted.length === 2) {
    return `${formatted[0]}, & ${formatted[1]}`;
  }
  const allButLast = formatted.slice(0, -1).join(', ');
  return `${allButLast}, & ${formatted[formatted.length - 1]}`;
}

function formatAuthorSegment(authors: ApaAuthor[]): string {
  const value = formatAuthors(authors);
  return /[.!?]$/.test(value) ? value : `${value}.`;
}

function formatAuthor(author: ApaAuthor): string {
  if (!author.given) {
    return author.family;
  }
  return `${author.family}, ${initials(author.given)}`;
}

function initials(given: string): string {
  return given
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase()}.`)
    .join(' ');
}

function formatCitationAuthors(authors: ApaAuthor[]): string {
  if (authors.length === 0) {
    return 'Unknown author';
  }
  if (authors.length === 1) {
    return authors[0]?.family ?? 'Unknown author';
  }
  if (authors.length === 2) {
    return `${authors[0]?.family} & ${authors[1]?.family}`;
  }
  return `${authors[0]?.family} et al.`;
}

function formatNarrativeAuthors(authors: ApaAuthor[]): string {
  if (authors.length === 0) {
    return 'Unknown author';
  }
  if (authors.length === 1) {
    return authors[0]?.family ?? 'Unknown author';
  }
  if (authors.length === 2) {
    return `${authors[0]?.family} and ${authors[1]?.family}`;
  }
  return `${authors[0]?.family} et al.`;
}

function formatCitationSource(
  reference: ApaReference
): { label: string; commaInsideLabel: boolean } {
  if (hasAuthors(reference)) {
    return {
      label: formatCitationAuthors(reference.authors),
      commaInsideLabel: false
    };
  }

  const title = toTitleCase(reference.title);
  if (usesQuotedTitleInCitation(reference.sourceType)) {
    return {
      label: `"${title},"`,
      commaInsideLabel: true
    };
  }

  return {
    label: title,
    commaInsideLabel: false
  };
}

function formatNarrativeCitationSource(reference: ApaReference): string {
  if (hasAuthors(reference)) {
    return formatNarrativeAuthors(reference.authors);
  }

  const title = toTitleCase(reference.title);
  return usesQuotedTitleInCitation(reference.sourceType) ? `"${title}"` : title;
}

function usesQuotedTitleInCitation(sourceType: ApaReference['sourceType']): boolean {
  return (
    sourceType === 'journalArticle' ||
    sourceType === 'bookChapter' ||
    sourceType === 'website'
  );
}

function formatCitationLocator(locator: string | undefined): string {
  const trimmed = locator?.trim();
  if (!trimmed) {
    return '';
  }
  if (/^(p\.|pp\.|para\.|paras\.|chapter|section|table|fig\.|figure)\b/i.test(trimmed)) {
    return `, ${trimmed}`;
  }

  const pageRange = trimmed.replace(/\s*[-–]\s*/g, '-');
  if (/^\d+$/.test(pageRange)) {
    return `, p. ${pageRange}`;
  }
  if (/^\d+-\d+$/.test(pageRange)) {
    return `, pp. ${pageRange}`;
  }

  return `, ${trimmed}`;
}

function formatYear(year: string | undefined): string {
  return year?.trim() ? year.trim() : 'n.d.';
}

function toTitleCase(value: string): string {
  const minorWords = new Set([
    'a',
    'an',
    'and',
    'as',
    'at',
    'but',
    'by',
    'for',
    'in',
    'nor',
    'of',
    'on',
    'or',
    'per',
    'so',
    'the',
    'to',
    'up',
    'via',
    'yet'
  ]);
  let forceCapitalize = true;
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      const result =
        forceCapitalize || !minorWords.has(lower)
          ? capitalizeHyphenatedWord(lower)
          : lower;
      forceCapitalize = /[:.!?]$/.test(word);
      return result;
    })
    .join(' ');
}

function capitalizeHyphenatedWord(word: string): string {
  return word
    .split('-')
    .map((part) => (part ? `${part[0]?.toUpperCase()}${part.slice(1)}` : part))
    .join('-');
}

function ensureSentencePunctuation(value: string): string {
  const trimmed = value.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function compactParts(parts: string[]): string {
  return parts.filter((part) => part.trim().length > 0).join(' ');
}

function italicText(value: string): string {
  return value;
}
