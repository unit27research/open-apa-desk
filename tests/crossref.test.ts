import {
  buildCrossrefUserAgent,
  buildCrossrefWorksUrl,
  getCrossrefMailtoStatus,
  normalizeCrossrefWork,
  normalizeDoi,
  requireCrossrefMailto
} from '../src/core/crossref';

describe('Crossref normalization', () => {
  it('normalizes DOI strings from URLs and mixed case input', () => {
    expect(normalizeDoi('https://doi.org/10.1234/ABC.Def')).toBe(
      '10.1234/abc.def'
    );
  });

  it('requires a real project Crossref mailto before lookup', () => {
    expect(() => requireCrossrefMailto(undefined)).toThrow(/CROSSREF_MAILTO/);
    expect(() => requireCrossrefMailto('open-apa-desk@example.com')).toThrow(
      /placeholder/
    );
    expect(() => requireCrossrefMailto('maintainer@example.com')).toThrow(
      /placeholder/
    );
    expect(() => requireCrossrefMailto('not an email')).toThrow(/valid/);
    expect(requireCrossrefMailto(' contact@unit27research.com ')).toBe(
      'contact@unit27research.com'
    );
  });

  it('reports Crossref mailto setup without exposing the email address', () => {
    const status = getCrossrefMailtoStatus('josh@unit27research.com');

    expect(status).toEqual({
      configured: true,
      message: 'DOI lookup is configured for Crossref.'
    });
    expect(status.message).not.toContain('josh@unit27research.com');
  });

  it('reports placeholder Crossref mailto setup as not configured', () => {
    const status = getCrossrefMailtoStatus('maintainer@example.com');

    expect(status.configured).toBe(false);
    expect(status.message).toMatch(/placeholder/);
  });

  it('builds Crossref request URL and User-Agent with the project mailto', () => {
    expect(
      buildCrossrefWorksUrl('10.1234/example value', 'contact@unit27research.com')
    ).toBe(
      'https://api.crossref.org/works/10.1234%2Fexample%20value?mailto=contact%40unit27research.com'
    );
    expect(buildCrossrefUserAgent('0.1.0-alpha.0', 'contact@unit27research.com')).toBe(
      'OpenAPADesk/0.1.0-alpha.0 (mailto:contact@unit27research.com)'
    );
  });

  it('maps a Crossref journal work to editable APA fields', () => {
    const work = {
      DOI: '10.5555/EXAMPLE.2024.1',
      title: ['A practical guide to student citation helpers'],
      'container-title': ['Journal of Open Learning'],
      issued: { 'date-parts': [[2024, 5, 1]] },
      author: [
        { family: 'Miller', given: 'Jordan' },
        { family: 'Khan', given: 'Priya' }
      ],
      volume: '12',
      issue: '3',
      page: '101-118',
      URL: 'https://doi.org/10.5555/example.2024.1'
    };

    expect(normalizeCrossrefWork(work)).toEqual({
      id: expect.stringMatching(/^ref_/),
      sourceType: 'journalArticle',
      authors: [
        { family: 'Miller', given: 'Jordan' },
        { family: 'Khan', given: 'Priya' }
      ],
      year: '2024',
      title: 'A practical guide to student citation helpers',
      containerTitle: 'Journal of Open Learning',
      volume: '12',
      issue: '3',
      pages: '101-118',
      doi: '10.5555/example.2024.1',
      url: 'https://doi.org/10.5555/example.2024.1'
    });
  });
});
