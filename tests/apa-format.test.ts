import {
  formatCitation,
  formatCitationGroup,
  formatNarrativeCitation,
  formatReference,
  sortReferences
} from '../src/core/apa';
import type { ApaReference } from '../src/core/types';

describe('APA 7 formatting', () => {
  it('formats a journal article reference with DOI', () => {
    const reference: ApaReference = {
      id: 'ref_1',
      sourceType: 'journalArticle',
      authors: [
        { family: 'Nguyen', given: 'Ari' },
        { family: 'Patel', given: 'Mina' }
      ],
      year: '2024',
      title: 'Trust signals in student writing tools',
      containerTitle: 'Journal of Learning Systems',
      volume: '18',
      issue: '2',
      pages: '44-59',
      doi: '10.1234/jls.2024.18.2.44'
    };

    expect(formatReference(reference)).toBe(
      'Nguyen, A., & Patel, M. (2024). Trust signals in student writing tools. Journal of Learning Systems, 18(2), 44-59. https://doi.org/10.1234/jls.2024.18.2.44'
    );
  });

  it('formats missing dates as n.d. for websites', () => {
    const reference: ApaReference = {
      id: 'ref_2',
      sourceType: 'website',
      authors: [{ family: 'Open Education Lab' }],
      year: '',
      title: 'APA paper checklist for first-year writers',
      siteName: 'Open Education Lab',
      url: 'https://example.edu/apa-checklist'
    };

    expect(formatReference(reference)).toBe(
      'Open Education Lab. (n.d.). APA paper checklist for first-year writers. Open Education Lab. https://example.edu/apa-checklist'
    );
  });

  it('formats parenthetical citations for one, two, and three-plus authors', () => {
    const one: ApaReference = {
      id: 'one',
      sourceType: 'book',
      authors: [{ family: 'Garcia', given: 'Lena' }],
      year: '2021',
      title: 'Writing in public',
      publisher: 'River Press'
    };
    const two: ApaReference = {
      id: 'two',
      sourceType: 'book',
      authors: [
        { family: 'Smith', given: 'Dana' },
        { family: 'Jones', given: 'Lee' }
      ],
      year: '2020',
      title: 'Learning notes',
      publisher: 'Study House'
    };
    const three: ApaReference = {
      id: 'three',
      sourceType: 'report',
      authors: [
        { family: 'Williams', given: 'Mara' },
        { family: 'Chen', given: 'Iris' },
        { family: 'Brown', given: 'Theo' }
      ],
      year: '2019',
      title: 'Student support systems',
      publisher: 'Civic Learning Group'
    };

    expect(formatCitation(one)).toBe('(Garcia, 2021)');
    expect(formatCitation(two)).toBe('(Smith & Jones, 2020)');
    expect(formatCitation(three)).toBe('(Williams et al., 2019)');
  });

  it('formats parenthetical citations with optional direct-quote locators', () => {
    const reference: ApaReference = {
      id: 'locator',
      sourceType: 'book',
      authors: [{ family: 'Garcia', given: 'Lena' }],
      year: '2021',
      title: 'Writing in public',
      publisher: 'River Press'
    };

    expect(formatCitation(reference, '23')).toBe('(Garcia, 2021, p. 23)');
    expect(formatCitation(reference, '23-24')).toBe(
      '(Garcia, 2021, pp. 23-24)'
    );
    expect(formatCitation(reference, 'para. 4')).toBe(
      '(Garcia, 2021, para. 4)'
    );
  });

  it('formats narrative citations with APA author wording and locators', () => {
    const one: ApaReference = {
      id: 'one',
      sourceType: 'book',
      authors: [{ family: 'Garcia', given: 'Lena' }],
      year: '2021',
      title: 'Writing in public',
      publisher: 'River Press'
    };
    const two: ApaReference = {
      id: 'two',
      sourceType: 'book',
      authors: [
        { family: 'Smith', given: 'Dana' },
        { family: 'Jones', given: 'Lee' }
      ],
      year: '2020',
      title: 'Learning notes',
      publisher: 'Study House'
    };

    expect(formatNarrativeCitation(one)).toBe('Garcia (2021)');
    expect(formatNarrativeCitation(two, '23')).toBe(
      'Smith and Jones (2020, p. 23)'
    );
  });

  it('formats grouped parenthetical citations sorted like references', () => {
    const references: ApaReference[] = [
      {
        id: 'zimmer',
        sourceType: 'book',
        authors: [{ family: 'Zimmer', given: 'Noah' }],
        year: '2020',
        title: 'Late alphabet',
        publisher: 'Example Press'
      },
      {
        id: 'adams',
        sourceType: 'book',
        authors: [{ family: 'Adams', given: 'Robin' }],
        year: '2023',
        title: 'Early alphabet',
        publisher: 'Example Press'
      }
    ];

    expect(formatCitationGroup(references)).toBe('(Adams, 2023; Zimmer, 2020)');
  });

  it('formats no-author parenthetical citations from titles', () => {
    const article: ApaReference = {
      id: 'no-author-article',
      sourceType: 'journalArticle',
      authors: [],
      year: '2001',
      title: 'using citations',
      containerTitle: 'Journal of Student Writing'
    };
    const book: ApaReference = {
      id: 'no-author-book',
      sourceType: 'book',
      authors: [],
      year: '',
      title: 'writing in public',
      publisher: 'River Press'
    };

    expect(formatCitation(article)).toBe('("Using Citations," 2001)');
    expect(formatCitation(book)).toBe('(Writing in Public, n.d.)');
  });

  it('moves no-author titles into the reference author position', () => {
    const article: ApaReference = {
      id: 'no-author-ref',
      sourceType: 'journalArticle',
      authors: [],
      year: '2001',
      title: 'using citations',
      containerTitle: 'Journal of Student Writing',
      volume: '5',
      pages: '10-12'
    };

    expect(formatReference(article)).toBe(
      'using citations. (2001). Journal of Student Writing, 5, 10-12.'
    );
  });

  it('sorts references by rendered author and year', () => {
    const references: ApaReference[] = [
      {
        id: 'b',
        sourceType: 'book',
        authors: [{ family: 'Zimmer', given: 'Noah' }],
        year: '2020',
        title: 'Late alphabet',
        publisher: 'Example Press'
      },
      {
        id: 'a',
        sourceType: 'book',
        authors: [{ family: 'Adams', given: 'Robin' }],
        year: '2023',
        title: 'Early alphabet',
        publisher: 'Example Press'
      }
    ];

    expect(sortReferences(references).map((reference) => reference.id)).toEqual([
      'a',
      'b'
    ]);
  });
});
