import {
  addCitation,
  buildDefaultState,
  buildReferencesSectionText,
  deleteReference,
  findDuplicateReference,
  upsertReference
} from '../src/core/state';
import type { ApaReference } from '../src/core/types';

describe('document state helpers', () => {
  const book: ApaReference = {
    id: 'book_1',
    sourceType: 'book',
    authors: [{ family: 'Garcia', given: 'Lena' }],
    year: '2021',
    title: 'Writing in public',
    publisher: 'River Press'
  };

  it('creates a versioned empty document state', () => {
    expect(buildDefaultState()).toEqual({
      schemaVersion: 1,
      references: [],
      citations: [],
      generatedSectionIds: {}
    });
  });

  it('upserts references without duplicating existing ids', () => {
    const state = buildDefaultState();
    const withBook = upsertReference(state, book);
    const updated = upsertReference(withBook, {
      ...book,
      title: 'Writing in public spaces'
    });

    expect(updated.references).toHaveLength(1);
    expect(updated.references[0]?.title).toBe('Writing in public spaces');
  });

  it('updates an existing reference when a new save has the same DOI', () => {
    const state = upsertReference(buildDefaultState(), {
      ...book,
      doi: '10.1234/ABC'
    });
    const updated = upsertReference(state, {
      ...book,
      id: 'book_2',
      title: 'Writing in public spaces',
      doi: 'https://doi.org/10.1234/abc'
    });

    expect(updated.references).toHaveLength(1);
    expect(updated.references[0]).toMatchObject({
      id: 'book_1',
      title: 'Writing in public spaces',
      doi: 'https://doi.org/10.1234/abc'
    });
  });

  it('finds likely manual-entry duplicates by type, title, year, and lead author', () => {
    const state = upsertReference(buildDefaultState(), book);
    const duplicate = findDuplicateReference(state, {
      ...book,
      id: 'book_2',
      title: ' writing in public ',
      doi: undefined
    });

    expect(duplicate?.id).toBe('book_1');
  });

  it('deletes references without removing existing citation history', () => {
    const state = addCitation(
      upsertReference(buildDefaultState(), book),
      ['book_1'],
      '(Garcia, 2021)'
    );
    const updated = deleteReference(state, 'book_1');

    expect(updated.references).toEqual([]);
    expect(updated.citations).toHaveLength(1);
  });

  it('records inserted citation text with stable reference ids', () => {
    const state = addCitation(buildDefaultState(), ['book_1'], '(Garcia, 2021)');

    expect(state.citations[0]).toMatchObject({
      referenceIds: ['book_1'],
      insertedText: '(Garcia, 2021)'
    });
    expect(state.citations[0]?.id).toMatch(/^cite_/);
  });

  it('builds a sorted References section from saved references', () => {
    const zed: ApaReference = {
      ...book,
      id: 'book_2',
      authors: [{ family: 'Zimmer', given: 'Noah' }],
      title: 'Late alphabet'
    };
    const state = upsertReference(upsertReference(buildDefaultState(), zed), book);

    expect(buildReferencesSectionText(state)).toBe(
      'References\n\nGarcia, L. (2021). Writing in public. River Press.\n\nZimmer, N. (2021). Late alphabet. River Press.'
    );
  });
});
