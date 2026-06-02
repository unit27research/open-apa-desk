import { authorsToEditableLines, parseEditableAuthorLines } from '../src/core/authors';

describe('sidebar author helpers', () => {
  it('parses one author per line using family, given fields', () => {
    expect(parseEditableAuthorLines('Miller, Jordan\nKhan, Priya')).toEqual([
      { family: 'Miller', given: 'Jordan' },
      { family: 'Khan', given: 'Priya' }
    ]);
  });

  it('treats organization authors as family-only values', () => {
    expect(parseEditableAuthorLines('Open Education Lab')).toEqual([
      { family: 'Open Education Lab' }
    ]);
  });

  it('renders authors back to editable student-facing lines', () => {
    expect(
      authorsToEditableLines([
        { family: 'Miller', given: 'Jordan' },
        { family: 'Open Education Lab' }
      ])
    ).toBe('Miller, Jordan\nOpen Education Lab');
  });
});
