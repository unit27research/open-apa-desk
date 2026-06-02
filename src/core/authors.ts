import type { ApaAuthor } from './types';

export function parseEditableAuthorLines(value: string): ApaAuthor[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseEditableAuthorLine);
}

export function authorsToEditableLines(authors: ApaAuthor[]): string {
  return authors
    .map((author) => {
      return author.given ? `${author.family}, ${author.given}` : author.family;
    })
    .join('\n');
}

function parseEditableAuthorLine(line: string): ApaAuthor {
  const commaIndex = line.indexOf(',');
  if (commaIndex < 0) {
    return { family: line };
  }
  const family = line.slice(0, commaIndex).trim();
  const given = line.slice(commaIndex + 1).trim();
  return given ? { family, given } : { family };
}
